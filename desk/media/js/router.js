
define( function(require){


return (function(){


	var  $           = require('jquery'), 
       	     _           = require('underscore'),   
	     Backbone    = require('backbone'),  
       	     handler     = require('handlers'),
       	     modal 	 = require('modal'),
       	     bootstrap = require('bootstrap'),
       	     timeago     = require('timeago');



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
			"!/dashboard/" : "dashboard",
			"!/aplicaciones/" : "apps",
			"!/workspace/" : "workspace",
			//"!/contactos/" : "contact",
			"!/ajustes/" : "setting",

			 },
			dashboard : function(){

					var  Dashboard = Backbone.View.extend({
						 defaults : {  
							handler : "dashboard" ,   
						},
						initialize : function(){ 

								   handler.tabs.active({ tab : this.defaults.handler , container : this.defaults.handler  }); 
						}

					});

					    new Dashboard();


			},
			apps: function(){

					var  Apps= Backbone.View.extend({
						 defaults : {  
							handler : "apps" ,   
						},
						initialize : function(){ 

								   handler.tabs.active({ tab : this.defaults.handler , container : this.defaults.handler  }); 
						}

					});
					    new Apps();
			},

			contact : function(){
				if(config.user.rol != 0){

					var  ContactSection = Backbone.View.extend({
						 defaults : {  
							handler : "contact" ,   
						},
						initialize : function(){ 

								   handler.tabs.active({ tab : this.defaults.handler , container : this.defaults.handler  }); 
								   //var main_contact = require("contact");
								   //!new main_contact();
						}

					});
					    new ContactSection();
				}

			},

			setting : function(){

					var  Setting = Backbone.View.extend({
						 defaults : {  
							handler : "setting" ,   
						},
						initialize : function(){ 

								   handler.tabs.active({ tab : this.defaults.handler , container : this.defaults.handler  }); 
						}

					});
					    new Setting();
			},

			workspace : function(){

					var  Workspace = Backbone.View.extend({
						 defaults : {  
							handler : "workspace" ,   
						},
						initialize : function(){ 

								   handler.tabs.active({ tab : this.defaults.handler , container : this.defaults.handler  }); 
						}

					});
					    new Workspace();
			},


	});

	if( config.user.rol !=0){

		App.Router.prototype.routes["!/contactos/"]= "contact";

	}


	/* Enabling backbone history so that backbone start monitoring hash changes in url. */ 
	new App.Router();
	Backbone.history.start(); 

	};// initialize App

		return { 


			initialize: initialize

		};



	})();//closue

});

