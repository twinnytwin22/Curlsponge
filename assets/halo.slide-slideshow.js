(() => {
    var halo = {
        init: () => {
            var block = $('[data-slideshow-block]');

            block.each((index, element) => {
                var self = $(element),
                    slider = self.find('.heroCarousel'),
                    itemDots = slider.data('item-dots'),
                    itemArrows = slider.data('item-arrows'),
                    itemAutoPlay = slider.data('item-autoplay'),
                    itemTime = slider.data('item-time'),
                    itemFade = slider.data('item-fade');

                if(slider.length > 0){
                    if(!slider.hasClass('slick-initialized')){
                        if (slider.find('.heroCarousel-slide--first [data-mp4-video]').length > 0){
                            slider.on('init', (event, slick) => {
                                var firstSlide = slider.find('.heroCarousel-slide--first'),
                                    player = firstSlide.find('video').get(0);

                                if (player != undefined) {
                                    slider.addClass('slick-slider--playvideo');
                                    player.play();
                                }
                            });
                        }

                        if (slider.find('.heroCarousel-slide--first [data-vimeo-video]').length > 0){
                            slider.on('init', (event, slick) => {
                                var firstSlide = slider.find('.heroCarousel-slide--first'),
                                    player = firstSlide.find('iframe').get(0),
                                    command = {
                                        'method': 'play',
                                        'value': 'true'
                                    };

                                if (player != undefined) {
                                    slider.addClass('slick-slider--playvideo');
                                    player.contentWindow.postMessage(JSON.stringify(command), '*');
                                }
                            });
                        }

                        slider.slick({
                            mobileFirst: true,
                            adaptiveHeight: false,
                            infinite: false,
                            dots: true,
                            arrows: false,
                            slidesToShow: 1,
                            slidesToScrol: 1,
                            fade: itemFade,
                            autoplay: itemAutoPlay,
                            autoplaySpeed: itemTime,
                            rtl: window.rtl_slick,
                            nextArrow: '<button type="button" class="slick-arrow slick-next" aria-label="'+ window.accessibility.next_slide +'">' + window.slick.nextArrow + '</button>',
                            prevArrow: '<button type="button" class="slick-arrow slick-prev" aria-label="'+ window.accessibility.previous_slide +'">' + window.slick.prevArrow + '</button>',
                            customPaging : (slider, i) => {
                                let index = i + 1;
                                return '<button type="button" data-role="none" role="button" tabindex="0">'+ String(index).padStart(2, '0') +'</button>';
                            },
                            responsive: [
                                {
                                    breakpoint: 1025,
                                    settings: {
                                        dots: itemDots,
                                        arrows: itemArrows
                                    }
                                }
                            ]
                        });

                        if(slider.find('[data-youtube-video]').length > 0){
                            if (typeof window.onYouTubeIframeAPIReady === 'undefined') {
                                window.onYouTubeIframeAPIReady = halo.initYoutubeCarousel.bind(window, slider);

                                const tag = document.createElement('script');
                                tag.src = 'https://www.youtube.com/player_api';
                                const firstScriptTag = document.getElementsByTagName('script')[0];
                                firstScriptTag.parentNode.insertBefore(tag, firstScriptTag);
                            } else {
                                halo.initYoutubeCarousel(slider);
                            }
                        }

                        if (slider.find('[data-mp4-video]').length > 0){
                            slider.on('beforeChange', (event, slick) => {
                                var currentSlide = $(slick.$slider).find('.slick-current'),
                                    player = currentSlide.find('video').get(0);

                                if (player != undefined) {
                                    slider.removeClass('slick-slider--playvideo');
                                    player.pause();
                                }
                            });

                            slider.on('afterChange', (event, slick) => {
                                var currentSlide = $(slick.$slider).find('.slick-current'),
                                    player = currentSlide.find('video').get(0);

                                if (player != undefined) {
                                    slider.addClass('slick-slider--playvideo');
                                    player.play();
                                }
                            });
                        }

                        if (slider.find('[data-vimeo-video]').length > 0){
                            slider.on('beforeChange', (event, slick) => {
                                var currentSlide = $(slick.$slider).find('.slick-current'),
                                    player = currentSlide.find('iframe').get(0),
                                    command = {
                                        'method': 'pause',
                                        'value': 'true'
                                    };

                                if (player != undefined) {
                                    slider.removeClass('slick-slider--playvideo');
                                    player.contentWindow.postMessage(JSON.stringify(command), '*');
                                }
                            });

                            slider.on('afterChange', (event, slick) => {
                                var currentSlide = $(slick.$slider).find('.slick-current'),
                                    player = currentSlide.find('iframe').get(0),
                                    command = {
                                        'method': 'play',
                                        'value': 'true'
                                    };

                                if (player != undefined) {
                                    slider.addClass('slick-slider--playvideo');
                                    player.contentWindow.postMessage(JSON.stringify(command), '*');
                                }
                            });
                        }

                        if(itemAutoPlay && slider.find('lookbook-point').length > 0) {
                            slider.on('beforeChange', (event, slick) => {
                                slider.closest('.lookbook-box').find('lookbook-popup').removeAttr('open');
                            });
                        }
                    }
                }
            });
        },

        initYoutubeCarousel: (carousel) => {
            carousel.each((index, slick) => {
                const $slick = $(slick);

                if ($slick.find('[data-youtube-video]').length > 0) {
                    $slick.addClass('slick-slider--video');

                    halo.initYoutubeCarouselEvent($slick);
                }
            });
        },

        initYoutubeCarouselEvent: ($slick) => {
            var $videos = $slick.find('[data-youtube-video]');

            bindEvents();

            function bindEvents() {
                if ($slick.hasClass('slick-initialized')) {
                    onSlickInit();
                }

                $slick.on('init', onSlickInit);
                $slick.on('beforeChange', onSlickBeforeChange);
                $slick.on('afterChange', onSlickAfterChange);
            }

            function onPlayerReady(event) {
                $(event.target.getIframe()).closest('.slick-slide').data('youtube-player', event.target);

                setTimeout(function(){
                    if ($(event.target.getIframe()).closest('.slick-slide').hasClass('slick-active')) {
                        $slick.slick('slickPause');

                        if (typeof $slick.data('youtubeMute') !== 'undefined'){
                            event.target.mute();
                        }

                        event.target.playVideo();
                    }
                }, 100);
            }

            function onPlayerStateChange(event) {
                if (event.data === YT.PlayerState.PLAYING) {
                    $slick.addClass('slick-slider--playvideo');
                    $slick.slick('slickPause');
                }

                if (event.data === YT.PlayerState.PAUSED) {
                    $slick.removeClass('slick-slider--playvideo');
                }

                if (event.data === YT.PlayerState.ENDED) {
                    $slick.removeClass('slick-slider--playvideo');
                    $slick.slick('slickPlay');
                    $slick.slick('slickNext');
                }
            }

            function onSlickInit() {
                $videos.each((index, video) => {
                    const id = `youtube_player_${Math.floor(Math.random() * 100)}`;

                    video.setAttribute('id', id);

                    const player = new YT.Player(id, {
                        host: 'http://www.youtube.com',
                        videoId: video.getAttribute('data-youtube-video'),
                        wmode: 'transparent',
                        playerVars: {
                            controls: 0,
                            disablekb: 1,
                            enablejsapi: 1,
                            fs: 0,
                            rel: 0,
                            showinfo: 0,
                            iv_load_policy: 3,
                            modestbranding: 1,
                            wmode: 'transparent',
                        },
                        events: {
                            onReady: onPlayerReady,
                            onStateChange: onPlayerStateChange,
                        },
                    });
                });
            }

            function onSlickBeforeChange(){
                const player = $slick.find('.slick-slide.slick-active').data('youtube-player');

                if (player) {
                    player.stopVideo();
                }
            }

            function onSlickAfterChange(){
                $slick.slick('slickPlay');

                const player = $slick.find('.slick-slide.slick-active').data('youtube-player');

                if (player) {
                    if (typeof $slick.data('youtubeMute') !== 'undefined') {
                        player.mute();
                    }

                    player.playVideo();
                }
            }
        }
    }

    halo.init();
})();