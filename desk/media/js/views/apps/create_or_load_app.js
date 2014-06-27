/*

Crea una poderosa app  o carga una app ya existente 

Summary : Cuando se hace la instancia de este objeto se le pasa por parametro en el constructor el id de la aplicacion que desea cargar
	  id_to_load_application = Number.

	  Este objeto se encarga de toda la funcionlidad de las secciones ( Columnas )
	  inicia boton de guardar app)
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

		//crear una aplicacion, solo el nombre,creador, y a que area pertenece
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

				 var current_application_name = $(e.currentTarget).val();
		 		 var id_to_update =  App.Instance.aplicacion.id;

		                 //clase en la que se inyectara el nombre de la aplicacion
			 	 $('.current_app').html( current_application_name  )
				$(".app-str li[data-id="+id_to_update+"] .name").html(current_application_name);

				var current_name_app = { name : current_application_name } ; 

				$.ajax({

					url : "/api/v1/apps/"+id_to_update+"/",
					type : "PUT",
					data : JSON.stringify(current_name_app),
					success : function(data){
						console.log("hoooo updated");
					},

					dataType : "json",
					contentType: "application/json",

				});
		 		console.log( App.Instance.aplicacion)
			 	 //application.save({ name : "hoo" });

			}

		 });


		 // crear o cargar  las columnas dinamicas e insertarlo en la plantilla html
		 var create_or_load_app = Backbone.View.extend({  

		      	 template_column  : require("text!../templates/apps/form_create_app/column.html"),
			 options : {
				 create : false,
				 id_to_load_application : 0,
				 application_name : "",

			 },
			 initialize : function(){

				 	     //boton salvar la app --- Ya no hay bton de salvar, los datos se guardan automagicamente
				 	     //!new button_save_app();
 					     !new input_name_app();


					     console.log( this.options.create )

					     if( this.options.create ){

						     //crea (POST) los datos generales de una aplicacion
						     this.create_new_application();
					      }else{

						     this.load_selected_appliaction(this.options);

					      }


				 	     // se muestra la seccion de nueva aplicacion
					     $(".section_[data-nav=creating_app]").show()
					     $(".section_[data-nav=workspace]").hide()

		        },
			// carga los datos de una aplicacion 
			load_selected_appliaction : function(options){


							console.log(options)
						    var current_name_app = options.application_name;

						    var $node = $(".section_[data-nav=apps]").show();
						    $node.find(".app_message").html("Cargando <strong>"+current_name_app+"</strong>");



				     //pone el template de columnas dinamicas
				     //var view_column = _.template(this.template_column  );    
				     //$(".container_app").html(this.$el.html(view_column));




			},
			// si se requiere se crea una nueva aplicacion, solo el nombre el creador y el workspace, la estructura es otro modelo
			create_new_application : function(){

		 				
					     var aplicacion = new App.Model.new_app();
					     App.Instance.aplicacion = aplicacion;

					     var current_id = config.user.id;
					     var current_workspace_selected = $(".workspace-str .active").attr("data-id");
					     aplicacion.set("owner" , "/api/v1/user/"+current_id+"/");
					     aplicacion.set("workspace" , "/api/v1/workspace/"+current_workspace_selected+"/");
					     aplicacion.set("name" , "Nueva Aplicacion");

					     var self = this;

					     aplicacion.save(null,{

						     beforeSend : function(){

						    var $node = $(".section_[data-nav=apps]").show();
						    $node.find(".app_message").html("Creando Aplicacion..");

						     },

						     success : function(model , data){

								//contenedor de la aplicacion desk
					     			$(".section_[data-nav=app_desk]").show()

								//ocultamos el mensaje de creando app
					     			$(".section_[data-nav=creating_app]").hide()
								//ocultamos mensaje de no has creado ninguna aplicacion
					     			$(".section_[data-nav=apps]").hide()
								aplicacion.idAttribute  = aplicacion.id;   
								AppBox.Collections.current_collection.add(aplicacion);  


								     //pone el template de columnas dinamicas
								     var view_column = _.template(self.template_column  );    
								     $(".container_app").html(self.$el.html(view_column));



							       
						   }
						     
					     });




			}

		 });



		 return create_or_load_app;



	})();//closure

});//end define
