from django.conf.urls import patterns,url
urlpatterns = patterns('apps.index.views', 


		url(r'^$' ,    'index' ,  name = 'index') , 

		 )
