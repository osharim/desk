#encoding:utf-8
import re 
from django.conf import settings as set_django 
from apps.core.models import *
from django.contrib.auth.models import User
from tastypie.resources import ModelResource , ALL , ALL_WITH_RELATIONS 
from tastypie.authorization import Authorization
from tastypie.exceptions import BadRequest 
from tastypie import fields
from django.core import serializers
from django.db.models import Q , F
from datetime import date 
from tastypie.paginator import Paginator


class PageNumberPaginator(object):

    """
        Limits result sets down to sane amounts for passing to the client.
        
        This is used in place of Django's ``Paginator`` due to the way pagination
        works. ``limit`` & ``offset`` (tastypie) are used in place of ``page``
        (Django) so none of the page-related calculations are necessary.
        
        This implementation also provides additional details like the
        ``total_count`` of resources seen and convenience links to the
        ``previous``/``next`` pages of data as available.
        """
    def __init__(self, request_data, objects, resource_uri=None, limit=None, offset=0, max_limit=1000, collection_name='objects'):
        """
            Instantiates the ``Paginator`` and allows for some configuration.
            
            The ``request_data`` argument ought to be a dictionary-like object.
            May provide ``limit`` and/or ``offset`` to override the defaults.
            Commonly provided ``request.GET``. Required.
            
            The ``objects`` should be a list-like object of ``Resources``.
            This is typically a ``QuerySet`` but can be anything that
            implements slicing. Required.
            
            Optionally accepts a ``limit`` argument, which specifies how many
            items to show at a time. Defaults to ``None``, which is no limit.
            
            Optionally accepts an ``offset`` argument, which specifies where in
            the ``objects`` to start displaying results from. Defaults to 0.
            
            Optionally accepts a ``max_limit`` argument, which the upper bound
            limit. Defaults to ``1000``. If you set it to 0 or ``None``, no upper
            bound will be enforced.
            """

	id_application = int(request_data.get("application"))
	application  = Apps.objects.filter( id = id_application )[0]

	current_app_has_section = AppHasSection.objects.filter(app = application )
	

	#get max sections available in app
	max_sections_in_application = current_app_has_section.count()


	#get max rows in sections available in section
	_fields = SectionHasField.objects.filter( section = current_app_has_section[0].section )

	max_fields_in_section = _fields.count()

	max_rows_in_application = 20

	#si la suma de todas las columnas y campos nos general mas de 20 rows entonces lo ajustamos para paginacion
	new_limit_by_20 = max_sections_in_application * max_rows_in_application 

	#sino entonces mostramos todos los datos
	new_limit = max_fields_in_section * max_sections_in_application

	#sobreescribirmos el limite
	limit = new_limit if new_limit <= max_rows_in_application else new_limit_by_20 

	limit = new_limit_by_20

        self.request_data = request_data
        self.objects = objects
        self.limit = limit
        self.max_limit = max_limit
        self.offset = offset
        self.resource_uri = resource_uri
        self.collection_name = collection_name
    
    def get_limit(self):
        """
            Determines the proper maximum number of results to return.
            
            In order of importance, it will use:
            
            * The user-requested ``limit`` from the GET parameters, if specified.
            * The object-level ``limit`` if specified.
            * ``settings.API_LIMIT_PER_PAGE`` if specified.
            
            Default is 20 per page.
            """
        
        limit = self.request_data.get('limit', self.limit)
        if limit is None:
            limit = getattr(settings, 'API_LIMIT_PER_PAGE', 20)
        
        try:
            limit = int(limit)
        except ValueError:
            raise BadRequest("Invalid limit '%s' provided. Please provide a positive integer." % limit)
        
        if limit < 0:
            raise BadRequest("Invalid limit '%s' provided. Please provide a positive integer >= 0." % limit)
        
        if self.max_limit and (not limit or limit > self.max_limit):
            # If it's more than the max, we're only going to return the max.
            # This is to prevent excessive DB (or other) load.
            return self.max_limit
        
        return limit
    
    def get_offset(self):
        """
            Determines the proper starting offset of results to return.
            
            It attempts to use the user-provided ``offset`` from the GET parameters,
            if specified. Otherwise, it falls back to the object-level ``offset``.
            
            Default is 0.
            """
        offset = self.offset
        
        if 'offset' in self.request_data:
            offset = self.request_data['offset']
        
        try:
            offset = int(offset)
        except ValueError:
            raise BadRequest("Invalid offset '%s' provided. Please provide an integer." % offset)
        
        if offset < 0:
            raise BadRequest("Invalid offset '%s' provided. Please provide a positive integer >= 0." % offset)
        
        return offset
    
    def get_slice(self, limit, offset):
        """
            Slices the result set to the specified ``limit`` & ``offset``.
            """
        if limit == 0:
            return self.objects[offset:]
        
        return self.objects[offset:offset + limit]
    
    def get_count(self):
        """
            Returns a count of the total number of objects seen.
            """
        try:
            return self.objects.count()
        except (AttributeError, TypeError):
            # If it's not a QuerySet (or it's ilk), fallback to ``len``.
            return len(self.objects)
    
    def get_previous(self, limit, offset):
        """
            If a previous page is available, will generate a URL to request that
            page. If not available, this returns ``None``.
            """
        if offset - limit < 0:
            return None
        
        return self._generate_uri(limit, offset-limit)
    
    def get_next(self, limit, offset, count):
        """
            If a next page is available, will generate a URL to request that
            page. If not available, this returns ``None``.
            """
        if offset + limit >= count:
            return None
        
        return self._generate_uri(limit, offset+limit)
    
    def _generate_uri(self, limit, offset):
        if self.resource_uri is None:
            return None
        
        try:
            # QueryDict has a urlencode method that can handle multiple values for the same key
            request_params = self.request_data.copy()
            if 'limit' in request_params:
                del request_params['limit']
            if 'offset' in request_params:
                del request_params['offset']
            request_params.update({'limit': limit, 'offset': offset})
            encoded_params = request_params.urlencode()
        except AttributeError:
            request_params = {}
            
            for k, v in self.request_data.items():
                if isinstance(v, six.text_type):
                    request_params[k] = v.encode('utf-8')
                else:
                    request_params[k] = v
            
            if 'limit' in request_params:
                del request_params['limit']
            if 'offset' in request_params:
                del request_params['offset']
            request_params.update({'limit': limit, 'offset': offset})
            encoded_params = urlencode(request_params)
        
        return '%s?%s' % (
                          self.resource_uri,
                          encoded_params
                          )
    
    def page(self):
        """
            Generates all pertinent data about the requested page.
            
            Handles getting the correct ``limit`` & ``offset``, then slices off
            the correct set of results and returns all pertinent metadata.
            """
        limit = self.get_limit()
        offset = self.get_offset()
        count = self.get_count()
        objects = self.get_slice(limit, offset)
        meta = {
            'offset': offset,
            'limit': limit,
            'total_count': count,
        }
        
        if limit:
            meta['previous'] = self.get_previous(limit, offset)
            meta['next'] = self.get_next(limit, offset, count)
        
        return {
            self.collection_name: objects,
            'meta': meta,
    }


class UsuarioResource(ModelResource):

	class Meta:
		queryset = User.objects.all().order_by("-date_joined") 
		excludes = ['password' , 'last_login','is_superuser', 'email', 'date_joined'  ,'is_active', 'is_staff',] 




class UsersResource(ModelResource):

  	class Meta:

	    queryset = User.objects.all()
            excludes = ['is_active', 'is_staff', 'is_superuser','date_joined' ,'last_login' , 'username','password']
	    allowed_methods = ['get']
	    resource_name = 'user'
	    


class AllowedUsersResource(ModelResource):

	user = fields.ForeignKey("apps.api.resource.UsuarioResource",  full = True , attribute = 'user') 

  	class Meta:

	    object_class = User
	    queryset = AdminCreatedUsers.objects.all()
	    allowed_methods = ['get']
	    resource_name = 'allowed'
	    
  	def dehydrate(self , bundle):

		bundle.data["img"] = "https://s3.amazonaws.com/pinffiles/unknown.png"
		

		return bundle
	
	def get_object_list(self, request):

		 return super(AllowedUsersResource , self).get_object_list(request).filter( admin = request.user)


# ***********************************************************************************************************************
# ***********************************************************************************************************************
# ******************************************* SIGN UP**************************************************************
# ***********************************************************************************************************************
# ***********************************************************************************************************************


class UserSignUpResource(ModelResource):

  class Meta:
    object_class = User
    queryset = User.objects.all()
    allowed_methods = ['post']
    include_resource_uri = False
    resource_name = 'newuser'
    excludes = ['is_active', 'is_staff', 'is_superuser','date_joined' ,'last_login' , 'username']
    authorization= Authorization()
    always_return_data = True
    
  def dehydrate(self , bundle):

		
	setting = Settings.objects.filter(user_id = bundle.obj )
	bundle.data['img'] =	setting[0].img
	del bundle.data["password"]
#	bundle.data['rol'] = setting[0].rol
	return bundle

  def obj_create(self, bundle, request=None, **kwargs):

	error_message = ''

	try:
		bundle = self.full_hydrate(bundle)
		email = bundle.data.get('email')
		check_if_exist = User.objects.filter(email=email)

		if check_if_exist:
			raise BadRequest()
	except:
		
		error_message = 'El email ya existe'
	else:
		
		rol_get = 0 #bundle.data.get("rol")
		bundle.obj.set_password(bundle.data.get('password'))
		bundle.obj.username = email
		user = bundle.obj.save()
		id_new_user =  bundle.obj.id

		new_user_created = bundle.obj
		current_user = bundle.request.user


		AdminCreatedUsers.objects.create( admin = current_user , user = new_user_created )

		data = Settings.objects.create( user_id =  id_new_user , rol = rol_get , users_created = 0 ) 

	finally:

		if error_message:
			raise BadRequest(error_message)
	return bundle



class WorkspaceResource(ModelResource): 


	owner = fields.ForeignKey("apps.api.resource.UsuarioResource",  full = True , attribute = 'owner') 

	class Meta:
	    	allowed_methods = ['get','post']
		queryset = Workspace.objects.all()
		resource_name ='workspace'
		always_return_data = True
		authorization= Authorization()

	
	def obj_create(self, bundle , request = None, ):

		bundle.obj.name = bundle.data.get("name") 
		bundle.obj.owner_id = bundle.request.user.id
		bundle.obj.save()
		return bundle

	
	def get_object_list(self, request):

		 return super(WorkspaceResource, self).get_object_list(request).filter( owner = request.user)








class AppsResource(ModelResource): 


	owner = fields.ForeignKey("apps.api.resource.UsuarioResource",  full = True , attribute = 'owner') 
	workspace = fields.ForeignKey("apps.api.resource.WorkspaceResource",  full = True , attribute = 'workspace') 

	class Meta:
	    	allowed_methods = ['get','post','put']
		queryset = Apps.objects.all()
		resource_name ='apps'
		always_return_data = True
		authorization= Authorization()

	
	def obj_create(self, bundle , request = None, ):

		bundle.obj.name = bundle.data.get("name") 
		bundle.obj.workspace_id  = re.search('\/api\/v1\/workspace\/(\d+)\/', str(bundle.data.get("workspace") )).group(1)
		bundle.obj.owner_id  = bundle.request.user.id
		bundle.obj.save()
		#crea las secciones para la aplicacion por default

		_current_app = bundle.obj


		_current_section = Section.objects.create( name = u"Nueva seccion")
		for i in range(5):

			_current_field_in_section = Field.objects.create( data = "")

			#se guarda la seccion y el campo en una relaci on
			SectionHasField.objects.create ( field = _current_field_in_section , section =  _current_section )


		print _current_section.__dict__,"id"
		print "total"


		AppHasSection.objects.create( app = _current_app  , section = _current_section )

		return bundle



#Todas las apps que un workspace tiene
class WorkSpaceAppsResource(ModelResource): 

	#workspace = fields.ForeignKey("apps.api.resource.WorkspaceResource",  full = True , attribute = 'workspace') 

	class Meta:
	    	allowed_methods = ['get']
		queryset = Apps.objects.all()
		resource_name ='workspaceapps'
		always_return_data = True
		authorization= Authorization()

	
	def get_object_list(self, request):

		
		id_workspace =  int(request.GET.get("workspace"))

		allowed_apps = super(WorkSpaceAppsResource, self).get_object_list(request).filter( owner = request.user.id)

		allowed_apps = allowed_apps.filter( workspace =  id_workspace )

		return allowed_apps






#datos de una seccion en una aplicacion
class FieldResource(ModelResource):
	class Meta:
		queryset = Field.objects.all()
		always_return_data = True
	    	resource_name = 'field'
	    	authorization= Authorization()


#seccion en una aplicacion
class SectionResource(ModelResource):
	class Meta:
		queryset = Section.objects.all()
	        always_return_data = True
	    	resource_name = 'section'
	    	authorization= Authorization()



#una seccion tiene muchos datos
#esta api se encarga de crear las ultimas filas de una seccion --------
class SectionHasFieldResource(ModelResource):

	section = fields.ForeignKey("apps.api.resource.SectionResource",  full = False , attribute = 'section') 
	field = fields.ForeignKey("apps.api.resource.FieldResource",  full = True , attribute = 'field') 

  	class Meta:

	    queryset = SectionHasField.objects.all()
	    allowed_methods = ['get','put','post']
	    resource_name = 'sectionfield'
	    always_return_data = True
	    authorization= Authorization()

	    filtering = {

			  "section" : ["exact"],

		   }


 	def dehydrate(self , bundle):

		fields_ =  bundle.data["field_instalce"]
		fields_str = []

		for field in fields_:


			fields_str.append({

				"id" : field.field.id,
				"data" : field.field.data,
				"section" : field.section.id
			})

		bundle.data["fields"] =	fields_str

		del bundle.data["field"] 
		del bundle.data["field_instalce"] 
		del bundle.data["section_id_"] 

		return bundle


	def obj_create(self, bundle , request = None, ):

		_max_fields_to_add = bundle.data.get("max_fields_") 
		_current_section_id  = bundle.data.get("section_id_") 


		fields_created = []

		for i in range(_max_fields_to_add):

			_current_field = Field.objects.create( data = "")

		        #se guarda la seccion y el campo en una relaci on
			#solo la primera vez que se guarde el dato por obj.save
			#esto es porque obj.save solo guarda una vez, y necesitamos guardar muchas veces en SectionHasField
			instance_section  =  Section.objects.get(pk = _current_section_id[i])
			if i == 0:

				bundle.obj.section_id  = instance_section.id
				bundle.obj.field_id =  _current_field.id
				bundle.obj.save()
				fields_created.append( bundle.obj )
			else:

				obj_field_section = SectionHasField.objects.create ( field = _current_field  , section =  instance_section  )
				fields_created.append( obj_field_section )

		bundle.data["field_instalce"] = []
		bundle.data["field_instalce"] = fields_created

		return bundle

   
	
	#def get_object_list(self, request):

		 #return super(AllowedUsersResource , self).get_object_list(request).filter( admin = request.user)




#una seccion tiene muchos datos pero no regresa los datos de una seccion, se usa para obtener las secciones de una app con la relacion M2M y no nos regrese datos extra
class SectionHasFieldWithNoSectionDataResource(ModelResource):

	field = fields.ForeignKey("apps.api.resource.FieldResource",  full = True , attribute = 'field') 

  	class Meta:

	    queryset = SectionHasField.objects.all().order_by("-field__date")
	    allowed_methods = ['get','put','post']
	    always_return_data = True
	    include_resource_uri = False
	    authorization= Authorization()




#una aplicacion tiene muchas secciones
class AppHasSectionResource(ModelResource):

	field = fields.ForeignKey("apps.api.resource.FieldResource",  full = True , attribute = 'field') 
	section = fields.ForeignKey("apps.api.resource.SectionResource",  full = True , attribute = 'section') 

  	class Meta:

	    queryset = SectionHasField.objects.all().order_by("field__date")
	    allowed_methods = ['get','put','post']
	    resource_name = 'appsection'
	    always_return_data = True
	    authorization= Authorization()
	    paginator_class = PageNumberPaginator

	def _get_all_fiels_from_section(self , all_data , current_id ):


		_fields = []

		for key ,_field   in enumerate(all_data):

			if _field.data["section"].data["id"] == current_id:

				_fields.append({

					"data" : _field.data["field"].data["data"] ,
					"id" : _field.data["field"].data["id"]
				})


		return _fields

	    
	def alter_list_data_to_serialize(self, request, data):


		id_application = int(request.GET.get("application"))
		application  = Apps.objects.filter( owner = request.user , id = id_application )[0]


		all_data =   data["objects"]

		_data_json_field_and_section = []
		_all_sections= []

		for data_field in all_data:


			if data_field.data["section"].data["id"] not in _all_sections:

				#save not duplicated fields
				_current_section_id =  data_field.data["section"].data["id"]
				_all_sections.append( _current_section_id )

				_data_json_field_and_section.append({ 
					
					 "name" :  data_field.data["section"].data["name"],
					 "section" : { 

					  		"name" :  data_field.data["section"].data["name"],
							"id" :  data_field.data["section"].data["id"],
					 },

					 "section_fields" : self._get_all_fiels_from_section( all_data , _current_section_id ) 
					
				})


				

		#Metemos los datos de la app a META
		META = data["meta"]
		META["app"] = { "app" : application.name , "id" : application.id  }
		data["meta"] = META

		#se agreagn los campos agrupados por seccion
		#Agregamos los datos agrupados a objects
		data["objects"] = _data_json_field_and_section 

		return data



	def dehydrate(self , bundle):

		return bundle
	
	
	def get_object_list(self, request):

		id_app  =  int(request.GET.get("application"))

		all_sections_in_application = AppHasSection.objects.filter( app = id_app , app__owner = request.user ).values("section__id")



		sections_length = all_sections_in_application.count()

		id_sections = []
		for section in all_sections_in_application:
			id_sections.append( section.get("section__id") )
		


		allowed_sections_has_fields  = super(AppHasSectionResource , self).get_object_list(request).filter( section__in = id_sections ) 


		return allowed_sections_has_fields 




#Areggar una nueva seccion a una aplicacion a traves de desk
class AddSectionToApplicationResource(ModelResource):
	#field = fields.ForeignKey("apps.api.resource.FieldResource",  full = True , attribute = 'field') 
  	class Meta:

	    queryset = SectionHasField.objects.all()
	    allowed_methods = ['get','put','post']
	    always_return_data = True
	    include_resource_uri = False
	    resource_name = 'addsection'
	    authorization= Authorization()


	def dehydrate(self , bundle):

		fields_ = SectionHasField.objects.filter( section = bundle.obj.section ).order_by("id")
		bundle.data["id_section"] = bundle.obj.section.id

		fields_str = []

		for field in fields_:

			#apuntamos al objecto dentro de la relacion
			field = field.field
			fields_str.append({

				"id" : field.id,
				"data" : field.data
			})

		bundle.data["fields"] =	fields_str

		return bundle


	def obj_create(self, bundle , request = None, ):

		_current_app_id = bundle.data.get("app") 
		_max_fields_to_add = bundle.data.get("max_fields_") 
		_current_section_name = bundle.data.get("section_name_") 


		#se crea la seccion con el nombre 
		_current_section = Section.objects.create( name = _current_section_name )

		#una aplicacion tiene una nueva seccion
		app_instance = Apps.objects.get( pk = _current_app_id , owner = bundle.request.user  )

		AppHasSection.objects.create( app = app_instance , section = _current_section )


		for i in range(_max_fields_to_add):

			_current_field = Field.objects.create( data = "")
		        #se guarda la seccion y el campo en una relaci on
			#solo la primera vez que se guarde el dato por obj.save
			#esto es porque obj.save solo guarda una vez, y necesitamos guardar muchas veces en SectionHasField
			if i == 0:

				bundle.obj.section_id  = _current_section.id
				bundle.obj.field_id =  _current_field.id
				bundle.obj.save()
			else:

				SectionHasField.objects.create ( field = _current_field  , section =  _current_section )

		return bundle


