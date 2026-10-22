window.App = (function($, win, doc, app){

	"use strict";
	app.togglePortfolioDesc = function(){
		var el = arguments[0];
		el.click(function(){
			$(this).children().toggleClass('active');
			$(this).parent().next().slideToggle();
		});
	};
	
	window.onload = function(){
		var settings = {
		    dots: !1,
		    autoplay: !1,
		    loop:!0,
		    autoWidth: !0,
		    items: 1,
		    margin: 8,
		    lazyLoad: !1,
		};
		
		var owl = $('.production-services-slider').owlCarousel(settings);

			var settings2 = {
			    dots: !1,
			    autoplay: !1,
			    loop:!0,
			    lazyLoad: !0,
			    lazyLoadEager: 1,
			    autoWidth: !1,
	    		margin: 12,
			    autoHeight: !1,
			    items: 1,
			};
		
		var portfolioSlider = $('.portfolio__entry__images--carousel').owlCarousel(settings2);

		if(!App.isTouch){
			
			$('.owl-carousel')
				.append('<div class="c-nav__wrapper">\
							<div class="c-nav__button c-nav__button__prev"></div>\
							<div class="c-nav__button c-nav__button__next"></div>\
						</div>');
				
			$.each([owl,portfolioSlider], function(index, carousel){
				$(carousel).each(function(){
					App.assignCursor($(this).find('.c-nav__button__prev'), '↖Previous image').click(function(e){
						$(this).parents().filter(carousel).trigger('prev.owl.carousel');
					});
					App.assignCursor($(this).find('.c-nav__button__next'), 'Next image↗').click(function(e){
						$(this).parents().filter(carousel).trigger('next.owl.carousel');
					});
				})
			});			
		}

		$('.portfolio__entry__toggler').toggleText({
			'state_0': 'More +',
			'state_1': 'Less -'	
		}).click(function(){			
			$(this).trigger('update.toggleText');
			$(this).parent().next().slideToggle(); 
		});
	};
	
	
	return app;
	
})(jQuery, window, document, window.App || {});