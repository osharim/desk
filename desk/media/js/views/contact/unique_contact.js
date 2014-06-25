/*

	Summary: Renderea el template de un unico contacto 
*/

define( function(require){ 

	 var $           = require('jquery'),  
	  _           = require('underscore'), 
	  Backbone    = require('backbone');

	  require('modal');

	return (function(){ 


		 var  Contact  = Backbone.View.extend({    


			   tagName : "div",        
		       	   className :"contact-str",  
		      	   template_contact : require("text!../templates/contact/unique_contact.html"),
		       	   render : function(){   
				   var view_contact = _.template(this.template_contact  ,  this.model.toJSON()  );    
				   this.$el.html(view_contact); 
				   return this; 
			   }
		 });

		 return Contact;

	})();

});


