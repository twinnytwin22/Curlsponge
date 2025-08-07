jQuery.cookie = function(b,j,m){if(typeof j!="undefined"){m=m||{};if(j===null){j="";m.expires=-1}var e="";if(m.expires&&(typeof m.expires=="number"||m.expires.toUTCString)){var f;if(typeof m.expires=="number"){f=new Date();f.setTime(f.getTime()+(m.expires*24*60*60*1000))}else{f=m.expires}e="; expires="+f.toUTCString()}var l=m.path?"; path="+(m.path):"";var g=m.domain?"; domain="+(m.domain):"";var a=m.secure?"; secure":"";document.cookie=[b,"=",encodeURIComponent(j),e,l,g,a].join("")}else{var d=null;if(document.cookie&&document.cookie!=""){var k=document.cookie.split(";");for(var h=0;h<k.length;h++){var c=jQuery.trim(k[h]);if(c.substring(0,b.length+1)==(b+"=")){d=decodeURIComponent(c.substring(b.length+1));break}}}return d}};

Shopify.Products = (() => {
    var config = {
        howManyToShow: 3,
        howManyToStoreInMemory: 10,
        wrapperId: 'recently-viewed-products',
        templateId: 'recently-viewed-product-template',
        layout: 'slider',
        media: 'adapt',
        ratio: '125',
        action: true,
        onComplete: null
    };
    var productHandleQueue = [];
    var wrapper = null;
    var template = null;
    var shown = 0;
    var cookie = {
        configuration: {
            expires: 90,
            path: '/',
            domain: window.location.hostname
        },
        name: 'shopify_recently_viewed',
        write: (recentlyViewed) => {
            jQuery.cookie(this.name, recentlyViewed.join(' '), this.configuration);
        },
        read: () => {
            var recentlyViewed = [];
            var cookieValue = jQuery.cookie(this.name);

            if (cookieValue !== null) {
                recentlyViewed = cookieValue.split(' ');
            }
            return recentlyViewed;
        },
        destroy: function() {
            jQuery.cookie(this.name, null, this.configuration);
        },
        remove: function(productHandle) {
            var recentlyViewed = this.read();
            var position = $.inArray(productHandle, recentlyViewed);

            if (position !== -1) {
                recentlyViewed.splice(position, 1);
                this.write(recentlyViewed);
            }
        }
    };

    var finalize = () => {
        wrapper.show();

        if (config.onComplete) {
            try {
                config.onComplete();
            } catch (error) {}
        }
    };

    var moveAlong = () => {
        if (productHandleQueue.length && shown < config.howManyToShow) {
            var url = window.routes.root + `/products/${productHandleQueue[0]}?view=ajax_recently_viewed`;

            $.ajax({
                type: 'get',
                url: url,
                cache: false,
                success: (product) => {
                    wrapper.append(product);
                    productHandleQueue.shift();
                    shown++;
                    moveAlong();
                },
                error: () => {
                    cookie.remove(productHandleQueue[0]);
                    productHandleQueue.shift();
                    moveAlong();
                }
            });
        } else {
            finalize();
        }
    };

    var doAlong = () => {
        if (productHandleQueue.length) {
            var url = window.routes.root + '/collections/all';

            $.ajax({
                type: 'get',
                url: url,
                cache: false,
                data: {
                    view: 'ajax_recently_viewed',
                    constraint: `limit=${productHandleQueue.length}+layout=${config.layout}+imageRatio=${config.media}+action=${config.action}+portraitAspectRatio=${config.ratio}+sectionId=recently-viewed+list_handle=` + encodeURIComponent(productHandleQueue)
                },
                success: (data) => {
                    wrapper.append(data);
                },
                error: (xhr, text) => {
                    alert($.parseJSON(xhr.responseText).description);
                },
                complete: () => {
                    if(config.layout == 'slider'){
                        var wrapper = $('.halo-recently-viewed-block'),
                            productGrid = wrapper.find('.products-carousel'),
                            itemToShow = productGrid.data('item-to-show'),
                            itemDots = productGrid.data('item-dots'),
                            itemArrows = productGrid.data('item-arrows');

                        if(productGrid.length > 0) {
                            if(productGrid.not('.slick-initialized')) {
                                productGrid.slick({
                                    mobileFirst: true,
                                    adaptiveHeight: true,
                                    vertical: false,
                                    infinite: false,
                                    slidesToShow: 1,
                                    slidesToScroll: 1,
                                    arrows: false,
                                    dots: true,
                                    nextArrow: '<button type="button" class="slick-arrow slick-next" aria-label="'+ window.accessibility.next_slide +'">' + window.slick.nextArrow + '</button>',
                                    prevArrow: '<button type="button" class="slick-arrow slick-prev" aria-label="'+ window.accessibility.previous_slide +'">' + window.slick.prevArrow + '</button>',
                                    responsive: 
                                    [
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
                                            breakpoint: 991,
                                            settings: {
                                                slidesToShow: 4,
                                                slidesToScroll: 1
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
                                            breakpoint: 320,
                                            settings: {
                                                slidesToShow: 2,
                                                slidesToScroll: 1
                                            }
                                        }
                                    ]
                                });
                            }
                        }
                    }

                    if(window.product_swatch_style == 'slider'){
                        var product = wrapper.find('.product'),
                            productSwatch = product.find('.card-swatch--slider');

                        if(productSwatch.length > 0){
                            var swatchGrid = productSwatch.find('.swatch');

                            if(swatchGrid.length > 0){
                                if(!swatchGrid.hasClass('slick-initialized')){
                                    Shopify.ProductSwatchs.showSwatchSlider({
                                        slider: swatchGrid,
                                        onComplete: null
                                    });
                                }
                            }
                        }
                    }
                }
            });
        }
    };

    return {
        showRecentlyViewed: (params) => {
            var params = params || {};
            $.extend(config, params);
            productHandleQueue = cookie.read();
            template = config.templateId;
            wrapper = $('#' + config.wrapperId);
            config.howManyToShow = Math.min(productHandleQueue.length, config.howManyToShow);

            if (config.howManyToShow && wrapper.length) {
                if (template == 'recently-viewed-product-popup'){
                    moveAlong();
                } else {
                    doAlong();
                }
            }
        },

        recordRecentlyViewed: (params) => {
            var params = params || {};
            $.extend(config, params);
            var recentlyViewed = cookie.read();

            if (window.location.pathname.indexOf('/products/') !== -1) {
                var productHandle = $('.productView[data-product-handle]').attr('data-product-handle'),
                    position = $.inArray(productHandle, recentlyViewed);

                if (position === -1) {
                    recentlyViewed.unshift(productHandle);
                    recentlyViewed = recentlyViewed.splice(0, config.howManyToStoreInMemory);
                } else {
                    recentlyViewed.splice(position, 1);
                    recentlyViewed.unshift(productHandle);
                }

                cookie.write(recentlyViewed);
            }
        }
    };
})();