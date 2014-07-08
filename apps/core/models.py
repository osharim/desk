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
    	date = models.DateTimeField( auto_now_add = True, db_column = "date" ) 

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

#*******************************************************************
#********************* SHARE **************************************
#*******************************************************************

#configuracion de las secciones dentro de una aplicacion, puede ver, puede editar
class SettingsSharedAplication(models.Model):

    	section = models.ForeignKey(Section,  db_column = "section_id")
    	can_edit  = models.IntegerField( default = 1)
    	can_view  = models.IntegerField( default  = 1)

	class Meta:
		db_table = u'settings_shared_application'

#el usuario comparte una aplicacion con un usuario : N:M
class ShareApplication(models.Model):

    	from_user = models.ForeignKey(User , related_name ="from_user_id")
    	app = models.ForeignKey(Apps,  db_column = "app_id")

	class Meta:
		db_table = u'share_application'


#Puede compartir con muchios usuarios esta aplicacion
class ShareApplicationManyUsers(models.Model):

    	to_user  = models.ForeignKey(User , related_name ="to_user_id")
    	share_application  = models.ForeignKey(ShareApplication)

	class Meta:
		db_table = u'share_application_many_users'


#una palicacion tiene muchas configuraciones
class SharedApplicationHasSettings(models.Model):

    	settings = models.ForeignKey(SettingsSharedAplication)
    	share = models.ForeignKey(ShareApplication)

	class Meta:
		db_table = u'shared_aplication_has_settings'


