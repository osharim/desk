/*

	Summary: Crea la vista del Boton "crear aplicion" y funcionalidades
*/

define( function(require){ 

	 var $           = require('jquery'),  
	  _           = require('underscore'), 
	  Backbone    = require('backbone'),
	  create_app = require('create_app');

	return (function(){ 

		 var model_new_app  = Backbone.Model.extend({    
		     url : '/api/v1/apps/',    
		     defaults: {  
			      name : "",  
		     }
		 });

		 //carga el boton para crear un workspaec 
		 var button_create_app = Backbone.View.extend({  

			 template :  require("text!../templates/apps/button_create_app.html"),
			 tagName : "div",
			 cassName :"app-el",  

			 initialize : function(){  

					    var template  =  this.template;
					    var data = {}
					    var compiledTemplate = _.template( template , data );
					   $(".section_[data-nav=appbox] .header_main").append( this.$el.append( compiledTemplate )  );

			 },
			  events : { 

				    "click .create_app" : "open_modal_to_create_app", 

			  },
			   open_modal_to_create_app : function(){   

							      !new create_app()

			   }



		 });


		 return button_create_app;



	})();//closure

});//end define
