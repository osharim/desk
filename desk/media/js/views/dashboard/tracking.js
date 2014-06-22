define( function(require){ 

 return (function(){

       	 
	 var c3 = require('c3');

	 var chart = c3.generate({
		 data: {
			       columns: [
		 	 ['KG ', 89, 87, 85, 80 ]
		 ]
		       },
	     grid: {
			   x: {
				      lines: [{value: 0, text: 'Inicio '}, {value: 1, text: 'Semana 1'} ,  {value: 2, text: 'Semana 2'}]
			      }
		   },

	     axis : {
			
			    	
			    y : {


					max : 100 , 
					min : 70

				}

		    }
	 });



	//		chart.transform('area-spline')


	setTimeout(function () {
		    chart.axis.range({max: {x: 7}, min: {y: 30}});
	}, 2000);


			setTimeout(function () {
				    chart.axis.range({max: {y: 90 }, min: {y: 50 }});
			}, 2330);


	 /*

			var chart = c3.generate({
				bindto: '#chart',
				data: {
					x : 'x',
					columns: [

					['x', 'Semana 1', 'Semana 2', 'Semana 3'   ],
					['kg', 90, 89, 85.3],
					//['Rendimiento', 90, 87, 65.3,67],

					],
					type: 'spline'
				},

				axis: {
					//rotated: true,

					x: {
						type: 'category',
					}, y: { max:93 ,
						min: -10,
						// Range includes padding, set 0 if no padding needed
						 //padding: {top:0, bottom:0}
					}

				}
			});
			chart.transform('area-spline')

	setTimeout(function () {
		    chart.axis.range({max: {x: 2}, min: {x: 0}});
	}, 2000);

			chart.transform('area-spline')
			setTimeout(function () {
				chart.axis.range({max: {y: 20}, min: { y: 50}});
			}, 2000);
			*/







 })(require);

 
});
