// Filename: app.js
define([ 'jquery', 'underscore' , 'backbone', 'router'  ] , function($, _, Backbone , Router){ 

//define([ 'jquery', 'modernizr' ,'ajax_st' , 'contact' , 'core' , 'home_core' ], function($){

 
  var initialize = function(){

     Router.initialize();  
 

  }

  return {

    initialize: initialize

  };

  
});
