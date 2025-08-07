(() => {
    var halo = {
        init: () => {
            var blockTestimonial_1 = $('[data-testimonial-block]');
            var blockTestimonial_2 = $('[data-testimonial-2-block]');

            if(blockTestimonial_1.length > 0){
                blockTestimonial_1.each((index, element) => {
                    var self = $(element),
                        sliderFor = self.find('[data-testimonial-for]'),
                        sliderNav = self.find('[data-testimonial-nav]'),
                        itemToShow = sliderFor.data('item-to-show'),
                        itemDots = sliderFor.data('item-dots'),
                        itemArrows = sliderFor.data('item-arrows');

                    if(sliderFor.length > 0){
                        if(!sliderFor.hasClass('slick-initialized')){
                            sliderFor.slick({
                                mobileFirst: true,
                                adaptiveHeight: true,
                                infinite: false,
                                vertical: false,
                                arrows: false,
                                dots: true,
                                asNavFor: sliderNav,
                                slidesToShow: 1,
                                slidesToScroll: 1,
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
                                                if(itemToShow == 5){
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
                                        slidesToShow: 3,
                                        slidesToScroll: 1
                                    }
                                },
                                {
                                    breakpoint: 550,
                                    settings: {
                                        slidesToShow: 2,
                                        slidesToScroll: 1
                                    }
                                }]
                            });
                        }
                    }

                    if(sliderNav.length > 0){
                        if(!sliderNav.hasClass('slick-initialized')){
                            sliderNav.slick({
                                fade: true,
                                arrows: false,
                                dots: false,
                                infinite: false,
                                slidesToShow: 1,
                                slidesToScroll: 1,
                                focusOnSelect: true,
                                autoplay: true,
                                autoplaySpeed: 5000,
                                asNavFor: sliderFor
                            });
                        }
                    }
                });
            }
            if(blockTestimonial_2.length > 0){
                blockTestimonial_2.each((index, element) => {
                    var self = $(element),
                        slider = self.find('[data-testimonial-content]'),
                        itemDots = slider.data('item-dots'),
                        itemArrows = slider.data('item-arrows');

                    if(slider.length > 0){
                        if(!slider.hasClass('slick-initialized')){
                            slider.slick({
                                mobileFirst: true,
                                adaptiveHeight: true,
                                arrows: false,
                                dots: true,
                                fade: true,
                                slidesToShow: 1,
                                slidesToScroll: 1,
                                nextArrow: '<button type="button" class="slick-arrow slick-next" aria-label="'+ window.accessibility.next_slide +'">' + window.slick.nextArrow + '</button>',
                                prevArrow: '<button type="button" class="slick-arrow slick-prev" aria-label="'+ window.accessibility.previous_slide +'">' + window.slick.prevArrow + '</button>',
                                responsive: [
                                {
                                    breakpoint: 550,
                                    settings: {
                                        arrows: itemArrows,
                                        dots: itemDots,
                                        slidesToShow: 1,
                                        slidesToScroll: 1
                                    }
                                }]
                            });
                        }
                    }
                });
            }
        }
    }

    halo.init();
})();