from django.db import models
from django.contrib.auth.models import User
#manejamos la imagen y el rol de User , lo extendemos
class Settings(models.Model):

    user  = models.ForeignKey(User)
    img = models.CharField(max_length=300, blank=True  , default="https://s3.amazonaws.com/pinffiles/unknown.png")
    rol = models.CharField(max_length=50, blank=True)
    lang = models.CharField(max_length=10, default="ES")
    users_created = models.IntegerField()

    class Meta:
        db_table = u'settings'

#Que administrador creo cuales usuarios
class AdminCreatedUsers(models.Model):

    admin = models.ForeignKey(User , related_name="admin")
    user  = models.ForeignKey(User , related_name ="user")
    fecha = models.DateTimeField( auto_now_add = True, db_column = "fecha" ) 

    class Meta:
        db_table = u'administator_create_users'



#Workspace
class Workspace(models.Model):

    owner = models.ForeignKey(User , related_name ="owner" , db_column = "owner_id")
    date = models.DateTimeField( auto_now_add = True, db_column = "fecha" ) 
    name = models.CharField(max_length=50, blank=True)

    class Meta:
        db_table = u'workspace'
#Apps
class Apps(models.Model):

    owner = models.ForeignKey(User ,  db_column = "owner_id")
    date = models.DateTimeField( auto_now_add = True, db_column = "date" ) 
    name = models.CharField(max_length=50, blank=True)
    workspace  = models.ForeignKey(Workspace   , db_column = "workspace_id")

    class Meta:
        db_table = u'apps'


#datos de una seccion en una aplicacion
class Field(models.Model):

	data = models.TextField(blank=True)

	class Meta:
		db_table = u'field'


#seccion en una aplicacion
class Section(models.Model):

	name = models.CharField(max_length=50, blank=True)
    	date = models.DateTimeField( auto_now_add = True, db_column = "date" ) 

	class Meta:
		db_table = u'section'

#una seccion tiene muchos datos
class SectionHasField(models.Model):

    	section = models.ForeignKey(Section,  db_column = "section_id")
    	field = models.ForeignKey(Field,  db_column = "field_id")

	class Meta:
		db_table = u'section_has_field'



#una aplicacion tiene muchas secciones
class AppHasSection(models.Model):

    	app = models.ForeignKey(Apps,  db_column = "app_id")
    	section = models.ForeignKey(Section,  db_column = "section_id")

	class Meta:
		db_table = u'app_has_section'


