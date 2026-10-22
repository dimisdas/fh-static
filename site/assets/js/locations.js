window.App = (function($, win, doc, app){

	"use strict";
	
	$(function(){
		if(!App.isTouch){			
			$('.locations__name .readmore').toggleText({
				'state_0': ' ',
				'state_1': 'View ↗'
			});
			$('.locations__name').on('mouseenter mouseleave',function(){
				$(this).find('.readmore').trigger('update.toggleText');
			});
		}
		
	});	
	
	
	return app;
	
})(jQuery, window, document, window.App || {});