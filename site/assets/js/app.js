window.App = (function($, win, doc, app){

	"use strict";
	
	var lastScrollTop = 0;
	
	function app(){
		
		this.isTouch = this.isTouch();
		
		this.ST = 0;
		
		this.animations = {
			'header': {
				'delta': 10,
				'running': false,
				'height': $('#header').outerHeight(),
			},
			'prefooter': {
				'intensity': .4,
				'running': false,
				'translate': 0
			}
		};
		
		this.raf = 	win.requestAnimationFrame ||
					win.mozRequestAnimationFrame ||
				    win.webkitRequestAnimationFrame ||
				    win.msRequestAnimationFrame ||
				    function(f) {
				      	return setTimeout(f, 1000 / 60);
				    };
							    
	    this.caf =	win.cancelAnimationFrame ||
					win.mozCancelAnimationFrame ||
					clearTimeout;	
	    
	    this.assignedCursors = [];
	    
	    this.initialize();
	}
	
	app.prototype.initialize = function(){
		var inst = this;
		// Execute data app attributes
		$(doc).ready(function(){
			$('[data-app]').each(function(){
				var method = $(this).data('app');
				if (typeof inst[method] === 'function'){
					inst[method].call(inst, $(this));
				}
			});
			$(win).scroll();
		});
		
		inst.headerEffect();
		
		new LazyLoad({
		    elements_selector: ".lazy"
		});

	    
	    var menuAnim = lottie.loadAnimation({
	        container: document.getElementsByClassName('menu__burger')[0],
	        renderer: 'svg',
	        loop: !1,
	        autoplay: !1,
	        path: '/assets/js/menu.json'
	    });
	    
	    menuAnim.playSpeed =  -1;
    	$('.menu__burger').click(function(){
    		menuAnim.play();
    		menuAnim.setSpeed(menuAnim.playSpeed == 1 ? -1 : 1);
    		
    		$('body').toggleClass('menu--visible');
    	});
    	
    	$('.button--effect').each(function(){
    		$(this).html('<span class="helper">' + $(this).text() + '</span><span class="bg"></span>');
    		$(this).find('.helper').toggleText({
    			'state_0': $(this).text(),
    			'state_1': $(this).text(),
    			'delay': 15,
    			'skip_0': true
    		});
    	});
		$('.button--effect').mouseenter(function(){
			$(this).find('.helper').trigger('update.toggleText');
		});
	};
	
	app.introEffects = -1;
	app.promises = {};
	app.elements = {};
	
	app.prototype.introEffect = function(){
		var inst = this;
		var $el = arguments[0];
		
		var lineStart 	= "<span class=\"row-effect\"><span class=\"row-effect__inner\">";
		var lineEnd 	= "</span></span>";
		var html;

		app.introEffects++;
		var _static = app.introEffects;
		app.promises[app.introEffects] = [];    				
		app.elements[app.introEffects] = $el;


		$el.children('p, h1, h2').each(function(index){
			// wrap letters to spans
			$(this).html("<span>" + $(this).text().split('').join("</span><span>") + "</span>");
			html = lineStart;
			
			$(this).find('span').each(function(){
				html += $(this).text();
				if(!$(this).next().length)return false;

				// Detect position top change and create new lines
				if($(this).offset().top < $(this).next().offset().top){
					html += lineEnd;
					html += lineStart;
				}
			});
			
			html += lineEnd;
			$(this).html(html);
			html = null;
		});

		var dfd = $.Deferred();
		
		dfd.done(function(i){
			setTimeout(function(){
				app.elements[i].children('p, h1, h2').each(function(){
					$(this).text($(this).text());
				});
			}, 10000); // Css time
			$(win).off('scroll.' + 'inst' + i);
	    });
	    
		$(win).on('scroll.' + 'inst' +  _static, function(){
			// Is in viewport
			if(inst.isInViewport($el[0], {top:(window.innerHeight || document.documentElement.clientHeight)/4,left:0})){				
				$el.find('.row-effect').each(function(i){
    				var $that = $(this);
    				setTimeout(function(){
    					$that.addClass('row-effect--active');   
    				},150*i);
					dfd.resolve(_static);
				});
			}
    	});		
	};

	app.prototype.assignCursor = function($el, html, css){

		var instance = this;
		if(this.isTouch) return;

		if(typeof css === 'undefined') css = {};
			
		if(typeof this.cursor === 'undefined'){
			$('body').append('<div id="cursor" />');
			this.cursor = $('#cursor');			

			$(doc).on("mousemove", function(e){
				if(!instance.cursor.enabled) return;
				instance.cursor.css({
					'left': e.clientX - (instance.cursor.width()/2),
					'top':  e.clientY - (instance.cursor.height()/2)
				});
			});
		}
		
		$el
			.css('cursor', 'none')
			.on("mouseenter", function(){
				instance.cursor.enabled = !0;
				instance.cursor
					.html(html)
					.css(css)
					.show();
			})
			.on("mouseleave", function(){
				instance.cursor.enabled = !1;
				instance.cursor.hide();
			});

		this.assignedCursors.push($el);
		
		return $el;
	};
	
	app.prototype.isInViewport = function(el, offset){
		
		if(typeof offset === 'undefined') offset = {top:0,left:0};
		var rect = el.getBoundingClientRect();

		var windowHeight = (window.innerHeight || document.documentElement.clientHeight);
		var windowWidth = (window.innerWidth || document.documentElement.clientWidth);


		var vertInView = (rect.top+offset.top < windowHeight) && ((rect.top + rect.height) > 0);
		var horInView = (rect.left+offset.left < windowWidth) && ((rect.left + rect.width) > 0);

	    return (vertInView && horInView);
	};
	
	app.prototype.headerEffect = function(){
			
		this.raf.apply(win, [this.headerEffect.bind(this)]);
		this.ST = $(doc).scrollTop();

		
		if(Math.abs(lastScrollTop - this.ST) <= this.animations.header.delta
		|| $('body').hasClass('menu--visible')){
	 		return;
	 	}
		
	 	if(this.ST > lastScrollTop && this.ST > this.animations.header.height){
	 		// Scroll Down
	 		//$('#header').css('top', -1*this.animations.header.height);
	 		$('#header').addClass('slideOut');
	 	} else if(this.ST < lastScrollTop) {
	 		// Scroll Up
	 		if(this.ST + $(window).height() < $(document).height()){
				$('#header').addClass('with-bg').removeClass('slideOut');
	 			//$('#header').css('top',0);
	 		}
	 	} 	
	 	
		if(this.ST <= this.animations.header.height){
			$('#header').removeClass('with-bg');
		}
		
	 	lastScrollTop = this.ST;

	};
	
    app.prototype.footerEffect = function($img){
    	var inst = this;
    	
    	if(arguments[0] === 'undefined'){
    		return;
    	}
    	var translate = $img.offset().top;
    		translate -= $img.parent().prev().find('a').offset().top;
    		translate += parseInt($img.parent().prev().find('a').css('margin-top'));
    		translate *= -1;

    	$img.startingPos = translate;
    	
    	$img.css({
    		'-webkit-transform': 'translate3d(0,'+translate+'px,0)',
    		'transform': 'translate3d(0,'+translate+'px,0)'    		
    	});
    	
    	this.raf.apply(win, [this.footerAnimation.bind(this, $img)]);
    };
    
    var translate;
    
    app.prototype.footerAnimation = function($img){

    	this.raf.apply(win, [this.footerAnimation.bind(this, $img)]);
		
    	var offset = $img.startingPos;
    	
    	if($img.parent().offset().top+offset > $(win).scrollTop()+$(win).height()){
        	this.animations.prefooter.running = false;
    		return;
    	}
    	
		translate = $(win).scrollTop();
		translate += $(win).height();
		translate -= $img.parent().offset().top;
		translate += offset;    	
		translate *= this.animations.prefooter.intensity;    	
		translate = translate > 0 ? 0 : translate;
    	
    	$img.css({
    		'-webkit-transform': 'translate3d(0,'+translate+'px,0)',
    		'transform': 'translate3d(0,'+translate+'px,0)'
    	});
    	
    	this.animations.prefooter.running = false;
    };

    
    app.prototype.isTouch = function(){
    	var prefixes = ' -webkit- -moz- -o- -ms- '.split(' ');
    	
    	var mq = function(query){	
    		return window.matchMedia(query).matches;
    	}

    	if (('ontouchstart' in window)
    	|| window.DocumentTouch 
    	&& document instanceof DocumentTouch){
    		return true;
    	}
    	
    	return mq(['(', prefixes.join('touch-enabled),('), 'heartz', ')'].join(''));
    }

	return new app;
	
})(jQuery, window, document, {});