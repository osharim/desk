//file will be responsible for configuring Require.js and loading initially important dependencies
require.config({

	waitSeconds: 60,
        baseUrl : config.baseUrl,

        shim : {
		   'ajax_st'  : { deps : ['jquery'] } ,
		   'timeago'  : { deps : ['jquery'] } ,
		   'bootstrap'  : { deps : ['jquery'] } ,
		   //'switchery'  : { deps : ['underscore','transitionize','fastclick'] } ,
		   //'c3'  : { deps : ['d3'] } ,
		   'underscore'  : {  exports : '_' }  ,
		   'bentel.modalbox'  : { deps : ['jquery'] , exports : '$'  } ,
 		   'backbone' : { deps : ['underscore' , 'jquery'] , exports : 'Backbone' }   
        },


        paths :{
		       //"spin" : "spin.min",// graficas con d2
		       "circles" : "circles.min",//circulos en svg
		       "modernizr" : "modernizr",//cross browsers
		       'modal' : 'bentel.modalbox', // modalboax
		       "app" : "../app", // inicializador de la app
		       'router' : '../router', //ruteo de toda la app
		       'handlers' : '../handlers/tabs', // sincroniza el contenedor con las tabs




		       //Dashboard


		       /*					CONTACT					        */
		       /*					VIEWS  						*/
		       /*					VIEWS  						*/
		       "button_create_contact" : "../views/contact/button_create_contact", // boton crear contacto 
		       "contact" : "../views/contact/contact", // vista general de contacto 
		       "unique_contact" : "../views/contact/unique_contact", // render template de un unico contacto 
		       "directory_contacts" : "../views/contact/directory_contacts", // contenedor general de los contactos 

                }
        });


require([
//Carga de nuestro modulo y lo pasamos a nuestra funcion
'app' ,

], function(App){
	App.initialize();
});
	
