Shopify.ProductSwatchs = (() => {
	var config = {
		slider: '.swatch',
        onComplete: null
	}
    
    return {
    	showSwatchSlider: function(params) {
    		var params = params || {};

    		$.extend(config, params);

    		var slider = config.slider;

    		if(slider.length > 0){
    			if(!slider.hasClass('slick-initialized')){
    				slider.slick({
    					mobileFirst: true,
    					adaptiveHeight: true,
    					vertical: false,
                        infinite: false,
                        slidesToShow: 3,
                        slidesToScroll: 1,
                        arrows: true,
                        dots: false,
                        rtl: window.rtl_slick,
                        nextArrow: '<button type="button" class="slick-arrow slick-next" aria-label="'+ window.accessibility.next_slide +'">' + window.slick.nextArrow + '</button>',
                        prevArrow: '<button type="button" class="slick-arrow slick-prev" aria-label="'+ window.accessibility.previous_slide +'">' + window.slick.prevArrow + '</button>',
                        responsive:
                        [
                        	{
                                breakpoint: 1599,
                                settings: {
                                    slidesToShow: 5
                                }
                            },
                            {
                                breakpoint: 550,
                                settings: {
                                    slidesToShow: 4
                                }
                            }
                        ]
    				});
    			}
    		}
    	}
    }
})();