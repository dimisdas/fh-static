var App = (function($, win, doc, App){

	"use strict";

	$(function(){		
		// Intro scroll animation
		$('.clouds').Sequence({
			frames: 80,
			path: "/assets/img/cloud_sequence",
			ext: "webp",
			trigger: function(){
				return -1*$(window).height()
			},
			height: function(){
				if($(win).width() < 768){
					return $(window).height()/2;					
				}
				return $(window).height();
			}
		});		
	});	
	
	return App;
	
})(jQuery, window, document, window.App || {});