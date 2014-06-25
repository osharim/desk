/*

	Summary: Maneja todo el directorio de contactos  
*/

define( function(require){ 

	 var $           = require('jquery'),  
	  _           = require('underscore'), 
	  Backbone    = require('backbone'),
	  unique_contact = require('unique_contact');

	  require('modal');

	return (function(){ 

		  Directory_contacts = {
			  Models : {},
			  Views: {},
			  Collections : {},


		  }

		  var url_to_get_users = "/api/v1/users/"
	  
		  //model
		 Directory_contacts.Models.Contacts = Backbone.Model.extend({});

		 Directory_contacts.Collections.Directory = Backbone.Collection.extend({ 

			 url : url_to_get_users,  

		         model: Directory_contacts.Models.Contacts ,// Cotacts is a model 
			 
			 parse: function(response) { 

				  return response.objects;   

		}

		 });// backbone


		   Directory_contacts.Views.Contacts_directory = Backbone.View.extend({ 

				initialize  : function(){ 
					
				        Directory_contacts.Collections.current_collection = new Directory_contacts.Collections.Directory();
					Directory_contacts.Collections.current_collection.on('add', this.append_new_contact, this); 
					this.render();

			},render : function(){

				  var that = this;
				Directory_contacts.Collections.current_collection.fetch({ 

					success : function(data){ 

								that.update_models_in_controllers(); 
					}

				});

			},

			append_new_contact: function(){ 

						     var collection_length = Directory_contacts.Collections.current_collection.length;
						     var last_model = Directory_contacts.Collections.current_collection.at(collection_length-1)  

						     this.renderContact(last_model)





			},
			update_models_in_controllers : function(){ 


			this.$el.html("");
			var that =this ;

			_.each (Directory_contacts.Collections.current_collection.models , function(contact_item){ 
					that.renderContact(contact_item);
			});
						       
						       
			},
			 renderContact : function(contact_item){ 


						  var contactView  = new unique_contact({ 
							   model : contact_item 

						  });
						var template_contact = contactView.render().el;
						$(".section_[data-nav=contact] .directory_contacts").append( template_contact);

			}
							

		   });


		return  Directory_contacts.Views.Contacts_directory;


		})();



});//define
	
