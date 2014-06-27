#encoding:utf-8
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

	
	#def obj_create(self, bundle , request = None, ):

		#bundle.obj.name = bundle.data.get("name") 
		#bundle.obj.workspace = bundle.data.get("workspace") 
		#bundle.obj.owner = bundle.request.user.id
		#bundle.obj.save()
		#return bundle

	
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



