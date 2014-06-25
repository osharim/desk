/*

	Summary: Crea la vista del Boton "crear contacto" y funcionalidades
*/

define( function(require){ 

	 var $           = require('jquery'),  
	  _           = require('underscore'), 
	  Backbone    = require('backbone');

	  require('modal');

	return (function(){ 

		 var model_new_user = Backbone.Model.extend({    
		     url : '/api/v1/newuser/',    

		     defaults: {  
			      password : "",  
			      first_name: "",  
			      last_name: "",  
			      email : "",  
			      rol : "",  
		     }
		 });

		 //carga el boton para crear un contacto
		 var button_create_contact = Backbone.View.extend({  

			 template :  require("text!../templates/contact/button_create_contact.html"),
			 title :  "Crear un contacto",
			 content :  require("text!../templates/contact/form_create_contact/form_create_contact.html"),
			 footer :  require("text!../templates/contact/form_create_contact/footer_button_create_contact.html"),

			 tagName : "div",
			 cassName :"reply-el",  

			 //el : ".create_contact", 

			 initialize : function(){  

					    var template  =  this.template;
					    var data = {}
					    var compiledTemplate = _.template( template , data );
					    $(".section_[data-nav=contact] .header_main").append( this.$el.append( compiledTemplate )  );


			 },
			  events : { 

				    "click .create_contact" : "open_modal_to_create_contact", 

			  },
			   open_modal_to_create_contact : function(){   

				   var that = this;
				   $.modal({
					   title : that.title,
					    content : that.content , 
					    footer : that.footer, 
					    success : function(){

						   $(".create_contact_form").click(function(){

							   //input signup nodes
							   var $paren_form = $(".content_signup");
							    var $nodes_input_ = $paren_form.children();
							    var error = false;

							    _.each( $nodes_input_ , function(input){

								    var _ref_node_ = $(input);

								    if ( _ref_node_.find("input").val().length < 2 ){
									    _ref_node_.addClass("error");
									    error= true;

								    }else{

									    _ref_node_.removeClass("error");
								    }



							    });//End each


								    if(!error){

									    var first_name = $paren_form.find("input[name=first_name]").val().trim();
									    var last_name = $paren_form.find("input[name=last_name]").val().trim();
									    var password = $paren_form.find("input[name=password]").val();
									    var email = $paren_form.find("input[name=email]").val().trim();
									    var rol = 0;

									    var new_model_user   =  new model_new_user(); 
									    new_model_user.set("first_name",  first_name);
									    new_model_user.set("last_name",  last_name);
									    new_model_user.set("password",  password);
									    new_model_user.set("email",  email);
									    new_model_user.set("rol",  rol );

									    new_model_user.save(null  , {  

										    success : function(model , data){ 

										        new_model_user.set({ user : data } );   
											Directory_contacts.Collections.current_collection.add(new_model_user);  
											$(".close_box").click();



										    }

									      });//save model_user



								    }


						   });

					   }
				});  

			   }



		 });


		 return button_create_contact;



	})();//closure

});//end define
