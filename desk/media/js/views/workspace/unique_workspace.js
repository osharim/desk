/*
	Summary: Renderea el template de un unico workspace
*/

define( function(require){ 

	 var $           = require('jquery'),  
	  _           = require('underscore'), 
	  Backbone    = require('backbone'),
	  appbox      = require('appbox');

	return (function(){ 


		 var  Workspace = Backbone.View.extend({    


			   tagName : "div",        
		       	   className :"workspace-str",  
		      	   template_workspace : require("text!../templates/workspace/unique_workspace.html"),
		       	   render : function(){   

				   var url_workspace = this.model.get("name").replace(" ","");
				   this.model.set("url_workspace" ,url_workspace );
				   var view_workspace = _.template(this.template_workspace  ,  this.model.toJSON()  );    


				   this.$el.html(view_workspace); 
				   return this; 
			   },
		      	   events  :{

					    "click" : "open_workspace",

				    },
		           open_workspace : function(e){


						    var $node = $(".section_[data-nav=apps]").show();
						    $node.find(".app_message").html("Aun no has seleccionado ninguna aplicacion");
						
					           window.App.Sections.slideRightMainWindow();
						   //eliminamos todos los menus que fueron seleccionado anteriornente 
						    $(".wbox").find(".active").removeClass("active")
						    $(".menu").find(".active").removeClass("active")
						    //activamos el estilo para el workspace que se le dio click
						    $( e.currentTarget ).find("li").addClass("active")

 					            window.App.Instances.App.Create = true;
				 		    var navigate_to_workspace_by_id = this.model.get("id")
					            var app =  new appbox({ navigate_to_workspace_by_id : navigate_to_workspace_by_id });


			}
		 });

		 return Workspace;

	})();

});


