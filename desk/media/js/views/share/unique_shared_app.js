/*
	Summary: Renderea el template de un unico app compartida
*/

define( function(require){ 

	 var $           = require('jquery'),  
	  _           = require('underscore'), 
	  Backbone    = require('backbone');

	return (function(){ 


		 var  App = Backbone.View.extend({    


			   tagName : "tr",        
		       	   className :"app-shared-str",  
		      	   template_app : require("text!../templates/share/unique_app.html"),
		       	   render : function(){   

				   var view_app = _.template(this.template_app  ,  this.model.toJSON()  );    
				   this.$el.html(view_app); 
				   console.log( this.model.toJSON() )
				   this.$el.attr("data-id", this.model.get("app").id );
				   return this; 

			   },
		      	   events  :{

					    "click" : "open_app",

				    },
		           open_app : function(event){

					      var current_el = $(event.currentTarget);

					      var current_app_id = current_el.attr("data-id");

					      window.App.Instances.Router.navigate("#!/app/{}/".format(current_app_id) , {trigger: true } );

			}
		 });

		 return App;

	})();

});


