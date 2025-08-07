(() => {
    var halo = {
        init: () => {
            var collage = $('[data-collage-2-block]');
            
            if(collage.length > 0){
                collage.each((index, element) => {
                    var self = $(element),
                        slider = self.find('[data-collage-content]');

                    if(slider.length > 0){
                        if(!slider.hasClass('slick-initialized')){
                            slider.slick({
                                mobileFirst: false,
                                adaptiveHeight: false,
                                infinite: true,
                                vertical: false,
                                arrows: false,
                                dots: true,
                                slidesToShow: 1,
                                slidesToScroll: 1,
                                speed: 500,
                                fade: true,
                                rtl: window.rtl_slick,
                                cssEase: 'linear',
                                nextArrow: '<button type="button" class="slick-arrow slick-next" aria-label="' + window.accessibility.next_slide + '">' + window.slick.nextArrow + '</button>',
                                prevArrow: '<button type="button" class="slick-arrow slick-prev" aria-label="' + window.accessibility.previous_slide + '">' + window.slick.prevArrow + '</button>',
                                responsive: [
                                    {
                                        breakpoint: 1024,
                                        settings: {
                                            dots: true,
                                            arrows: false,
                                        }
                                    }
                                ]
                            });
                        }
                    }
                });
            }
        }
    }

    halo.init();
})();