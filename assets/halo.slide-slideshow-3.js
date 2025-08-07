(() => {
    var halo = {
        init: () => {
            var block = $('[data-slideshow-block-3]');

            block.each((index, element) => {
                var self = $(element),
                    slider = self.find('.heroCarousel');
                    
                if(slider.length > 0){
                    if ($(window).width() < 767) {
                        if(!slider.hasClass('slick-initialized')){
                            slider.slick({
                                mobileFirst: true,
                                adaptiveHeight: true,
                                infinite: true,
                                dots: true,
                                arrows: false,
                                slidesToShow: 1,
                                slidesToScrol: 1,
                                fade: true,
                                rtl: window.rtl_slick,
                                speed: 900,
                                autoplay: false,
                                touchThreshold: 100,
                                cssEase: 'cubic-bezier(0.7, 0, 0.3, 1)'
                            });
                        }
                    }
                }
            });
        }
    }

    halo.init();
})();