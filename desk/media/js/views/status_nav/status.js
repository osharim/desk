define( function(require){ 

 return (function(){

	var  $           = require('jquery'),
	     _           = require('circles');


 	console.log("status")

			Circles.create({
				id:         'circles-1',
				percentage: 73, // avance
				radius:     125,
				width:      4,
				number:     11.13, //display
				text:       '%K.G <br> <span class="text-small">  <i class="icon down">Perdidos</i></span>', 
				colors:  ['#F4BCBF', '#D43A43'],
				duration:   500
			})
	



 })(require);

 
});



