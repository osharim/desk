/*

	Summary: Maneja todo el directorio de workspaces , obtiene todos los workspaces
*/

define( function(require){ 

	 var $           = require('jquery'),  
	  _           = require('underscore'), 
	  Backbone    = require('backbone'),
	  unique_workspace = require('unique_workspace');

	  require('modal');

	return (function(){ 

		  WorkspaceBox = {
			  Models : {},
			  Views: {},
			  Collections : {},


		  }

	  
		  //model
		 WorkspaceBox.Models.Workspaces = Backbone.Model.extend({});

		 WorkspaceBox.Collections.Directory = Backbone.Collection.extend({ 

			 url : '/api/v1/workspace/',  

		         model: WorkspaceBox.Models.Workspaces ,// workspace is a model 
			 
			 parse: function(response) { 

				  return response.objects;   

		}

		 });// backbone


		   WorkspaceBox.Views.Workspaces = Backbone.View.extend({ 

				initialize  : function(){ 
					
				        WorkspaceBox.Collections.current_collection = new WorkspaceBox.Collections.Directory();
					WorkspaceBox.Collections.current_collection.on('add', this.append_new_workspace, this); 
					this.render();

			},render : function(){

				  var that = this;
				WorkspaceBox.Collections.current_collection.fetch({ 

					success : function(data){ 

								that.update_models_in_controllers(); 
					}

				});

			},

			append_new_workspace: function(){ 

						     var collection_length = WorkspaceBox.Collections.current_collection.length;
						     var last_model = WorkspaceBox.Collections.current_collection.at(collection_length-1)  

						     this.renderWorkspace(last_model)





			},
			update_models_in_controllers : function(){ 


			this.$el.html("");
			var that =this ;

			_.each (WorkspaceBox.Collections.current_collection.models , function(workspace_item){ 
					that.renderWorkspace(workspace_item);
			});
						       
						       
			},
			 renderWorkspace : function(workspace_item){ 


						  var workspaceView  = new unique_workspace({ 
							   model : workspace_item 

						  });
						var template_workspace = workspaceView.render().el;
						$(".workspace_box .wbox").append( template_workspace);

			}
							

		   });


		return  WorkspaceBox.Views.Workspaces;


		})();



});//define
	
