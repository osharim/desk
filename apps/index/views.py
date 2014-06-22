from django.template import RequestContext
from django.contrib.auth.decorators import login_required
from django.shortcuts import render_to_response 
from django.conf import settings as set_django
import json as simplejson


#@login_required
def index(request): 

	user = request.user
	print user
	print  user
	print user.__dict__
	PATH_STYLE_CSS = set_django.PATH_STYLE_CSS
	PATH_STYLE_JS = set_django.PATH_STYLE_JS
	APP_VERSION = set_django.APP_VERSION


	ctx = {
		"active_dashboard": True,
		"current_user": user ,
		'APP_VERSION' :APP_VERSION ,
		'PATH_STYLE_CSS' : PATH_STYLE_CSS,
		'PATH_STYLE_JS' :PATH_STYLE_JS 
	}

	return render_to_response('index/index.html',ctx,  context_instance = RequestContext(request)  ) 
