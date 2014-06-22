// // node r.js -o cssIn="../css/style.css" out="../css/style.min.css" optimizeCss=default
({
    paths: {
        jquery     : "libs/jquery",
        modernizr : "libs/modernizr",
         spin : "libs/spin.min",
	"home_core" : "home/core",
	"ajax_st" : "libs/ajax_st",
    },

    shim : {
       			

    },

    baseUrl : ".",
    name: "main",
    out: "dist/main.js",
	waitSeconds: 60,
    removeCombined: true,

})
