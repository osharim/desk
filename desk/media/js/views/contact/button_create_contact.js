/*

	Summary: Crea la vista del Boton "crear contacto" y funcionalidades
*/

define( function(require){ 

	 var $           = require('jquery'),  
	  _           = require('underscore'), 
	  Backbone    = require('backbone');

	  require('modal');

	return (function(){ 

		 // crea un contacto en un click y regresa la intancia del boton para crear un contacto
		 var button_create_contact = Backbone.View.extend({  

			 template :  require("text!../templates/contact/button_create_contact.html"),
			 title :  "Crear un contacto",
			 content :  require("text!../templates/contact/form_create_contact/form_create_contact.html"),
			 footer :  require("text!../templates/contact/form_create_contact/footer_button_create_contact.html"),

			 tagName : "div",
			 cassName :"reply-el",  

			 //el : ".create_contact", 

			 initialize : function(){  
				 	console.log(this)

					    var template  =  this.template;
					    var data = {}
					    var compiledTemplate = _.template( template , data );
					    console.log(compiledTemplate)
					    //console.log(this.$el.append( compiledTemplate ))
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

				});  

			   }



		 });


		 return button_create_contact;



	})();//closure

});//end define
