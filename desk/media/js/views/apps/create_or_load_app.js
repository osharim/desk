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
					},

					dataType : "json",
					contentType: "application/json",

				});
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



		 },events : {
		
		 	"click .add_column" : "add_section", 	 
		 	"click td.allow" : "edit_value_in_field", 	 
		 	"keyup .current_edit" : "data_in_textarea", 	 
			  
			
		 },
		 // en el textarea al dar enter se guarda el dato y se pierde el foto

		 data_in_textarea  : function(e){

			 console.log(e)
			 console.log(e.which )

			 var _current_el = $(e.currentTarget);
			 var _current_key_pressed = e.which;
			 var _current_value  = _current_el.val()
			 var _current_id  = _current_el.attr("data-id");


			 switch(_current_key_pressed){

				//Enter --Save field
				 case 13 : 


					var new_data = { data : _current_value   };
					$.ajax({

						url : "/api/v1/field/"+_current_id+"/",
						type : "PUT",
						data : JSON.stringify( new_data ),
						success : function(data){
						},

						dataType : "json",
						contentType: "application/json",

					});
					 //application.save({ name : "hoo" });
					 _current_el.val().replace(/\v+/g, '');

					 //return false;



				 break;

				 //tab
				 case 9	: 

					 console.log("tab")
					 e.preventDefault();

				 break;



			 };

			 

		 },
		  // al dar click en el field se inserta el textarea
		  edit_value_in_field : function(e){


			var td_ = $(e.currentTarget);

			//si el td_ actual ya se le dio click entonces ya no hacemos nada.. para no insertar otra ves el elemento, 
			if( !td_.hasClass("focus")){


						var td_data  = td_.html(); 
						console.log( td_ )
						var _current_id = $(td_).attr("data-id");
						var editableText = $("<textarea class='current_edit' data-id="+_current_id+" />");
						editableText.val(td_data);
						$(td_).html(editableText).addClass("focus");
						editableText.focus();
			}

		  },
		  add_section : function(){

				       var _current_section_name = "Seccion nueva";

				       //se ingresa la nueva columna antes del boton +
			 		$(".app thead tr th:last-child").before("<th> "+_current_section_name+"</th>")
			 		//Se guarga la referencia de la tabla de datos
			 	        var $node_container_data =  $(".container_data"),
					//cuantos tr existen , (filas) , para cuando se agrege la columna se agregen filas de la misma cantidad
		 			_node_max_field_length_container_data = $node_container_data.children().length;


					_.each ( $node_container_data.children() , function(tr){
						//se ponen las filas en la nueva columna  al maximo de filas existentes
						  $( tr ).children(":last-child").before("<td></td>")

					});

					var id_current_app = this.options.application_data.objects[0].app.id;


					var data_new_section = { 
						app : id_current_app  , 
						section_name_: _current_section_name, 
						max_fields_  : _node_max_field_length_container_data - 1
				       	} ; 
					//crea una seccion y crea N  campos , N = _node_max_field_length_container_data;
					$.ajax({


						url : "/api/v1/addsection/",
						type : "POST",
						data : JSON.stringify(data_new_section),
						success : function(data){
						},

						dataType : "json",
						contentType: "application/json",
					})





			 		

		}
		 ,render : function(){


				     var application_data = this.options.application_data;
			 	    //nombre de la aplicacion actual
				     $(".current_app").html(application_data.objects[0].app.name);

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

								     //pone el template de columnas dinamicas
								     var data_in_application = new App.View.load_data_from_app_with_sections_and_fields({ application_data : data });

					}//success
					
					});//fetch




			}

		 });



		 return create_or_load_app;



	})();//closure

});//end define
