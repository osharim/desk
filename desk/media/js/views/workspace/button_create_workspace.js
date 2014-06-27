/*

	Summary: Crea la vista del Boton "crear workspace" y funcionalidades
*/

define( function(require){ 

	 var $           = require('jquery'),  
	  _           = require('underscore'), 
	  Backbone    = require('backbone');
	  require('modal');

	return (function(){ 

		 var model_new_worspace  = Backbone.Model.extend({    
		     url : '/api/v1/workspace/',    
		     defaults: {  
			      name : "",  
		     }
		 });

		 //carga el boton para crear un workspaec 
		 var button_create_workspace = Backbone.View.extend({  

			 template :  require("text!../templates/workspace/button_create_workspace.html"),
			 title :  "Añade un area de trabajo",
			 content :  require("text!../templates/workspace/form_create_workspace/form_create_workspace.html"),
			 footer :  require("text!../templates/workspace/form_create_workspace/footer_button_create_workspace.html"),

			 tagName : "div",
			 cassName :"workspace-el",  

			 initialize : function(){  

					    var template  =  this.template;
					    var data = {}
					    var compiledTemplate = _.template( template , data );
					   $(".btn_add_workspace").append( this.$el.append( compiledTemplate )  );

			 },
			  events : { 

				    "click .create_workspace" : "open_modal_to_create_workspace", 

			  },
			   open_modal_to_create_workspace : function(){   

				   var that = this;
				   $.modal({
					   title : that.title,
					    content : that.content , 
					    footer : that.footer, 
					    success : function(){


						   $("input[name=workspace]").keyup(function(){
							   $(".sync_workspace").html( $(this).val());
						   });

						   $(".create_workspace_form").click(function(){

							   //input signup nodes
							   var $paren_form = $(".content_create_workspace");
							    var $nodes_input_ = $paren_form.children();
							    var error = false;

							    _.each( $nodes_input_ , function(input){

								    var _ref_node_ = $(input);

								    if ( _ref_node_.find("input").val().length < 2 ){
									    _ref_node_.addClass("error");
									    error= true;

								    }else{

									    _ref_node_.removeClass("error");
								    }



							    });//End each


								    if(!error){

									    var workspace = $paren_form.find("input[name=workspace]").val().trim();

									    var new_model_workspace   =  new model_new_worspace(); 
									    new_model_workspace.set("name",  workspace );

									    new_model_workspace.save(null  , {  

										    success : function(model , data){ 

										        new_model_workspace.set({ workspace : data } );   
											WorkspaceBox.Collections.current_collection.add(new_model_workspace);  
											$(".close_box").click();
										    }

									      });//save model_user



								    }


						   });

					   }
				});  

			   }



		 });


		 return button_create_workspace;



	})();//closure

});//end define
