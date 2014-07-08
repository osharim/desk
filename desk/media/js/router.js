
define( function(require){


return (function(){


	var  $           = require('jquery'), 
       	     _           = require('underscore'),   
	     Backbone    = require('backbone'),  
       	     handler     = require('handlers'),
       	     modal 	 = require('modal'),
       	     bootstrap = require('bootstrap'),
	   create_or_load_app = require('create_or_load_app'),
       	     timeago     = require('timeago');



	window.App = {

		Model : {} ,
		View : {},
		Controller : {},
		Navigate : {},
		Router : {},
       		Sections : {
			
			slideRightMainWindow : function(){

				$(".section_").animate({left : 405 });
				 $(".appbox").show();
				 //$(".menu .appbox").show();
			},
			slideLeftMainWindow : function(){

				 $(".section_").animate({left : 225 });
			},

			showLoader : function(){

				$("#loader").animate({ top : 0 },"fast");
//
			},
			hideLoader: function(){

				$("#loader").animate({ top : -46 },"fast");
			}



		},
		Instances : {
			CurrentApp : {},
			Router : {},

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

						 !new workspace();

				   });

		},
		routes : {

			"" : "dashboard",
			"!/dashboard/" : "dashboard",
			"!/aplicaciones/favoritas/" : "apps_favorites",
			"!/aplicacion/compartida/" : "shared_application",
			"!/workspace/:workspace/:id/" : "workspace",
			"!/app/:id/" : "load_application",
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
			shared_application : function(){

					var  SharedApplication = Backbone.View.extend({

						 defaults : {  
							handler : "shared-application" ,   
						},
						initialize : function(){ 

								   handler.tabs.active({ tab : this.defaults.handler , container : this.defaults.handler  }); 


								//init shared_application 

								   require(["share_application"], function (share) {

										 !new share();

								   });



						}

					});
					!new SharedApplication()
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


			load_application : function(id){

			        var current_app_id = parseInt(id);
				//window.App.Instances.Workspace.By_id  = id ;
				var load_app = new create_or_load_app({ create : false , id_to_load_application : current_app_id , application_name : "" });

			},

	});

	if( config.user.rol ==1){

		App.Router.prototype.routes["!/contactos/"]= "contact";

	}


	/* Enabling backbone history so that backbone start monitoring hash changes in url. */ 
	App.Instances.Router = new App.Router();
	Backbone.history.start(); 

	};// initialize App

		return { 


			initialize: initialize

		};



	})();//closue

});

