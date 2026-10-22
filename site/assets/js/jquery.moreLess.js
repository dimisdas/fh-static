(function ($) {
	'use strict';
    
	var toggleText = (function(){
		
    	var inst = 0;

		
    	function constructor(el, opts){

    		this.defaults = {
    			'state_0': 'More +',
    			'state_1': 'Less -',
    			'delay': 10,
    			'skip_0': false
    		};
    		
    		inst += 1;
    		this.inst = inst;
    		this.el = $(el);    		
    		this.options = $.extend({}, this.defaults, opts);
    		
    		Object.defineProperty(this, "state", {
    		    get state(){
    		      return this._state;
    		    },
    		    set state(value){
    		    	this._state = value;
    		    },
    		    writable: true
		    });
    		    		    
    		this.init();
    	}

		return constructor;
	})();
	
	toggleText.prototype.init = function(){
		
		var that = this;

		that.el.css({
			'overflow': 'hidden'
		});
		
		that.options.state_0 = that.options.state_0.split('');
		that.options.state_1 = that.options.state_1.split('');

		that.el.html($.map( that.options.state_0, function( val, i ){			
			return '<span>' + val + '</span>';
		}).join(''));

		this.state = 0;		

		that.el.on( "update.toggleText", function(event, args){
			that.updateText(args);
		});
	};
	
	toggleText.prototype.updateText = function(){

		if(this.state == arguments[0]) return;
		
		this.state = arguments[0] || !this.state;

		this.animate(this.state?this.options.state_1:this.options.state_0);
		this.el.toggleClass('state1');
	};
	
	toggleText.prototype.getText = function(state){
		return state?this.options.state_1:this.options.state_0;
	}
	
	toggleText.prototype.animate = function(text){

		var that = this;
		that.el.children('span').each(function(index){
			
			$(this).stop(true, true).delay(that.options.delay*index).animate({
				transformValue: 100
			},{
				duration: that.options.duration,
				start: function(animation){
					animation.tweens[0].start = 0;
					if(that.options.skip_0){
			    		that.el.find('span').each(function(index){
			    			$(this).stop(true, true).delay(that.options.delay*index).animate({
			    				transformValue: 0
			    			},{
			    				duration: that.options.duration,
			    				start: function(animation){
			    					animation.tweens[0].start = 100;
			    				},
			    				step: function(now, tween) {
		    		    			$(this).css({
		    		    				'transform': 'translate3d(0,'+now+'%,0)'
		    		    			});
			    		        },
			    		        complete: function(){
			    		        	if($(this).index() !== that.getText(that.state).length-1){
			    		        		return
			    		        	}
			    		        	that.el.removeClass('updating');
			    		        }
			    			});
			    		});
					}
				},
				step: function(now, tween) {
	    			$(this).css({
	    				'transform': 'translate3d(0,-'+now+'%,0)'
	    			});
		        },
		        complete: function(){
					if(that.options.skip_0){
						return;
					}
		        	if($(this).index() !== that.getText(!that.state).length-1){
		        		return;
		        	}

		        	that.el.empty();
		        	that.el.addClass('updating');
		        	that.el.html($.map( text, function( val, i ){
		    			return '<span>' + val + '</span>';
		    		}));

		    		that.el.find('span').each(function(index){
		    			$(this).stop(true, true).delay(that.options.delay*index).animate({
		    				transformValue: 0
		    			},{
		    				duration: that.options.duration,
		    				start: function(animation){
		    					animation.tweens[0].start = 100;
		    				},
		    				step: function(now, tween) {
	    		    			$(this).css({
	    		    				'transform': 'translate3d(0,'+now+'%,0)'
	    		    			});
		    		        },
		    		        complete: function(){
		    		        	if($(this).index() !== that.getText(that.state).length-1){
		    		        		return
		    		        	}
		    		        	that.el.removeClass('updating');
		    		        }
		    			});
		    		});

		        }
			});
		});
	};
	
    $.fn.toggleText = function(opts) {
        var l = this.length, i;        
        for(i = 0; i < l; i++){
        	 this[i].toggleText = new toggleText(this[i], opts);
        }
        return this;
    };
    
})(jQuery)