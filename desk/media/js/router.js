
define( function(require){


return (function(){


	var  $           = require('jquery'), 
       	     _           = require('underscore'),   
	     Backbone    = require('backbone'),  
       	     handler     = require('handlers'),
       	     status  	 = require('status'),
       	     modal 	 = require('modal'),
       	     timeago     = require('timeago');



//iniciar todos los switch de la aplicacion
_.each( $(".js-switch") , function(item , index){ var switchery = new Switchery(item); }); 



// los switch de colores de ajustes
var blue = document.querySelector('.js-switch-blue');
var switchery = new Switchery(blue, { color: '#41b7f1' });

var pink = document.querySelector('.js-switch-pink');
var switchery = new Switchery(pink, { color: '#ff7791' });

var teal = document.querySelector('.js-switch-teal');
var switchery = new Switchery(teal, { color: '#3cc8ad' });

var red = document.querySelector('.js-switch-red');
var switchery = new Switchery(red, { color: '#db5554' });



	window.App = {

		Model : {} ,
		View : {},
		Controller : {},
		Router : {}
	};


	var initialize = function(){ 
		
		window.App.Router = Backbone.Router.extend({

			initialize : function(){


		},
		routes : {

			"" : "dashboard",
			"dashboard" : "dashboard",
			"perfil" : "perfil",
			"metas" : "metas",
			"ajustes" : "ajustes",
			"recordatorios" : "recordatorios",
			"dieta" : "dieta"

			 },
			dashboard : function(){

					var  Dashboard = Backbone.View.extend({
						 defaults : {  
							handler : "dashboard" ,   
						},
						initialize : function(){ 

								   handler.tabs.active({ tab : this.defaults.handler , container : this.defaults.handler  }); 


       	     							   var tracking    = require('tracking');
						
						}


					});

					    new Dashboard();


			},
			perfil : function(){


					var  Profile = Backbone.View.extend({
						 defaults : {  
							handler : "profile" ,   
						},
						initialize : function(){ 

								   handler.tabs.active({ tab : this.defaults.handler , container : this.defaults.handler  }); 


						
						}


					});

					    new Profile();





			},
			metas : function(){


					var  Goals= Backbone.View.extend({
						 defaults : {  
							handler : "goal" ,   
						},
						initialize : function(){ 

								   handler.tabs.active({ tab : this.defaults.handler , container : this.defaults.handler  }); 
						
						}


					});

					    new Goals();






			},
			ajustes : function(){


					var  Settings = Backbone.View.extend({
						 defaults : {  
							handler : "setting" ,   
						},
						initialize : function(){ 

								   handler.tabs.active({ tab : this.defaults.handler , container : this.defaults.handler  }); 
						
						}


					});

					    new Settings();
		},

		recordatorios: function(){


					var  Reminders = Backbone.View.extend({
						 defaults : {  
							handler : "reminder" ,   
						},
						initialize : function(){ 

								   handler.tabs.active({ tab : this.defaults.handler , container : this.defaults.handler  }); 
						
						}


					});

					    new Reminders();
		},



		dieta : function(){


					var  Diet = Backbone.View.extend({
						 defaults : {  
							handler : "diet" ,   
						},
						initialize : function(){ 

								   handler.tabs.active({ tab : this.defaults.handler , container : this.defaults.handler  }); 
						
						}


					});

					    new Diet();
		},


	});


	/* Enabling backbone history so that backbone start monitoring hash changes in url. */ 
	new App.Router();
	Backbone.history.start(); 

	};// initialize App

		return { 


			initialize: initialize

		};



	})();//closue

});

