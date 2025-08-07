(() => {
    var halo = {
        init: () => {
            var block = $('[data-product-custom-banner-block]');

            block.each((index, element) => {
                var slider = $(element).find('.halo-row-carousel'),
                    sliderMobile = $(element).find('.halo-row-carousel--mobile'),
                    itemToShow = slider.data('item-to-show'),
                    itemDots = slider.data('item-dots'),
                    itemArrows = slider.data('item-arrows');

                if(slider.length > 0){
                    if(sliderMobile.length > 0){
                        if(!slider.hasClass('slick-initialized')){
                            slider.slick({
                                mobileFirst: true,
                                adaptiveHeight: true,
                                infinite: false,
                                vertical: false,
                                arrows: false,
                                dots: true,
                                slidesToShow: 1,
                                slidesToScroll: 1,
                                nextArrow: '<button type="button" class="slick-arrow slick-next" aria-label="'+ window.accessibility.next_slide +'">' + window.slick.nextArrow + '</button>',
                                prevArrow: '<button type="button" class="slick-arrow slick-prev" aria-label="'+ window.accessibility.previous_slide +'">' + window.slick.prevArrow + '</button>',
                                responsive: [
                                    {
                                        breakpoint: 1024,
                                        settings: {
                                            arrows: itemArrows,
                                            dots: itemDots
                                        }
                                    }
                                ]
                            });
                        }
                    } else {
                        if (window.innerWidth >= 1025) {
                            if(!slider.hasClass('slick-initialized')){
                                slider.slick({
                                    mobileFirst: true,
                                    adaptiveHeight: true,
                                    infinite: false,
                                    vertical: false,
                                    arrows: false,
                                    dots: true,
                                    slidesToShow: 1,
                                    slidesToScroll: 1,
                                    nextArrow: '<button type="button" class="slick-arrow slick-next" aria-label="'+ window.accessibility.next_slide +'">' + window.slick.nextArrow + '</button>',
                                    prevArrow: '<button type="button" class="slick-arrow slick-prev" aria-label="'+ window.accessibility.previous_slide +'">' + window.slick.prevArrow + '</button>',
                                    responsive: [
                                        {
                                            breakpoint: 1024,
                                            settings: {
                                                arrows: itemArrows,
                                                dots: itemDots
                                            }
                                        }
                                    ]
                                });
                            }
                        } else {
                            if(slider.hasClass('slick-initialized')){
                                slider.slick('unslick');
                            }
                        }
                    }
                }
            });
        }
    }

    $(window).on('resize', () => {
        halo.init();
    });

    halo.init();
})();