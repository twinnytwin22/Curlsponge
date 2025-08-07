(() => {
    var halo = {
        init: () => {
            var block = $('[data-slideshow-block-2]');

            block.each((index, element) => {
                var self = $(element),
                    slider = self.find('.heroCarousel'),
                    itemDots = slider.data('item-dots'),
                    itemArrows = slider.data('item-arrows'),
                    itemAutoPlay = slider.data('item-autoplay'),
                    itemTime = slider.data('item-time'),
                    itemFade = true;
                    
                if(slider.length > 0){
                    if(!slider.hasClass('slick-initialized')){
                        slider.slick({
                            mobileFirst: true,
                            adaptiveHeight: true,
                            infinite: true,
                            dots: true,
                            arrows: false,
                            slidesToShow: 1,
                            slidesToScrol: 1,
                            fade: itemFade,
                            rtl: window.rtl_slick,
                            speed: 900,
                            autoplay: itemAutoPlay,
                            autoplaySpeed: itemTime,
                            touchThreshold: 100,
                            cssEase: 'cubic-bezier(0.7, 0, 0.3, 1)',
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

                        if (slider.find('.heroCarousel-video').length > 0){
                            slider.on('beforeChange', (event, slick) => {
                                var currentSlide = $(slick.$slider).find('.slick-current'),
                                    player = currentSlide.find('video').get(0);

                                if (player != undefined) {
                                    player.pause();
                                }
                            });

                            slider.on('afterChange', (event, slick) => {
                                var currentSlide = $(slick.$slider).find('.slick-current'),
                                    player = currentSlide.find('video').get(0);

                                if (player != undefined) {
                                    player.play();
                                }
                            });
                        }
                    }
                }
            });
        }
    }

    halo.init();
})();