#encoding:utf-8
import re
from django.http import HttpResponseRedirect
from django.shortcuts import render_to_response
from django.template import RequestContext
from apps.login.forms import *
from django.contrib.auth import authenticate,login,logout
from django.contrib.auth.models import User

# create a function to resolve email to username
def get_user_email(email):
	try:
		return User.objects.get(email=email.lower())
	except User.DoesNotExist:
		return None

def login_auth(request , lang  ):

	try:
		lang =  request.GET.get("lang")
	except:
		lang = "ES"

	if lang is None:
		lang = "ES"

	lang_types  =  { "ES" :"ES" , "EN" :"EN" ,  "CN" :"CN" }


	next = ""
	state = ""

	if request.GET:  
	        next = next

	if request.POST:
		#obtener posible email
		email = request.POST["email"]
		password = request.POST["password"]

		if re.match(r"^[A-Za-z0-9\.\+_-]+@[A-Za-z0-9\._-]+\.[a-zA-Z]*$",email ):
			user_from_qs  = get_user_email(email) 

 
		if user_from_qs  is not None:
			user = authenticate(username = user_from_qs.username , password = password)
			if user is not None:
				#Si esta logeado el usuario
				login(request, user)

				return HttpResponseRedirect("/")
			else:
				state = "Clave , email o usuario incorrecto"
		else:
			state = "Clave , email o usuario incorrecto"

	ctx = { "login_form" : LoginForm, 
		"state" : state ,
		"lang" : lang_types ,
		'next':next
	}	
	return render_to_response('login/login.html',ctx,  context_instance = RequestContext(request)  )

#Cerrar sesion
def logout_auth(request):
    logout(request)
    return HttpResponseRedirect('/')
