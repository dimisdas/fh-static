var App = (function($, win, doc, App){

	"use strict";
	$(function(){
		if(App.isTouch) return;		

		var css = {
			'color': '#0a1622',
			'max-width': '250px',
			'white-space': 'pre-wrap',
			'font-size': '1em'
		};

		$('.films__film__inner').each(function(){
			App.assignCursor($(this), $(this).data('info'), css);
		});
	});	
	return App;
	
})(jQuery, window, document, window.App || {});