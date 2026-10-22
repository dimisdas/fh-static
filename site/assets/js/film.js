$(function(){
    "use strict";

    var opts = {
        items: 3,
        loop: true,
        dots: false,
        autoplay: true,
		autoplayTimeout: 10000,
        autoplaySpeed: 3000,
        lazyLoad: true,
        lazyLoadEager: 1,
        stagePadding: 100,
        responsive: {
            0: {
                items: 1,
                stagePadding: 100,
            },
            575: {
                items: 2,
            },
            768: {
                items: 2,
            },
            992: {
                items: 3,
            }
        }
    };

    var carousel = $('.film__carousel').owlCarousel(opts);

    window.onload = function(){
      carousel.data('owl.carousel')._invalidated.width = true;
      carousel.trigger('refresh.owl.carousel');
    }
    var el = document.getElementById('player');
    var player = new Plyr(el, {
        controls: [
            'play-large',
            'play',
            'progress',
            'current-time',
            'mute',
            'volume',
            'settings',
            'pip',
            'airplay',
            'fullscreen'
        ],
        settings: [
            'speed',
            'loop'
        ]
    });
    player.on('play', function(e){
        $(e.target).find('.player__cover').fadeOut();
    });
    player.on('controlshidden', function(e){
        $('#header').addClass('slideOut');
    });
    player.on('controlsshown', function(e){
        $('#header').removeClass('slideOut');
    });

    $('.player__cover').click(function(){
        player.play();
    });
});
