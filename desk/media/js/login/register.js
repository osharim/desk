$(document).ready(function(){


	/*
	 * Summary : Click en boton de registrarse ahora, seguido unas transiciones que ponen los campos de registro
	 */

	$(".register_now").click(function(){


			$(".login_fields").fadeOut(function(){
				
				$(".login_registered").fadeIn();
				$("input[name=username]").focus()
			});


			//se pone fijo el contenedor del boton "regitrar ahora"
			$(".footer").css( { "opacity" : 1 } );

			$(this).html("Siguiente")
				.addClass("next")
				.removeClass("register_now");
			$(".header").html("Registro");


			/*
			 * Summary : Click en boton de registrarse ahora, seguido unas transiciones que ponen los campos de registro
			 */



			$(".next").click(function(){

			$(this).html("¡Finalizar Registro!")
				.addClass("finish")
				.removeClass("next")
				$(".step_one").hide()
			//$(".step_one").slideUp()	
			$(".step_two").show()	
			$("input[name=register-peso]").focus()
			//$(".step_two").slideDown()	
				
		//	$(".step_one").slideDown( function(){  })


			});





	});






});
