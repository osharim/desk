
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
		Navigate : {},
		Router : {},
       		Sections : {
			
			slideRightMainWindow : function(){

				$(".section_").animate({left : 365 });
				 $(".appbox").show();
				 //$(".menu .appbox").show();
			},
			slideLeftMainWindow : function(){

				 $(".section_").animate({left : 190  });
			}


		},
		Instances : {

			Contact : false,
			Workspace : {
				
				By_id : "" ,
				
			},
			App : {
				Create : false
				
			},


		}
	};


	var initialize = function(){ 
		
		window.App.Router = Backbone.Router.extend({

			initialize : function(){


				//init workspaces

				   require(["workspace"], function (workspace) {

					   //if( window.App.Instances.Workspace.By_id){

						 !new workspace();

					   //}

				   });




		},
		routes : {

			"" : "dashboard",
			"!/dashboard/" : "dashboard",
			"!/aplicaciones/favoritas/" : "apps_favorites",
			"!/workspace/:workspace/:id/" : "workspace",
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
					    window.App.Sections.slideLeftMainWindow();


			},
			apps_favorites : function(){

					var  Apps= Backbone.View.extend({
						 defaults : {  
							handler : "apps" ,   
						},
						initialize : function(){ 

								   handler.tabs.active({ tab : this.defaults.handler , container : this.defaults.handler  }); 
						}

					});
					    new Apps();
					    window.App.Sections.slideLeftMainWindow();
			},

			contact : function(){
				if(config.user.rol == 1){

					var  ContactSection = Backbone.View.extend({
						 defaults : {  
							handler : "contact" ,   
						},
						initialize : function(){ 

								   handler.tabs.active({ tab : this.defaults.handler , container : this.defaults.handler  }); 

								   require(["contact"], function (contact) {

									   if( !window.App.Instances.Contact){

										 window.App.Instances.Contact = true;
									   	 !new contact();

									   }

								   });

						}

					});
					    new ContactSection();
				    window.App.Sections.slideLeftMainWindow();
				}

			},

			setting : function(){

					var  Setting = Backbone.View.extend({
						 defaults : {  
							handler : "setting" ,   
						},
						initialize : function(){ 

								   handler.tabs.active({ tab : this.defaults.handler , container : this.defaults.handler  }); 
								   window.App.Sections.slideLeftMainWindow();
						}

					});
					    new Setting();
			},

			workspace : function(workspace,id){


				window.App.Instances.Workspace.By_id  = id ;

			},


	});

	if( config.user.rol ==1){

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

