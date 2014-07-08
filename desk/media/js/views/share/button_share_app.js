/*
	Summary: Al dar click en Compartir aplicacion dentro de la aplicacion se abre un modal box
       		 dentro del modalbox se obtiene todas las secciones de una aplicacion, el email del usuario
	 	 
		 Boton de envento al dar click compartir "aplicacion" se envian los datos al endpoint	 
*/

define( function(require){ 

	 var $           = require('jquery'),  
	  _           = require('underscore'), 
	  Backbone    = require('backbone');
	  require('modal');

	return (function(){ 

	 var  input_to_text_email_and_share = Backbone.View.extend({    

			   el : ".share_app_input",

		      	   events  :{
					    "keyup" : "enter_email",
				    },
	      		    enter_email : function(event){
							
						  var _container_users_to_share_application = $(".content_users_s_a");

						  var _$el  = $(event.currentTarget);

						 if( event.KeyCode == 13 || event.which == 13 ){
							 
							 _current_email = _$el.val();
							 tag_with_email = "<span>{}</span>".format(_current_email);
							 _container_users_to_share_application.append( tag_with_email );
							 _$el.val("");
 
 
						 }


			   }
	 });




		// boton dentro del modal box para compartir la aplicacion, obtiene y hace todos los ajustes que se compartiran para la app
		// mete funcionalidad a los checkbox, funcionalidad como al darle cheked o unchecked lo haga ver que se activo o se dessactivo todo
		 var  button_share_on_modalbox = Backbone.View.extend({    


			   el : ".share_application",

		      	   events  :{
					    "click" : "share",
				    },

		      	   initialize : function(){

						this.attach_event_on_checkbox();

			},
		      	   attach_event_on_checkbox : function(){


							      //Habilita y Deshabilita con el checkbox de compartir
				          $('.allow_share').change(function() {

					      		var _$el = $(this);



							  if( !_$el.is(":checked")) {

										  _$el.attr("checked", false);
						  				  _$el.parent().parent().css({ opacity : .3 } );

						  	  }else{

										  _$el.attr("checked", true);
						  				  _$el.parent().parent().css({ opacity : 1 } );
							  }
					});


					  //cuando se da click en el checkbox de puede editar, checamos si el checkbox de puede ver esta habilitado
					  //sino se shabilita
							      
				          $('.allow_edit').change(function() {

					      		var _$el = $(this);

							  if( _$el.is(":checked")) {
							  // se habilita 
								_$el.parent().next().find(".allow_view").attr("checked" , true );
							  }
					});


						//cuano se da click en puede ver, checamos si esta habilitado puede editar, si esta habilitado se deshabilita
				          $('.allow_view').change(function() {

					      		var _$el = $(this);

							  if( !_$el.is(":checked")) {
							  // se habilita 
								_$el.parent().prev().find(".allow_edit").attr("checked" , false );
							  }
					});




			},

			   get_all_users_to_share_application : function(){

				var user_email = []
				var users_in_dom = $(".content_users_s_a span");
				
				_.each(users_in_dom ,function(user){
					
					user_email.push( $(user).html()  )
					
				});
				
				return user_email;


			},

			   // obtiene las configuraciones de las secciones y retorna un objeto JSON con las configuraciones
			   get_all_sections_with_settings  : function(){

			     var $sections_to_share = $(".allow_share:checked").parent().parent();
			     var section_json_encoded = [];
			     _.each( $sections_to_share , function(section){
						    var _$el =  $(section),

						    allow_view =  ( _$el.find(".allow_view").attr("checked") == "checked" ? 1 : 0 ) ,
						    allow_edit =  ( _$el.find(".allow_edit").attr("checked") == "checked" ? 1 : 0 ),
						    id_section =   _$el.attr("data-id");
				      
			      section_json_encoded.push({ "s_" : id_section , "c_v" : allow_view , "c_e" : allow_edit })
			     });

			     return section_json_encoded;


			  },

		      	   share :  function(){

					    	var self = this;

					    	var shared_settings = { 
						
								from_user : "/api/v1/user/{}/".format( config.user.id ), 
								to_user : this.get_all_users_to_share_application(),
								app : "/api/v1/apps/{}/".format( App.Instances.CurrentApp.get("id") ),
		       						shared_sections : this.get_all_sections_with_settings()
						}	

							
						var shared_sections_settings = {};


						$.ajax({

							url : "/api/v1/share/",
							type : "POST",
							data : JSON.stringify(shared_settings),
							contentType: "application/json",     
							
							dataType : "json", 
							success : function(){

								 self.$el.html("Se ha compartido esta aplicacion");
								 setTimeout(function(){
									 $(".box .close").click()

								 },400)
							},
							beforeSend  : function(){

								 self.$el.html("Compartiendo...");


							}

						})



				   }

		 });



		 var  Share = Backbone.View.extend({    

			   el : ".app_share",
		      	   template_content_share  : require("text!../templates/share/form_share_app/content_share_app.html"),  
		      	   template_section_in_application   : require("text!../templates/share/form_share_app/sections_in_application.html"),  
		      	   template_footer_in_application    : require("text!../templates/share/form_share_app/footer_share_app.html"),  
		      	   events  :{
					    "click" : "open_share",
				    },
		           open_share : function(e){
						
						var current_app = window.App.Instances.CurrentApp;
						var current_app_name = current_app.get("name");
						var current_app_id = current_app.get("id");


						// get all sections availble into application

						var $sections = $(".edit_section");
						var sections_length =  $sections.length

						var _sections = [];
						_.each( $sections , function(th){

							var _current_td = $(th);
							_sections.push( { "id" : parseInt( _current_td.attr("data-id")) , "name" :  _current_td.children(".name").html()  }  );
						});



						application_to_share = _sections; 
				   		var sections_in_application = _.template(this.template_section_in_application , application_to_share   );    

				   		var footer_in_application = _.template(this.template_footer_in_application  , { current_app_name : current_app_name } );    

						//render del html en el contenedor
				   		var view_content_share  = _.template(this.template_content_share,  { secions_in_application : sections_in_application }  );    

						    $.modal({
							    title : "Compartir  <strong>"+current_app_name+"</strong>",
						    	    content : view_content_share,
						    	    footer : footer_in_application ,
							    success : function(){

						    		    !new button_share_on_modalbox();
						    		    !new input_to_text_email_and_share();



							    }
						    });


			}


		 });

		 return Share;

	})();

});


