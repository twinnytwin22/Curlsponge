(() => {
    var halo = {
        init: () => {
            var block = $('[data-footer-banner-block]');

            block.each((index, element) => {
                var slider = $(element).find('.halo-row-carousel'),
                    itemToShow = slider.data('item-to-show'),
                    itemDots = slider.data('item-dots'),
                    itemArrows = slider.data('item-arrows');

                if(slider.length > 0){
                    if(!slider.hasClass('slick-initialized')){
                        slider.slick({
                            mobileFirst: true,
                            adaptiveHeight: true,
                            infinite: false,
                            vertical: false,
                            arrows: false,
                            dots: true,
                            slidesToShow: 2,
                            slidesToScroll: 1,
                            rtl: window.rtl_slick,
                            nextArrow: '<button type="button" class="slick-arrow slick-next" aria-label="'+ window.accessibility.next_slide +'">' + window.slick.nextArrow + '</button>',
                            prevArrow: '<button type="button" class="slick-arrow slick-prev" aria-label="'+ window.accessibility.previous_slide +'">' + window.slick.prevArrow + '</button>',
                            responsive: [
                                {
                                    breakpoint:1300,
                                    settings: {
                                        arrows: itemArrows,
                                        dots: itemDots,
                                        get slidesToShow() {
                                            if(itemToShow !== undefined && itemToShow !== null && itemToShow !== ''){
                                                return this.slidesToShow = itemToShow;
                                            } else {
                                                return this.slidesToShow = 1;
                                            }
                                        }
                                    }
                                },
                                {
                                    breakpoint: 767,
                                    settings: {
                                        arrows: itemArrows,
                                        dots: itemDots,
                                        get slidesToShow() {
                                            if(itemToShow !== undefined && itemToShow !== null && itemToShow !== ''){
                                                if(itemToShow == 4 || itemToShow == 5){
                                                    return this.slidesToShow = itemToShow - 1;
                                                } else {
                                                    return this.slidesToShow = itemToShow;
                                                }
                                            } else {
                                                return this.slidesToShow = 1;
                                            }
                                        }
                                    }
                                },
                                {
                                    breakpoint: 550,
                                    settings: {
                                        slidesToShow: 2,
                                        slidesToScroll: 1
                                    }
                                }
                            ]
                        });
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