requirejs.config({  
	baseUrl: '/bower_components/',
	paths:{
		'jquery': 'bootstrap/dist/js/jquery.min',
		'bootstrap': 'bootstrap/dist/js/bootstrap',
		'react': 'vbootstrap/dist/js/react/react-with-addons.min'
	},
	shim:{
		'bootstrap': ['jquery'],
		'jquery' :{
			'exports' : '$'
		}
	},
	urlArgs: "bust=" + new Date().getFullYear() + (('0'+(new Date().getMonth()+1)).slice(-2)) + new Date().getDate()
});
