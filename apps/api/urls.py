from tastypie.api import Api
from apps.api.resource import *  

v1_api = Api(api_name='v1')

#v1_api.register(UsuarioDatosResource()) 
v1_api.register(UserSignUpResource()) 
v1_api.register(UsersResource()) 
v1_api.register(WorkspaceResource()) 
