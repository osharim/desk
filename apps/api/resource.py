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

# Usuario Datos

#class UsuarioDatosResource(ModelResource):
	#usuario = fields.ForeignKey("apps.api.resource.UsuarioResource", 'usuario'    ,  null = True , full = True )          
#	class Meta: 
#		queryset = UsuarioDatos.objects.all()
#		resource_name ='usuario'
#		authorization= Authorization()     

