define( function(require){

return (function(){

	var  $           = require('jquery');


       return {

	       tabs : {

			      active : function(options){

				       console.log(options)

					this._hide_active_and_show_selected(options);
 					$(".menu").find("li[data-path='"+options.tab+"']").addClass("active")
					$(".section_[data-nav='"+options.container+"']").show();


			      },

			      _hide_active_and_show_selected : function(options){

					$(".menu").find(".active").removeClass("active");
					$(".section_").hide();

				}
		      }

       };


	})(require);

});
