(() => {
    var halo = {
        init: () => {
            var block = $('[data-announcement-bar]');

            block.each((index, element) => {
                if(!block.hasClass('slick-initialized')){
                    block.slick({
                        dots: false,
                        arrows: false,
                        infinite: true,
                        mobileFirst: true,
                        vertical: true,
                        autoplay: true,
                        autoplaySpeed: 5000,
                        slidesToShow: 1,
                        slidesToScroll: 1,
                        nextArrow: '<button type="button" class="slick-arrow slick-next" aria-label="'+ window.accessibility.next_slide +'">'+ window.slick.nextArrow +'</button>',
                        prevArrow: '<button type="button" class="slick-arrow slick-prev" aria-label="'+ window.accessibility.previous_slide +'">'+ window.slick.prevArrow +'</button>',
                        responsive: [
                            {
                                breakpoint: 768,
                                settings: {
                                    arrows: true
                                }
                            }
                        ]
                    });
                }
            });
        }
    }

    halo.init();
})();