var App = (function($, win, doc, App){

	"use strict";
	
	$(function(){
		
		//Set up carousels
		var settings = {
			    dots: !1,
			    autoplay: !1,
			    autoplayTimeout: 8000,
			    loop:!0,
			    lazyLoad: !0,
			    autoWidth: 0,
	    		margin: 12,
			    items: 1,
			    onInitialized: function(e){
			    	if(!App.isTouch){
				    	// Append navigateeiong elements
						this.$element					
							.append('<div class="c-nav__wrapper">\
								<div class="c-nav__button c-nav__button__prev"></div>\
								<div class="c-nav__button c-nav__button__next"></div>\
							</div>')						
							.append('<div class="cursor" />');
						
						// Set data navigation to cursor
						this.$element.find('.cursor')
							.data('current', 1)
							.data('total', e.item.count);			    		
			    	}
				}
		
			};
		
		var	locationCarousel = $('.location__carousel').owlCarousel(settings);
				
    	if(!App.isTouch){
			locationCarousel.on('translated.owl.carousel',function(e){
				
				// Set data navigation to cursor
				var current = (e.item.index + 1) - e.relatedTarget._clones.length / 2;
				var itemsCount = e.item.count;

				if (current > itemsCount || current == 0) {
					current = itemsCount - (current % itemsCount);
				}
				
				$(this).find('.cursor')
					.data('current', current)
					.data('total', itemsCount)
					// Replace cursor text
					.text($(this).find('.cursor').text()
					.replace(/^(.*\()[0-9]+(\/[0-9]+\).*)$/g,
								'$1' + current + '$2'));
			});
			
			// Assign event to navigation elements
			$.each([locationCarousel], function(index, value){
				$('.c-nav__button__prev').click(function(e){
					$(this).parents().filter(value).trigger('prev.owl.carousel');
				});
				$('.c-nav__button__next').click(function(){
					$(this).parents().filter(value).trigger('next.owl.carousel');
				});			
			});
					
			//Show cursor on hover
			$(doc)
				.on("mouseenter scroll", '.c-nav__wrapper', function(){
					$(this).next('.cursor').show();
				})
				.on("mouseleave scroll", '.c-nav__wrapper', function(){
					$(this).next('.cursor').hide();
				});
	
			// Updating cursor texts on carousel hover
			$(doc)
				.on("mouseenter", '.c-nav__button__prev', function(e){
					var cursor = $(this).parent().next('.cursor');
					cursor.text('↖Previous image ('+ cursor.data('current') +'/'+ cursor.data('total') +')');
				})
				.on("mouseenter", '.c-nav__button__next', function(e){
					var cursor = $(this).parent().next('.cursor');
					cursor.text('('+ cursor.data('current') +'/'+ cursor.data('total') +') Next image↗');
				});
			
			// Follow cursor
			$(doc).on("mousemove", function(e) {
				if(!$(e.target).closest('.c-nav__wrapper').length) return;
				$('.cursor').css({
					'left': e.clientX - ($('.cursor').width()/2),
					'top':  e.clientY - ($('.cursor').height()/2)
				});
			});
    	}
		// Maps
		
		// Map style
		var style = [
		    {
		        "featureType": "all",
		        "elementType": "labels",
		        "stylers": [
		            {
		                "visibility": "off"
		            }
		        ]
		    },
		    {
		        "featureType": "administrative",
		        "elementType": "labels",
		        "stylers": [
		            {
		                "visibility": "off"
		            }
		        ]
		    },
		    {
		        "featureType": "administrative",
		        "elementType": "labels.text.fill",
		        "stylers": [
		            {
		                "color": "#444444"
		            },
		            {
		                "visibility": "off"
		            }
		        ]
		    },
		    {
		        "featureType": "administrative.neighborhood",
		        "elementType": "labels",
		        "stylers": [
		            {
		                "visibility": "off"
		            }
		        ]
		    },
		    {
		        "featureType": "landscape",
		        "elementType": "all",
		        "stylers": [
		            {
		                "visibility": "off"
		            },
		            {
		                "color": "#e0dfe0"
		            }
		        ]
		    },
		    {
		        "featureType": "landscape",
		        "elementType": "labels",
		        "stylers": [
		            {
		                "visibility": "off"
		            }
		        ]
		    },
		    {
		        "featureType": "poi",
		        "elementType": "all",
		        "stylers": [
		            {
		                "visibility": "off"
		            }
		        ]
		    },
		    {
		        "featureType": "poi",
		        "elementType": "labels",
		        "stylers": [
		            {
		                "visibility": "off"
		            }
		        ]
		    },
		    {
		        "featureType": "poi.park",
		        "elementType": "geometry",
		        "stylers": [
		            {
		                "color": "#a8a9a8"
		            },
		            {
		                "visibility": "off"
		            }
		        ]
		    },
		    {
		        "featureType": "road",
		        "elementType": "all",
		        "stylers": [
		            {
		                "saturation": -100
		            },
		            {
		                "lightness": 45
		            },
		            {
		                "visibility": "off"
		            }
		        ]
		    },
		    {
		        "featureType": "road",
		        "elementType": "geometry.fill",
		        "stylers": [
		            {
		                "visibility": "off"
		            },
		            {
		                "color": "#5b5b5a"
		            }
		        ]
		    },
		    {
		        "featureType": "road",
		        "elementType": "labels",
		        "stylers": [
		            {
		                "visibility": "off"
		            }
		        ]
		    },
		    {
		        "featureType": "road.highway",
		        "elementType": "all",
		        "stylers": [
		            {
		                "visibility": "off"
		            }
		        ]
		    },
		    {
		        "featureType": "road.highway",
		        "elementType": "labels",
		        "stylers": [
		            {
		                "visibility": "off"
		            }
		        ]
		    },
		    {
		        "featureType": "road.arterial",
		        "elementType": "labels.icon",
		        "stylers": [
		            {
		                "visibility": "off"
		            }
		        ]
		    },
		    {
		        "featureType": "transit",
		        "elementType": "all",
		        "stylers": [
		            {
		                "visibility": "off"
		            }
		        ]
		    },
		    {
		        "featureType": "transit",
		        "elementType": "labels",
		        "stylers": [
		            {
		                "visibility": "off"
		            }
		        ]
		    },
		    {
		        "featureType": "water",
		        "elementType": "all",
		        "stylers": [
		            {
		                "color": "#ffffff"
		            },
		            {
		                "visibility": "on"
		            }
		        ]
		    },
		    {
		        "featureType": "water",
		        "elementType": "labels",
		        "stylers": [
		            {
		                "visibility": "off"
		            }
		        ]
		    }
		];

		
		// Custom overlay		

		function TextOverlay(latLng, map, txt){			
			this.pos 	= new google.maps.LatLngBounds(latLng);
			this.txt 	= txt;
			this.div_ 	= null;		
			
			this.setMap(map);			
		}
		
		TextOverlay.prototype = new google.maps.OverlayView();
		
		TextOverlay.prototype.onAdd = function() {
			var div = document.createElement('div');
				// Styles
				div.style.borderStyle = 'none';
				div.style.borderWidth = '0px';
				div.style.position = 'absolute';
				div.style.color = '#0A1622';
				div.style.fontFamily = 'Nitti';
				div.style.textTransform = 'Uppercase';
				
				// Text
				div.innerHTML = this.txt;	
				
			this.div_ = div;
			this.getPanes().overlayLayer.appendChild(div);
		};

		TextOverlay.prototype.draw = function() {
			var overlayProjection = this.getProjection();
			this.div_.style.left = overlayProjection.fromLatLngToDivPixel(this.pos.getSouthWest()).x + 'px';
			this.div_.style.top = overlayProjection.fromLatLngToDivPixel(this.pos.getNorthEast()).y + 'px';
			this.div_.style.fontSize = (20*this.map.zoom/9) + 'px';			
		};
		
		// Athens LatLng
		var athens = new google.maps.LatLng(37.9908997, 23.70332);
		
		$('.location__item').each(function(){
			var $location = $(this);
			
			$location.latlngbounds = new google.maps.LatLngBounds(athens);
			var $map = $location.find('.location__map');
			
			$(this).find('.location__map-toggler').toggleText({
				'state_0': 'View in map',
				'state_1': 'Close map'	
			}).click(function(){
				$map.toggle();
				$(this).parent().toggleClass('map-open');
				$(this).trigger('update.toggleText');

				if(typeof $location.googlemap === 'undefined'){
					
					// Initialize map
					$location.googlemap = new google.maps.Map($map[0], {
					      center: {lat: $map.data('lat'), lng: $map.data('lng')},
					      styles: style,
					      fullscreenControl: !1,
					      mapTypeControl: !1,
					      streetViewControl: !1
					});
					
					$location.latlngbounds.extend(new google.maps.LatLng($map.data('lat'), $map.data('lng')));
					
					// Athens circle
					/*new google.maps.Circle({
						clickable: !1,
			            fillOpacity: 0,
			            strokeColor: '#0A1622',
			            strokeWeight: 1,
			            map: $location.googlemap,
			            center: athens,
			            radius: 5000
			          });*/

					new TextOverlay(athens, $location.googlemap, 'Athens');
					
					// Location circle
					new google.maps.Circle({
						clickable: !1,
			            fillOpacity: 0,
			            strokeColor: '#0A1622',
			            strokeWeight: 1,
			            map: $location.googlemap,
			            center: {
			            	lat: $map.data('lat'), lng: $map.data('lng')
			            },
			            radius: 10000
			          });					
				}
				// Center map
				$location.googlemap.fitBounds($location.latlngbounds);
				
			});
		});
	});
	
	return App;
	
})(jQuery, window, document, window.App || {});
