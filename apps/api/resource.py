#encoding:utf-8
import re 
from apps.core.models import *
from django.contrib.auth.models import User
from tastypie.resources import ModelResource , ALL , ALL_WITH_RELATIONS 
from tastypie.authorization import Authorization
from tastypie.exceptions import BadRequest 
from tastypie import fields
from django.core import serializers
from django.db.models import Q , F
from datetime import date 


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

			_current_field_in_section = Field.objects.create( data = "Empieza a escribir aqui")

			#se guarda la seccion y el campo en una relaci on
			SectionHasField.objects.create ( field = _current_field_in_section , section =  _current_section )

		AppHasSection.objects.create( app = _current_app  , section = _current_section )

		return bundle

	
	#def get_object_list(self, request):

		 #return super(WorkspaceResource, self).get_object_list(request).filter( owner = request.user)







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

		bundle.data["field_instalce"] = fields_created

		return bundle

   
	
	#def get_object_list(self, request):

		 #return super(AllowedUsersResource , self).get_object_list(request).filter( admin = request.user)




#una seccion tiene muchos datos pero no regresa los datos de una seccion, se usa para obtener las secciones de una app con la relacion M2M y no nos regrese datos extra
class SectionHasFieldWithNoSectionDataResource(ModelResource):

	field = fields.ForeignKey("apps.api.resource.FieldResource",  full = True , attribute = 'field') 

  	class Meta:

	    queryset = SectionHasField.objects.all().order_by("field__date")
	    allowed_methods = ['get','put','post']
	    always_return_data = True
	    include_resource_uri = False
	    authorization= Authorization()




#una aplicacion tiene muchas secciones
class AppHasSectionResource(ModelResource):

	section = fields.ForeignKey("apps.api.resource.SectionResource",  full = True , attribute = 'section') 

	section_fields = fields.ToManyField('apps.api.resource.SectionHasFieldWithNoSectionDataResource', 

			attribute = lambda bundle:       SectionHasField.objects.filter(section = bundle.obj.section ) 

			,null = True
			,full = True
	)
	app = fields.ForeignKey("apps.api.resource.AppsResource",  full = True , attribute = 'app') 

  	class Meta:

	    queryset = AppHasSection.objects.all()
	    allowed_methods = ['get','put','post']
	    resource_name = 'appsection'
	    always_return_data = True
	    authorization= Authorization()
	    filtering = {
		"app" : ["exact"],
	    }

	def dehydrate(self , bundle):
		return bundle
	
	
	def get_object_list(self, request):

		 return super(AppHasSectionResource , self).get_object_list(request).filter( app__owner = request.user)




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

		fields_ = SectionHasField.objects.filter( section = bundle.obj.section )
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
		app_instance = Apps.objects.get( pk = _current_app_id )
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


