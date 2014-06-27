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
			View : { },
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

		/*******************************************************************************************************/
		/*******************************************************************************************************/
		/*******************************************************************************************************/
		/*******************************************************************************************************/





		var id_application = 0;
		// carga los datos de una app , campos y secciones 
		App.Model.data_application = Backbone.Model.extend({    
					     url : function(){
						     
						    var current_id_application = this.attributes.id_application;
						     return '/api/v1/appsection/?app='+current_id_application;
					     },
					 });


		/*******************************************************************************************************/
		/*******************************************************************************************************/
		/*******************************************************************************************************/
		/*******************************************************************************************************/





		 // toma todos los datos de una app con secciones y campos y renderiza el template y los inyecta en el DOM
		 App.View.load_data_from_app_with_sections_and_fields  = Backbone.View.extend({   

		 template_field_section  : require("text!../templates/apps/form_create_app/sections_and_fields.html"),

		 initialize : function(){

			 this.render();


		 },render : function(){

			 	     console.log(this)

				     var application_data = this.options.application_data;
				     console.log(application_data)

				     var template_field_and_sections_rendered  = _.template(this.template_field_section , { data  : application_data } );    
				     $(".section_").hide();
				     $(".section_[data-nav=app_desk]").show();
				     $(".container_app").html(this.$el.html(template_field_and_sections_rendered));


		 }
		 
		});



		/*******************************************************************************************************/
		/*******************************************************************************************************/
		/*******************************************************************************************************/
		/*******************************************************************************************************/



	         //objeto principal, determina si se require cargar o crear una app
		 var create_or_load_app = Backbone.View.extend({  

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
						    var current_id_app = options.id_to_load_application;

						    var $node = $(".section_[data-nav=apps]").show();
						    $node.find(".app_message").html("Cargando <strong>"+current_name_app+"</strong>");
						    
						    this.load_data_in_app_and_polled_sections_by_id_app(current_id_app)




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

							      //carga los datos (field and sections)  de una app
							      self.load_data_in_app_and_polled_sections_by_id_app( aplicacion.id );
							       
						   }
						     
					     });

			},

			/*
					Summary : Cargamos los datos que tiene una app ,  fields y sections ( Campos y datos) de una app con id en especifico
					param @id_application(int)
			*/
			load_data_in_app_and_polled_sections_by_id_app : function(id_application){

			
					var data_in_section = new App.Model.data_application( { id_application : id_application });

					data_in_section.fetch({
					
							success : function(model,data){

								     console.log(data);
								     //pone el template de columnas dinamicas
								     var data_in_application = new App.View.load_data_from_app_with_sections_and_fields({ application_data : data });

					}//success
					
					});//fetch




			}

		 });



		 return create_or_load_app;



	})();//closure

});//end define
