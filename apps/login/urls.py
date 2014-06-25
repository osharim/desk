from django.conf.urls import patterns,url


urlpatterns = patterns('apps.login.views',

		#login
		url(r'^$' ,    'login_auth' ,  name = 'login_path'  , kwargs={'lang': "ES" }   ) ,
		url(r' (?P<lang>[-\w]+)$' ,    'login_auth' ,  name = 'login_path') ,
		url(r'out/$' ,    'logout_auth' ,  name = 'logout_path') ,
		)
