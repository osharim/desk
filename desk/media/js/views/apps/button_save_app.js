/*

	Summary: Crea la vista del Boton "salvar applicacion"
*/

define( function(require){ 

	 var $           = require('jquery'),  
	  _           = require('underscore'), 
	  Backbone    = require('backbone');


	return (function(){ 

		//guarda atributos de una app en la DB ---> nombre y  a que workspace pertenece
		 var model_new_app = Backbone.Model.extend({    
		     url : '/api/v1/app/',    
		     defaults: {  
			      nombre: "",  
			      workspace : "",  
		     }

		 });

		 var button_save_app = Backbone.View.extend({  

			 template :  require("text!../templates/apps/button_save_app.html"),
			 tagName : "div",
			 cassName :"save-el",  

			 //el : ".save_app", 

			 initialize : function(){  

					    var template  =  this.template;
					    var data = {}
					    var compiledTemplate = _.template( template , data );
					    $(".section_[data-nav=new_app] .header_main").append( this.$el.append( compiledTemplate )  );


			 },
			  events : { 

				    "click .save_app" : "save_app", 

			  },
			   save_app: function(){   

					     console.log("save app");
							   	error = false

								    if(!error){

									    //var email = $paren_form.find("input[name=email]").val().trim();

									    var new_model_app   =  new model_new_user(); 
									    //new_model_app.set("first_name",  first_name);

									    new_model_app.save(null  , {  

										    success : function(model , data){ 
										        new_model_app.set({ user : data } );   
											AppBox.Collections.current_collection.add(new_model_app);  
											$(".close_box").click();



										    }

									      });//save model_app

								    }//if

					   }
				});  



		 return button_save_app;



	})();//closure

});//end define
