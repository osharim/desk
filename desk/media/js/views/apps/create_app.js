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

		var App = {
			Instance  : {},
			Model : { },
		}

		//crear una aplicacion
		App.Model.new_app = Backbone.Model.extend({    
		     url : '/api/v1/apps/',    
		     defaults: {  
			      name : "",  
			      owner : "/api/v1/user/",  
			      workspace : "/api/v1/workspace/",  
		     }
		 });


		 //INPUT:Nombre de la aplicacion
		 //nombre de la aplicacion input
		 var input_name_app = Backbone.View.extend({  

			 el : '.create_name_app_',    

			 events : {

			    'keyup input' : 'update_name'        

			},
		       update_name: function(e){

		                 //clase en la que se inyectara el nombre de la aplicacion
			 	 $('.current_app').html($(e.currentTarget).val() )


		 		var id_to_update =  App.Instance.aplicacion;
		 		console.log( App.Instance.aplicacion)
			 	 //application.save({ name : "hoo" });

			}

		 });



		 // crear las columnas dinamicas e insertarlo en la plantilla html

		 var create_app = Backbone.View.extend({  

		      	 template_column  : require("text!../templates/apps/form_create_app/column.html"),
			 initialize : function(){


				 	     //boton salvar la app --- Ya no hay bton de salvar, los datos se guardan automagicamente
				 	     //!new button_save_app();
 					     !new input_name_app();

		 				
					     var aplicacion = new App.Model.new_app();
					     App.Instance.aplicacion = aplicacion;
					     console.log(aplicacion)

					     aplicacion.set("owner" , "/api/v1/user/25/");
					     aplicacion.set("workspace" , "/api/v1/workspace/19/");
					     aplicacion.set("name" , "Nueva Aplicacion");

					     aplicacion.save(null,{

						     success : function(model , data){

								aplicacion.idAttribute  = aplicacion.id;   
								AppBox.Collections.current_collection.add(aplicacion);  

							       
						   }
						     
					     });



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
