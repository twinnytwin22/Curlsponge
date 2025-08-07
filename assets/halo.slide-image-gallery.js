(() => {
    var halo = {
        init: () => {
            var block = $('[data-image-gallery-block]'),
                block2 = $('[data-image-gallery-block-2]');

            if (block.length > 0) {
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
                                    rtl: window.rtl_slick,
                                    nextArrow: '<button type="button" class="slick-arrow slick-next" aria-label="'+ window.accessibility.next_slide +'">' + window.slick.nextArrow + '</button>',
                                    prevArrow: '<button type="button" class="slick-arrow slick-prev" aria-label="'+ window.accessibility.previous_slide +'">' + window.slick.prevArrow + '</button>',
                                    responsive: [
                                        {
                                            breakpoint: 1599,
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
                                            breakpoint: 1024,
                                            settings: {
                                                arrows: itemArrows,
                                                dots: itemDots,
                                                get slidesToShow() {
                                                    if(itemToShow !== undefined && itemToShow !== null && itemToShow !== ''){
                                                        if(itemToShow == 5 || itemToShow == 6){
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
                                            breakpoint: 767,
                                            settings: {
                                                get slidesToShow() {
                                                    if(itemToShow !== undefined && itemToShow !== null && itemToShow !== ''){
                                                        if(itemToShow == 1 || itemToShow == 2){
                                                            return this.slidesToShow = itemToShow;
                                                        } else {
                                                            return this.slidesToShow = 3;
                                                        }
                                                    } else {
                                                        return this.slidesToShow = 1;
                                                    }
                                                },
                                                slidesToScroll: 1
                                            }
                                        },
                                        {
                                            breakpoint: 550,
                                            settings: {
                                                get slidesToShow() {
                                                    if(itemToShow !== undefined && itemToShow !== null && itemToShow !== ''){
                                                        if(itemToShow == 1){
                                                            return this.slidesToShow = itemToShow;
                                                        } else {
                                                            return this.slidesToShow = 2;
                                                        }
                                                    } else {
                                                        return this.slidesToShow = 1;
                                                    }
                                                },
                                                slidesToScroll: 1
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
                                        rtl: window.rtl_slick,
                                        nextArrow: '<button type="button" class="slick-arrow slick-next" aria-label="'+ window.accessibility.next_slide +'">' + window.slick.nextArrow + '</button>',
                                        prevArrow: '<button type="button" class="slick-arrow slick-prev" aria-label="'+ window.accessibility.previous_slide +'">' + window.slick.prevArrow + '</button>',
                                        responsive: [
                                            {
                                                breakpoint: 1599,
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
                                                breakpoint: 1024,
                                                settings: {
                                                    arrows: itemArrows,
                                                    dots: itemDots,
                                                    get slidesToShow() {
                                                        if(itemToShow !== undefined && itemToShow !== null && itemToShow !== ''){
                                                            if(itemToShow == 5 || itemToShow == 6){
                                                                return this.slidesToShow = itemToShow - 1;
                                                            } else {
                                                                return this.slidesToShow = itemToShow;
                                                            }
                                                        } else {
                                                            return this.slidesToShow = 1;
                                                        }
                                                    }
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
                    } else if(sliderMobile.length > 0){
                        if (window.innerWidth < 1025) {
                            if(!sliderMobile.hasClass('slick-initialized')){
                                sliderMobile.slick({
                                    mobileFirst: true,
                                    adaptiveHeight: true,
                                    infinite: false,
                                    vertical: false,
                                    arrows: false,
                                    dots: true,
                                    slidesToShow: 1,
                                    slidesToScroll: 1,
                                    rtl: window.rtl_slick,
                                    nextArrow: '<button type="button" class="slick-arrow slick-next" aria-label="'+ window.accessibility.next_slide +'">' + window.slick.nextArrow + '</button>',
                                    prevArrow: '<button type="button" class="slick-arrow slick-prev" aria-label="'+ window.accessibility.previous_slide +'">' + window.slick.prevArrow + '</button>',
                                    responsive: [
                                    {
                                        breakpoint: 767,
                                        settings: {
                                            get slidesToShow() {
                                                if(itemToShow !== undefined && itemToShow !== null && itemToShow !== ''){
                                                    if(itemToShow == 1 || itemToShow == 2){
                                                        return this.slidesToShow = itemToShow;
                                                    } else {
                                                        return this.slidesToShow = 3;
                                                    }
                                                } else {
                                                    return this.slidesToShow = 1;
                                                }
                                            },
                                            slidesToScroll: 1
                                        }
                                    },
                                    {
                                        breakpoint: 550,
                                        settings: {
                                            get slidesToShow() {
                                                if(itemToShow !== undefined && itemToShow !== null && itemToShow !== ''){
                                                    if(itemToShow == 1){
                                                        return this.slidesToShow = itemToShow;
                                                    } else {
                                                        return this.slidesToShow = 2;
                                                    }
                                                } else {
                                                    return this.slidesToShow = 1;
                                                }
                                            },
                                            slidesToScroll: 1
                                        }
                                    }]
                                });
                            }
                        } else {
                            if(sliderMobile.hasClass('slick-initialized')){
                                sliderMobile.slick('unslick');
                            }
                        }
                    }
                });
            }

            if (block2.length > 0) {
                block2.each((index, element) => {
                    var slider = $(element).find('.halo-row-carousel'),
                        sliderMobile = $(element).find('.halo-row-carousel--mobile'),
                        itemToShow = slider.data('item-to-show'),
                        itemDots = slider.data('item-dots'),
                        itemArrows = slider.data('item-arrows'),
                        progressBar = block2.find('.scrollbar-thumb');

                    if(slider.length > 0){
                        if(sliderMobile.length > 0){
                            if(!slider.hasClass('slick-initialized')){
                                slider.on('init', (event, slick) => {
                                    var percent = ((slick.currentSlide / (slick.slideCount - 1)) * 100) + '%';
                                    progressBar.css('--percent', percent);
                                });

                                slider.slick({
                                    mobileFirst: true,
                                    adaptiveHeight: true,
                                    infinite: true,
                                    vertical: false,
                                    arrows: false,
                                    dots: false,
                                    slidesToShow: 1,
                                    slidesToScroll: 1,
                                    rtl: window.rtl_slick,
                                    nextArrow: '<button type="button" class="slick-arrow slick-next" aria-label="'+ window.accessibility.next_slide +'">' + window.slick.nextArrow + '</button>',
                                    prevArrow: '<button type="button" class="slick-arrow slick-prev" aria-label="'+ window.accessibility.previous_slide +'">' + window.slick.prevArrow + '</button>',
                                    responsive: [
                                        {
                                            breakpoint: 1599,
                                            settings: {
                                                arrows: itemArrows,
                                                dots: itemDots,
                                                get slidesToShow() {
                                                    if(itemToShow !== undefined && itemToShow !== null && itemToShow !== ''){
                                                        return this.slidesToShow = itemToShow;
                                                    } else {
                                                        return this.slidesToShow = 1;
                                                    }
                                                },
                                                get initialSlide() {
                                                    if(itemToShow == 3.5 || itemToShow == 4.5) {
                                                        return this.initialSlide = 0.5;
                                                    } else {
                                                        return this.initialSlide = 1;
                                                    }
                                                }
                                            }
                                        },
                                        {
                                            breakpoint: 1024,
                                            settings: {
                                                arrows: itemArrows,
                                                dots: itemDots,
                                                get slidesToShow() {
                                                    if(itemToShow !== undefined && itemToShow !== null && itemToShow !== ''){
                                                        if(itemToShow == 5 || itemToShow == 6){
                                                            return this.slidesToShow = itemToShow - 1;
                                                        } else {
                                                            return this.slidesToShow = itemToShow;
                                                        }
                                                    } else {
                                                        return this.slidesToShow = 1;
                                                    }
                                                },
                                                get initialSlide() {
                                                    if(itemToShow == 3.5 || itemToShow == 4.5) {
                                                        return this.initialSlide = 0.5;
                                                    } else {
                                                        return this.initialSlide = 1;
                                                    }
                                                }
                                            }
                                        },
                                        {
                                            breakpoint: 767,
                                            settings: {
                                                get slidesToShow() {
                                                    if(itemToShow !== undefined && itemToShow !== null && itemToShow !== ''){
                                                        if(itemToShow == 1 || itemToShow == 2){
                                                            return this.slidesToShow = itemToShow;
                                                        } else {
                                                            return this.slidesToShow = 3;
                                                        }
                                                    } else {
                                                        return this.slidesToShow = 2;
                                                    }
                                                },
                                                get initialSlide() {
                                                    if(itemToShow == 3.5 || itemToShow == 4.5) {
                                                        return this.initialSlide = 0.5;
                                                    } else {
                                                        return this.initialSlide = 1;
                                                    }
                                                },
                                                slidesToScroll: 1
                                            }
                                        },
                                        {
                                            breakpoint: 550,
                                            settings: {
                                                get slidesToShow() {
                                                    if(itemToShow !== undefined && itemToShow !== null && itemToShow !== ''){
                                                        if(itemToShow == 1){
                                                            return this.slidesToShow = itemToShow;
                                                        } else {
                                                            return this.slidesToShow = 2;
                                                        }
                                                    } else {
                                                        return this.slidesToShow = 2;
                                                    }
                                                },
                                                slidesToShow: 2
                                            }
                                        }
                                    ]
                                });

                                slider.on('afterChange', (event, slick, nextSlide) => {
                                    var percent = ((nextSlide / (slick.slideCount - 1)) * 100) + '%';
                                    progressBar.css('--percent', percent);
                                });
                            }
                        } else {
                            if (window.innerWidth >= 1025) {
                                if(!slider.hasClass('slick-initialized')){
                                    slider.on('init', (event, slick) => {
                                        var percent = ((slick.currentSlide / (slick.slideCount - 1)) * 100) + '%';
                                        progressBar.css('--percent', percent);
                                    });

                                    slider.slick({
                                        mobileFirst: true,
                                        adaptiveHeight: true,
                                        infinite: true,
                                        vertical: false,
                                        arrows: false,
                                        dots: false,
                                        slidesToScroll: 1,
                                        slidesToShow: 1,
                                        rtl: window.rtl_slick,
                                        nextArrow: '<button type="button" class="slick-arrow slick-next" aria-label="'+ window.accessibility.next_slide +'">' + window.slick.nextArrow + '</button>',
                                        prevArrow: '<button type="button" class="slick-arrow slick-prev" aria-label="'+ window.accessibility.previous_slide +'">' + window.slick.prevArrow + '</button>',
                                        responsive: [
                                            {
                                                breakpoint: 1599,
                                                settings: {
                                                    arrows: itemArrows,
                                                    dots: itemDots,
                                                    get slidesToShow() {
                                                        if(itemToShow !== undefined && itemToShow !== null && itemToShow !== ''){
                                                            return this.slidesToShow = itemToShow;
                                                        } else {
                                                            return this.slidesToShow = 1;
                                                        }
                                                    },
                                                    get initialSlide() {
                                                        if(itemToShow == 3.5 || itemToShow == 4.5) {
                                                            return this.initialSlide = 0.5;
                                                        } else {
                                                            return this.initialSlide = 1;
                                                        }
                                                    }
                                                }
                                            },
                                            {
                                                breakpoint: 1024,
                                                settings: {
                                                    arrows: itemArrows,
                                                    dots: itemDots,
                                                    get slidesToShow() {
                                                        if(itemToShow !== undefined && itemToShow !== null && itemToShow !== ''){
                                                            if(itemToShow == 5 || itemToShow == 6){
                                                                return this.slidesToShow = itemToShow - 1;
                                                            } else {
                                                                return this.slidesToShow = itemToShow;
                                                            }
                                                        } else {
                                                            return this.slidesToShow = 1;
                                                        }
                                                    },
                                                    get initialSlide() {
                                                        if(itemToShow == 3.5 || itemToShow == 4.5) {
                                                            return this.initialSlide = 0.5;
                                                        } else {
                                                            return this.initialSlide = 1;
                                                        }
                                                    }
                                                }
                                            }
                                        ]
                                    });

                                    slider.on('afterChange', (event, slick, nextSlide) => {
                                        var percent = ((nextSlide / (slick.slideCount - 1)) * 100) + '%';
                                        progressBar.css('--percent', percent);
                                    });
                                }
                            } else {
                                if(slider.hasClass('slick-initialized')){
                                    slider.slick('unslick');
                                }
                            }
                        }
                    } else if(sliderMobile.length > 0){
                        if (window.innerWidth < 1025) {
                            if(!sliderMobile.hasClass('slick-initialized')){
                                sliderMobile.on('init', (event, slick) => {
                                    var percent = ((slick.currentSlide / (slick.slideCount - 1)) * 100) + '%';
                                    progressBar.css('--percent', percent);
                                });

                                sliderMobile.slick({
                                    mobileFirst: true,
                                    adaptiveHeight: true,
                                    infinite: true,
                                    vertical: false,
                                    arrows: false,
                                    dots: false,
                                    slidesToShow: 1,
                                    slidesToScroll: 1,
                                    rtl: window.rtl_slick,
                                    nextArrow: '<button type="button" class="slick-arrow slick-next" aria-label="'+ window.accessibility.next_slide +'">' + window.slick.nextArrow + '</button>',
                                    prevArrow: '<button type="button" class="slick-arrow slick-prev" aria-label="'+ window.accessibility.previous_slide +'">' + window.slick.prevArrow + '</button>',
                                    responsive: [
                                    {
                                        breakpoint: 767,
                                        settings: {
                                            get slidesToShow() {
                                                if(itemToShow !== undefined && itemToShow !== null && itemToShow !== ''){
                                                    if(itemToShow == 1 || itemToShow == 2){
                                                        return this.slidesToShow = itemToShow;
                                                    } else {
                                                        return this.slidesToShow = 3;
                                                    }
                                                } else {
                                                    return this.slidesToShow = 1;
                                                }
                                            },
                                            get initialSlide() {
                                                if(itemToShow == 3.5 || itemToShow == 4.5) {
                                                    return this.initialSlide = 0.5;
                                                } else {
                                                    return this.initialSlide = 2;
                                                }
                                            },
                                            slidesToScroll: 1
                                        }
                                    },
                                    {
                                        breakpoint: 550,
                                        settings: {
                                            get slidesToShow() {
                                                if(itemToShow !== undefined && itemToShow !== null && itemToShow !== ''){
                                                    if(itemToShow == 1){
                                                        return this.slidesToShow = itemToShow;
                                                    } else {
                                                        return this.slidesToShow = 2;
                                                    }
                                                } else {
                                                    return this.slidesToShow = 2;
                                                }
                                            },
                                            slidesToShow: 2
                                        }
                                    }]
                                });

                                sliderMobile.on('afterChange', (event, slick, nextSlide) => {
                                    var percent = ((nextSlide / (slick.slideCount - 1)) * 100) + '%';
                                    progressBar.css('--percent', percent);
                                });
                            }
                        } else {
                            if(sliderMobile.hasClass('slick-initialized')){
                                sliderMobile.slick('unslick');
                            }
                        }
                    }
                });
            }
        }
    }

    $(window).on('resize', () => {
        halo.init();
    });

    halo.init();
})(jQuery);