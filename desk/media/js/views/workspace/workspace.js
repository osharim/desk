/*

	Summary: Crea la vista general de la seccion workspace 
*/

define( function(require){ 

	 var $           = require('jquery'),  
	  _           = require('underscore'), 
	  Backbone    = require('backbone')
	  button_create_workspace = require('button_create_workspace'),
	  workspacebox = require('workspacebox');

	return (function(){ 


		 var Workspace = Backbone.View.extend({  

			 initialize : function(){

				!new button_create_workspace();
				!new workspacebox();

			 }


		 });


		 return Workspace;



	})();//closure

});//end define
