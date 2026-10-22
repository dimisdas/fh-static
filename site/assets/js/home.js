var App = (function($, win, doc, App){

	"use strict";

	$(function(){
		// Testimonials carousel
		var owl = $('.testimonials .owl-carousel').owlCarousel({
		    loop:!0,
		    margin:10,
		    items: 1,
		    nav:!0,
		    autoHeight: !1,
		    navText: [
		    	'<span class="owl-nav__span owl-nav__span--prev"></span>',
		    	'<span class="owl-nav__span owl-nav__span--next"></span>'
		    ],
		    responsive: {
		    	0: {
				    autoHeight: !0,
		    	},
		    	768: {
				    autoHeight: !1,
		    	}
		    }
		});

    // Refresh testimonials carousel
    win.onload = function(){
      owl.data('owl.carousel')._invalidated.width = true;
      owl.trigger('refresh.owl.carousel');
    }

		// Intro scroll animation

		$('.video-intro').Sequence({
			frames: 107,
			path: "assets/img/intro_new",
			ext: "webp",
			height: function(){
				return $(window).height();
			}
		});

		// Outro scroll animation
		$('.video-outro').Sequence({
			frames: 60,
			path: "assets/img/sequence_outro",
			ext: "webp",
			height: function(){
				return $(window).width()>640
					? $(window).height()
					: ($(window).height()/2);
			},
			trigger: function(){
				return -.9*$(window).height();
			}
		});
	});

	return App;

})(jQuery, window, document, window.App || {});
