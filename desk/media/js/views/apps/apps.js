/*

	Summary: Carga todas las apps ---> "AppBox"
*/

define( function(require){ 

	 var $           = require('jquery'),  
	  _           = require('underscore'), 
	  Backbone    = require('backbone'),
	  unique_app = require('unique_app'),
	  button_create_app  = require('button_create_app');


	return (function(){ 

		  AppBox = {
			  Models : {},
			  Views: {},
			  Collections : {},
		  }


		  console.log(window.App.Navigate.workspace)
		  console.log(App.Navigate.workspace)
		//var workspace_to_route = '/api/v1/apps/'+window.App.Navigate.workspace+'/';

		 AppBox.Models.AppBoxs = Backbone.Model.extend({});

		 AppBox.Collections.Box = Backbone.Collection.extend({ 

			 url : function() { 
				       
				       console.log(this)
				       return  "/api/v1/workspaceapps/?workspace="+this.models[0].id;
			      
			       },

		         model: AppBox.Models.AppBoxs ,// AppBoxs is a model 
			 
			 parse: function(response) { 

				  return response.objects;   

			}

		 });

		 AppBox.Views.Apps = Backbone.View.extend({  

			 initialize : function(){
				 
					      

					      if( !window.App.Instances.App.Create){

 							window.App.Instances.App.Create = true;
				        		!new button_create_app();

					      }

				 	     // se muestra la seccion de nueva aplicacion
					$(".section_[data-nav=new_app]").hide()
					$(".section_[data-nav=workspace]").hide()
					$(".section_[data-nav=appbox]").show()

			 		console.log(this.options.navigate_to_workspace_by_id )

					AppBox.Collections.current_collection = new AppBox.Collections.Box( { id : this.options.navigate_to_workspace_by_id });
					AppBox.Collections.current_collection.on('add', this.append_new_app , this); 
					this.render();

			 },render : function(){

				  var that = this;
				AppBox.Collections.current_collection.fetch({ 

					beforeSend : function(){


						},

					success : function(data){ 

								if(data.length != 0){

								        $(".workspace_apps .status_workspace").hide();
									//se vacia el contenedor
								        $(".workspace_apps .container_appbox ").html("");
									that.update_models_in_controllers(); 
								}else{
								        $(".workspace_apps .container_appbox ").html("");
								        $(".workspace_apps .status_workspace").show();
								        $(".workspace_apps .status_workspace .no_apps").show();
								        $(".workspace_apps .status_workspace .loading").hide();

								}
					}

				});


			},
			update_models_in_controllers : function(){ 


			var that =this ;

			_.each (AppBox.Collections.current_collection.models , function(app_item){ 
					that.renderApp(app_item);
			});
						       
						       
			},

			 renderApp : function(app_item){ 


						  var AppView  = new unique_app({ 
							   model : app_item 

						  });
						var template_app = AppView.render().el;
						$(".container_appbox").append( template_app);

			}
				

		 });


		 return AppBox.Views.Apps;

	})();//closure

});//end define


