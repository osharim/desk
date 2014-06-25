/*
	Summary: Renderea el template de un unico workspace
*/

define( function(require){ 

	 var $           = require('jquery'),  
	  _           = require('underscore'), 
	  Backbone    = require('backbone');

	return (function(){ 


		 var  Workspace = Backbone.View.extend({    


			   tagName : "div",        
		       	   className :"workspace-str",  
		      	   template_workspace : require("text!../templates/workspace/unique_workspace.html"),
		       	   render : function(){   
				   var view_workspace = _.template(this.template_workspace  ,  this.model.toJSON()  );    
				   this.$el.html(view_workspace); 
				   return this; 
			   }
		 });

		 return Workspace;

	})();

});


