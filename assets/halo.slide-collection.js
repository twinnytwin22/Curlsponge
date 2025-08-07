(() => {
    var halo = {
        init: () => {
            var block = $('[data-featured-collection-block]');

            block.each((index, element) => {
                var slider = $(element).find('.halo-row-carousel'),
                    sliderMobile = $(element).find('.halo-row-carousel--mobile'),
                    itemToShow = slider.data('item-to-show'),
                    itemDots = slider.data('item-dots'),
                    itemArrows = slider.data('item-arrows'),
                    itemLarge = slider.data('item-large'),
                    itemDotsMobile = $(element).hasClass('has-dots--mobile') ? true : false,
                    itemArrowsMobile = $(element).hasClass('has-arrow--mobile') ? true : false ,
                    progressBar = $(element).find('.scrollbar-thumb');
                if(slider.length > 0){
                    if(sliderMobile.length > 0){
                        if(!slider.hasClass('slick-initialized')){
                            slider.on('init', (event, slick) => {  
                                var currentDot = $(".slick-dots .slick-active").index() + 1;
                                var dots = slider.find('.slick-dots li').length;

                                var percent = (currentDot / dots) * 100 + '%';
                                progressBar.css('--percent', percent);
                            });

                            slider.on('afterChange', (event, slick, nextSlide) => {  
                                var currentDot = $(".slick-dots .slick-active").index() + 1 + nextSlide;
                                var dots = slider.find('.slick-dots li').length;

                                var percent = (currentDot / dots) * 100 + '%';
                                progressBar.css('--percent', percent);
                            });

                            slider.slick({
                                mobileFirst: true,
                                adaptiveHeight: true,
                                infinite: false,
                                vertical: false,
                                arrows: itemArrowsMobile,
                                dots: progressBar ? true : itemDotsMobile,
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
                                                        if(itemLarge){
                                                            return this.slidesToShow = itemToShow - 1;
                                                        } else{
                                                            return this.slidesToShow = itemToShow;
                                                        }
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
                                        arrows: itemArrows,
                                        dots: itemDots,
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
                                        arrows: itemArrows,
                                        dots: itemDots,
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
                        if ($(window).width() >= 1025) {
                            if(!slider.hasClass('slick-initialized')){
                                slider.on('init', (event, slick) => {  
                                    var currentDot = $(".slick-dots .slick-active").index() + 1;
                                    var dots = slider.find('.slick-dots li').length;
    
                                    var percent = (currentDot / dots) * 100 + '%';
                                    progressBar.css('--percent', percent);
                                });
    
                                slider.on('afterChange', (event, slick, nextSlide) => {  
                                    var currentDot = $(".slick-dots .slick-active").index() + 1 + nextSlide;
                                    var dots = slider.find('.slick-dots li').length;
    
                                    var percent = (currentDot / dots) * 100 + '%';
                                    progressBar.css('--percent', percent);
                                });

                                slider.slick({
                                    mobileFirst: true,
                                    adaptiveHeight: true,
                                    infinite: false,
                                    vertical: false,
                                    arrows: itemArrowsMobile,
                                    dots: progressBar ? true : itemDotsMobile,
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
                                                            if(itemLarge){
                                                                return this.slidesToShow = itemToShow - 1;
                                                            } else{
                                                                return this.slidesToShow = itemToShow;
                                                            }
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
                            slider.on('init', (event, slick) => {  
                                var currentDot = $(".slick-dots .slick-active").index() + 1;
                                var dots = slider.find('.slick-dots li').length;

                                var percent = (currentDot / dots) * 100 + '%';
                                progressBar.css('--percent', percent);
                            });

                            slider.on('afterChange', (event, slick, nextSlide) => {  
                                var currentDot = $(".slick-dots .slick-active").index() + 1 + nextSlide;
                                var dots = slider.find('.slick-dots li').length;

                                var percent = (currentDot / dots) * 100 + '%';
                                progressBar.css('--percent', percent);
                            });

                            sliderMobile.slick({
                                mobileFirst: true,
                                adaptiveHeight: true,
                                infinite: false,
                                vertical: false,
                                arrows: itemArrowsMobile,
                                dots: progressBar ? true : itemDotsMobile,
                                slidesToShow: 1,
                                slidesToScroll: 1,
                                rtl: window.rtl_slick,
                                nextArrow: '<button type="button" class="slick-arrow slick-next" aria-label="'+ window.accessibility.next_slide +'">' + window.slick.nextArrow + '</button>',
                                prevArrow: '<button type="button" class="slick-arrow slick-prev" aria-label="'+ window.accessibility.previous_slide +'">' + window.slick.prevArrow + '</button>',
                                responsive: [
                                {
                                    breakpoint: 767,
                                    settings: {
                                        arrows: itemArrows,
                                        dots: itemDots,
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

                if(slider.hasClass('halo-customArrow') && itemArrows){
                    var arrowsList = $(element).find('.halo-block-header .arrows');

                    if(slider.find('.slick-arrow').length > 0) {
                        arrowsList.append(slider.find('.slick-prev'));
                        arrowsList.append(slider.find('.slick-next'));
                    }
                }
            });
        },

        gallery: () => {
            $('[data-fancybox-gallery]').on('click', (event) => {
                event.preventDefault();

                let galleryId = event.currentTarget.getAttribute('data-fancybox-gallery'),
                    gallery = window[`block_gallery_${galleryId}`]

                $.fancybox.open(gallery, {
                    loop: true,
                    thumbs: {
                        autoStart : true
                    }
                });
            });
        }
    }

    halo.init();
    halo.gallery();
})();