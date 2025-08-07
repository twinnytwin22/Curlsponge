class RecentlyViewed extends HTMLElement {
	constructor() {
		super();

        this.expireDay = this.getAttribute('data-expire-day');
        this.limit = this.getAttribute('data-product-to-show');
        this.icon = this.querySelectorAll('.recently-viewed-icon');
        this.tab = this.querySelectorAll('.recently-viewed-tab');

        var popup = this;
        var shownSection = 0;

        Shopify.Products.record({
            name: 'shopify_recently_viewed_popup',
            expire: this.expireDay,
            max: 10
        });

        var list = Shopify.Products.show({
            name: 'shopify_recently_viewed_popup'
        });

        var doAlong = function () {
            if (list.length == 0){
                $(popup).addClass('is-show');
                $(popup).find('.no-products').css("display", "flex");
            } else {
                $(popup).find('.no-products').remove();
                var productHandleQueue = list;
                var url = window.routes.root + '/products/' + productHandleQueue[shownSection] + '?view=ajax_recently_viewed';

                if (productHandleQueue.length && shownSection < productHandleQueue.length && shownSection < Number(popup.getAttribute('data-product-to-show'))) { 
                    $.ajax({
                        type: 'get',
                        url: url,
                        cache: false,
                        success: function (product) {
                            $(popup).find('.products-grid').append(product);
                            shownSection++;
                            doAlong();
                        }
                    });
                } else {
                    var recentlyGrid = $(popup).find('.products-grid'),
                        productGrid = recentlyGrid.find('.item'),
                        iconNextArrow = '<button type="button" class="slick-next"><svg xmlns="http://www.w3.org/2000/svg" width="22" height="22" viewBox="0 0 24 24"><title>ic-arrow-right</title><path d="M15.111 12L8 4.889 8.889 4l8 8-8 8L8 19.111z"></path></svg></button>',
                        iconPrevArrow = '<button type="button" class="slick-prev"><svg xmlns="http://www.w3.org/2000/svg" width="22" height="22" viewBox="0 0 24 24"><title>ic-arrow-left</title><path d="M8.778 12l7.111-7.111L15 4l-8 8 8 8 .889-.889z"></path></svg></button>';

                    if (productGrid.length > 0){
                        if(recentlyGrid.is(':visible')) {
                            if (window.innerWidth < 767) {
                                if (productGrid.length > 2) {
                                    recentlyGrid.addClass('has-arrow');
                                }
                            } else{
                                if (productGrid.length > 3) {
                                    recentlyGrid.addClass('has-arrow');
                                }
                            }
                        }
                    }

                    if(!recentlyGrid.hasClass('slick-initialized')) {
                        if (productGrid.length > 2) {
                            recentlyGrid.slick({
                                infinite: false,
                                speed: 1000,
                                slidesToShow: 3,
                                dots: false,
                                arrows: true,
                                vertical: true,
                                slidesToScroll: 1,
                                adaptiveHeight: true,
                                nextArrow: iconNextArrow, 
                                prevArrow: iconPrevArrow,
                                responsive: [
                                    {
                                        breakpoint: 768,
                                        settings: {
                                            slidesToScroll: 1,
                                            slidesToShow: 1
                                        }
                                    }
                                ]
                            });
                        } else if (productGrid.length > 1) {
                            recentlyGrid.slick({
                                infinite: false,
                                speed: 1000,
                                slidesToShow: 2,
                                dots: false,
                                arrows: true,
                                vertical: true,
                                slidesToScroll: 1,
                                adaptiveHeight: true,
                                nextArrow: iconNextArrow, 
                                prevArrow: iconPrevArrow,
                                responsive: [
                                    {
                                        breakpoint: 768,
                                        settings: {
                                            slidesToScroll: 1,
                                            slidesToShow: 1
                                        }
                                    }
                                ]
                            });
                        }
                    
                        recentlyGrid.prepend('<div class="product-info"></div>');
                    }

                    popup.classList.add('is-show');

                    recentlyGrid.on('mouseenter', '.item', (event) => {
                        event.preventDefault();

                        var $currTarget = $(event.currentTarget), 
                            current = recentlyGrid.find('.slick-active'),
                            index = current.index($currTarget),
                            content = $currTarget.find('.second-info').html(),
                            productInfo = $('.product-info', recentlyGrid),
                            marginTop = Math.abs(index) * productInfo.outerHeight();

                        productInfo
                            .html(content)
                            .css('margin-top', marginTop)
                            .show();
                    });

                    recentlyGrid.on('mouseenter', '.slick-arrow', (event) => {
                        $('.product-info', recentlyGrid).hide();
                    });

                    recentlyGrid.on('click', 'a[data-mobile-click]', (event) => {
                        if (window.innerWidth < 768) {
                            event.preventDefault();
                        }
                    });
                }
            }
        }
		doAlong();

        if(this.icon.length > 0) {
            this.icon.forEach((icon) => {
                icon.addEventListener('click', this.iconClick.bind(this));
            });
        }

        document.body.addEventListener('click', this.onBodyClickEvent.bind(this));
	}

    iconClick(event){
        var $currTarget = event.currentTarget;

        if($currTarget.classList.contains('open-popup')){
            var currPopup = $currTarget.getAttribute('data-target');

            if($currTarget.classList.contains('is-open')){
                $currTarget.classList.remove('is-open');
                document.getElementById(currPopup).classList.remove('is-visible');
            } else {
                this.closeTab();

                $currTarget.classList.add('is-open');
                document.getElementById(currPopup).classList.add('is-visible');
            }
        } else if ($currTarget.classList.contains('scroll-top')) {
            this.closeTab();

            $('html, body').animate({
                scrollTop: 0
            }, 700);
        }
    }

    closeTab(){
        if(this.icon.length > 0) {
            this.icon.forEach((icon) => {
                icon.classList.remove('is-open');
            });
        }

        if(this.tab.length > 0) {
            this.tab.forEach((tab) => {
                tab.classList.remove('is-visible');
            });
        }
    }

    onBodyClickEvent(event){
        if (!this.contains(event.target)){
            this.closeTab();
        }
    }

    addMediaSize(data, limit) {
        let htmlMedia = document.createElement('div');
        htmlMedia.innerHTML = data;

        // Limit
        $(htmlMedia).find(`.item:nth-child(n+${Number(limit) + 1})`).remove();

        return $(htmlMedia).html();
    }
}

customElements.define('recently-viewed-popup', RecentlyViewed);

class RecentlyDarkMode extends HTMLElement {
    constructor() {
        super();
        this.darkMode = this.querySelector('.recently-dark-mode');

        this.checkDarkMode();
        this.darkMode.addEventListener('click', this.toggleEvent.bind(this));
    }

    toggleEvent(event){
        event.preventDefault();
        event.stopPropagation();

        var $this = event.currentTarget;
        if(!$this.classList.contains('default-dark-mode')){
            if(!$this.classList.contains('active')){
                $this.classList.add('active');
                document.body.classList.add('dark-mode');
                localStorage.setItem('theme', 'dark');
            } else {
                $this.classList.remove('active');
                document.body.classList.remove('dark-mode');
                localStorage.removeItem('theme');
            }
        } else {
            if($this.classList.contains('active')){
                $this.classList.remove('active');
                document.body.classList.remove('dark-mode');
                localStorage.setItem('theme', 'light');
            } else {
                $this.classList.add('active');
                document.body.classList.add('dark-mode');
                localStorage.removeItem('theme');
            }
        }
    }

    checkDarkMode() {
        if(!this.darkMode.classList.contains('default-dark-mode')){
            localStorage.getItem('theme') === 'dark' ? this.darkMode.classList.add('active') : this.darkMode.classList.remove('active');
        } else {
            localStorage.getItem('theme') === 'light' ? this.darkMode.classList.remove('active') : this.darkMode.classList.add('active');
        }
    }
}

customElements.define('dark-mode', RecentlyDarkMode);