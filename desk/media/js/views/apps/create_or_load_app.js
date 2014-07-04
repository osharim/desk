/*

Crea una poderosa app  o carga una app ya existente 

Summary : Cuando se hace la instancia de este objeto se le pasa por parametro en el constructor el id de la aplicacion que desea cargar
	  id_to_load_application = Number.

	  Este objeto se encarga de toda la funcionlidad de las secciones ( Columnas )
	  inicia boton de guardar app)
*/

define( function(require){ 

	 var $           = require('jquery'),  
	  _           = require('underscore'), 
	  Backbone    = require('backbone'),
	  button_save_app = require('button_save_app');
	  //require('editable');
	  require('modal');


	return (function(){ 

		var App = {
			Instance  : {},
			Model : { },
			View : { },
		}

		//crear una aplicacion, solo el nombre,creador, y a que area pertenece
		App.Model.new_app = Backbone.Model.extend({    
		     url : '/api/v1/apps/',    
		     defaults: {  
			      name : "",  
			      owner : "/api/v1/user/",  
			      workspace : "/api/v1/workspace/",  
		     }
		 });


		 //INPUT:Nombre de la aplicacion
		 //nombre de la aplicacion input
		 var input_name_app = Backbone.View.extend({  

			 el : '.create_name_app_',    

			 events : {

			    'keyup input' : 'update_name'        

			},
		       update_name: function(e){

				 var current_application_name = $(e.currentTarget).val();
		 		 var id_to_update =  App.Instance.aplicacion.id;

		                 //clase en la que se inyectara el nombre de la aplicacion
			 	 $('.current_app').html( current_application_name  )
				$(".app-str li[data-id="+id_to_update+"] .name").html(current_application_name);

				var current_name_app = { name : current_application_name } ; 

				$.ajax({

					url : "/api/v1/apps/"+id_to_update+"/",
					type : "PUT",
					data : JSON.stringify(current_name_app),
					success : function(data){
					},

					dataType : "json",
					contentType: "application/json",

				});
			 	 //application.save({ name : "hoo" });

			}

		 });

		/*******************************************************************************************************/
		/*******************************************************************************************************/
		/*******************************************************************************************************/
		/*******************************************************************************************************/





		var id_application = 0;
		// carga los datos de una app , campos y secciones 
		App.Model.data_application = Backbone.Model.extend({    
					     url : function(){
						     
					 if( this.attributes.url ){

						return '/api/v1/appsection/?'+this.attributes.url;

					}

						    var current_id_application = this.attributes.id_application;
						    return '/api/v1/appsection/?app='+current_id_application;
					     },
					 });


		/*******************************************************************************************************/
		/*******************************************************************************************************/
		/*******************************************************************************************************/
		/*******************************************************************************************************/

		 // toma todos los datos de una app con secciones y campos y renderiza el template y los inyecta en el DOM
		 App.View.load_data_from_app_with_sections_and_fields  = Backbone.View.extend({   

		//estructura general ( secciones y estructura de table
		 template_field_section  : require("text!../templates/apps/form_create_app/sections_and_fields.html"),

		//datos que van dentro de table
		 template_field_to_fill   : require("text!../templates/apps/form_create_app/fields.html"),

		 initialize : function(){

			 this.render();

		 },events : {
		
			 //al dar click en boton + se agrega nueva columna
		 	"click .add_column" : "add_section", 	 
		 	//al dar click al final de las filas se agrega nueva fila
		 	"click .last_allow" : "add_fields_at_end", 	 
			//checar que tecla se oprimio para naavegar
		 	//"keydown textarea" : "check_key_pressed", 	 
		 },

		// forzar un trigger change a todos los tds
		force_trigger_change_on_td_with_contenteditable : function(){


				var td_with_no_event_attached = $(".no-event-attach"),
				    self = this;


				var all_td_in_application_that_allow_edit_field = $( td_with_no_event_attached ).on('focus', function() {
					    var $this = $(this);
						$this.data('before', $this.html());
						    return $this;
				}).on('blur keyup paste', function() {
					    var $this = $(this);
						if ($this.data('before') !== $this.html()) {
								$this.data('before', $this.html());
									$this.trigger('change');
									    }
						    return $this;
				});



				 $(td_with_no_event_attached).change(function(e) {


					 if( $(e.currentTarget).attr("data-type") == "section"){

					 	self.edit_section_name(e);

					 }else{
					 	self.edit_value_in_field(e);
					 }

					}).keypress(function(e) {

					 	self.check_key_pressed(e);

				});

				 all_td_in_application_that_allow_edit_field.removeClass("no-event-attach");



		},

		//al dar click en el nombre de seccion se puede editar el nombre
		edit_section_name : function(e){

			var $el = $(e.currentTarget);
			var content = $el.find(".name").html()

			if( content.length > 0 ) {

				var new_data = { name : content };
				var _current_id = $el.attr("data-id") 

					$.ajax({
						url : "/api/v1/section/"+_current_id+"/",
						type : "PUT",
						data : JSON.stringify( new_data ),
						success : function(data){ },
						dataType : "json",
						contentType: "application/json",

					});
			}




		},

		//se agregan fields al final de la aplicacion
		add_fields_at_end : function(e){

			var self = this;
			//checamos si hay paginacion, entonces no se crea un elemento, se hace paginacion
			var paginator_button = $(".paginator");
			pagination_is_availble = ( paginator_button.length >= 1  ) ? true: false; 
			if(!pagination_is_availble){

				 //se quita el evento para agregar filas 
				$(e.currentTarget).unbind("click");
				$(".last_allow").removeClass("last_allow").addClass("allow");

				//reload edit fields
				//$(".allow").editable("destroy");
				//this.edit_value_in_field();



				var last_fields = "<tr>";
				var $sections = $(".edit_section");
				var sections_length =  $sections.length

				//ids de las secciones que se les agregara un campo extra
				var id_sections = [];
				_.each( $sections , function(th){
					  
					  id_sections.push( parseInt( $(th).attr("data-id")) );
				});




				var new_data = { max_fields_ : sections_length ,  section_id_ : id_sections };

				$.ajax({

					url : "/api/v1/sectionfield/",
					type : "POST",
					data : JSON.stringify( new_data ),
					success : function(data){
						

						var $last_id_number_in_section_id = $(".container_data tr").last().children().first().html();
						var last_id_number = parseInt($last_id_number_in_section_id);
						last_id_number +=1;

						var _td_in_section_id = "<td>"+last_id_number+"</td>";
						var _td_in_add_section  = "<td></td>";

						last_fields += _td_in_section_id;


						last_field = "";
						//for(var i = 0; i <  data.fields.length  ; i++){ 
						_.each( data.fields , function( new_tr ){
							
							last_fields += "<td contenteditable='true' class='last_allow no-event-attach' data-id='"+new_tr.id+"'></td>"


						//}
						});

						last_fields += _td_in_add_section;
						last_fields += "</tr>";

						$(".container_data").append(last_fields);



						self.force_trigger_change_on_td_with_contenteditable()


					}, dataType : "json",
					contentType: "application/json",

				});


				$(e.currentTarget).addClass("allow").click() 
			}else{
					$(".paginator").click();	

			}

		},
		check_key_pressed : function(event){

			var current_el = $(event.currentTarget).parent()



			switch(event.keyCode ){ 

			case 9: //for tab key
				

				    this.from_current_td_select_next_right_td( current_el);
				    return false; // <== here


			case 13://enter
				    this.from_current_td_select_next_down_td( current_el);
				    return false;


			case 37://left
				    this.from_current_td_select_next_left_td( current_el);
				    return false;


			case 39://right
				    this.from_current_td_select_next_right_td( current_el);
				    return false;


			case 38://up

				    this.from_current_td_select_next_up_td( current_el);
				    return false;


			case 40://down

				    this.from_current_td_select_next_down_td( current_el);
				    return false;




			  }




			},
		from_current_td_select_next_left_td : function(el){

					$(".focused").removeClass("focused");
					var $el = $(el);
					next_td  = $el.prev()[0]

					$(next_td).click().addClass("focused")

				    return false; // <== here

			},


		from_current_td_select_next_right_td : function(el){

					$(".focused").removeClass("focused");
					var $el = $(el);
					next_td  = $el.next()[0]

					$(next_td).click().addClass("focused")

				    return false; // <== here

			},

		from_current_td_select_next_up_td : function(el){

			$(".focused").removeClass("focused");

			var $el = $(el);
			var current_index = $el.index();
			next_td  = $el.parent().prev().children("td:eq("+current_index+")")[0]; 

			$(next_td).click().addClass("focused")

		},



		// selecciona el campo de abajo respecto al parametro ingresado
		from_current_td_select_next_down_td : function(el){

			$(".focused").removeClass("focused");

			var $el = $(el);
			var current_index = $el.index();
			next_td  = $el.parent().next().children("td:eq("+current_index+")")[0]; 

			$(next_td).click().addClass("focused")

		},

		 // iniciamos que puedan editar los campos al dar click
		  edit_value_in_field : function(current_el){

			console.log( current_el)

			var $el = $(current_el.currentTarget);
			var _content = $el.html();


			var self = this;

			if( _content.length >= 0 ) {

				var new_data = { data : _content };

				var _current_id = $el.attr("data-id") 

					$.ajax({

						url : "/api/v1/field/"+_current_id+"/",
						type : "PUT",
						data : JSON.stringify( new_data ),
						success : function(_data){


							// al dar enter se va a al campo de abajo
							//self.from_current_td_select_next_down_td(data.$el)


						},

						dataType : "json",
						contentType: "application/json",

					});


			}


		  },
		  add_section : function(){

					var self = this;



					var $node_container_data =  $(".container_data"),
					id_current_app = this.options.application_data.meta.app.id,
					_current_section_name = "Nueva seccion",
					_node_max_field_length_container_data = $node_container_data.children().length; 


					var data_new_section = { 
						app : id_current_app  , 
						section_name_: _current_section_name, 
						max_fields_  : _node_max_field_length_container_data
				       	} ; 
					//crea una seccion y crea N  campos , N = _node_max_field_length_container_data;
					$.ajax({


						url : "/api/v1/addsection/",
						type : "POST",
						data : JSON.stringify(data_new_section),
						success : function(data){


						       var _current_section_name = data.section_name_ 

						       //se ingresa la nueva columna antes del boton +
						        $last_th = $( "<th class='edit_section no-event-attach' contenteditable='true'  data-id='"+data.id_section+"'> <span class='name'>"+_current_section_name+"</span></th>");
							var last_th = $(".app thead tr th:last-child").before($last_th)

							//reload edition name
						 	//$(".edit_section .name").editable("destroy");
							//self.edit_section_name();

							//contenedor de los datos --> fields
							$childs_node = $node_container_data.children()
						
							_.each ( data.fields , function(data, keys ){

								//pone los td de la seccion creada antes del boton +
								$(  $childs_node[ keys] ).children(":last-child").before("<td contenteditable='true' class='allow no-event-attach' data-id='"+data.id+"'></td>")

							});

							$($childs_node[ _node_max_field_length_container_data  ]).children(":last-child").before("<td contenteditable='true' class='last_allow no-event-attach'></td>")

							//self.edit_value_in_field();

							self.force_trigger_change_on_td_with_contenteditable()


						},

						dataType : "json",
						contentType: "application/json",
					})





			 		

		}
		 ,render : function(){


				     var application_data = this.options.application_data;
			 	    //nombre de la aplicacion actual
				     $(".current_app").html(application_data.meta.app.name);

				     var start_id_counter = 1;
				     //rendereamos los datos de la app just fields
				    var template_field_fill   = _.template(this.template_field_to_fill  , 
						    { data  : application_data , counter_id_start_with_integer : start_id_counter } );    

				     //render completo de la app
				     var template_field_and_sections_rendered  = _.template(this.template_field_section , { data  : application_data , data_tr_template : template_field_fill  } );    

				     $(".section_").hide();
				     $(".section_[data-nav=app_desk]").show();
				     $(".container_app").html(this.$el.html(template_field_and_sections_rendered));
				     //activamos que pueda editar valores en los campos
				     //this.edit_value_in_field();
				     //activamos que pueda editar cabecera
				     //this.edit_section_name();

				     this.force_trigger_change_on_td_with_contenteditable();

				     this.paginator(application_data);



				      var current_app_id = application_data.meta.app.id;
				      $(".app-str li").removeClass("active");
				      $(".app-str li[data-id="+current_app_id+"]").addClass("active")




		 },
		paginator : function(data){

				    var self = this;

				$(".paginator").remove();
				    if ( data.meta.next ){

					    var button_paginator  = ' <div class="btn gray paginator" data-next="'+data.meta.next+'"> Click para ver mas </span> ';
					    $(".container_app").append( button_paginator )


					    $(".paginator").click(function(){

						    var $_el = $(this),
					    		next = $_el.attr("data-next");


						    	var id_application = this.id_application;
									
							var data_in_section = new App.Model.data_application( { id_application : 0 , url : next  } );

							data_in_section.fetch({
							
									success : function(model,data){

										    var continue_with_previous_counter_id = $(".container_data tr:last-child td:first-child").html();
										  //numero ultimo de la columna de id para seguir la secuencia . si obtenemos 20, le sumamos 1 para seguir con 21
										     continue_with_previous_counter_id = parseInt(continue_with_previous_counter_id)+1;

										      //rendereamos los datos de la app just fields
										 	var template_field_fill   = _.template(self.template_field_to_fill , { 
											 		data  : data , counter_id_start_with_integer : continue_with_previous_counter_id  
										 	} );    




											$(".last_allow").removeClass("last_allow").addClass("allow");

											//reload edit fields
											//$(".allow").editable("destroy");


										        $(".container_data").append(template_field_fill);

										     	//reload edit fields
										     	//self.edit_value_in_field();
											self.force_trigger_change_on_td_with_contenteditable()



										     self.paginator(data)
										    
							}//success
							
							});//fetch
					    })
				    }else{

					    	$(".paginator").remove();

				    }
		}
		 
		});



		/*******************************************************************************************************/
		/*******************************************************************************************************/
		/*******************************************************************************************************/
		/*******************************************************************************************************/



	         //objeto principal, determina si se require cargar o crear una app
		 var create_or_load_app = Backbone.View.extend({  

			 options : {
				 create : false,
				 id_to_load_application : 0,
				 application_name : "",

			 },
			 initialize : function(){




				 	     //boton salvar la app --- Ya no hay bton de salvar, los datos se guardan automagicamente
				 	     //!new button_save_app();
 					     !new input_name_app();



					     if( this.options.create ){

						     //crea (POST) los datos generales de una aplicacion
						     this.create_new_application();
					      }else{

						     this.load_selected_appliaction(this.options);

					      }


				 	     // se muestra la seccion de nueva aplicacion
					     $(".section_[data-nav=creating_app]").show()
					     $(".section_[data-nav=workspace]").hide()
					     this._maximize_and_minimize_button();

		        },
			 _maximize_and_minimize_button : function(){

								 var mutex_fullscreen = false;

								 var maximize = "<i class='glyphicon glyphicon-fullscreen'></i> Maximizar",
								     minimize = "<i class='glyphicon glyphicon-resize-small'></i> Minimizar";
								  

								 $( ".full_screen" ).toggle(function() {
									   
									 if ( !mutex_fullscreen ){

										 mutex_fullscreen = true;
									     var _current_el = $(this);
									         _current_el.html(minimize);
										 $(".section_[data-nav=app_desk]").animate({ left : 0 },
											 
										function(){
											mutex_fullscreen = false;
										});
									 }
										     
								 }, function() {
									   
									 if ( !mutex_fullscreen ){
									   
									      mutex_fullscreen = true;
									       var _current_el = $(this);
									          _current_el.html(maximize);

										   $(".section_[data-nav=app_desk]").animate({ left : 365 } ,
											function(){
												mutex_fullscreen = false;
										});

									 }     
										     
								 });

			},
			// carga los datos de una aplicacion 
			load_selected_appliaction : function(options){


						    var current_name_app = options.application_name;
						    var current_id_app = options.id_to_load_application;

						    var $node = $(".section_[data-nav=apps]").show();
						    $node.find(".app_message").html("Cargando <strong>"+current_name_app+"</strong>");
						    
						    this.load_data_in_app_and_polled_sections_by_id_app(current_id_app)




			},
			// si se requiere se crea una nueva aplicacion, solo el nombre el creador y el workspace, la estructura es otro modelo
			create_new_application : function(){ 
		 				
					     var aplicacion = new App.Model.new_app();
					     App.Instance.aplicacion = aplicacion;

					     var current_id = config.user.id;
					     var current_workspace_selected = $(".workspace-str .active").attr("data-id");
					     aplicacion.set("owner" , "/api/v1/user/"+current_id+"/");
					     aplicacion.set("workspace" , "/api/v1/workspace/"+current_workspace_selected+"/");
					     aplicacion.set("name" , "Nueva Aplicacion");

					     var self = this;

					     aplicacion.save(null,{

						     beforeSend : function(){

						    var $node = $(".section_[data-nav=apps]").show();
						    $node.find(".app_message").html("Creando Aplicacion..");

						     },

						     success : function(model , data){

								//contenedor de la aplicacion desk
					     			$(".section_[data-nav=app_desk]").show()

								//ocultamos el mensaje de creando app
					     			$(".section_[data-nav=creating_app]").hide()
								//ocultamos mensaje de no has creado ninguna aplicacion
					     			$(".section_[data-nav=apps]").hide()

								aplicacion.idAttribute  = aplicacion.id;   


								AppBox.Collections.current_collection.add(aplicacion);  

							      //carga los datos (field and sections)  de una app
							      self.load_data_in_app_and_polled_sections_by_id_app( aplicacion.id );
							       
						   }
						     
					     });

			},

			/*
					Summary : Cargamos los datos que tiene una app ,  fields y sections ( Campos y datos) de una app con id en especifico
					param @id_application(int)
			*/
			load_data_in_app_and_polled_sections_by_id_app : function(id_application){

			
					var data_in_section = new App.Model.data_application( { id_application : id_application });

					data_in_section.fetch({
					
							success : function(model,data){

								     //pone el template de columnas dinamicas
								     var data_in_application = new App.View.load_data_from_app_with_sections_and_fields({ application_data : data });
					}//success
					
					});//fetch




			}

		 });



		 return create_or_load_app;



	})();//closure

});//end define
