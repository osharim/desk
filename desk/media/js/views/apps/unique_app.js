/*
	Summary: Renderea el template de un unico app
*/

define( function(require){ 

	 var $           = require('jquery'),  
	  _           = require('underscore'), 
	  Backbone    = require('backbone');

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
					      console.log("open appp");



			}
		 });

		 return App;

	})();

});


