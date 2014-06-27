/*

	Summary: Crea la vista del Boton "crear aplicion" y funcionalidades
*/

define( function(require){ 

	 var $           = require('jquery'),  
	  _           = require('underscore'), 
	  Backbone    = require('backbone'),
	  create_or_load_app = require('create_or_load_app');

	return (function(){ 

		 var model_new_app  = Backbone.Model.extend({    
		     url : '/api/v1/apps/',    
		     defaults: {  
			      name : "",  
		     }
		 });

		 //carga el boton para crear un workspaec 
		 var button_create_or_load = Backbone.View.extend({  

			 template :  require("text!../templates/apps/button_create_app.html"),
			 tagName : "div",
			 cassName :"app-el",  

			 initialize : function(){  

					    var template  =  this.template;
					    var data = {}
					    var compiledTemplate = _.template( template , data );
					   $(".btn_create_app_into_workspace").html( this.$el.append( compiledTemplate )  );

			 },
			  events : { 

				    "click .create_app" : "click_to_create_or_load", 

			  },
			   click_to_create_or_load : function(){   

							      //se manda el create  para determinar que se quiere crear una app
							      !new create_or_load_app({ create : true } )

			   }



		 });


		 return button_create_or_load;



	})();//closure

});//end define
