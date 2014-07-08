/*

	Summary: Maneja todo el directorio de aplicaciones compartidas, obtiene todos los aplicaciones ocmpartidas 
*/

define( function(require){ 

	 var $           = require('jquery'),  
	  _           = require('underscore'), 
	  Backbone    = require('backbone'),
	  unique_shared_app = require('unique_shared_app');

	return (function(){ 

		  SharedBox = {
			  Models : {},
			  Views: {},
			  Collections : {},
		  }

		 SharedBox.Models.SharedApps = Backbone.Model.extend({});

		 SharedBox.Collections.Directory = Backbone.Collection.extend({ 

			 url : '/api/v1/share/',

		         model: SharedBox.Models.SharedApps ,
			 
			 parse: function(response) { 

				  return response.objects;   

		}

		 });// backbone


		   SharedBox.Views.SharedApps = Backbone.View.extend({ 

				initialize  : function(){ 
					
				        SharedBox.Collections.current_collection = new SharedBox.Collections.Directory();
					$(".shared_app_box .big_alert").hide();
					//SharedBox.Collections.current_collection.on('add', this.append_new_shared_app, this); 
					this.render();

			},render : function(){


				  var that = this;
				SharedBox.Collections.current_collection.fetch({ 

					success : function(data){ 

								that.update_models_in_controllers(); 

					}

				});

			},

			append_new_shared_app: function(){ 

						       /*
						     var collection_length = SharedBox.Collections.current_collection.length;
						     var last_model = SharedBox.Collections.current_collection.at(collection_length-1)  

						     this.renderSharedApplication(last_model)

						    $(".shared_app-str li").last().click();
						     */

			},
			update_models_in_controllers : function(){ 


			this.$el.html("");
			var that =this ;

			_.each (SharedBox.Collections.current_collection.models , function(shared_app_item){ 
					that.renderSharedApplication(shared_app_item);
			});
						       
						       
			},
			 renderSharedApplication : function(shared_app_item){ 


						  var shared_appView  = new unique_shared_app({ 
							   model : shared_app_item 

						  });

						var template_shared_app = shared_appView.render().el;
						$(".shared_app_box .wbox").append( template_shared_app);

			}
							

		   });


		return  SharedBox.Views.SharedApps;


		})();



});//define
	
