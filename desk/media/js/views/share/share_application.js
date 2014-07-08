/*

	Summary: Crea la vista general de aplicaciones compartidas 
*/

define( function(require){ 

	 var $           = require('jquery'),  
	  _           = require('underscore'), 
	  Backbone    = require('backbone'),
	  shared_applicationsbox = require('shared_applicationsbox');

	return (function(){ 


		 var SharedApplications = Backbone.View.extend({  

			 initialize : function(){

	  				!new shared_applicationsbox(); 

			 }


		 });


		 return SharedApplications;



	})();//closure

});//end define
