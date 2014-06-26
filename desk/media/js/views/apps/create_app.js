/*

	Summary: Crea una poderosa app (inyecta las columnas , inicia boton de guardar app) 
*/

define( function(require){ 

	 var $           = require('jquery'),  
	  _           = require('underscore'), 
	  Backbone    = require('backbone'),
	  button_save_app = require('button_save_app');
	  require('modal');

	return (function(){ 
		 //nombre dw la aplicacion input
		 var input_name_app = Backbone.View.extend({  

			 el : '.create_name_app_',    

			 events : {

			    'keyup input' : 'filter'        

			},
		       filter : function(e){

		                 //clase en la que se inyectara el nombre de la aplicacion
			 	 $('.current_app').html($(e.currentTarget).val() )

			}

		 });



		 // crear las columnas dinamicas e insertarlo en la plantilla html

		 var create_app = Backbone.View.extend({  

		      	 template_column  : require("text!../templates/apps/form_create_app/column.html"),
			 initialize : function(){


				 	     //boton salvar la app
				 	     !new button_save_app();
 					     !new input_name_app();


				 	     // se muestra la seccion de nueva aplicacion
					     $(".section_[data-nav=new_app]").show()
					     $(".section_[data-nav=workspace]").hide()

			 	             //pone el template de columnas dinamicas
					     var view_column = _.template(this.template_column  );    
					     $(".container_app").html(this.$el.html(view_column));
					    //<span class="current_app"></span>

		        }

		 });



		 return create_app;



	})();//closure

});//end define
