/*

	Summary: Crea la vista general de la seccion contactos
*/

define( function(require){ 

	 var $           = require('jquery'),  
	  _           = require('underscore'), 
	  Backbone    = require('backbone'),
	  button_create_contact = require('button_create_contact'),
	  directory_contacts = require('directory_contacts');

	return (function(){ 


		 var Contact = Backbone.View.extend({  

			 initialize : function(){

				console.log("init contact");
				new button_create_contact();
				new directory_contacts();

			 }


		 });


		 return Contact;



	})();//closure

});//end define
