from django.conf.urls import patterns, include, url
from django.conf import settings
from apps.api.urls import *



urlpatterns = patterns('',

		url(r'^' , include('apps.index.urls')) ,   
		(r'^api/' , include(v1_api.urls)),
		(r'api/doc/', include('tastypie_swagger.urls', namespace='tastypie_swagger')),   
		url(r'login/' , include('apps.login.urls')) ,
		)


if settings.DEBUG:
	urlpatterns += patterns('',    
		url(r'^media/(?P<path>.*)$', 'django.views.static.serve', {
			'document_root': settings.MEDIA_ROOT,   
			}),
		)
