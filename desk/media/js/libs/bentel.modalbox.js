/**
 *  Bentel Mexico
 *  Modalbox  
 *  Copyright 2013 @Bentel Mexico.
 *  @Omr.
 *
 */


/* Global JQuery : false */


/* Widget "modal" object constructor */

(function ( $ ) {

	$.Modal = function(options){

		this._create(options);
		this.__init__();
		root = this;
	};

	
/* Styles of container element */

	$.Modal.settings = {
		/* Static Class Refs Modal */

		defaults : '.modal',
		titleCss : '.box_title',
		contentCss : '.box_body',
		closeCss : '.close_box , .close_button', 
		footerCss : '.box_footer',
		/* content dinamic */
		title   : '',
		content : '',
		footer : '',		
		/* class metohd css */

		before : function(){ return false;},
		onClose : function(){ return false; },
		success : function(){ return false; },

		};


/* SETUP widget */

	$.Modal.prototype = {
 
		_create : function(options){

			this.options = $.extend( {} , $.Modal.settings , options );
		},

		__init__ : function(){

			 this.options.before() 			/* fire up callback */
			 this._set_content();			/* setup contend dinamic modal */
			 this._open();					/* open modal */
			 this._attach();				/* attach events */

		},
		_open : function(){

			var self = this;
			
	 		 $(this.options.defaults).fadeIn('fast', function() {
						
						
					 self.options.success() 			/* fire has been loaded */
			});

			

		},

		_close : function(e ){

			

			$(root.options.defaults).fadeOut('fast', function() {
						
						
					root._delete_content();
					
						
					});

		},
		_attach : function(){

			/* if not exist a  modal instance so make attach events */  
			if ( !$.data(window,'modal') ){
				
				
				
				$(this.options.closeCss).live('click',this._close );


			} 

 
		},
		_set_content : function(){
			
				$(this.options.titleCss).html(this.options.title);
				$(this.options.contentCss).html(this.options.content);
				
				$(this.options.footerCss).html(this.options.footer);



		},

		_delete_content : function(){


				$(this.options.titleCss).html("");
				$(this.options.contentCss).html("");
				 
				$(this.options.footerCss).html("");


		}
	}
		

 

/* Bridge Widget */

		$.modal = function(options){

 

			var instance =  $.data(window,'modal');

			/* if modal instance existe , we invoke it */

			if(  instance ){
						
						instance._create(options);
						instance.__init__();

			}else{

 			/* if not exist a  modal instance we create  new one */ 
						
				$.data(window, 'modal', new $.Modal(options) );
			}

			 

		 
			}
}

)($);


