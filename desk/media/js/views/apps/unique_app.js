/*
	Summary: Renderea el template de un unico app
*/

define( function(require){ 

	 var $           = require('jquery'),  
	  _           = require('underscore'), 
	  Backbone    = require('backbone'),
	  create_or_load_app = require('create_or_load_app');

	return (function(){ 


		 var  App = Backbone.View.extend({    


			   tagName : "div",        
		       	   className :"app-str",  
		      	   template_app : require("text!../templates/apps/unique_app.html"),
		       	   render : function(){   

				   var view_app = _.template(this.template_app  ,  this.model.toJSON()  );    

				   this.$el.html(view_app); 
				   return this; 

			   },
		      	   events  :{

					    "click" : "open_app",

				    },
		           open_app : function(){

					      var current_app_id = this.model.id;
					      console.log( current_app_id, "id")
					      var current_app_name = this.model.get("name")

						//eliminamos clase de seleccion
					      //ponemos la clase de seleccion de elemento
					      $(".app-str li").removeClass("active");
					      $(".app-str li[data-id="+current_app_id+"]").addClass("active")
						
					//	window.App.Instances.CurrentApp =  this.model;
					      var load_app = new create_or_load_app({ create : false , id_to_load_application : current_app_id , application_name : current_app_name   });




			}
		 });

		 return App;

	})();

});


