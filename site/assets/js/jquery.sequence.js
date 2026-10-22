Number.prototype.pad = function(size) {
    var s = String(this);
    while (s.length < (size || 2)) {s = "0" + s;}
    return s;
};
/**
 * Plugin params
 * ----------------------------------------------
 * name: frames 		type: int				The total frames of the sequence, must be same as images in the specified path
 * name: path 			type: string			The root path where the images are located
 * name: ext 			type: string			The images file extension
 * name: height 		type: number|method		The height of the sequence
 * name: trigger 		type: number|method		The offset that starts the animation. Screen based. eg: 200 starts when element passed 200 from screen top, -window.innerHeight triggers when element passed bottom
 * name: loaderClass 	type: string			The class will be applied to the loading element
 * name: loader 		type: string(html)		The loading element html
 */
(function ($) {
	'use strict';

	
	// check_webp_feature:
	//  'feature' can be one of 'lossy', 'lossless', 'alpha' or 'animation'.
	//  'callback(feature, result)' will be passed back the detection result (in an asynchronous way!)
	function check_webp_feature(feature, callback){
		
		var kTestImages = {
				lossy: "UklGRiIAAABXRUJQVlA4IBYAAAAwAQCdASoBAAEADsD+JaQAA3AAAAAA",
				lossless: "UklGRhoAAABXRUJQVlA4TA0AAAAvAAAAEAcQERGIiP4HAA==",
				alpha: "UklGRkoAAABXRUJQVlA4WAoAAAAQAAAAAAAAAAAAQUxQSAwAAAARBxAR/Q9ERP8DAABWUDggGAAAABQBAJ0BKgEAAQAAAP4AAA3AAP7mtQAAAA==",
				animation: "UklGRlIAAABXRUJQVlA4WAoAAAASAAAAAAAAAAAAQU5JTQYAAAD/////AABBTk1GJgAAAAAAAAAAAAAAAAAAAGQAAABWUDhMDQAAAC8AAAAQBxAREYiI/gcA"
			};
		
	   var img = new Image();
	   
	   img.onload = function () {
	       var result = (img.width > 0) && (img.height > 0);
	       callback(feature, result);
	   };
	   img.onerror = function () {
	       callback(feature, false);
	   };
	   img.src = "data:image/webp;base64," + kTestImages[feature];
	}
	
	var Sequence = (function(){
    	
    	var inst = 0;

    	function sequence(el, opts){
    		
    		this.defaults = {
				frames: 60,
				path: "/",
				ext: "webp",
    			height: $(window).height(),
    			trigger: 0,
    			loaderClass: 'sdframes__loader',
    			loader: '<span class="loader">\
    				 <svg viewBox="0 0 280 280" class="spinner">\
					  	<circle class="line" cx="140" cy="140" r="130"></circle>\
					  </svg>\
					</span>',
					speed: 1,
					preflight: function(){
						return true;
					},
					onInitialized: function(seq){
							seq.el.css({
								'height':'',
								'background-color':'',
							});
					}
    		};
    		
    		inst += 1;
    		this.inst = inst;
    		this.el = $(el);
    		this.options = $.extend({}, this.defaults, opts);
    		this.options.path = this.options.path.replace(/\/$/, '') + '/';

    		this.options.preflight();
    		this.loader = '<div class="'+this.options.loaderClass+'">'+ this.options.loader +'</div>';
    		    		
    		this.images = {
				loaded: 0,
				list: [],
				add: function(sequence, src){
					var images = this;
					if(!sequence.el.find('.'+sequence.options.loaderClass).length){
						sequence.el.append($(sequence.loader).clone());						
					}
					var image = new Image();
					image.onload = function(){
						if(++images.loaded === sequence.options.frames){
							sequence.el.removeClass('loading').addClass('ready');
							sequence.el.find('.'+sequence.options.loaderClass).remove();
						}
						image.onload = null;
					}
					image.src = src;
					if(image.complete){
						image.onload();
					}
					images.list.push(image);
				}
		    };
			
    		this.raf = 	window.requestAnimationFrame ||
    				   	window.mozRequestAnimationFrame ||
    				   	window.webkitRequestAnimationFrame ||
    				   	window.msRequestAnimationFrame ||
    				    function(f) {
    				      	return setTimeout(f, 1000 / 60);
    				    };
			    
    	    this.caf =	window.cancelAnimationFrame ||
    					window.mozCancelAnimationFrame ||
    					clearTimeout;

    			this._height = typeof this.options.height ==="number" 
    				? this.options.height
    				: this.options.height();

    			this._trigger = typeof this.options.trigger === "number" 
    				? this.options.trigger
    				: this.options.trigger();
    			
    	    var canvas = document.createElement('canvas');
    	    
    			// Canvas styles
    			canvas.height 		= this._height;
    			canvas.width 			= $(window).innerWidth();
    			canvas.style.height 	= this._height + 'px';
    			canvas.style.width 	= $(window).innerWidth() + 'px';
    			
	    	this.el[0].appendChild(canvas);
	    	
	    	this.ctx = canvas.getContext("2d");	    	
	    	this.canvas = canvas;
	    	this.top;
    		this.init();
    	}
		return sequence;
    }());
		
	Sequence.prototype.init = function(){
		var _this = this;
		_this.el.removeClass('ready').addClass('loading');
		
		var image = new Image();
		image.onload = function(){
			_this.el[0].style.backgroundImage = "url('"+ this.src + "')";
			image.onload = null;
			_this.options.onInitialized(_this);
		}

		var pad = (""+this.options.frames).split("").length;

		image.src = this.options.path + (1).pad(pad) + '.' + this.options.ext;
		
		if(image.complete){
			image.onload();
		}
		

		// Preload images
		for(var i=1; i<= this.options.frames; i++){
			this.images.add(this, this.options.path + i.pad(pad) + "." + this.options.ext);
		}
		
		$(window).resize(function(){		

			_this._height = typeof _this.options.height ==="number" 
				? _this.options.height
				: _this.options.height();

			_this._trigger = typeof _this.options.trigger === "number" 
				? _this.options.trigger
				: _this.options.trigger();
			
			// Canvas styles
			_this.canvas.height 		= _this._height;
			_this.canvas.width 			= $(window).innerWidth();
			_this.canvas.style.height 	= _this._height + 'px';
			_this.canvas.style.width 	= $(window).innerWidth() + 'px';
						
			// Steps
			_this.step = (_this._height+Math.abs(_this._trigger))/_this.options.frames/_this.options.speed;
			
		}).resize();
		
		// Start animation
		this.animation();
	};

	Sequence.prototype.animation = function(){
		this.raf.apply(window, [this.animation.bind(this)]);
		var a = parseInt(($(window).scrollTop()-this.el.offset().top-this._trigger)/this.step);
		if(this.currentImage == a) return;
		
		if(this.isInViewport()
		&& this.el.hasClass('ready')){
			if(a>-1 && a < this.images.loaded){
				this.currentImage = a;
				this.drawImage(this.ctx, this.images.list[a]);
			}
		}		
	};

	var rect;
	Sequence.prototype.isInViewport = function(){
		rect = this.el[0].getBoundingClientRect(); 
	    return ((rect.top < (window.innerHeight || document.documentElement.clientHeight)) && ((rect.top + rect.height) > 0));
	};
	
	Sequence.prototype.drawImage = function(ctx, img, x, y, w, h, offsetX, offsetY){

	    if (arguments.length === 2) {
	        x = y = 0;
	        w = ctx.canvas.width;
	        h = ctx.canvas.height;
	    }
	    // default offset is center
	    offsetX = typeof offsetX === "number" ? offsetX : 0.5;
	    offsetY = typeof offsetY === "number" ? offsetY : 0.5;

	    // keep bounds [0.0, 1.0]
	    if (offsetX < 0) offsetX = 0;
	    if (offsetY < 0) offsetY = 0;
	    if (offsetX > 1) offsetX = 1;
	    if (offsetY > 1) offsetY = 1;

	    var iw = img.width,
	        ih = img.height,
	        r = Math.min(w / iw, h / ih),
	        nw = iw * r,   // new prop. width
	        nh = ih * r,   // new prop. height
	        cx, cy, cw, ch, ar = 1;

	    // decide which gap to fill    
	    if (nw < w) ar = w / nw;                             
	    if (Math.abs(ar - 1) < 1e-14 && nh < h) ar = h / nh;  // updated
	    nw *= ar;
	    nh *= ar;

	    // calc source rectangle
	    cw = iw / (nw / w);
	    ch = ih / (nh / h);

	    cx = (iw - cw) * offsetX;
	    cy = (ih - ch) * offsetY;

	    // make sure source rectangle is valid
	    if (cx < 0) cx = 0;
	    if (cy < 0) cy = 0;
	    if (cw > iw) cw = iw;
	    if (ch > ih) ch = ih;

	    // fill image in dest. rectangle
	    ctx.drawImage(img, cx, cy, cw, ch,  x, y, w, h);
	};
	
    $.fn.Sequence = function(opts) {
        var l = this.length, i;
        var instance = this;
    	if(opts.ext == 'webp'){
    		if(typeof window.webpSupport === 'undefined'){
        		check_webp_feature('lossless', function(feature, support){
        			// Fallback to jpg
        			if(!support){
        				opts.ext = 'jpg';
        				console.warn('WebP file requested but not supported. Automatically fallback to jpg.');
        			}
                    for(i = 0; i < l; i++){
                    	instance[i].Sequence = new Sequence(instance[i], opts);
                    }
        			window.webpSupport = support;
        		});
    		}
    	}else{
            for(i = 0; i < l; i++){
            	instance[i].Sequence = new Sequence(instance[i], opts);
            }
    	}
        return this;
    };    
})(jQuery);