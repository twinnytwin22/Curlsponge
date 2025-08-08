(function ($) {
    var $body = $('body'),
        $doc = $(document),
        $html = $('html'),
        $win = $(window),
        w = $win.width();

    $doc.ready(() => {
        $doc.ajaxStart(() => {
            halo.isAjaxLoading = true;
        });

        $doc.ajaxStop(() => {
            halo.isAjaxLoading = false;
        });

        halo.ready();
    });

    window.onload = function() { 
        halo.init();
    }

    var halo = {
        haloTimeout: null,
        isAjaxLoading: false,
        ready: function (){
            this.loaderScript();
            this.loaderProductBlock();
            this.initResizeMenu();
            this.initMultiTab();

            if($body.hasClass('template-product')) {
                this.loaderRecommendationsBlock();
            }

            if($body.hasClass('template-page')) {
                this.initWishlistPage();
            }
        },
        init: function () {
            this.announcementBar();
            this.languageCurrency();
            this.headerSearch();
            this.headerSearchEvent();
            this.footerSearch();
            this.navSidebarMobile();
            this.navSidebarMobileToggle();
            this.navSidebarMobileTabToggle();
            this.productBlockInfiniteScroll();
            this.initGlobalCheckbox();
            this.initColorSwatch();
            this.initAddToCart();
            this.initQuickShop();
            this.initQuickCart();
            this.initBeforeYouLeave();
            this.initNotifyInStock();
            this.initCompareProduct();
            this.initQuickView();
            this.initWishlist();
            this.initLookbook();
            this.clickedActiveProductTabs();
            this.clickedActiveVideoBanner();
            this.bannerBlockCountdown();
            this.initProductCardSwapVideo();
            this.initProductCardSwatch();
            this.clickedActiveNewsletterForm();
            this.initDynamicBrowserTabTitle();

            if($body.hasClass('template-product')) {
                this.initProductView($('.halo-productView'));
                this.initProductBundle();
                this.scrollToReview();
            }

            if($body.hasClass('template-cart')){
                this.initGiftCard();
                this.initFreeShippingMessage();
            }
          
            if($body.hasClass('template-blog')) {
                this.initCollapseSidebarBlock();
                this.initCategoryActive();
                this.toggleSidebarMobile();
            }

            if($body.hasClass('template-collection') || $body.hasClass('template-search')) {
                this.initCollapseSidebarBlock();
                this.initCategoryActive();
                this.toggleSidebarMobile();
                this.initInfiniteScrolling();
                this.initQuickShopProductList();
                this.initProductCardSwatchSliderForGrid();
            }

            if(w < 551){
                this.initDropdownColumns();
            }
            
            $win.on('resize', () => {
                var resize = debounce(() => {
                    halo.headerSearch();
                }, 100);

                resize();
            });
        },
        
        checkNeedToConvertCurrency: function () {
            return (window.show_multiple_currencies && Currency.currentCurrency != shopCurrency) || window.show_auto_currency;
        },

        loaderScript: function() {
            var load = function(){
                var script = $('[data-loader-script]');

                if (script.length > 0) {
                    script.each((index, element) => {
                        var $this = $(element),
                            link = $this.data('loader-script'),
                            top = element.getBoundingClientRect().top;

                        if (!$this.hasClass('is-load')){
                            if (top < window.innerHeight + 100) {
                                halo.buildScript(link);
                                $('[data-loader-script="' + link + '"]').addClass('is-load');
                            }
                        }
                    })
                }
            }
            
            load();
            window.addEventListener('scroll', load);
        },

        buildScript: function(name) {
            var loadScript = document.createElement("script");
            loadScript.src = name;
            document.body.appendChild(loadScript);
        },

        announcementBar: function() {
            if($('[data-announcement-bar]').length > 0){
                if(!$('[data-announcement-bar]').hasClass('slick-initialized')){
                    $('[data-announcement-bar]').slick({
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
            }

            $doc.on('click', '[data-close-announcement-bar]', (event) => {
                event.preventDefault();

                var $bar = $(event.currentTarget).closest('.shopify-section');

                if($bar.length > 0){
                    $bar.remove();
                }
            });
        },

        languageCurrency: function() {
            if ($('.wrapper_language_currency').length > 0) {
                $doc.on('click', '.wrapper_language_currency .top-language-currency', (event) => {
                    $('.dropdown-language-currency').toggleClass('show');
                });

                $doc.on('click', (event) => {
                    if ($('.dropdown-language-currency').hasClass('show') && ($(event.target).closest('.wrapper_language_currency').length === 0)) {
                        $('.dropdown-language-currency').removeClass('show');
                    }
                });
            }
        },

        headerSearch: function() {
            if(!window.hidden_search_header){
                if ($win.width() < 1025) {
                    if ($('.header-mobile.header-mobile-style-3 .header-mobile-search').length > 0 ){
                        if (!$('.header-mobile-search .header__seach--details').length){
                            $('.header-mobile-search .header__search--mobile').empty();
                            $('.header .header__search').find('.header__seach--details').appendTo($('.header-mobile-search .header__search--mobile'));
                        }
                    } else {
                        if (!$('#search-form-mobile .halo-sidebar-wrapper').find('.header__seach--details').length){
                            $('#search-form-mobile .halo-sidebar-wrapper').empty();
                            $('.header .header__search').find('.header__seach--details').appendTo($('#search-form-mobile .halo-sidebar-wrapper'));
                        }
                    }
                } else {
                    if ($('.header-mobile.header-mobile-style-3 .header-mobile-search').length > 0){
                        if (!$('.header .header__search').find('.header__seach--details').length){
                            $('.header .header__search').empty();
                            $('.header-mobile.header-mobile-style-3 .header-mobile-search').find('.header__seach--details').appendTo($('.header .header__search'));
                        }
                    } else {
                        if (!$('.header .header__search').find('.header__seach--details').length){
                            $('.header .header__search').empty();
                            $('#search-form-mobile .halo-sidebar-wrapper').find('.header__seach--details').appendTo($('.header .header__search'));
                        }
                    }
                }
            }
        },

        headerSearchEvent: function(){
            var searchPC = $('.header .header__search'),
                seachMobile = $('#search-form-mobile .halo-sidebar-wrapper'),
                headerStyle3Mobile = $('.header-mobile.header-mobile-style-3 .header-mobile-search');

            if ($win.width() < 1025) {
                if ($('.header-mobile.header-mobile-style-3 .header-mobile-search').length > 0 ){
                    $('.header-mobile.header-mobile-style-3 .header-mobile-search input[name="q"]').focus(() => {
                        if(!$body.hasClass('open-search-mobile')){
                            $body.addClass('open-search');

                            $('details.header__seach--details').attr('open','true');
                        }
                    });
                }
            } else {
                if(!$body.hasClass('open-search-mobile')){
                    $doc.on('focus', '.header .header__search input[name="q"]', () => {
                        $body.addClass('open-search');
                        $('details.header__seach--details').attr('open','true');
                    });
                }

                $doc.on('click', '[data-open-search-popup]', (event) => {
                    event.preventDefault();
                    $body.addClass('open-search-popup');
                });

                $doc.on('click', '[data-close-search-popup]', (event) => {
                    event.preventDefault();
                    $body.removeClass('open-search-popup');
                });
            }
            
            $doc.on('click', '[data-close-search-popup]', (event) => {
                event.preventDefault();
                $body.removeClass('open-search');
                $('details.header__seach--details').removeAttr('open');
            });

            $doc.on('click', '[data-search-mobile]', (event) => {
                event.preventDefault();

                if(!$('#search-form-mobile .halo-sidebar-wrapper').find('.header__seach--details').length){
                    if ($('.header-mobile.header-mobile-style-3 .header-mobile-search').length > 0 ){
                        $('.header-mobile.header-mobile-style-3 .header-mobile-search').find('.header__seach--details').appendTo($('#search-form-mobile .halo-sidebar-wrapper'));
                    }
                }

                $body.addClass('open-search-mobile');
                $('details.header__seach--details').attr('open','true');
            });

            $doc.on('click', '[data-search-close-sidebar]', (event) => {
                event.preventDefault();

                if($('#search-form-mobile .halo-sidebar-wrapper').find('.header__seach--details').length > 0){
                    if ($('.header-mobile.header-mobile-style-3 .header-mobile-search').length > 0 ){
                        $('#search-form-mobile .halo-sidebar-wrapper').find('.header__seach--details').appendTo($('.header-mobile.header-mobile-style-3 .header-mobile-search'));
                    }
                }

                $body.removeClass('open-search-mobile');
                
                $('details.header__seach--details').removeAttr('open');
            });

            $doc.on('click', (event) => {
                if($body.hasClass('open-search')){
                    if($(event.target).closest('.header-mobile-search').length === 0 && $(event.target).closest('.header__search').length === 0){
                        $body.removeClass('open-search');
                        $('details.header__seach--details').removeAttr('open');
                    }
                }

                if($body.hasClass('open-search-popup')){
                    if($(event.target).closest('.header__search').length === 0){
                        $body.removeClass('open-search-popup');
                    }
                }

                if($body.hasClass('open-search-mobile')){
                    if($(event.target).closest('.halo-sidebar-search').length === 0 && $(event.target).closest('[data-search-mobile]').length === 0){
                        if($('#search-form-mobile .halo-sidebar-wrapper').find('.header__seach--details').length > 0){
                            if ($('.header-mobile.header-mobile-style-3 .header-mobile-search').length > 0 ){
                                $('#search-form-mobile .halo-sidebar-wrapper').find('.header__seach--details').appendTo($('.header-mobile.header-mobile-style-3 .header-mobile-search'));
                            }
                        }
                        $body.removeClass('open-search-mobile');

                        $('details.header__seach--details').removeAttr('open');
                    }
                }
            });
        },

        footerSearch: function(){
            if($win.width() < 1025){
                if(window.hidden_search_header && window.show_search_footer){
                    var url = window.routes.root + `/search?type=product&q=&view=ajax_search`;

                    fetch(url)
                    .then(response => response.text())
                    .then(text => {
                        const html = document.createElement('div');
                        html.innerHTML = text;

                        const search = html.querySelector('#FooterSearch');

                        if (search && search.innerHTML.trim().length) {
                            document.querySelector('#search-form-mobile .halo-sidebar-wrapper').innerHTML = search.innerHTML;
                        }
                    })
                    .catch(e => {
                        console.error(e);
                    });
                }
            }
        },

        clickedActiveNewsletterForm: function(){
            var element = $(".footer-7 .footer-block__newsletter");
            if (element.length){
                
                $doc.on("click",'.newsletter-form__field-wrapper [data-overlay-button]', (event) =>{
                    element.addClass('active');
                });

                $doc.on("click", (event) =>{
                    if(element.hasClass('active')){
                        if($(event.target).closest('.newsletter-form__field-wrapper').length === 0){
                            element.removeClass('active');
                        }     
                    }
                });
            }
        },

        initDropdownColumns: function() {
            var sectionColumnTitle = document.querySelectorAll('[data-toggle-column]');
            if(sectionColumnTitle.length){
                for (i = 0; i < sectionColumnTitle.length; i++) {
                    (function(i) {
                        sectionColumnTitle[i].addEventListener('click', (event) => {
                            var $this = event.target,
                                $content = $this.nextElementSibling;
    
                            $this.classList.toggle('is-clicked');
    
                            if ($content.style.maxHeight){
                                $content.style.maxHeight = null;
                            } else {
                                $content.style.maxHeight = $content.scrollHeight + 'px';
                            }
                        });
                    })(i);
                }
            }
        },

        initResizeMenu: function() {
            if($('[data-resize-menu]').length > 0){
                const $main = $('[data-resize-menu]'),
                    $toggle = $main.children('[data-menu-lv-toggle]'),
                    $dropdown = $toggle.find('[data-menu-lv-toggle-content]');

                const resize = () => {
                    if (!$toggle.is('.visually-hidden')) {
                        $toggle.before($dropdown.children());
                        $toggle.addClass('visually-hidden');
                    }

                    if ($win.width() <= 1024) {
                        $('#HeaderNavigation').removeClass('has-resize-menu');
                        $('#HeaderNavigation-2').removeClass('has-resize-menu');
                        return;
                    } else{
                        $('#HeaderNavigation').removeClass('has-resize-menu');
                        $('#HeaderNavigation-2').removeClass('has-resize-menu');
                    }

                    do {
                        const $lastItem = $main.children('.menu-lv-1:not(:last-child):last');

                        if($lastItem.length > 0){
                            const lastItemRight = Math.round($lastItem.offset().left - $main.offset().left + $lastItem.width());
                            const mainWidth = Math.round($main.width());

                            if ($dropdown.children().length > 0) {
                                if($toggle.length > 0){
                                    const toggleRight = Math.round($toggle.offset().left - $main.offset().left + $toggle.width());

                                    if (toggleRight > mainWidth) {
                                        $dropdown.prepend($lastItem);
                                    } else {
                                        break;
                                    }
                                }
                            } else if (lastItemRight > mainWidth) {
                                $dropdown.prepend($lastItem);
                                $toggle.removeClass('visually-hidden');
                            } else {
                                break;
                            }
                        } else{
                            break;
                        }

                    } while (true);
                };

                $win.on('resize', debounce(resize, 200));

                resize();
            }
        },

        navSidebarMobile: function() {
            $doc.on('click', '[data-mobile-menu]', (event) => {
                event.preventDefault();
                event.stopPropagation();

                var menuMobile = $('[data-navigation-mobile]'),
                    menuDesktop = $('#HeaderNavigation [data-navigation]');

                if(window.mobile_menu == 'default'){
                    if(!$('#navigation-mobile .menu-tab').length){
                        $('.header .header-menu-tab .menu-tab').appendTo('#navigation-mobile .site-nav-mobile.nav-menu-tab');
                    }

                    if(!$('#navigation-mobile .header__brands').length){
                        $('.header .header__brands').appendTo('#navigation-mobile .site-nav-mobile.nav-menu-tab');
                    }
                }

                if(!$('#navigation-mobile .dropdown-language-currency').length){
                    $('.wrapper_language_currency .dropdown-language-currency').appendTo('#navigation-mobile .site-nav-mobile.nav-currency-language');
                }

                if(window.mobile_menu == 'default' && !menuMobile.children().length){
                    menuDesktop.children().appendTo(menuMobile);
                    
                    if($('.nav-product-carousel').length > 0){
                        $('.nav-product-carousel.slick-initialized').get(0).slick.setPosition();
                    }
                }

                $body.addClass('menu-open');
            });

            $doc.on('click', '[data-menu-close-sidebar]', (event) => {
                event.preventDefault();
                event.stopPropagation();

                var menuMobile = $('[data-navigation-mobile]'),
                    menuDesktop = $('[data-navigation]');

                if(window.mobile_menu == 'default'){
                    if(!$('.header .menu-tab').length){
                        $('#navigation-mobile .site-nav-mobile.nav-menu-tab .menu-tab').appendTo('.header .header-menu-tab');
                    }

                    if(!$('.header .header__brands').length){
                        $('#navigation-mobile .site-nav-mobile.nav-menu-tab .header__brands').appendTo('.header .header-top-left');
                    }
                }

                if(!$('.wrapper_language_currency .dropdown-language-currency').length){
                    $('#navigation-mobile .site-nav-mobile .dropdown-language-currency').appendTo('.wrapper_language_currency');
                }

                menuMobile.find('li').removeClass('is-open is-hidden');

                if(window.mobile_menu == 'default' && !menuDesktop.children().length){
                    menuMobile.children().appendTo(menuDesktop);
                    
                    if($('.nav-product-carousel').length > 0){
                        $('.nav-product-carousel.slick-initialized').get(0).slick.setPosition();
                    }
                }

                $body.removeClass('menu-open');
            });

            $doc.on('click', (event) => {
                if($body.hasClass('menu-open')){
                    if (($(event.target).closest('#navigation-mobile').length === 0) && ($(event.target).closest('[data-mobile-menu]').length === 0)){
                        var menuMobile = $('[data-navigation-mobile]'),
                            menuDesktop = $('[data-navigation]');

                        if(window.mobile_menu == 'default'){
                            if(!$('.header .menu-tab').length){
                                $('#navigation-mobile .site-nav-mobile.nav-menu-tab .menu-tab').appendTo('.header .header-menu-tab');
                            }

                            if(!$('.header .header-top-left .header__brands').length){
                                $('#navigation-mobile .site-nav-mobile.nav-menu-tab .header__brands').appendTo('.header .header-top-left');
                            }

                            if(!$('.header .header__inline-customer_service .customer-service').length){
                                $('#navigation-mobile .site-nav-mobile.nav-acc .service-mb .customer-service').appendTo('.header .header__inline-customer_service');
                            }
                        }
                
                        if(!$('.wrapper_language_currency .dropdown-language-currency').length){
                            $('#navigation-mobile .site-nav-mobile .dropdown-language-currency').appendTo('.wrapper_language_currency');
                        }

                        menuMobile.find('li').removeClass('is-open is-hidden');

                        if(window.mobile_menu == 'default' && !menuDesktop.children().length){
                            menuMobile.children().appendTo(menuDesktop);
                            
                            if($('.nav-product-carousel').length > 0){
                                $('.nav-product-carousel.slick-initialized').get(0).slick.setPosition();
                            }
                        }

                        $body.removeClass('menu-open');
                    }
                }
            });
        },

        navSidebarMobileToggle: function() {
            var mainMenu = $('site-nav-mobile.nav'),
                menuMobile = mainMenu.find('.list-menu .dropdown'),
                menuMobileLabel = $('.menu-mb-title');

            $doc.on('click', '.site-nav-mobile .list-menu__item', (event) => {
                if(!event.currentTarget.classList.contains('list-menu__item--end')){
                    event.preventDefault();
                    event.stopPropagation();

                    var $target = $(event.currentTarget).closest('.dropdown');

                    $target.siblings().removeClass('is-open').addClass('is-hidden');
                    $target.removeClass('is-hidden').addClass('is-open');
                }
            });

            $doc.on('click', '.nav-title-mobile', (event) => {
                event.preventDefault();
                event.stopPropagation();

                var $target = $(event.currentTarget),
                    $parentLv1 = $target.parents('.menu-lv-1');
                    $parentLv2 = $target.parents('.menu-lv-2');
                    $parentLv3 = $target.parents('.menu-lv-3');

                if($parentLv3.length > 0){
                    $parentLv3.siblings().removeClass('is-hidden');
                    $parentLv3.removeClass('is-open');
                } else if ($parentLv2.length > 0){
                    $parentLv2.siblings().removeClass('is-hidden');
                    $parentLv2.removeClass('is-open');
                } else if ($parentLv1.length > 0){
                    $parentLv1.siblings().removeClass('is-hidden');
                    $parentLv1.removeClass('is-open');
                }
            });
        },

        navSidebarMobileTabToggle: function() {
            if(window.mobile_menu != 'default'){
                $doc.on('click', '[data-mobile-menu-tab]', (event) => {
                    event.preventDefault();
                    event.stopPropagation();

                    var tabItem = event.currentTarget.closest('li'),
                        tabTarget = event.currentTarget.dataset.target;

                    if(!tabItem.classList.contains('is-active')){

                        document.querySelector('[data-navigation-tab-mobile]').querySelectorAll('li').forEach((element) =>{
                            if(element != tabItem){
                                element.classList.remove('is-active');
                            } else {
                                element.classList.add('is-active');

                                document.querySelectorAll('[id^="MenuMobileListSection-"]').forEach((tab) =>{
                                    if(tab.getAttribute('id') == tabTarget) {
                                        tab.classList.remove('is-hidden');
                                        tab.classList.add('is-visible');
                                    } else {
                                        tab.classList.remove('is-visible');
                                        tab.classList.add('is-hidden');
                                    }
                                });
                            }
                        });
                    }
                });
            }
        },

        initMultiTab: function() {
            if($('[data-menu-tab]').length > 0){
                $doc.on('click', '[data-menu-tab] li', (event) => {
                    var active = $(event.currentTarget).data('load-page'),
                        href= $(event.currentTarget).attr('href');

                    $.cookie('page-url', active, {
                        expires: 1,
                        path: '/'
                    });
                });

                var canonical = $('[canonical-shop-url]').attr('canonical-shop-url'),
                    pageUrl = $.cookie('page-url'),
                    menuTabItem,
                    logoTabItem;

                if (document.URL != canonical) {
                    if(pageUrl != null){
                        menuTabItem = $(`[data-load-page="${pageUrl}"]`);
                        logoTabItem = $(`[data-load-logo-page="${pageUrl}"]`);
                    } else{
                        menuTabItem = $('[data-load-page].is-active');
                        logoTabItem = $('[data-load-logo-page].first');
                    }

                    var menuTab = menuTabItem.closest('[data-menu-tab]');

                    menuTabItem.addClass('is-active');
                    menuTab.find('[data-load-page]').not(menuTabItem).removeClass('is-active');
                    logoTabItem.addClass('is-active');
                    logoTabItem.siblings().removeClass('is-active');
                }

                var active = $('[data-menu-tab] li.is-active').data('load-page'),
                    check = false,
                    url = window.routes.root + `/search?type=product&q=${active}&view=ajax_mega_menu`;

                if($body.hasClass('template-index')){
                    if ($win.width() < 1025) {
                        if(window.mobile_menu == 'default'){
                            window.addEventListener('load', () => {
                                document.body.addEventListener('touchstart', () => {
                                    if (check == false) {
                                        check = true;

                                        halo.initMobileMenuDefault(url);
                                    }
                                }, false)
                            }, false);
                        } else {
                            window.addEventListener('load', () => {
                                document.body.addEventListener('touchstart', () => {
                                    if (check == false) {
                                        check = true;

                                        halo.initMobileMenuCustom();
                                    }
                                }, false)
                            }, false);
                        }
                    } else {
                        $doc.on('mousemove', () => {
                            if (check == false) {
                                check = true;

                                halo.initMenu(url);
                            }
                        });
                    }
                } else {
                    if ($win.width() < 1025) {
                        if(window.mobile_menu == 'default'){
                            window.addEventListener('load', () => {
                                document.body.addEventListener('touchstart', () => {
                                    if (check == false) {
                                        check = true;

                                        halo.initMobileMenuDefault(url);
                                    }
                                }, false)
                            }, false);
                        } else {
                            window.addEventListener('load', () => {
                                document.body.addEventListener('touchstart', () => {
                                    if (check == false) {
                                        check = true;

                                        halo.initMobileMenuCustom();
                                    }
                                }, false)
                            }, false);
                        }
                    } else {
                        if (check == false) {
                            check = true;

                            halo.initMenu(url);
                        }
                    }
                }
            } else {
                var check = false,
                    url = window.routes.root + '/search?view=ajax_mega_menu';

                if ($win.width() < 1025) {
                    if(window.mobile_menu == 'default'){
                        window.addEventListener('load', () => {
                            document.body.addEventListener('touchstart', () => {
                                if (check == false) {
                                    check = true;

                                    halo.initMobileMenuDefault(url);
                                }
                            }, false)
                        }, false);
                    } else {
                        window.addEventListener('load', () => {
                            document.body.addEventListener('touchstart', () => {
                                if (check == false) {
                                    check = true;

                                    halo.initMobileMenuCustom();
                                }
                            }, false)
                        }, false);
                    }
                } else {
                    $doc.on('mousemove', () => {
                        if (check == false) {
                            check = true;

                            halo.initMenu(url);
                        }
                    });
                }
            }

            if(window.header_transparent){
                if ($win.width() > 1024) {
                    if ($('.header__inline-menu > .list-menu').length > 0) {
                        $doc.on('mouseover', '.header__inline-menu > .list-menu', event => {
                            $body.addClass('activeHeader');
                        })
                        .on('mouseleave', '.header__inline-menu > .list-menu', event => {
                            $body.removeClass('activeHeader');
                        });
                    }
                }
            }
        },

        initMenu: function(url){
            fetch(url)
            .then(response => response.text())
            .then(text => {
                const html = document.createElement('div');
                html.innerHTML = text;

                const navigation = html.querySelector('#HeaderNavigation');

                if (navigation && navigation.innerHTML.trim().length) {
                    document.querySelector('#HeaderNavigation').innerHTML = navigation.innerHTML;

                    halo.initResizeMenu();
                    halo.sliderProductMegaMenu();
                    
                    if($('.nav-product-carousel').length > 0){
                        $('.nav-product-carousel.slick-initialized').each((index, element) => {
                            $(element).get(0).slick.setPosition();
                        });
                    }
                }
            })
            .catch(e => {
                console.error(e);
            });
        },

        initMobileMenuDefault: function(url) {
            fetch(url)
            .then(response => response.text())
            .then(text => {
                const html = document.createElement('div');
                html.innerHTML = text;

                const navigation = html.querySelector('#HeaderNavigation');

                if (navigation && navigation.innerHTML.trim().length) {
                    var menuMobile = $('[data-navigation-mobile]');

                    menuMobile.html($(navigation).find('[data-navigation]').children());

                    halo.sliderProductMegaMenu();

                    if($('.nav-product-carousel').length > 0){
                        $('.nav-product-carousel.slick-initialized').each((index, element) => {
                            $(element).get(0).slick.setPosition();
                        });
                    }
                }
            })
            .catch(e => {
                console.error(e);
            });
        },

        initMobileMenuCustom: function() {
            var menuElement = $('[data-section-type="menu"]'),
                menuMobile = $('[data-navigation-mobile]'),
                menuTabMobile = $('[data-navigation-tab-mobile]');

            const content = document.createElement('div');
            const tab = document.createElement('ul');
            
            Object.assign(tab, {
                className: 'menu-tab list-unstyled'
            });

            tab.setAttribute('role', 'menu');
            
            menuElement.each((index, element) => {
                var currentMenu = element.querySelector('template').content.firstElementChild.cloneNode(true);
                
                if(index == 0){
                    currentMenu.classList.add('is-visible'); 
                } else {
                    currentMenu.classList.add('is-hidden');
                }
                
                content.appendChild(currentMenu);
            });

            content.querySelectorAll('[id^="MenuMobileListSection-"]').forEach((element, index) => {
                var tabTitle = element.dataset.heading,
                    tabId = element.getAttribute('id'),
                    tabElement = document.createElement('li');

                Object.assign(tabElement, {
                    className: 'item'
                });

                tabElement.setAttribute('role', 'menuitem');

                if (index == 0) {
                    tabElement.classList.add('is-active');
                }

                tabElement.innerHTML = `<a class="link" href="#" data-mobile-menu-tab data-target="${tabId}">${tabTitle}</a>`;

                tab.appendChild(tabElement);
            });

            menuTabMobile.html(tab);
            menuMobile.html(content.innerHTML);
        },

        sliderProductMegaMenu: function() {
            var productBlock = $('[data-product-megamenu]');

            productBlock.each(function () {
                var self = $(this),
                    productGrid = self.find('.nav-product-carousel'),
                    itemToShow = productGrid.data('item-to-show');

                if(productGrid.length > 0){
                    if(!productGrid.hasClass('slick-initialized')){
                        productGrid.slick({
                            mobileFirst: true,
                            adaptiveHeight: true,
                            infinite: false,
                            vertical: false,
                            slidesToShow: 1,
                            slidesToScroll: 1,
                            dots: true,
                            arrows: false,
                            nextArrow: '<button type="button" class="slick-arrow slick-arrow--circle slick-next" aria-label="'+ window.accessibility.next_slide +'">' + window.slick.nextArrow + '</button>',
                            prevArrow: '<button type="button" class="slick-arrow slick-arrow--circle slick-prev" aria-label="'+ window.accessibility.previous_slide +'">' + window.slick.prevArrow + '</button>',
                            responsive: [
                            {
                                breakpoint: 1600,
                                settings: {
                                    dots: false,
                                    arrows: true,
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
                                breakpoint: 1025,
                                settings: {
                                    dots: true,
                                    arrows: false,
                                    get slidesToShow() {
                                        if(itemToShow !== undefined && itemToShow !== null && itemToShow !== ''){
                                            return this.slidesToShow = itemToShow - 1;
                                        } else {
                                            return this.slidesToShow = 1;
                                        }
                                    }
                                }
                            }]
                        });
                    }
                }
            }); 
        },
        
        clickedActiveVideoBanner: function () {
            if($('[data-video-banner]').length > 0) {
                var videoBanner = $('[data-video-banner]');

                videoBanner.each((index, element) => {
                    var self = $(element),
                        banner = self.parents('.banner-item'),
                        icon = banner.find('[data-close-video]'),
                        modal = banner.find('.modal-content-video');

                    self.off('click').on('click', (event) => {
                        event.preventDefault();
                        event.stopPropagation();

                        var dataVideo = self.data('video');

                        $('.video-banner').find('.modal-video-content').remove();
                        $('.video-banner').removeClass('open_video fixed_video');

                        if(self.hasClass('video_youtube')){
                            var templateModal = `
                                <div class="modal-video-content">
                                    <div class="video_YT video">
                                        <iframe\
                                            id="player"\
                                            type="text/html"\
                                            width="100%"\
                                            height="100%"\
                                            frameborder="0"\
                                            webkitAllowFullScreen\
                                            mozallowfullscreen\
                                            allowFullScreen\
                                            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" title="YouTube video player"\
                                            src="https://www.youtube.com/embed/${dataVideo}?autoplay=1&mute=0"\
                                            data-video-player>\
                                        </iframe>\
                                    </div>
                                </div>
                            `;   
                        } else {
                            var templateModal = `
                                <div class="modal-video-content">
                                    <div class="video">
                                        <video controls autoplay class="video">
                                            <source src="${dataVideo}">
                                        </video>
                                    </div>
                                </div>
                            `;
                        }

                        banner.find('.video-banner').addClass('open_video');
                        modal.html(templateModal);
                    });

                    icon.off('click').on('click', (event) => {
                        event.preventDefault();
                        event.stopPropagation();

                        banner.find('.modal-video-content').remove();
                        banner.find('.video-banner').removeClass('open_video fixed_video');
                    });

                    $win.on('scroll', (event) => {
                        var offsetTop = modal.offset().top,
                            height = modal.height();

                        if($(event.currentTarget).scrollTop() < offsetTop - height){
                            if(!banner.find('.video-banner').hasClass('fixed_video')){
                                banner.find('.video-banner').addClass('fixed_video');
                            }
                        } else if($(event.currentTarget).scrollTop() > offsetTop + height + 50){
                            if(!banner.find('.video-banner').hasClass('fixed_video')){
                                banner.find('.video-banner').addClass('fixed_video');
                            }
                        }
                    });
                });
            }
        },

        clickedActiveProductTabs: function () {
            if($('[data-product-tabs]').length > 0) {
                $doc.on('click', '[data-product-tabs-title]', (event) => {
                    event.preventDefault();
                    event.stopPropagation();

                    if(!event.currentTarget.classList.contains('active')) {
                        var curTab = event.currentTarget,
                            url = curTab.getAttribute('data-collection'),
                            curTabContent = document.getElementById(curTab.getAttribute('data-target')),
                            element = curTab.closest('[data-product-tabs]'),
                            tabLink = element.querySelectorAll('[data-product-tabs-title]'),
                            tabContent = element.querySelectorAll('[data-product-tabcontent]');

                        tabLink.forEach((tab) =>{
                            tab.classList.remove('active');
                        });

                        tabContent.forEach((content) =>{
                            content.classList.remove('active');
                        });

                        curTab.classList.add('active');
                        curTabContent.classList.add('active');

                        if (!curTabContent.querySelector('.products-content').classList.contains('slick-initialized')) {
                            halo.buildAjaxProductTab(element, url, false);
                        }
                    }
                });
            }

            if($('[data-product-tabs-2]').length > 0) {
                $doc.on('click', '[data-product-tabs-title-2]', (event) => {
                    event.preventDefault();
                    event.stopPropagation();

                    var curTab = event.currentTarget,
                        curTag = event.currentTarget.getAttribute('data-collection-tag'),
                        element = curTab.closest('[data-product-tabs-2]'),
                        tabLink = element.querySelectorAll('[data-product-tabs-title-2]');

                    tabLink.forEach((tab) =>{
                        tab.classList.remove('active');
                    });

                    curTab.classList.add('active');

                    halo.buildFilterProductTag(element, curTag);
                });
            }
        },

        buildAjaxProductTab: function (element, url, shuffle = false) {
            if(url != null && url != undefined) {
                var $block = $(element),
                    layout = $block.data('layout'),
                    limit = $block.data('limit'),
                    image_ratio = $block.data('image-ratio'),
                    portrait_aspect_ratio = $block.data('ratio'),
                    action = $block.data('show-add-to-cart'),
                    tabActive = $block.find('.product-tabs-content .tab-content.active'),
                    curTabContent = tabActive.find('.products-content'),
                    loading = tabActive.find('.loading'),
                    sectionId = $block.attr('sectionid') + url;

                $.ajax({
                    type: 'get',
                    url: window.routes.root + '/collections/' + url,
                    cache: false,
                    data: {
                        view: 'ajax_product_block',
                        constraint: `limit=${limit}+layout=${layout}+sectionId=${sectionId}+imageRatio=${image_ratio}+action=${action}+portraitAspectRatio=${portrait_aspect_ratio}`
                    },
                    beforeSend: function () {
                        $block.addClass('ajax-loaded');
                    },
                    success: function (data) {
                        if (url != '') {
                            curTabContent.html(data);
                        } else {
                            loading.text(window.product_tabs.no_collection).show();
                        }
                    },
                    complete: function () {
                        if (shuffle){
                            halo.productTabShuffle(element);
                        }

                        if (layout == 'slider') {
                            halo.productBlockSlider(curTabContent.parent());
                        }

                        if(window.product_swatch_style == 'slider'){
                            var productList = curTabContent.find('.product');

                            productList.each((index, element) => {
                                var product = $(element);

                                halo.initProductCardSwatchSlider(product);
                            });
                        }

                        if(window.compare.show){
                            Shopify.ProductCompare.setLocalStorageProductForCompare({
                                link: $('a[data-compare-link]'),
                                onComplete: null
                            });
                        }

                        if(window.wishlist.show){
                            Shopify.ProductWishlist.setLocalStorageProductForWishlist();
                        }

                        if (halo.checkNeedToConvertCurrency()) {
                            Currency.convertAll(window.shop_currency, $('#currencies .active').attr('data-currency'), 'span.money', 'money_format');
                        }
                    },
                    error: function (xhr, text) {
                        loading.text(window.product_tabs.error).show();
                    }
                });
            } else {
                var $block = $(element),
                    layout = $block.data('layout'),
                    tabActive = $block.find('.product-tabs-content .tab-content.active'),
                    curTabContent = tabActive.find('.products-content');

                $block.addClass('ajax-loaded');

                if (layout == 'slider') {
                    halo.productBlockSlider(curTabContent.parent());
                }

                if (halo.checkNeedToConvertCurrency()) {
                    Currency.convertAll(window.shop_currency, $('#currencies .active').attr('data-currency'), 'span.money', 'money_format');
                }
            }
        },

        buildFilterProductTag: function(block, tag){
            const id = block.getAttribute('sectionId');

            if (tag == 'all'){
               window[`shuffleInstance_${id}`].filter();
               block.querySelector('[data-product-infinite]').style.display = 'block';
            } else {
                window[`shuffleInstance_${id}`].filter((element) => {
                    var filterValue = element.getAttribute('data-tag'),
                        filterArray;

                    if(filterValue !== undefined && filterValue !== null){
                        filterArray = filterValue.split(",");
                        return filterArray.indexOf(tag) != -1;
                    }
                });

                block.querySelector('[data-product-infinite]').style.display = 'none';
            }
        },
        
        loaderProductBlock: function() {
            halo.buildProductBlock();
            halo.buildCustomFeaturedProductBlock();
            halo.buildProductTabsBlock();
        },

        buildProductBlock: function() {
            var isAjaxLoading = false;

            $doc.ajaxStart(() => {
                isAjaxLoading = true;
            });

            $doc.ajaxStop(() => {
                isAjaxLoading = false;
            });

            var productBlock = $('[data-product-block]');

            var load = () => {
                productBlock.each((index, element) => {
                    var top = element.getBoundingClientRect().top,
                        $block = $(element);

                    if (!$block.hasClass('ajax-loaded')) {
                        if(top < window.innerHeight){
                            var url = $block.data('collection'),
                                layout = $block.data('layout'),
                                limit = $block.data('limit'),
                                image_ratio = $block.data('image-ratio'),
                                portrait_aspect_ratio = $block.data('ratio'),
                                action = $block.data('show-add-to-cart'),
                                sectionId = $block.attr('sectionId');

                            if(url != null && url != undefined) {
                                $.ajax({
                                    type: 'get',
                                    url: window.routes.root + '/collections/' + url,
                                    cache: false,
                                    data: {
                                        view: 'ajax_product_block',
                                        constraint: `limit=${limit}+layout=${layout}+sectionId=${sectionId}+imageRatio=${image_ratio}+action=${action}+portraitAspectRatio=${portrait_aspect_ratio}`
                                    },
                                    beforeSend: function () {
                                        $block.addClass('ajax-loaded');
                                    },
                                    success: function (data) {
                                        if (url != '') {
                                            if (layout == 'grid') {
                                                $block.find('.products-grid').html(data);
                                            } else if (layout == 'slider'){
                                                $block.find('.products-carousel').html(data);
                                            }
                                        }
                                    },
                                    complete: function () {
                                        if (layout == 'slider') {
                                            halo.productBlockSlider($block);
                                        }

                                        // Re-initialize lazy loading for new content
                                        if (window.lazySizes) {
                                            // Force lazySizes to re-scan for new elements
                                            lazySizes.autoSizer.checkElems();
                                            // Manually check the new block for lazy images
                                            var lazyImages = $block.find('.lazyload');
                                            lazyImages.each(function() {
                                                lazySizes.loader.checkElems();
                                            });
                                        }
                                        
                                        // Alternative: trigger lazy loading check for data-src images
                                        $block.find('img[data-src]').each(function() {
                                            var $img = $(this);
                                            if ($img.attr('data-src')) {
                                                $img.attr('src', $img.attr('data-src'));
                                                $img.removeAttr('data-src');
                                                $img.removeClass('lazyload').addClass('lazyloaded');
                                            }
                                        });

                                        // Force immediate loading for images with src but lazyload class
                                        $block.find('img.lazyload[src]').each(function() {
                                            var $img = $(this);
                                            $img.removeClass('lazyload').addClass('lazyloaded');
                                            // Trigger load event manually if needed
                                            if (!$img[0].complete) {
                                                $img[0].onload = function() {
                                                    $(this).addClass('lazyloaded');
                                                };
                                            }
                                        });

                                        if(window.product_swatch_style == 'slider'){
                                            var productList = $block.find('.product');

                                            productList.each((index, element) => {
                                                var product = $(element);

                                                halo.initProductCardSwatchSlider(product);
                                            });
                                        }

                                        if(window.compare.show){
                                            Shopify.ProductCompare.setLocalStorageProductForCompare({
                                                link: $('a[data-compare-link]'),
                                                onComplete: null
                                            });
                                        }

                                        if(window.wishlist.show){
                                            Shopify.ProductWishlist.setLocalStorageProductForWishlist();
                                        }

                                        if($block.find('[data-countdown-id]').length > 0){
                                            halo.productBlockCountdown($block);
                                        }

                                        if (halo.checkNeedToConvertCurrency()) {
                                            Currency.convertAll(window.shop_currency, $('#currencies .active').attr('data-currency'), 'span.money', 'money_format');
                                        }
                                    }
                                });
                            } else {
                                $block.addClass('ajax-loaded');

                                if (layout == 'slider') {
                                    halo.productBlockSlider($block);
                                }

                                if (halo.checkNeedToConvertCurrency()) {
                                    Currency.convertAll(window.shop_currency, $('#currencies .active').attr('data-currency'), 'span.money', 'money_format');
                                }
                            }
                        }
                    }
                });
            }

            load();
            window.addEventListener('scroll', load);
        },

        buildCustomFeaturedProductBlock() {
            var productBlock = $('[data-custom-featured-product-block]');

            if(productBlock.length > 0){
                var isAjaxLoading = false;

                $doc.ajaxStart(() => {
                    isAjaxLoading = true;
                });

                $doc.ajaxStop(() => {
                    isAjaxLoading = false;
                });

                var load = () => {
                    productBlock.each((index, element) => {
                        var $block = $(element),
                            id = $block.attr('id');

                        if (!element.classList.contains('ajax-loaded')) {
                            if(check($block, -100)){
                                const content = document.createElement('div');
                                
                                content.appendChild(element.querySelector('template').content.firstElementChild.cloneNode(true));
                                element.classList.add('ajax-loaded');
                                element.querySelector('[id^="ProductSection-"]').innerHTML = content.innerHTML;
                                
                                if(element.querySelector('[id^="featured-product-option-"]')){
                                    Shopify.FeaturedProduct.onReady({
                                        block: `${id}`,
                                        onComplete: function () {
                                            document.getElementById(id).querySelectorAll('.quantity__button').forEach(
                                                (button) => button.addEventListener('click', quantity.bind(this))
                                            );

                                            if (window.Shopify && Shopify.PaymentButton) {
                                                Shopify.PaymentButton.init();
                                            }
                                        }
                                    });
                                }

                                slider($block);
                                media($block);
                                zoom($block);
                            }
                        }
                    });
                }

                var check = ($element, threshold) => {
                    var rect = $element[0].getBoundingClientRect(),
                        windowHeight = window.innerHeight || document.documentElement.clientHeight;
                  
                    threshold = threshold ? threshold : 0;

                    return (
                        rect.bottom >= (0 - (threshold / 1.5)) &&
                        rect.right >= 0 &&
                        rect.top <= (windowHeight + threshold) &&
                        rect.left <= (window.innerWidth || document.documentElement.clientWidth)
                    );
                }

                var slider = ($block) => {
                    var sliderNav = $block.find('.customProductView-nav'),
                        sliderFor = $block.find('.customProductView-for'),
                        mainDots = sliderNav.data('dot'),
                        mainArrows = sliderNav.data('arrow');

                    if(!sliderNav.hasClass('slick-initialized')){
                        sliderNav.slick({
                            fade: true,
                            arrows: mainArrows,
                            dots: mainDots,
                            infinite: true,
                            slidesToShow: 1,
                            slidesToScroll: 1,
                            get asNavFor() {
                                if(sliderFor.length){
                                    return this.asNavFor = sliderFor;
                                } else {
                                    return this.asNavFor = false;
                                }
                            },
                            nextArrow: '<button type="button" class="slick-arrow slick-arrow--circle slick-next" aria-label="'+ window.accessibility.next_slide +'">' + window.slick.nextArrow + '</button>',
                            prevArrow: '<button type="button" class="slick-arrow slick-arrow--circle slick-prev" aria-label="'+ window.accessibility.previous_slide +'">' + window.slick.prevArrow + '</button>'
                        });
                    }

                    if(sliderFor.length && !sliderFor.hasClass('slick-initialized')){
                        var numberItem;

                        numberItem = sliderFor.find('.customProductView-thumbnail').length;

                        sliderFor.slick({
                            get slidesToShow() {
                                if(numberItem !== undefined && numberItem !== null && numberItem !== ''){
                                    if(numberItem > 5){
                                        return this.slidesToShow = 5;
                                    } else if (numberItem > 3){
                                        return this.slidesToShow = 3;
                                    } else {
                                        return this.slidesToShow = 5;
                                    }
                                } else {
                                    return this.slidesToShow = 5;
                                }
                            },
                            slidesToScroll: 1,
                            asNavFor: sliderNav,
                            arrows: false,
                            dots: false,
                            focusOnSelect: true,
                            infinite: true,
                            get centerMode() {
                                if(numberItem !== undefined && numberItem !== null && numberItem !== ''){
                                    if(numberItem > 5){
                                        return this.centerMode = true;
                                    } else if (numberItem > 3){
                                        return this.centerMode = true;
                                    } else{
                                        return this.centerMode = false;
                                    }
                                } else {
                                    return this.centerMode = false;
                                }
                            },
                            centerPadding: '60px',
                            nextArrow: '<button type="button" class="slick-arrow slick-next" aria-label="'+ window.accessibility.next_slide +'">' + window.slick.nextArrow + '</button>',
                            prevArrow: '<button type="button" class="slick-arrow slick-prev" aria-label="'+ window.accessibility.previous_slide +'">' + window.slick.prevArrow + '</button>',
                            responsive: [
                            {
                                breakpoint: 768,
                                settings: {
                                    centerPadding: '40px'
                                }
                            }]
                        });
                    }
                }

                var media = ($block) => {
                    var sliderNav = $block.find('.customProductView-nav'),
                        sliderFor = $block.find('.customProductView-for');

                    if (sliderNav.find('[data-youtube]').length > 0) {
                        if (typeof window.onYouTubeIframeAPIReady === 'undefined') {
                            window.onYouTubeIframeAPIReady = halo.initYoutubeCarousel.bind(window, sliderNav);

                            const tag = document.createElement('script');
                            tag.src = 'https://www.youtube.com/player_api';
                            const firstScriptTag = document.getElementsByTagName('script')[0];
                            firstScriptTag.parentNode.insertBefore(tag, firstScriptTag);
                        } else {
                            halo.initYoutubeCarousel(sliderNav);
                        }
                    }

                    if (sliderNav.find('[data-vimeo]').length > 0) {
                        sliderNav.on('beforeChange', (event, slick) => {
                            var currentSlide,
                                player,
                                command;

                            currentSlide = $(slick.$slider).find('.slick-current');
                            player = currentSlide.find('iframe').get(0);

                            command = {
                                'method': 'pause',
                                'value': 'true'
                            };

                            if (player != undefined) {
                                player.contentWindow.postMessage(JSON.stringify(command), '*');
                            }
                        });

                        sliderNav.on('afterChange', (event, slick) => {
                            var currentSlide,
                                player,
                                command;

                            currentSlide = $(slick.$slider).find('.slick-current');
                            player = currentSlide.find('iframe').get(0);

                            command = {
                                'method': 'play',
                                'value': 'true'
                            };

                            if (player != undefined) {
                                player.contentWindow.postMessage(JSON.stringify(command), '*');
                            }
                        });
                    }

                    if (sliderNav.find('[data-mp4]').length > 0) {
                        sliderNav.on('beforeChange', (event, slick) => {
                            var currentSlide,
                                player;

                            currentSlide = $(slick.$slider).find('.slick-current');
                            player = currentSlide.find('video').get(0);

                            if (player != undefined) {
                                player.pause();
                            }
                        });

                        sliderNav.on('afterChange', (event, slick) => {
                            var currentSlide,
                                player;

                            currentSlide = $(slick.$slider).find('.slick-current');
                            player = currentSlide.find('video').get(0);

                            if (player != undefined) {
                                player.play();
                            }
                        });
                    }

                    if(sliderNav.data('variant-image-group')){
                        var inputChecked = $block.find('[data-filter]:checked');

                        if(inputChecked.length > 0){
                            var className = inputChecked.data('filter');

                            if(className !== undefined) {
                                sliderNav.slick('slickUnfilter');

                                if(sliderFor.length > 0) {
                                    sliderFor.slick('slickUnfilter');
                                }

                                if(sliderNav.find(className).length) {
                                    sliderNav.slick('slickFilter', className).slick('refresh');

                                    if(sliderFor.length > 0 && sliderFor.find(className).length) {
                                        sliderFor.slick('slickFilter', className).slick('refresh');
                                    }
                                }
                            }
                        }

                        $doc.on('change', 'input[data-filter]', (event) => {
                            var className = $(event.currentTarget).data('filter');

                            sliderNav.slick('slickUnfilter');
                            
                            if(sliderFor.length > 0) {
                                sliderFor.slick('slickUnfilter');
                            }

                            if(className !== undefined) {
                                if(sliderNav.find(className).length) {
                                    sliderNav.slick('slickFilter', className).slick('refresh');
                                    
                                    if(sliderFor.length > 0 && sliderFor.find(className).length) {
                                        sliderFor.slick('slickFilter', className).slick('refresh');
                                    }
                                }
                            }
                        });
                    }
                }

                var zoom = ($block) => {
                    var productZoom =$block.find('[data-zoom-image]');

                    if ($win.width() > 1024) {
                        productZoom.each((index, element) => {
                            var $this = $(element);
                            
                            if ($win.width() > 1024) {
                                $this.zoom({ url: $this.attr('data-zoom-image'), touch: false });
                            } else {
                                $this.trigger('zoom.destroy');
                            }
                        });
                    }
                }

                var quantity = (event) => {
                    event.preventDefault();

                    var item = event.target.closest('.customProductView'),
                        input = item.querySelector('input[name="quantity"]'),
                        previousValue = input.value;

                    event.target.name === 'plus' ? input.stepUp() : input.stepDown();

                    if (previousValue !== input.value) input.dispatchEvent(new Event('change', { bubbles: true }));
                }

                load();
                window.addEventListener('scroll', load);
            }
        },

        buildProductTabsBlock: function() {
            var isAjaxLoading = false;

            $doc.ajaxStart(() => {
                isAjaxLoading = true;
            });

            $doc.ajaxStop(() => {
                isAjaxLoading = false;
            });

            var productBlock = $('[data-product-tabs]'),
                productBlock2 = $('[data-product-tabs-2]');

            var load = function() {
                productBlock.each((index, element) => {
                    var top = element.getBoundingClientRect().top,
                        url = element.querySelector('.tab-links.active').getAttribute('data-collection');

                    if (!element.classList.contains('ajax-loaded')) {
                        if (top < window.innerHeight) {
                            halo.buildAjaxProductTab(element, url, false);
                        }
                    }
                });

                productBlock2.each((index, element) => {
                    var top = element.getBoundingClientRect().top,
                        url = element.getAttribute('data-url');

                    if (!element.classList.contains('ajax-loaded')) {
                        if (top < window.innerHeight) {
                            halo.buildAjaxProductTab(element, url, true);
                        }
                    }
                });
            }

            load();
            window.addEventListener('scroll', load);
        },

        initProductCardSwatch: function(){
            $doc.on('click', '.card-swatch--grid .link', (event) =>{
                event.preventDefault();
                event.stopPropagation();

                var swatchList = $(event.currentTarget).closest('.swatch');

                if(!swatchList.hasClass('is-expand')){
                    swatchList.addClass('is-expand');
                } else {
                    swatchList.removeClass('is-expand');
                }
            });
        },

        initProductCardSwatchSlider: function(product){
            var productSwatch = product.find('.card-swatch--slider');

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
        },

        initProductCardSwatchSliderForGrid: function(){
            if(window.product_swatch_style == 'slider'){
                if($win.width() > 1024){
                    $doc.on('mouseover', '.product', (event) => {
                        var product = $(event.currentTarget);

                        if(!product.closest('.productList').length){
                            halo.initProductCardSwatchSlider(product);
                        }
                    });
                } else {
                    var isElementVisible = ($element, threshold) => {
                        var rect = $element[0].getBoundingClientRect(),
                            windowHeight = window.innerHeight || document.documentElement.clientHeight;
                      
                        threshold = threshold ? threshold : 0;

                        return (
                            rect.bottom >= (0 - (threshold / 1.5)) &&
                            rect.right >= 0 &&
                            rect.top <= (windowHeight + threshold) &&
                            rect.left <= (window.innerWidth || document.documentElement.clientWidth)
                        );
                    };

                    $win.on('scroll', () => {
                        $('.product').each((index, element) => {
                            var product = $(element);

                            if(isElementVisible(product, -100)){
                                if(!product.closest('.productList').length){
                                    halo.initProductCardSwatchSlider(product);
                                }
                            }
                        });
                    });
                }
            }
        },

        initProductCardSwapVideo: function(){
            if(window.show_mp4_video){
                if($win.width() > 1024){
                    $doc.on('mouseover', '.product', (event) => {
                        var product = $(event.currentTarget),
                            video = product.find('video');

                        if (video.length > 0) {
                            video.get(0).play();
                        }
                    });

                    $doc.on('mouseout', '.product', (event) => {
                        var product = $(event.currentTarget),
                            video = product.find('video');

                        if (video.length > 0) {
                            video.get(0).pause();
                        }
                    });
                }
            }
        },

        loaderRecommendationsBlock: function(){
            halo.buildRecommendationBlock();
        },

        scrollToReview: function() {
            var $scope = $('#halo-product-review');

            if($scope.length){
                $doc.on('click', '.productView-details .spr-badge', (event)  => {
                    event.preventDefault();

                    $('body,html').animate({
                        scrollTop: $scope.offset().top 
                    }, 1000);
                })
            }
        },

        productTabShuffle: function(block) {
            const Shuffle = window.Shuffle;
            const element = block.querySelector('.shuffle-container');
            const id = block.getAttribute('sectionId');
            const sizer = block.querySelector('.sizer-element');
            
            window[`shuffleInstance_${id}`] = new Shuffle(element, {
                itemSelector: '.product',
                sizer: sizer,
                speed: 500
            });
        },

        productBlockSlider: function(wrapper) {
            var productGrid = wrapper.find('.products-carousel'),
                itemToShow = productGrid.data('item-to-show'),
                itemDots = productGrid.data('item-dots'),
                itemArrows = productGrid.data('item-arrows');

            if(productGrid.length > 0) {
                if(productGrid.not('.slick-initialized')) {
                    if(!wrapper.hasClass('halo-custom-product-banner')){
                        if(wrapper.hasClass('halo-product-block-2')){
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
                                        breakpoint: 1899,
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
                                        breakpoint: 1699,
                                        settings: {
                                            arrows: itemArrows,
                                            dots: itemDots,
                                            slidesToShow: 6
                                        }
                                    },
                                    {
                                        breakpoint: 1599,
                                        settings: {
                                            arrows: itemArrows,
                                            dots: itemDots,
                                            slidesToShow: 5
                                        }
                                    },
                                    {
                                        breakpoint: 1024,
                                        settings: {
                                            arrows: itemArrows,
                                            dots: itemDots,
                                            slidesToShow: 4
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
                        } else {
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
                                        breakpoint: 1399,
                                        settings: {
                                            arrows: itemArrows,
                                            dots: itemDots,
                                            get slidesToShow() {
                                                if(itemToShow !== undefined && itemToShow !== null && itemToShow !== ''){
                                                    if(itemToShow == 6){
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
                                        breakpoint: 1024,
                                        settings: {
                                            arrows: itemArrows,
                                            dots: itemDots,
                                            get slidesToShow() {
                                                if(itemToShow !== undefined && itemToShow !== null && itemToShow !== ''){
                                                    if(itemToShow == 6){
                                                        return this.slidesToShow = itemToShow - 2;
                                                    } else if(itemToShow == 5) {
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
                    } else {
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
                                    breakpoint: 1399,
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
                                }
                            ]
                        });
                    }
                }
            }
        },
        
        productBlockCountdown: function($scope){
            var wrapper = $scope.find('[data-countdown-id]'),
                countDown = wrapper.data('countdown'),
                countDownDate = new Date(countDown).getTime();

            if(wrapper.length > 0) {
                var countdownfunction = setInterval(function() {
                    var now = new Date().getTime(),
                        distance = countDownDate - now;
                    if (distance < 0) {
                        clearInterval(countdownfunction);
                        wrapper.remove();
                    } else {
                        var days = Math.floor(distance / (1000 * 60 * 60 * 24)),
                            hours = Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)),
                            minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60)),
                            seconds = Math.floor((distance % (1000 * 60)) / 1000),
                            strCountDown = '<span class="item"><span class="num">'+days+'</span><span class="text">'+ window.countdown.days +'</span></span>\
                                <span class="item"><span class="num">'+hours+'</span><span class="text">'+ window.countdown.hours +'</span></span></span>\
                                <span class="item minnute"><span class="num">'+minutes+'</span><span class="text">'+ window.countdown.mins +'</span></span></span>\
                                <span class="item second"><span class="num">'+seconds+'</span><span class="text">'+ window.countdown.secs +'</span></span></span>';

                        wrapper.html(strCountDown);
                    }
                }, 1000);
            }
        },

        bannerBlockCountdown: function () {
            if($('[data-countdown-banner]').length) {
                var countdownBanner = $('[data-countdown-banner]');

                countdownBanner.each((index, element) => {
                    var wrapper = $(element).find('[data-countdown-id]'),
                        countDown = wrapper.data('countdown'),
                        countDownDate = new Date(countDown).getTime();

                    if(wrapper.length > 0) {
                        var countdownfunction = setInterval(function() {
                            var now = new Date().getTime(),
                                distance = countDownDate - now;
                                
                            if (distance < 0) {
                                clearInterval(countdownfunction);
                                wrapper.remove();
                            } else {
                                var days = Math.floor(distance / (1000 * 60 * 60 * 24)),
                                    hours = Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)),
                                    minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60)),
                                    seconds = Math.floor((distance % (1000 * 60)) / 1000),
                                    strCountDown = '<span class="item"><span class="num">'+days+'</span><span class="text">'+ window.countdown.day +'</span></span>\
                                        <span class="item"><span class="num">'+hours+'</span></span></span>\
                                        <span class="item minnute"><span class="num">'+minutes+'</span></span></span>\
                                        <span class="item second"><span class="num">'+seconds+'</span></span></span>';

                                wrapper.html(strCountDown);
                            }
                        }, 1000);
                    }
                });
            }
        },

        productBlockInfiniteScroll: function() {
            $doc.on('click', '[data-product-infinite] > .button', (event) => {
                var element = event.currentTarget,
                    url = element.getAttribute('data-collection'),
                    text = window.button_load_more.loading;

                if (!element.classList.contains('view-all')) {
                    event.preventDefault();
                    event.stopPropagation();

                    element.classList.add('is-loading');
                    element.innerHTML = text;

                    halo.doProductBlockInfiniteScroll(element, url);
                }
            });
        },

        doProductBlockInfiniteScroll: function(element, url){
            var block = element.closest('.halo-product-block'),
                limit = parseInt(element.getAttribute('data-limit')),
                action = element.getAttribute('data-show-add-to-cart'),
                total = parseInt(element.getAttribute('data-total')),
                image_ratio = element.getAttribute('data-image-ratio'),
                portrait_aspect_ratio = element.getAttribute('data-ratio'),
                sectionId = element.getAttribute('sectionId'),
                page = parseInt(element.getAttribute('data-page')),
                text, length, shuffle, productGrid;

            $.ajax({
                type: 'get',
                url: window.routes.root + '/collections/' + url,
                cache: false,
                data: {
                    view: 'ajax_product_block_load_more',
                    constraint: `limit=${limit}+page=${page}+sectionId=${sectionId}+imageRatio=${image_ratio}+action=${action}+portraitAspectRatio=${portrait_aspect_ratio}`
                },
                beforeSend: function () {},
                success: function (data) {
                    const html = document.createElement('div');
                    html.innerHTML = data;
                    const itemsFromResponse = html.querySelectorAll('.product').length;

                    if(!block.classList.contains('halo-product-tabs')){
                        productGrid = $(block).find('.products-grid');
                        shuffle = false;

                        productGrid.append($(html).find('.product'));
                        length = block.querySelectorAll('.products-grid .product').length;
                    } else {
                        productGrid = $(block).find('.tab-content.active .products-grid');
                        shuffle = true;

                        productGrid.append($(html).find('.product'));
                        length = block.querySelectorAll('.tab-content.active .product').length;
                    }

                    if(itemsFromResponse == limit && length < 50){
                        text = window.button_load_more.default;

                        element.setAttribute('data-page', page + 1);
                        element.innerHTML = text;
                        element.classList.remove('is-loading');
                    } else {
                        if (total > 50) {
                            text = window.button_load_more.view_all;

                            element.setAttribute('href', window.routes.root + '/collections/' + url);
                            element.innerHTML = text;
                            element.classList.remove('is-loading');
                            element.classList.add('view-all');
                        } else {
                            text = window.button_load_more.no_more;

                            element.setAttribute('disabled', 'disabled');
                            element.innerHTML = text;
                            element.classList.remove('is-loading');
                        }
                    }

                    if (shuffle){
                        const allItemsInGrid = Array.from(block.querySelectorAll('.products-grid .product'));
                        const newItems = allItemsInGrid.slice(-itemsFromResponse);

                        window[`shuffleInstance_${sectionId}`].add(newItems);
                    }
                },
                complete: function () {
                    if(window.product_swatch_style == 'slider'){
                        var productList = $(block).find('.product');

                        productList.each((index, element) => {
                            var product = $(element);

                            halo.initProductCardSwatchSlider(product);
                        });
                    }

                    if(window.compare.show){
                        Shopify.ProductCompare.setLocalStorageProductForCompare({
                            link: $('a[data-compare-link]'),
                            onComplete: null
                        });
                    }

                    if(window.wishlist.show){
                        Shopify.ProductWishlist.setLocalStorageProductForWishlist();
                    }

                    if (halo.checkNeedToConvertCurrency()) {
                        Currency.convertAll(window.shop_currency, $('#currencies .active').attr('data-currency'), 'span.money', 'money_format');
                    }
                }
            });
        },

        buildRecommendationBlock: function(){
            var $this = document.querySelector('[data-recommendations-block]'),
                layout = $this.dataset.layout;

            fetch($this.dataset.url)
            .then(response => response.text())
            .then(text => {
                const html = document.createElement('div');
                html.innerHTML = text;
                const recommendations = html.querySelector('[data-recommendations-block]');
                if (recommendations && recommendations.innerHTML.trim().length) {
                    $this.innerHTML = recommendations.innerHTML;

                    if (layout == 'slider') {
                        halo.productBlockSlider($($this));
                    }

                    if(window.product_swatch_style == 'slider'){
                        var productList = $($this).find('.product');

                        productList.each((index, element) => {
                            var product = $(element);

                            halo.initProductCardSwatchSlider(product);
                        });
                    }

                    if(window.compare.show){
                        Shopify.ProductCompare.setLocalStorageProductForCompare({
                            link: $('a[data-compare-link]'),
                            onComplete: null
                        });
                    }

                    if(window.wishlist.show){
                        Shopify.ProductWishlist.setLocalStorageProductForWishlist();
                    }

                    if (halo.checkNeedToConvertCurrency()) {
                        Currency.convertAll(window.shop_currency, $('#currencies .active').attr('data-currency'), 'span.money', 'money_format');
                    }
                }
            })
            .catch(e => {
                console.error(e);
            });
        },

        initGlobalCheckbox: function() {
            $doc.on('change', '.global-checkbox--input', (event) => {
                var targetId = event.target.getAttribute('data-target');

                if(event.target.checked){
                    $(targetId).attr('disabled', false);
                } else{
                    $(targetId).attr('disabled', true);
                }
            });

            $doc.on('click', '[data-open-global-checkbox]', (event) => {
                event.preventDefault();
                event.stopPropagation();
                 $body.addClass('global-checkbox-show');
            });
            
            $doc.on('click', '[data-close-global-checkbox]', (event) => {
                event.preventDefault();
                event.stopPropagation();

                $body.removeClass('global-checkbox-show');
            });

            $doc.on('click', (event) => {
                if($body.hasClass('global-checkbox-show')){
                    if (($(event.target).closest('[data-open-global-checkbox]').length === 0) && ($(event.target).closest('#halo-global-checkboxt-popup').length === 0)){
                        $body.removeClass('global-checkbox-show');
                    }
                }
            });
        },

        initColorSwatch: function() {
            if(window.product_swatch){
                $doc.on('click', '.card .swatch-label', (event) => {
                    var $target = $(event.currentTarget),
                        title = $target.attr('title').replace(/^\s+|\s+$/g, ''),
                        product = $target.closest('.product-item'),
                        productJson = product.data('json-product'),
                        productTitle = product.find('.card-title'),
                        productAction = product.find('[data-btn-addtocart]'),
                        variantId = $target.data('variant-id'),
                        productHref = product.find('a').attr('href'),
                        oneOption = $target.data('with-one-option'),
                        newImage = $target.data('variant-img'),
                        mediaList = []; 

                    $target.parents('.swatch').find('.swatch-label').removeClass('is-active');
                    $target.addClass('is-active');

                    if(window.enable_swatch_name){
                        if(productTitle.hasClass('card-title-change')){
                            productTitle.find('[data-change-title]').text(' - ' + title);
                        } else {
                            productTitle.addClass('card-title-change').append('<span data-change-title> - ' + title + '</span>');
                        }
                    }

                    product.find('a:not(.single-action)').attr('href', productHref.split('?variant=')[0]+'?variant='+ variantId);

                    if (oneOption != undefined) {
                        var quantity = $target.data('quantity');

                        product.find('[name="id"]').val(oneOption);

                        if (quantity > 0) {
                            if(window.notify_me.show){
                                productAction
                                    .removeClass('is-notify-me')
                                    .addClass('is-visible');
                            } else {
                                productAction
                                    .removeClass('is-soldout')
                                    .addClass('is-visible');
                            }
                        } else {
                           if(window.notify_me.show){
                                productAction
                                    .removeClass('is-visible')
                                    .addClass('is-notify-me');
                            } else {
                                productAction
                                    .removeClass('is-visible')
                                    .addClass('is-soldout');
                            }
                        }

                        if(productAction.hasClass('is-soldout') || productAction.hasClass('is-notify-me')){
                            if(!productAction.hasClass('action-icon')){
                                if(productAction.hasClass('is-notify-me')){
                                    productAction.text(window.notify_me.button);
                                } else {
                                    productAction
                                        .text(window.variantStrings.soldOut)
                                        .prop('disabled', true);
                                }
                            } else {
                                if(productAction.hasClass('is-notify-me')){
                                    productAction
                                        .find('.text')
                                        .text(window.notify_me.button);
                                    productAction
                                        .find('.icon')
                                        .remove();
                                    productAction
                                        .append('<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" aria-hidden="true" focusable="false" role="presentation" class="icon icon-mail"><path d="M 1 3 L 1 5 L 1 18 L 3 18 L 3 5 L 19 5 L 19 3 L 3 3 L 1 3 z M 5 7 L 5 7.1777344 L 14 12.875 L 23 7.125 L 23 7 L 5 7 z M 23 9.2832031 L 14 15 L 5 9.4160156 L 5 21 L 14 21 L 14 17 L 17 17 L 17 14 L 23 14 L 23 9.2832031 z M 19 16 L 19 19 L 16 19 L 16 21 L 19 21 L 19 24 L 21 24 L 21 21 L 24 21 L 24 19 L 21 19 L 21 16 L 19 16 z"/></svg>');
                                } else {
                                    productAction
                                        .find('.text')
                                        .text(window.variantStrings.soldOut);
                                    productAction
                                        .prop('disabled', true);
                                }
                            }
                        } else {
                            if(!productAction.hasClass('action-icon')){
                                productAction
                                    .text(window.variantStrings.addToCart)
                                    .prop('disabled', false);
                            } else {
                                productAction
                                    .find('.text')
                                    .text(window.variantStrings.addToCart);
                                productAction
                                    .find('.icon')
                                    .remove();
                                productAction
                                    .append('<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" class="icon icon-cart" aria-hidden="true" focusable="false" role="presentation"><path d="M 4.4140625 1.9960938 L 1.0039062 2.0136719 L 1.0136719 4.0136719 L 3.0839844 4.0039062 L 6.3789062 11.908203 L 5.1816406 13.824219 C 4.7816406 14.464219 4.7609531 15.272641 5.1269531 15.931641 C 5.4929531 16.590641 6.1874063 17 6.9414062 17 L 19 17 L 19 15 L 6.9414062 15 L 6.8769531 14.882812 L 8.0527344 13 L 15.521484 13 C 16.248484 13 16.917531 12.604703 17.269531 11.970703 L 20.873047 5.4863281 C 21.046047 5.1763281 21.041328 4.7981875 20.861328 4.4921875 C 20.681328 4.1871875 20.352047 4 19.998047 4 L 5.25 4 L 4.4140625 1.9960938 z M 6.0820312 6 L 18.298828 6 L 15.521484 11 L 8.1660156 11 L 6.0820312 6 z M 7 18 A 2 2 0 0 0 5 20 A 2 2 0 0 0 7 22 A 2 2 0 0 0 9 20 A 2 2 0 0 0 7 18 z M 17 18 A 2 2 0 0 0 15 20 A 2 2 0 0 0 17 22 A 2 2 0 0 0 19 20 A 2 2 0 0 0 17 18 z"/></svg>')
                                    .prop('disabled', false);
                            }
                        }
                    } else {
                        if (productJson != undefined) {
                            if(window.quick_shop.show){
                                halo.checkStatusSwatchQuickShop(product, productJson);
                            }
                        }

                        product.find('.swatch-element[data-value="'+ title +'"]').find('.single-label').trigger('click');
                    }

                    if (productJson != undefined) {
                        var mediaList = productJson.media.filter((index, element) => {
                            return element.alt === title;
                        });
                    }

                    if (mediaList.length > 0) {
                        if (mediaList.length > 1) {
                            var length = 2;
                        } else {
                            var length = mediaList.length;
                        }

                        for (var i = 0; i < length; i++) {
                            product.find('.card-media img:eq('+ i +')').attr('srcset', mediaList[i].src);
                        }
                    } else {
                        if (newImage) {
                            product.find('.card-media img:nth-child(1)').attr('srcset', newImage);
                        }
                    }
                });

                if($win.width() > 1024){
                    $doc.on('mouseover', '.card-swatch--slider', (event) => {
                        var $target = $(event.currentTarget);

                        $target.parents('.card-product').addClass('card-swatch-hover');
                    });
                    
                    $doc.on('mouseout', '.card-swatch--slider', (event) => {
                        var $target = $(event.currentTarget);
                        
                        $target.parents('.card-product').removeClass('card-swatch-hover');
                    });
                }
            }
        },

        initQuickShop: function() {
            if(window.quick_shop.show) {
                $doc.on('click', '[data-quickshop-popup]', (event) => {
                    event.preventDefault();
                    event.stopPropagation();

                    var $target = $(event.target),
                        product = $target.parents('.product-item'),
                        productJson = product.data('json-product'),
                        variantPopup = product.find('.variants-popup');

                    if(!product.hasClass('quickshop-popup-show')){
                        $('.product-item').removeClass('quickshop-popup-show');

                        product.addClass('quickshop-popup-show');

                        if(!$target.hasClass('is-unavailable')){
                            halo.initQuickShopPopup(product, variantPopup, productJson);
                        }
                    } else {
                        halo.initAddToCartQuickShop($target, variantPopup);
                    }
                });

                $doc.on('click', '[data-cancel-quickshop-popup]', (event) => {
                    event.preventDefault();
                    event.stopPropagation();

                    var $target = $(event.currentTarget),
                        product = $target.parents('.product-item');

                    product.removeClass('quickshop-popup-show');
                });

                $doc.on('click', (event) => {
                    if ($(event.target).closest('[data-quickshop-popup]').length === 0 && $(event.target).closest('.variants-popup').length === 0 && $(event.target).closest('.card-swatch').length === 0){
                        $('.product-item').removeClass('quickshop-popup-show');
                    }
                });

                halo.changeSwatchQuickShop();
            }
        },

        initQuickShopPopup: function(product, variantPopup, productJson) {
            if(!variantPopup.hasClass('ajax-loaded')) {
                const content = variantPopup.find('template').html();

                variantPopup.html(content);

                if(window.product_swatch){
                    product.find('.swatch-label.is-active').trigger('click');
                } else {
                    product.find('.swatch-element.available').eq('0').find('.single-label').trigger('click');
                }

                halo.checkStatusSwatchQuickShop(product, productJson);

                variantPopup.find('.selector-wrapper:not(.option-color)').each((index, element) => {
                    $(element).find('.swatch-element:not(.soldout):not(.unavailable)').eq('0').find('.single-label').trigger('click');
                });

                variantPopup.addClass('ajax-loaded');
            } else {
                if(window.product_swatch){
                    product.find('.swatch-label.is-active').trigger('click');
                } else {
                    product.find('.swatch-element.available').eq('0').find('.single-label').trigger('click');
                }

                halo.checkStatusSwatchQuickShop(product, productJson);

                variantPopup.find('.selector-wrapper:not(.option-color)').each((index, element) => {
                    $(element).find('.swatch-element:not(.soldout):not(.unavailable)').eq('0').find('.single-label').trigger('click');
                });
            }
        },

        changeSwatchQuickShop: function () {
            $doc.on('change', '[data-quickshop] .single-option', (event) => {
                if(!$(event.target).parents('.swatch-element').hasClass('unavailable')){
                    var $target = $(event.target),
                        product = $target.parents('.product-item'),
                        productJson = product.data('json-product'),
                        variantList,
                        optionColor = product.find('.option-color').data('option-position'),
                        optionIndex = $target.closest('[data-option-index]').data('option-index'),
                        swatch = product.find('.swatch-element'),
                        thisVal = $target.val(),
                        selectedVariant,
                        productInput = product.find('[name=id]'),
                        productAction = product.find('[data-quickshop-popup]'),
                        productInternalAction = product.find('.variants-popup [data-btn-addtocart]'),
                        selectedOption1 = product.find('.selector-wrapper-1').find('input:checked').val(),
                        selectedOption2 = product.find('.selector-wrapper-2').find('input:checked').val(),
                        selectedOption3 = product.find('.selector-wrapper-3').find('input:checked').val();

                    if (productJson != undefined) {
                        variantList = productJson.variants;
                    }

                    swatch.removeClass('soldout');
                    swatch.find('input[type="radio"]').prop('disabled', false);

                    switch (optionIndex) {
                        case 0:
                            var availableVariants = variantList.find((variant) => {
                                if (optionColor == 1) {
                                    return variant.option2 == thisVal && variant.option1 == selectedOption2;
                                } else {
                                    if (optionColor == 2) {
                                        return variant.option3 == thisVal && variant.option1 == selectedOption2;
                                    } else {
                                        return variant.option1 == thisVal && variant.option2 == selectedOption2;
                                    }
                                }
                            });

                            if(availableVariants != undefined){
                                selectedVariant = availableVariants;
                            } else{
                                var altAvailableVariants = variantList.find((variant) => {
                                    if (optionColor == 1) {
                                        return variant.option2 == thisVal;
                                    } else {
                                        if (optionColor == 2) {
                                            return variant.option3 == thisVal;
                                        } else {
                                            return variant.option1 == thisVal;
                                        }
                                    }
                                });

                                selectedVariant = altAvailableVariants;
                            }

                            break;
                        case 1:
                            var availableVariants = variantList.find((variant) => {
                                if (optionColor == 1) {
                                    return variant.option2 == selectedOption1 && variant.option1 == thisVal && variant.option3 == selectedOption2;
                                } else {
                                    if (optionColor == 2) {
                                        return variant.option3 == selectedOption1 && variant.option1 == thisVal && variant.option2 == selectedOption2;
                                    } else {
                                        return variant.option1 == selectedOption1 && variant.option2 == thisVal && variant.option3 == selectedOption2;
                                    }
                                }
                            });

                            if(availableVariants != undefined){
                                selectedVariant = availableVariants;
                            } else {
                                var altAvailableVariants = variantList.find((variant) => {
                                    if (optionColor == 1) {
                                        return variant.option2 == selectedOption1 && variant.option1 == thisVal;
                                    } else {
                                        if (optionColor == 2) {
                                            return variant.option3 == selectedOption1 && variant.option1 == thisVal;
                                        } else {
                                            return variant.option1 == selectedOption1 && variant.option2 == thisVal;
                                        }
                                    }
                                });

                                selectedVariant = altAvailableVariants;
                            }

                            break;
                        case 2:
                            var availableVariants = variantList.find((variant) => {
                                if (optionColor == 1) {
                                    return variant.option2 == selectedOption1 && variant.option1 == selectedOption2 && variant.option3 == thisVal;
                                } else {
                                    if (optionColor == 2) {
                                        return variant.option3 == selectedOption1 && variant.option1 == selectedOption2 && variant.option2 == thisVal;
                                    } else {
                                        return variant.option1 == selectedOption1 && variant.option2 == selectedOption2 && variant.option3 == thisVal;
                                    }
                                }
                            });

                            if(availableVariants != undefined){
                                selectedVariant = availableVariants;
                            }

                            break;
                    }

                    if (selectedVariant == undefined) {
                        return;
                    }

                    productInput.val(selectedVariant.id);

                    if(productAction.hasClass('disabled')){
                        if(!productAction.hasClass('action-icon')){
                            productAction
                                .text(window.variantStrings.addToCart)
                                .removeClass('disabled is-unavailable');
                        } else {
                            productAction
                                .find('.text')
                                .text(window.variantStrings.addToCart);
                            productAction.removeClass('disabled is-unavailable');
                        }

                        productInternalAction
                            .text(window.variantStrings.addToCart)
                            .removeClass('disabled is-unavailable');
                    }

                    halo.checkStatusSwatchQuickShop(product, productJson);
                } else {
                    var $target = $(event.target),
                        product = $target.parents('.product-item'),
                        productAction = product.find('[data-quickshop-popup]'),
                        productInternalAction = product.find('.variants-popup [data-btn-addtocart]');

                    if(!productAction.hasClass('action-icon')){
                        productAction
                            .text(window.variantStrings.unavailable)
                            .addClass('disabled is-unavailable');
                    } else{
                        productAction
                            .find('.text')
                            .text(window.variantStrings.unavailable);
                        productAction.addClass('disabled is-unavailable');
                    }

                    productInternalAction
                        .text(window.variantStrings.unavailable)
                        .addClass('disabled is-unavailable');
                }
            });
        },

        checkStatusSwatchQuickShop: function(product, productJson){
            var variantPopup = product.find('.card-variant'),
                variantList,
                productOption = product.find('[data-option-index]'),
                optionColor = product.find('.option-color').data('option-position'),
                selectedOption1 = product.find('[data-option-index="0"]').find('input:checked').val(),
                selectedOption2 = product.find('[data-option-index="1"]').find('input:checked').val(),
                selectedOption3 = product.find('[data-option-index="2"]').find('input:checked').val();

            if (productJson != undefined) {
                variantList = productJson.variants;
            }

            productOption.each((index, element) => {
                var optionIndex = $(element).data('option-index'),
                    swatch = $(element).find('.swatch-element');

                switch (optionIndex) {
                    case 0:
                        swatch.each((idx, elt) => {
                            var item = $(elt),
                                swatchVal = item.data('value');

                            var optionSoldout = variantList.find((variant) => {
                                if (optionColor == 1) {
                                    return variant.option2 == swatchVal && variant.available;
                                } else {
                                    if (optionColor == 2) {
                                        return variant.option3 == swatchVal && variant.available;
                                    } else {
                                        return variant.option1 == swatchVal && variant.available;
                                    }
                                }
                            });

                            var optionUnavailable = variantList.find((variant) => {
                                if (optionColor == 1) {
                                    return variant.option2 == swatchVal;
                                } else {
                                    if (optionColor == 2) {
                                        return variant.option3 == swatchVal;
                                    } else {
                                        return variant.option1 == swatchVal;
                                    }
                                }
                            });

                            if(optionSoldout == undefined){
                                if (optionUnavailable == undefined) {
                                    item.removeClass('soldout available').addClass('unavailable');
                                    item.find('input[type="radio"]').prop('checked', false);
                                } else {
                                    item
                                        .removeClass('unavailable available')
                                        .addClass('soldout')
                                        .find('.single-action')
                                        .attr('data-variant-id', optionUnavailable.title);
                                    item.find('input[type="radio"]').prop('checked', false);
                                    item.find('input[type="radio"]').prop('disabled', false);
                                }
                            } else {
                                item.removeClass('soldout unavailable').addClass('available');
                                item.find('input[type="radio"]').prop('disabled', false);
                            }
                        });

                        break;
                    case 1:
                        swatch.each((idx, elt) => {
                            var item = $(elt),
                                swatchVal = item.data('value');

                            var optionSoldout = variantList.find((variant) => {
                                if (optionColor == 1) {
                                    return variant.option2 == selectedOption1 && variant.option1 == swatchVal && variant.available;
                                } else {
                                    if (optionColor == 2) {
                                        return variant.option3 == selectedOption1 && variant.option1 == swatchVal && variant.available;
                                    } else {
                                        return variant.option1 == selectedOption1 && variant.option2 == swatchVal && variant.available;
                                    }
                                }
                            });

                            var optionUnavailable = variantList.find((variant) => {
                                if (optionColor == 1) {
                                    return variant.option2 == selectedOption1 && variant.option1 == swatchVal;
                                } else {
                                    if (optionColor == 2) {
                                        return variant.option3 == selectedOption1 && variant.option1 == swatchVal;
                                    } else {
                                        return variant.option1 == selectedOption1 && variant.option2 == swatchVal;
                                    }
                                }
                            });

                            if(optionSoldout == undefined){
                                if (optionUnavailable == undefined) {
                                    item.removeClass('soldout available').addClass('unavailable');
                                    item.find('input[type="radio"]').prop('checked', false);
                                } else {
                                    item
                                        .removeClass('unavailable available')
                                        .addClass('soldout')
                                        .find('.single-action')
                                        .attr('data-variant-id', optionUnavailable.title);
                                    item.find('input[type="radio"]').prop('disabled', false);

                                    if(item.find('input[type="radio"]:checked').length) {
                                        item.find('input[type="radio"]').prop('checked', false);
                                        item.siblings('.swatch-element.available:eq(0)').find('.single-option').prop('checked', true);
                                        item.siblings('.swatch-element.available:eq(0)').find('.single-option').trigger('change');
                                    }
                                }
                            } else {
                                item.removeClass('soldout unavailable').addClass('available');
                                item.find('input[type="radio"]').prop('disabled', false);
                            }
                        });

                        break;
                    case 2:
                        swatch.each((idx, elt) => {
                            var item = $(elt),
                                swatchVal = item.data('value');

                            var optionSoldout = variantList.find((variant) => {
                                if (optionColor == 1) {
                                    return variant.option2 == selectedOption1 && variant.option1 == selectedOption2 && variant.option3 == swatchVal && variant.available;
                                } else {
                                    if (optionColor == 2) {
                                        return variant.option3 == selectedOption1 && variant.option1 == selectedOption2 && variant.option2 == swatchVal && variant.available;
                                    } else {
                                        return variant.option1 == selectedOption1 && variant.option2 == selectedOption2 && variant.option3 == swatchVal && variant.available;
                                    }
                                }
                            });

                            var optionUnavailable = variantList.find((variant) => {
                                if (optionColor == 1) {
                                    return variant.option2 == selectedOption1 && variant.option1 == selectedOption2 && variant.option3 == swatchVal;
                                } else {
                                    if (optionColor == 2) {
                                        return variant.option3 == selectedOption1 && variant.option1 == selectedOption2 && variant.option2 == swatchVal;
                                    } else {
                                        return variant.option1 == selectedOption1 && variant.option2 == selectedOption2 && variant.option3 == swatchVal;
                                    }
                                }
                            });

                            if(optionSoldout == undefined){
                                if (optionUnavailable == undefined) {
                                    item.removeClass('soldout available').addClass('unavailable');
                                    item.find('input[type="radio"]').prop('checked', false);
                                } else {
                                    item
                                        .removeClass('unavailable available')
                                        .addClass('soldout')
                                        .find('.single-action')
                                        .attr('data-variant-id', optionUnavailable.title);
                                    
                                    item.find('input[type="radio"]').prop('disabled', false);

                                    if(item.find('input[type="radio"]:checked').length) {
                                        item.find('input[type="radio"]').prop('checked', false);
                                        item.siblings('.swatch-element.available:eq(0)').find('.single-option').prop('checked', true);
                                        item.siblings('.swatch-element.available:eq(0)').find('.single-option').trigger('change');
                                    }
                                }
                            } else {
                                item.removeClass('unavailable soldout').addClass('available');
                                item.find('input[type="radio"]').prop('disabled', false);
                            }
                        });

                        break;
                }
            });

            variantPopup.find('.selector-wrapper:not(.option-color)').each((index, element) => {
                var item = $(element);

                if (item.find('.swatch-element').find('input:checked').length < 1) {
                    if (item.find('.swatch-element.available').length > 0) {
                        item.find('.swatch-element.available').eq('0').find('.single-label').trigger('click');
                    } else {
                        item.find('.swatch-element.soldout').eq('0').find('.single-label').trigger('click');
                    }
                }
            });
        },

        initAddToCartQuickShop: function($target, popup){
            var variantId = popup.find('[name="id"]').val(),
                qty = 1;

            halo.actionAddToCart($target, variantId, qty);
        },

        initQuickShopProductList: function() {
            $doc.on('click', '[data-open-quickshop-popup-list]', (event) => {
                event.preventDefault();
                event.stopPropagation();

                var handle = $(event.currentTarget).data('product-handle'),
                    product = $(event.currentTarget).closest('.card');

                if(!product.hasClass('quick-shop-show')){
                    halo.updateContentQuickShop(product, handle);
                }
            });

            $doc.on('click', '[data-close-quickshop-popup-list]', (event) => {
                event.preventDefault();
                event.stopPropagation();

                var product = $(event.currentTarget).closest('.card');

                product.removeClass('quick-shop-show');
                product.find('.card-popup-content').empty();
            });

            $doc.on('click', (event) => {
                if($('.card').hasClass('quick-shop-show')){
                    if (($(event.target).closest('[data-open-quickshop-popup-list]').length === 0) && ($(event.target).closest('.card-popup').length === 0)){
                        $('.card').removeClass('quick-shop-show');
                        $('.card').find('.card-popup-content').empty();
                    }
                }
            });
        },

        updateContentQuickShop: function(product, handle) {
            var popup = product.find('.card-popup'),
                popupContent = popup.find('.card-popup-content');

            $.ajax({
                type: 'get',
                url: window.routes.root + '/products/' + handle + '?view=ajax_quick_shop',
                beforeSend: function () {
                    $('.card').removeClass('quick-shop-show');
                },
                success: function (data) {
                    popupContent.append(data);
                },
                error: function (xhr, text) {
                    alert($.parseJSON(xhr.responseText).description);
                },
                complete: function () {
                    product.addClass('quick-shop-show');
                }
            });
        },

        initAddToCart: function() {
            $doc.on('click', '[data-btn-addtocart]', (event) => {
                event.preventDefault();
                event.stopPropagation();

                var $target = $(event.currentTarget);

                $body.removeClass('cart-upsell-show add-to-cart-show');

                if($target.closest('product-form').length > 0){
                    var productForm = $target.closest('form');

                    halo.actionAddToCart2($target, productForm);
                } else {
                    if(!$target.hasClass('is-notify-me') && !$target.hasClass('is-soldout')){
                        var form = $target.parents('form'),
                            variantId = form.find('[name="id"]').val(),
                            qty = form.find('[name="quantity"]').val();

                        if(qty == undefined){
                            qty = 1;
                        }

                        if(variantId == undefined){
                            return;
                        }

                        halo.actionAddToCart($target, variantId, qty);
                    } else if($target.hasClass('is-notify-me')){
                        halo.notifyInStockPopup($target);
                    }
                }
            });

            $doc.on('click', '[data-close-add-to-cart-popup]', (event) => {
                event.preventDefault();
                event.stopPropagation();

                $body.removeClass('add-to-cart-show');
            });

            $doc.on('click', '[data-close-upsell-popup]', (event) => {
                event.preventDefault();
                event.stopPropagation();

                $body.removeClass('cart-upsell-show');
            });

            $doc.on('click', (event) => {
                if($body.hasClass('add-to-cart-show')){
                    if (($(event.target).closest('[data-add-to-cart-popup]').length === 0)) {
                        $body.removeClass('add-to-cart-show');
                    }
                }

                if($body.hasClass('cart-upsell-show')){
                    if (($(event.target).closest('[data-upsell-popup]').length === 0) && ($(event.target).closest('[data-edit-cart-popup]').length === 0)){
                        $body.removeClass('cart-upsell-show');
                    }
                }
            });
        },

        actionAddToCart: function($target, variantId, qty){
            var originalMessage = window.variantStrings.addToCart,
                waitMessage = window.variantStrings.addingToCart,
                successMessage = window.variantStrings.addedToCart;

            if(!$target.hasClass('action-icon')){
                if($target.hasClass('button-text-change')){
                    originalMessage = $target.text();
                }

                $target
                    .text(waitMessage)
                    .addClass('is-loading');
            } else {
                $target
                    .addClass('is-loading');
                $target
                    .find('.text')
                    .text(waitMessage);
            }

            if($body.hasClass('quick-view-show')){
                Shopify.addItem(variantId, qty, () => {
                    if(!$target.hasClass('action-icon')){
                        $target
                            .text(successMessage);
                    } else {
                        $target
                            .find('.text')
                            .text(successMessage);
                    }

                    if (window.after_add_to_cart.type == 'cart') {
                        halo.redirectTo(window.routes.cart);
                    } else {
                        Shopify.getCart((cartTotal) => {
                            $body.find('[data-cart-count]').text(cartTotal.item_count);

                            if(!$target.hasClass('action-icon')){
                                $target
                                    .text(originalMessage)
                                    .removeClass('is-loading');
                            } else {
                                $target
                                    .removeClass('is-loading');
                                $target
                                    .find('.text')
                                    .text(originalMessage);
                            }

                            var productMessage = $target.closest('form').find('.productView-message'),
                                    alertText = cartTotal.items[0].product_title + ' ' + window.after_add_to_cart.message,
                                    alertMessage = `<div class="alertBox alertBox--success"><p class="alertBox-message">${alertText}</p></div>`;
                                productMessage.html(alertMessage).show();
                        });
                    }
                });
            } else {
                Shopify.addItem(variantId, qty, () => {
                    if(!$target.hasClass('action-icon')){
                        $target
                            .text(successMessage);
                    } else {
                        $target
                            .find('.text')
                            .text(successMessage);
                    }

                    halo.switchActionAddToCart($target, originalMessage);
                });
            }
        },

        actionAddToCart2: function($target, productForm) {
            const config = fetchConfig('javascript');
            const formData = new FormData(productForm[0]);

            var originalMessage = window.variantStrings.addToCart,
                waitMessage = window.variantStrings.addingToCart,
                successMessage = window.variantStrings.addedToCart;

            if(!$target.hasClass('action-icon')){
                if($target.hasClass('button-text-change')){
                    originalMessage = $target.text();
                }

                $target
                    .text(waitMessage)
                    .addClass('is-loading');
            } else {
                $target
                    .addClass('is-loading');
                $target
                    .find('.text')
                    .text(waitMessage);
            }

            config.headers['X-Requested-With'] = 'XMLHttpRequest';
            config.body = formData;
            formData.append('sections', '');
            formData.append('sections_url', window.location.pathname);

            delete config.headers['Content-Type'];

            fetch(`${routes.cart_add_url}`, config)
                .then((response) => response.json())
                .then((response) => {
                    if (response.status) {
                        var productMessage = $target.closest('form').find('.productView-message'),
                                alertText = response.description,
                                alertMessage = `<div class="alertBox alertBox--success"><p class="alertBox-message">${alertText}</p></div>`;

                            productMessage.html(alertMessage).show();
                        return;
                    }
                })
                .catch((e) => {
                    console.error(e);
                })
                .finally(() => {
                    if($body.hasClass('quick-view-show')){
                        if (window.after_add_to_cart.type == 'cart') {
                            halo.redirectTo(window.routes.cart);
                        } else {
                            Shopify.getCart((cartTotal) => {
                                $body.find('[data-cart-count]').text(cartTotal.item_count);

                                if(!$target.hasClass('action-icon')){
                                    $target
                                        .text(originalMessage)
                                        .removeClass('is-loading');
                                } else {
                                    $target
                                        .removeClass('is-loading');
                                    $target
                                        .find('.text')
                                        .text(originalMessage);
                                }

                                var productMessage = $target.closest('form').find('.productView-message'),
                                    alertText = cartTotal.items[0].product_title + ' ' + window.after_add_to_cart.message,
                                    alertMessage = `<div class="alertBox alertBox--success"><p class="alertBox-message">${alertText}</p></div>`;
                                productMessage.html(alertMessage).show();
                            });
                        }
                    } else {
                        if(!$target.hasClass('action-icon')){
                            $target
                                .text(successMessage);
                        } else {
                            $target
                                .find('.text')
                                .text(successMessage);
                        }

                        halo.switchActionAddToCart($target, originalMessage);
                    }
                });
        },

        switchActionAddToCart: function($target, originalMessage) {
            switch (window.after_add_to_cart.type) {
                case 'cart':
                    halo.redirectTo(window.routes.cart);

                    break;
                case 'quick_cart':
                    if(window.quick_cart.show){
                        Shopify.getCart((cart) => {
                            if( window.quick_cart.type == 'popup'){
                                $body.addClass('cart-dropdown-show');
                                halo.updateDropdownCart(cart);
                            } else {
                                $body.addClass('cart-sidebar-show');
                                halo.updateSidebarCart(cart);
                            }

                            if(!$target.hasClass('action-icon')){
                                $target
                                    .text(originalMessage)
                                    .removeClass('is-loading');
                            } else {
                                $target
                                    .removeClass('is-loading');
                                $target
                                    .find('.text')
                                    .text(originalMessage);
                            }
                        });
                    } else {
                        halo.redirectTo(window.routes.cart);
                    }

                    break;
                case 'popup_cart_1':
                    Shopify.getCart((cart) => {
                        halo.updatePopupCart(cart, 1);
                        $body.addClass('add-to-cart-show');

                        if(!$target.hasClass('action-icon')){
                            $target
                                .text(originalMessage)
                                .removeClass('is-loading');
                        } else {
                            $target
                                .removeClass('is-loading');
                            $target
                                .find('.text')
                                .text(originalMessage);
                        }
                    });

                    break;
                case 'popup_cart_2':
                    Shopify.getCart((cart) => {
                        halo.updatePopupCart(cart, 2);

                        if(!$target.hasClass('action-icon')){
                            $target
                                .text(originalMessage)
                                .removeClass('is-loading');
                        } else {
                            $target
                                .removeClass('is-loading');
                            $target
                                .find('.text')
                                .text(originalMessage);
                        }
                    });

                    break;
            }
        },

        isRunningInIframe: function() {
            try {
                return window.self !== window.top;
            } catch (e) {
                return true;
            }
        },

        redirectTo: function(url){
            if (halo.isRunningInIframe() && !window.iframeSdk) {
                window.top.location = url;
            } else {
                window.location = url;
            }
        },

        initBeforeYouLeave: function() {
            var $beforeYouLeave = $('#halo-leave-sidebar'),
                time = $beforeYouLeave.data('time'),
                idleTime = 0;

            if (!$beforeYouLeave.length) {
                return;
            } else{
                setTimeout(() => {
                    if($beforeYouLeave.find('.products-carousel').length > 0){
                        var productWrapper = $beforeYouLeave.find('.products-carousel');

                        productsLoader(productWrapper);
                    }
                }, time/2 + 100);

                var slickInterval = setInterval(() => {
                    timerIncrement();
                }, time);

                $body.on('mousemove keydown scroll', () => {
                    resetTimer();
                });
            }

            $body.on('click', '[data-close-before-you-leave]', (event) => {
                event.preventDefault();

                $body.removeClass('before-you-leave-show');
            });

            $body.on('click', (event) => {
                if ($body.hasClass('before-you-leave-show')) {
                    if ($(event.target).closest('#halo-leave-sidebar').length === 0){
                        $body.removeClass('before-you-leave-show');
                    }
                }
            });

            function timerIncrement() {
                idleTime = idleTime + 1;

                if (idleTime >= 1 && !$body.hasClass('before-you-leave-show')) {
                    if($beforeYouLeave.find('.products-carousel').length > 0){
                        var slider = $beforeYouLeave.find('.products-carousel');

                        productsCarousel(slider);
                    }

                    $body.addClass('before-you-leave-show');
                }
            }

            function resetTimer() {
                idleTime = -1;
            }

            function productsCarousel(slider){
                if(!slider.hasClass('slick-slider')) {
                    slider.slick({
                        dots: true,
                        arrows: true,
                        slidesToShow: 1,
                        slidesToScroll: 1,
                        slidesPerRow: 1,
                        rows: 3,
                        infinite: false,
                        nextArrow: '<button type="button" class="slick-arrow slick-arrow--circle slick-next" aria-label="'+ window.accessibility.next_slide +'">' + window.slick.nextArrow + '</button>',
                        prevArrow: '<button type="button" class="slick-arrow slick-arrow--circle slick-prev" aria-label="'+ window.accessibility.previous_slide +'">' + window.slick.prevArrow + '</button>'
                    });
                }
            }

            function productsLoader(wrapper){
                if(!wrapper.hasClass('ajax-loaded')){
                    var url = wrapper.attr('data-collection');

                    fetch(url)
                    .then(response => response.text())
                    .then(html => {
                        if (!wrapper.find('.product').length) {
                            wrapper.append(html);
                            wrapper.addClass('ajax-loaded');

                            if (halo.checkNeedToConvertCurrency()) {
                                Currency.convertAll(window.shop_currency, $('#currencies .active').attr('data-currency'), 'span.money', 'money_format');
                            }
                        }
                    })
                    .catch(e => {
                        console.error(e);
                    });
                }
            }
        },

        initQuickCart: function() {
            if(window.quick_cart.show){
                if(window.quick_cart.type == 'popup'){
                    halo.initDropdownCart();
                } else {
                    halo.initSidebarCart();
                }
            }

            halo.initEventQuickCart();
        },


        initEventQuickCart: function(){
            halo.removeItemQuickCart();
            halo.updateQuantityItemQuickCart();
            halo.editQuickCart();
        },

        initFreeShippingMessage: function () {
            $.getJSON('/cart.js', (cart) => {
                halo.freeShippingMessage(cart);
            });
        },
        
        initCollapseSidebarBlock: function (){
            $doc.on('click', '.sidebarBlock-headingWrapper .sidebarBlock-heading', (event) => {
                var $target = $(event.currentTarget),
                    $blockCollapse = $target.parent().siblings();

                if($target.hasClass('is-clicked')){
                    $target.removeClass('is-clicked');
                    $blockCollapse.slideUp('slow');
                } else {
                    $target.addClass('is-clicked');
                     $blockCollapse.slideDown('slow');
                }
            });
        },

        initCategoryActive: function(){
            if ($('.all-categories-list').length > 0) {
                $doc.on('click', '.all-categories-list .icon-dropdown', (event) => {
                    var $target = $(event.currentTarget).parent();

                    $target.siblings().removeClass('is-clicked current-cate');
                    $target.toggleClass('is-clicked');
                    $target.siblings().find('> .dropdown-category-list').slideUp('slow');
                    $target.find('> .dropdown-category-list').slideToggle('slow');
                });

                $('.all-categories-list li').each((index, element) =>{
                    if ($(element).hasClass('current-cate')) {
                        $(element).find('> .dropdown-category-list').slideToggle('slow');
                    }
                });
            }
        },
        
        toggleSidebarMobile: function() {
            $doc.on('click', '[data-sidebar]', (event) => {
                event.preventDefault();
                event.stopPropagation();

                $body.addClass('open-mobile-sidebar');
            });

            $doc.on('click', '[data-close-sidebar]', (event) => {
                event.preventDefault();
                event.stopPropagation();

                $body.removeClass('open-mobile-sidebar');
            });

            $doc.on('click', (event) => {
                if($body.hasClass('open-mobile-sidebar')){
                    if (($(event.target).closest('[data-sidebar]').length === 0) && ($(event.target).closest('#halo-sidebar').length === 0)) {
                        $body.removeClass('open-mobile-sidebar');
                    }
                }
            });
        },

        initInfiniteScrolling: function(){
            if ($('.pagination-infinite'.length > 0)) {
                $win.on('scroll load', () => {
                    var currentScroll = $win.scrollTop(),
                        pageInfinite = $('.pagination-infinite'),
                        linkInfinite = pageInfinite.find('[data-infinite-scrolling]'),
                        position; 

                    if(linkInfinite.length > 0 && !linkInfinite.hasClass('is-loading')){
                        position = pageInfinite.offset().top - 500;
                        
                        if (currentScroll > position) {
                            var url = linkInfinite.attr('href');

                            halo.doAjaxInfiniteScrollingGetContent(url, linkInfinite);
                        }
                    }
                });
            }

            $doc.on('click', '[data-infinite-scrolling]', (event) => {
                var linkInfinite = $(event.currentTarget),
                    url = linkInfinite.attr('href');

                event.preventDefault();
                event.stopPropagation();

                halo.doAjaxInfiniteScrollingGetContent(url, linkInfinite);
            });
        },

        doAjaxInfiniteScrollingGetContent: function(url, link){
            $.ajax({
                type: 'GET',
                url: url,
                beforeSend: function () {
                    link.text(link.attr('data-loading-more'));
                    link.addClass('is-loading');
                    // document.getElementById('CollectionProductGrid').querySelector('.collection').classList.add('is-loading');
                    $body.addClass('has-halo-loader');
                },
                success: function (data) {
                    halo.ajaxInfiniteScrollingMapData(data);
                },
                error: function (xhr, text) {
                    alert($.parseJSON(xhr.responseText).description);
                },
                complete: function () {
                    link.text(link.attr('data-load-more'));
                    link.removeClass('is-loading');
                    // document.getElementById('CollectionProductGrid').querySelector('.collection').classList.remove('is-loading');
                    $body.removeClass('has-halo-loader');
                }
            });
        },

        ajaxInfiniteScrollingMapData: function(data){
            var currentTemplate = $('#CollectionProductGrid'),
                currentProductListing = currentTemplate.find('.productListing'),
                currentPagination = currentTemplate.find('.pagination'),
                newTemplate = $(data).find('#CollectionProductGrid'),
                newProductListing = newTemplate.find('.productListing'),
                newPagination = newTemplate.find('.pagination'),
                newProductItem = newProductListing.children('.product');
                
            if (newProductItem.length > 0) {
                currentProductListing.append(newProductItem);
                currentPagination.replaceWith(newPagination);

                $('[data-total-start]').text(1);
                
                if(window.compare.show){
                    Shopify.ProductCompare.setLocalStorageProductForCompare({
                        link: $('a[data-compare-link]'),
                        onComplete: null
                    });
                }

                if(window.wishlist.show){
                    Shopify.ProductWishlist.setLocalStorageProductForWishlist();
                }

                if (halo.checkNeedToConvertCurrency()) {
                    Currency.convertAll(window.shop_currency, $('#currencies .active').attr('data-currency'), 'span.money', 'money_format');
                }
            }
        },

        freeShippingMessage: function(cart){
            var freeshipEligible = 0,
                $wrapper = $('.haloCalculatorShipping'),
                $progress = $('[data-shipping-progress]'),
                $message = $('[data-shipping-message]');

            var freeshipText = window.free_shipping_text.free_shipping_message,
                freeshipText1 = window.free_shipping_text.free_shipping_message_1,
                freeshipText2 = window.free_shipping_text.free_shipping_message_2,
                freeshipText3 = window.free_shipping_text.free_shipping_message_3,
                freeshipText4 = window.free_shipping_text.free_shipping_message_4,
                extraPrice = 0,
                shipVal = window.free_shipping_text.free_shipping_1,
                classLabel1 = 'progress-30',
                classLabel2 = 'progress-60',
                classLabel3 = 'progress-100',
                freeshipPrice = parseInt(window.free_shipping_price);

            var cartTotalPrice =  parseInt(cart.total_price)/100,
                freeshipBar = Math.round((cartTotalPrice * 100)/freeshipPrice);

            if(cartTotalPrice == 0) {
                freeshipText =  '<span> ' + freeshipText + ' ' + Shopify.formatMoney(freeshipPrice * 100, window.money_format) +'!</span>';
            } else if (cartTotalPrice >= freeshipPrice) {
                freeshipEligible = 1;
                freeshipText = freeshipText1;
            } else {
                extraPrice = parseInt(freeshipPrice - cartTotalPrice);
                freeshipText = '<span> ' + freeshipText2 + ' </span>' + Shopify.formatMoney(extraPrice * 100, window.money_format) + '<span> ' + freeshipText3 + ' </span><span class="text">' + freeshipText4 + '</span>';
                shipVal = window.free_shipping_text.free_shipping_2;
            }

            if(freeshipBar >= 100 ){
                freeshipBar = 100;
            }

            var classLabel = 'progress-free';

            if(freeshipBar == 0){
                classLabel = 'none';
            } else if(freeshipBar <= 30 ) {
                classLabel = classLabel1;
            } else if(freeshipBar <= 60) {
                classLabel = classLabel2;
            } else if(freeshipBar < 100){
                classLabel = classLabel3;
            }

            if(!$wrapper.hasClass('style-3')){
                var progress = '<div class="progress_shipping" role="progressbar">\
                                    <div class="progress-meter" style="width: '+ freeshipBar +'%;"></div>\
                                </div>';
            } else {
                var progress = '<div class="progress_shipping" role="progressbar">\
                                    <div class="progress-meter" style="width: '+ freeshipBar +'%;">'+ freeshipBar +'%</div>\
                                </div>';
            }

            setTimeout(() => {
                $wrapper.removeClass('animated-loading');
                $progress.addClass(classLabel).html(progress);
                $message.addClass(classLabel).html(freeshipText);
            }, 200);
        },
        
        productItemCartSlider: function(){
            var productCart = $('[data-product-item-cart]');

            productCart.each(function () {
                var self = $(this),
                    productGrid = self.find('.products-carousel'),
                    itemToShow = productGrid.data('item-to-show'),
                    itemDots = productGrid.data('item-dots'),
                    itemArrows = productGrid.data('item-arrows');

                if(productGrid.length > 0){
                    if(!productGrid.hasClass('slick-initialized')){
                        productGrid.on('init', function(event, slick) {
                            var productFrist = productGrid.find('.product:eq(0)'),
                                contentHeight = productFrist.find('.product-bottom').outerHeight(),
                                boxHeight = productGrid.outerHeight();
                                pos =  (boxHeight - contentHeight)/2;

                            if(($win.width() > 1025) && (itemArrows == true)){
                                $(slick.$nextArrow[0]).css('top', pos);

                                $(slick.$prevArrow[0]).css('top', pos);
                            }
                        });

                        productGrid.slick({
                            mobileFirst: true,
                            adaptiveHeight: false,
                            infinite: false,
                            vertical: false,
                            slidesToShow: 1,
                            slidesToScroll: 1,
                            dots: true,
                            arrows: false,
                            nextArrow: '<button type="button" class="slick-arrow slick-arrow--circle slick-next" aria-label="'+ window.accessibility.next_slide +'">' + window.slick.nextArrow + '</button>',
                            prevArrow: '<button type="button" class="slick-arrow slick-arrow--circle slick-prev" aria-label="'+ window.accessibility.previous_slide +'">' + window.slick.prevArrow + '</button>',
                            responsive: [
                            {
                                breakpoint: 1600,
                                settings: {
                                    dots: itemDots,
                                    arrows: itemArrows,
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
                                breakpoint: 1400,
                                settings: {
                                    dots: itemDots,
                                    arrows: itemArrows,
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
                                breakpoint: 1025,
                                settings: {
                                    dots: itemDots,
                                    arrows: itemArrows,
                                    get slidesToShow() {
                                        if(itemToShow !== undefined && itemToShow !== null && itemToShow !== ''){
                                            if(itemToShow == 5){
                                                return this.slidesToShow = itemToShow - 2;
                                            } else if (itemToShow == 4) {
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
                                breakpoint: 992,
                                settings: {
                                    slidesToShow: 2
                                }
                            }]
                        });

                        productGrid.on('afterChange', function(event, slick) {
                            var productFrist = productGrid.find('.product:eq(0)'),
                                contentHeight = productFrist.find('.product-bottom').outerHeight(),
                                boxHeight = productGrid.outerHeight();
                                pos =  (boxHeight - contentHeight)/2;

                            if(($win.width() > 1025) && (itemArrows == true)){
                                $(slick.$nextArrow[0]).css('top', pos);

                                $(slick.$prevArrow[0]).css('top', pos);
                            }
                        });
                    }
                }
            });
        },

        productCollectionCartSlider: function(){
            var productCart = $('[data-product-collection-cart]');

            productCart.each((index, element) => {
                var self = $(element),
                    productGrid = self.find('.products-carousel'),
                    itemDots = productGrid.data('item-dots'),
                    itemArrows = productGrid.data('item-arrows');

                if(productGrid.length > 0){
                    if(!productGrid.hasClass('slick-initialized')){
                        productGrid.slick({
                            mobileFirst: true,
                            adaptiveHeight: false,
                            infinite: false,
                            vertical: false,
                            slidesToShow: 1,
                            slidesToScroll: 1,
                            dots: true,
                            arrows: false,
                            nextArrow: '<button type="button" class="slick-arrow slick-arrow--circle slick-next" aria-label="'+ window.accessibility.next_slide +'">' + window.slick.nextArrow + '</button>',
                            prevArrow: '<button type="button" class="slick-arrow slick-arrow--circle slick-prev" aria-label="'+ window.accessibility.previous_slide +'">' + window.slick.prevArrow + '</button>',
                            responsive: [
                            {
                                breakpoint: 1025,
                                settings: {
                                    dots: itemDots,
                                    arrows: itemArrows
                                }
                            }]
                        });
                    }
                }
            });
        },

        updateCart: function(cart){
            if(!$.isEmptyObject(cart)){
                const $sectionId = $('#main-cart-items').data('id');
                const $cart = $('[data-cart]')
                const $cartContent = $cart.find('[data-cart-content]');
                const $cartTotals = $cart.find('[data-cart-totals]');
                const $cartLoading = '<div class="halo-block-loader"></div>';
                const loadingClass = 'has-halo-block-loader';

                $cart
                    .addClass(loadingClass)
                    .prepend($cartLoading);

                $.ajax({
                    type: 'GET',
                    url: `/cart?section_id=${$sectionId}`,
                    cache: false,
                    success: function (data) {
                        var response = $(data);

                        $cart.removeClass(loadingClass);
                        $cart.find('.loading-overlay').remove();

                        if(cart.item_count > 0){
                            var contentCart =  response.find('[data-cart-content] .cart').html(),
                                subTotal = response.find('[data-cart-totals] .cart-total-subtotal').html(),
                                grandTotal = response.find('[data-cart-totals] .cart-total-grandtotal').html();

                            $cartContent.find('.cart').html(contentCart);
                            $cartTotals.find('.cart-total-subtotal').html(subTotal);
                            $cartTotals.find('.cart-total-grandtotal').html(grandTotal);

                            if(response.find('.cart-gift').length > 0){
                                var cartGift = response.find('.cart-gift');

                                $cart.find('.cart-gift').replaceWith(cartGift);
                            }

                            if(response.find('.haloCalculatorShipping').length > 0){
                                var calculatorShipping = response.find('.haloCalculatorShipping');

                                $cart.find('.haloCalculatorShipping').replaceWith(calculatorShipping);
                            }
                        } else {
                            var contentCart =  response.find('#main-cart-items').html(),
                                headerCart =  response.find('.page-header').html();

                            $('#main-cart-items').html(contentCart);
                            $('.page-header').html(headerCart);
                        }
                    },
                    error: function (xhr, text) {
                        alert($.parseJSON(xhr.responseText).description);
                    },
                    complete: function () {
                        $body.find('[data-cart-count]').text(cart.item_count);
                        halo.initFreeShippingMessage();

                        if (halo.checkNeedToConvertCurrency()) {
                            Currency.convertAll(window.shop_currency, $('#currencies .active').attr('data-currency'), 'span.money', 'money_format');
                        }
                    }
                });
            }
        },

        updatePopupCart: function(cart, layout) {
            if(layout == 1){
                var item = cart.items[0],
                    popup = $('[data-add-to-cart-popup]'),
                    product = popup.find('.product-added'),
                    productTitle = product.find('.product-title'),
                    productImage = product.find('.product-image'),
                    title = item.product_title,
                    image = item.featured_image,
                    img = '<img src="'+ image.url +'" alt="'+ image.alt +'" title="'+ image.alt +'"/><svg aria-hidden="true" focusable="false" data-prefix="fal" data-icon="external-link" role="img" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512" class="svg-inline--fa fa-external-link fa-w-16 fa-3x"><path d="M440,256H424a8,8,0,0,0-8,8V464a16,16,0,0,1-16,16H48a16,16,0,0,1-16-16V112A16,16,0,0,1,48,96H248a8,8,0,0,0,8-8V72a8,8,0,0,0-8-8H48A48,48,0,0,0,0,112V464a48,48,0,0,0,48,48H400a48,48,0,0,0,48-48V264A8,8,0,0,0,440,256ZM500,0,364,.34a12,12,0,0,0-12,12v10a12,12,0,0,0,12,12L454,34l.7.71L131.51,357.86a12,12,0,0,0,0,17l5.66,5.66a12,12,0,0,0,17,0L477.29,57.34l.71.7-.34,90a12,12,0,0,0,12,12h10a12,12,0,0,0,12-12L512,12A12,12,0,0,0,500,0Z" class=""></path></svg>';

                productImage.attr('href', item.url).html(img);

                productTitle
                    .find('.title')
                    .attr('href', item.url)
                    .text(title);

                Shopify.getCart((cartTotal) => {
                    $body.find('[data-cart-count]').text(cartTotal.item_count);
                });
            } else {
                var popup = $('.halo-upsell-popup'),
                    popupContent = popup.find('.halo-popup-content');

                const $cartLoading = '<div class="halo-block-loader"></div>';
                const loadingClass = 'has-halo-block-loader';

                if(!$.isEmptyObject(cart)) {
                    if(cart.quantity > 0 || cart.item_count > 0) {
                        popupContent
                            .addClass(loadingClass)
                            .prepend($cartLoading);

                        $.ajax({
                            type: 'GET',
                            url: '/cart?view=ajax_upsell_cart',
                            cache: false,
                            success: function (data) {
                                var response = $(data);

                                popupContent
                                    .removeClass(loadingClass)
                                    .html(response);
                            },
                            error: function (xhr, text) {
                                alert($.parseJSON(xhr.responseText).description);
                            },
                            complete: function () {
                                $body.find('[data-cart-count]').text(cart.item_count);

                                if(cart.item_count == 0){
                                    $body.removeClass('cart-upsell-show');
                                } else{
                                    if(!$body.hasClass('cart-upsell-show')){
                                        $body.addClass('cart-upsell-show');
                                    }

                                    halo.initFreeShippingMessage();

                                    if (halo.checkNeedToConvertCurrency()) {
                                        Currency.convertAll(window.shop_currency, $('#currencies .active').attr('data-currency'), 'span.money', 'money_format');
                                    }
                                }
                            }
                        });
                    } else {
                        $body.find('[data-cart-count]').text(cart.item_count);
                        $body.removeClass('cart-upsell-show');

                        halo.initFreeShippingMessage();
                    }
                }
            }
        },

        initDropdownCart: function() {
            if ($body.hasClass('template-cart')) {
                $doc.on('click', '[data-open-cart-popup]', (event) => {
                    event.preventDefault();
                    event.stopPropagation();

                    $('html, body').animate({
                        scrollTop: 0
                    }, 700);
                });
            } else {
                $doc.on('click', '[data-open-cart-popup]', (event) => {
                    event.preventDefault();
                    event.stopPropagation();   
                    
                    Shopify.getCart((cart) => {
                        $body.addClass('cart-dropdown-show');
                        halo.updateDropdownCart(cart);
                    });
                });
            }

            $doc.on('click', '[data-close-cart-popup]', (event) => {
                event.preventDefault();
                event.stopPropagation();

                if ($body.hasClass('cart-dropdown-show')) {
                    $body.removeClass('cart-dropdown-show');
                }
            });

            $doc.on('click', (event) => {
                if ($body.hasClass('cart-dropdown-show') && !$body.hasClass('edit-cart-show')) {
                    if (($(event.target).closest('[data-quick-cart-popup]').length === 0) && ($(event.target).closest('[data-open-cart-popup]').length === 0) && ($(event.target).closest('#halo-edit-cart-modal').length === 0)){
                        $body.removeClass('cart-dropdown-show');
                    }
                }
            });
        },
        
        updateDropdownCart: function (cart) {
            if(!$.isEmptyObject(cart)){
                const $cartDropdown = $('.quickCartWrap');
                const $cartLoading = '<div class="halo-block-loader"></div>';
                const loadingClass = 'has-halo-block-loader';

                $cartDropdown
                    .addClass(loadingClass)
                    .prepend($cartLoading);

                $.ajax({
                    type: 'GET',
                    url: '/cart?view=ajax_dropdown_cart',
                    cache: false,
                    success: function (data) {
                        var response = $(data);

                        $cartDropdown
                            .removeClass(loadingClass)
                            .html(response);
                    },
                    error: function (xhr, text) {
                        alert($.parseJSON(xhr.responseText).description);
                    },
                    complete: function () {
                        $body.find('[data-cart-count]').text(cart.item_count);
                        halo.productItemCartSlider();
                        halo.productCollectionCartSlider();
                        halo.initFreeShippingMessage();

                        if (halo.checkNeedToConvertCurrency()) {
                            Currency.convertAll(window.shop_currency, $('#currencies .active').attr('data-currency'), 'span.money', 'money_format');
                        }
                    }
                });
            }
        },

        initSidebarCart: function() {
            if ($body.hasClass('template-cart')) {
                $doc.on('click', '[data-cart-sidebar]', (event) => {
                    event.preventDefault();
                    event.stopPropagation();

                    $('html, body').animate({
                        scrollTop: 0
                    }, 700);
                });
            } else {
                $doc.on('click', '[data-cart-sidebar]', (event) => {
                    event.preventDefault();
                    event.stopPropagation();
                    
                    Shopify.getCart((cart) => {
                        $body.addClass('cart-sidebar-show');
                        halo.updateSidebarCart(cart);
                    });
                });
            }

            $doc.on('click', '[data-close-cart-sidebar]', (event) => {
                event.preventDefault();
                event.stopPropagation();

                if ($body.hasClass('cart-sidebar-show')) {
                    $body.removeClass('cart-sidebar-show');
                }
            });

            $doc.on('click', (event) => {
                if ($body.hasClass('cart-sidebar-show') && !$body.hasClass('edit-cart-show')) {
                    if (($(event.target).closest('#halo-cart-sidebar').length === 0) && ($(event.target).closest('[data-cart-sidebar]').length === 0) && ($(event.target).closest('[data-edit-cart-popup]').length === 0)){
                        $body.removeClass('cart-sidebar-show');
                    }
                }
            });
        },

        updateSidebarCart: function(cart) {
            if(!$.isEmptyObject(cart)){
                const $cartDropdown = $('#halo-cart-sidebar .halo-sidebar-wrapper');
                const $cartLoading = '<div class="halo-block-loader"></div>';
                const loadingClass = 'has-halo-block-loader';

                $cartDropdown
                    .addClass(loadingClass)
                    .prepend($cartLoading);

                $.ajax({
                    type: 'GET',
                    url: '/cart?view=ajax_side_cart',
                    cache: false,
                    success: function (data) {
                        var response = $(data);

                        $cartDropdown
                            .removeClass(loadingClass)
                            .html(response);
                    },
                    error: function (xhr, text) {
                        alert($.parseJSON(xhr.responseText).description);
                    },
                    complete: function () {
                        $body.find('[data-cart-count]').text(cart.item_count);
                        halo.productCollectionCartSlider();
                        halo.initFreeShippingMessage();

                        if (halo.checkNeedToConvertCurrency()) {
                            Currency.convertAll(window.shop_currency, $('#currencies .active').attr('data-currency'), 'span.money', 'money_format');
                        }
                    }
                });
            }
        },

        removeItemQuickCart: function () {
            $doc.on('click', '[data-cart-remove]', (event) => {
                event.preventDefault();
                event.stopPropagation();

                var $target = $(event.currentTarget),
                    productId = $target.attr('data-cart-remove-id'),
                    productLine = $target.data('line');

                Shopify.removeItem(productLine, (cart) => {
                    if($body.hasClass('template-cart')){
                        halo.updateCart(cart);
                    } else if($body.hasClass('cart-dropdown-show')){
                        halo.updateDropdownCart(cart);
                    } else if($body.hasClass('cart-sidebar-show')) {
                        halo.updateSidebarCart(cart);
                    } else if($body.hasClass('cart-upsell-show')){
                        halo.updatePopupCart(cart, 2);
                    }
                });
            });
        },

        updateQuantityItemQuickCart: function(){
            $doc.on('change', '[data-cart-quantity]', (event) => {
                event.preventDefault();
                event.stopPropagation();

                var $target = $(event.currentTarget),
                    productId = $target.attr('data-cart-quantity-id'),
                    productLine = $target.data('line'),
                    quantity = parseInt($target.val()),
                    stock = parseInt($target.data('inventory-quantity'));

                if (stock < quantity && stock > 0) {
                    quantity = stock;
                }

                Shopify.changeItem(productLine, quantity, (cart) => {
                    if($body.hasClass('template-cart')){
                        halo.updateCart(cart);
                    } else if($body.hasClass('cart-dropdown-show')){
                        halo.updateDropdownCart(cart);
                    } else if($body.hasClass('cart-sidebar-show')) {
                        halo.updateSidebarCart(cart);
                    } else if($body.hasClass('cart-upsell-show')){
                        halo.updatePopupCart(cart);
                    }
                });
            });
        },

        editQuickCart: function() {
            $doc.on('click', '[data-open-edit-cart]', (event) => {
                event.preventDefault();
                event.stopPropagation();

                var $target = $(event.currentTarget),
                    url = $target.data('edit-cart-url'),
                    itemId = $target.data('edit-cart-id'),
                    itemLine = $target.data('line'),
                    quantity = $target.data('edit-cart-quantity'),
                    option = $target.parents('.previewCartItem').find('previewCartItem-variant').text();

                const modal = $('[data-edit-cart-popup]'),
                    modalContent = modal.find('.halo-popup-content');

                $.ajax({
                    type: 'get',
                    url: url,
                    cache: false,
                    dataType: 'html',
                    beforeSend: function() {},
                    success: function(data) {
                        modalContent.html(data);
                        modalContent
                            .find('[data-template-cart-edit]')
                            .attr({
                                'data-cart-update-id': itemId,
                                'data-line': itemLine
                            });

                        var productItem = modalContent.find('.product-edit-item');
                        productItem.find('input[name="quantity"]').val(quantity);
                    },
                    error: function(xhr, text) {
                        alert($.parseJSON(xhr.responseText).description);
                    },
                    complete: function () {
                        $body.addClass('edit-cart-show');

                        if (halo.checkNeedToConvertCurrency()) {
                            Currency.convertAll(window.shop_currency, $('#currencies .active').attr('data-currency'), 'span.money', 'money_format');
                        }
                    }
                });
            });

            $doc.on('click', '[data-close-edit-cart]', (event) => {
                event.preventDefault();
                event.stopPropagation();

                $body.removeClass('edit-cart-show');
            });

            $doc.on('click', (event) => {
                if ($body.hasClass('edit-cart-show')) {
                    if (($(event.target).closest('[data-edit-cart-popup]').length === 0) && ($(event.target).closest('[data-open-edit-cart]').length === 0)){
                        $body.removeClass('edit-cart-show');
                    }
                }
            });

            halo.addMoreItemEditCart();
            halo.addAllItemCartEdit();
        },

        addMoreItemEditCart: function(){
            $doc.on('click', '[data-edit-cart-add-more]', (event) => {
                event.preventDefault();
                event.stopPropagation();

                var itemWrapper = $('[data-template-cart-edit]'),
                    currentItem = $(event.target).parents('.product-edit-item'),
                    count = parseInt(itemWrapper.attr('data-count')),
                    cloneProduct = currentItem.clone().removeClass('product-edit-itemFirst');
                    cloneProductId = cloneProduct.attr('id') + count;

                cloneProduct.attr('id', cloneProductId);

                halo.updateClonedProductAttributes(cloneProduct, count);

                cloneProduct.insertAfter(currentItem);

                count = count + 1;
                itemWrapper.attr('data-count', count);
            });

            $doc.on('click', '[data-edit-cart-remove]', (event) => {
                event.preventDefault();
                event.stopPropagation();

                var currentItem = $(event.target).parents('.product-edit-item');

                currentItem.remove();
            });
        },

        updateClonedProductAttributes: function(product, count){
            var form = $('.shopify-product-form', product),
                formId = form.attr('id'),
                newFormId = formId + count;

            form.attr('id', newFormId);

            $('.product-form__radio', product).each((index, element) => {
                var formInput = $(element),
                    formLabel = formInput.next(),
                    id = formLabel.attr('for'),
                    newId = id + count,
                    formInputName = formInput.attr('name');

                formLabel.attr('for', newId);

                formInput.attr({
                    id: newId,
                    name: formInputName + count
                });
            });
        },

        addAllItemCartEdit: function() {
            $doc.on('click', '#add-all-to-cart', (event) => {
                event.preventDefault();
                event.stopPropagation();

                var $target = $(event.currentTarget),
                    cartEdit = $target.parents('.cart-edit'),
                    product = cartEdit.find('.product-edit-item.isChecked'),
                    productId = cartEdit.attr('data-cart-update-id'),
                    productLine = cartEdit.data('line');

                if(product.length > 0){
                    $target
                        .text(window.variantStrings.addingToCart)
                        .addClass('is-loading');

                    Shopify.removeItem(productLine, (cart) => {
                        if(!$.isEmptyObject(cart)) {
                            var productHandleQueue = [];

                            var ajax_caller = function(data) {
                                return $.ajax(data);
                            }

                            product.each((index, element) => {
                                var item = $(element),
                                    variantId = item.find('input[name="id"]').val(),
                                    qty = parseInt(item.find('input[name="quantity"]').val());

                                productHandleQueue.push(ajax_caller({
                                    type: 'post',
                                    url: '/cart/add.js',
                                    data: 'quantity=' + qty + '&id=' + variantId,
                                    dataType: 'json',
                                    async: false
                                }));
                            });

                            if(productHandleQueue.length > 0) {
                                $.when.apply($, productHandleQueue).done((event) => {
                                    $target
                                        .text(window.variantStrings.addToCart)
                                        .removeClass('is-loading');

                                    Shopify.getCart((cart) => {
                                        $body.removeClass('edit-cart-show');

                                        if($body.hasClass('template-cart')){
                                            halo.updateCart(cart);
                                        } else if($body.hasClass('cart-dropdown-show')){
                                            halo.updateDropdownCart(cart);
                                        } else if($body.hasClass('cart-sidebar-show')) {
                                            halo.updateSidebarCart(cart);
                                        } else if($body.hasClass('cart-upsell-show')){
                                            halo.updatePopupCart(cart, 2);
                                        }
                                    });
                                });
                            }
                        }
                    });
                } else {
                    alert(window.variantStrings.addToCart_message);
                }
            });
        },

        initGiftCard: function() {
            $doc.on('click', '[data-gift-card]', (event) =>{
                event.preventDefault();
                event.stopPropagation();

                var $target = $(event.currentTarget),
                    id = $target.data('gift-card-id'),
                    text = $target.attr('data-adding-text');

                $target.text(text);
                halo.giftCard(id);
            });
        },

        giftCard: function(id) {
            Shopify.addItem(id, 1, () => {
                Shopify.getCart((cart) => {
                    halo.updateCart(cart);
                });
            });
        },

        initNotifyInStock: function() {
            var popup = $('[data-notify-popup]');

            $doc.on('click', '[data-open-notify-popup]', (event) => {
                event.preventDefault();
                event.stopPropagation();

                var $target = $(event.currentTarget);

                halo.notifyInStockPopup($target);
            });

            $doc.on('click', '[data-close-notify-popup]', (event) => {
                event.preventDefault();
                event.stopPropagation();

                $body.removeClass('notify-me-show');
                popup.find('.notifyMe-text').html('').hide();
            });

            $doc.on('click', (event) => {
                if($body.hasClass('notify-me-show')){
                    if (($(event.target).closest('[data-open-notify-popup]').length === 0) && ($(event.target).closest('[data-notify-popup]').length === 0)){
                        $body.removeClass('notify-me-show');
                        popup.find('.notifyMe-text').html('').hide();
                    }
                }
            });

            $doc.on('click', '[data-form-notify]', (event) => {
                event.preventDefault();
                event.stopPropagation();

                var $target = $(event.currentTarget);

                halo.notifyInStockAction($target);
            });
        },

        notifyInStockPopup: function($target){
            var variant,
                product = $target.parents('.product-item'),
                title = product.find('.card-title').data('product-title'),
                link = product.find('.card-title').data('product-url'),
                popup = $('[data-notify-popup]');

            if($target.hasClass('is-notify-me')){
                variant = product.find('.card-swatch .swatch-label.is-active').attr('title');
            } else {
                variant = $target.data('variant-id');
            }

            popup.find('[name="halo-notify-product-title"]').val($.trim(title));
            popup.find('[name="halo-notify-product-link"]').val(link);

            if(variant){
                popup.find('[name="halo-notify-product-variant"]').val(variant);
            }

            $body.addClass('notify-me-show');
        },

        notifyInStockAction: function($target){
            var proceed = true,
                $notify = $target.parents('.halo-notifyMe'),
                $notifyForm = $notify.find('.notifyMe-form'),
                $notifyText = $notify.find('.notifyMe-text'),
                notifyMail = $notify.find('input[name="email"]').val(),
                email_reg = /^([\w-\.]+@([\w-]+\.)+[\w-]{2,4})?$/,
                message;

            if (!email_reg.test(notifyMail) || (!notifyMail)){
                $notify
                    .find('.form-field')
                    .removeClass('form-field--success')
                    .addClass('form-field--error');

                proceed = false;
                message = '<div class="alertBox alertBox--error"><p class="alertBox-message">'+ window.notify_me.error +'</p></div>';

                $notifyText.html(message).show();
            } else {
                $notify
                    .find('.form-field')
                    .removeClass('form-field--error')
                    .addClass('form-field--success');

                $notifyText.html('').hide();
            }

            if (proceed) {
                var notifySite = $notify.find('[name="halo-notify-product-site"]').val(),
                    notifySiteUrl = $notify.find('[name="halo-notify-product-site-url"]').val(),
                    notifyToMail = window.notify_me.mail,
                    notifySubjectMail = window.notify_me.subject,
                    notifyLabelMail = window.notify_me.label,
                    productName = $notify.find('[name="halo-notify-product-title"]').val(),
                    productUrl = $notify.find('[name="halo-notify-product-link"]').val(),
                    productVariant = $notify.find('[name="halo-notify-product-variant"]').val();

                var content = '<div style="margin:30px auto;width:650px;border:10px solid #f7f7f7"><div style="border:1px solid #dedede">\
                        <h2 style="margin: 0; padding:20px 20px 20px;background:#f7f7f7;color:#555;font-size:2em;text-align:center;">'+ notifySubjectMail +'</h2>';

                content += '<table style="margin:0px 0 0;padding:30px 30px 30px;line-height:1.7em">\
                          <tr><td style="padding: 5px 25px 5px 0;"><strong>Product Name: </strong> ' + productName + '</td></tr>\
                          <tr><td style="padding: 5px 25px 5px 0;"><strong>Product URL: </strong> ' + productUrl + '</td></tr>\
                          <tr><td style="padding: 5px 25px 5px 0;"><strong>Email Request: </strong> ' + notifyMail + '</td></tr>\
                          '+ ((productVariant != '') ? '<tr><td style="padding: 5px 25px 5px 0;"><strong>Product Variant: </strong>' + productVariant + '</td></tr>' : '') +'\
                       </table>';

                content += '<a href="'+ notifySiteUrl +'" style="display:block;padding:30px 0;background:#484848;color:#fff;text-decoration:none;text-align:center;text-transform:uppercase">&nbsp;'+ notifySite +'&nbsp;</a>';
                content += '</div></div>';

                var notify_post_data = {
                    'api': 'i_send_mail',
                    'subject': notifySubjectMail,
                    'email': notifyToMail,
                    'from_name': notifyLabelMail,
                    'email_from': notifyMail,
                    'message': content
                };

                $.post('//themevale.net/tools/sendmail/quotecart/sendmail.php', notify_post_data, (response) => {
                    if (response.type == 'error') {
                       message = '<div class="alertBox alertBox--error"><p class="alertBox-message">'+ response.text +'</p></div>';
                    } else {
                       message = '<div class="alertBox alertBox--success"><p class="alertBox-message">'+ window.notify_me.success +'</p></div>';
                       halo.resetForm($notifyForm);
                    }

                    $notifyText.html(message).show();
                }, 'json');
            }
        },

        resetForm: function(form){
            $('.form-field', form).removeClass('form-field--success form-field--error');
            $('input[type=email], input[type=text], textarea', form).val('');
        },

        initCompareProduct: function() {
            if(window.compare.show){
                var $compareLink = $('a[data-compare-link]');

                Shopify.ProductCompare.setLocalStorageProductForCompare({
                    link: $compareLink,
                    onComplete: null
                });

                halo.setAddorRemoveProductForCompare($compareLink);
                halo.setProductForCompare();

                $doc.on('click', '[data-close-compare-product-popup]', (event) => {
                    event.preventDefault();
                    event.stopPropagation();

                    $body.removeClass('compare-product-show');
                });

                $doc.on('click', (event) => {
                    if($body.hasClass('compare-product-show')){
                        if (($(event.target).closest('[data-compare-link]').length === 0) && ($(event.target).closest('[data-compare-product-popup]').length === 0)){
                            $body.removeClass('compare-product-show');
                        }
                    }
                });
            }
        },

        setAddorRemoveProductForCompare: function($link) {
            $doc.on('change', '[data-product-compare] input', (event) => {
                var $this = $(event.currentTarget),
                    item = $this.parents('.card-compare'),
                    handle = $this.val(),
                    count = JSON.parse(localStorage.getItem('compareItem'));

                count = halo.uniqueArray(count);

                if(event.currentTarget.checked) {
                    item.find('.compare-icon').addClass('is-checked');
                    item.find('.text').text(window.compare.added);
                    item.find('input').prop('checked', true);
                    if(window.card.layout == '4' || window.card.layout == '5'){
                        item.find('label').html(`<span class="visually-hidden">${window.compare.added}</span>${window.compare.added}`);
                    }

                    halo.incrementCounterCompare(count, handle, $link);
                } else {
                    item.find('.compare-icon').removeClass('is-checked');
                    item.find('.text').text(window.compare.add);
                    item.find('input').prop('checked', false);

                    if(window.card.layout == '4' || window.card.layout == '5'){
                        item.find('label').html(`<span class="visually-hidden">${window.compare.add}</span>${window.compare.add}`);
                    }

                    halo.decrementCounterCompare(count, handle, $link);
                }
            });
        },

        setProductForCompare: function() {
            $doc.on('click', '[data-compare-link]', (event) => {
                event.preventDefault();
                event.stopPropagation();

                var count = JSON.parse(localStorage.getItem('compareItem'));

                if (count.length <= 1) {
                    alert(window.compare.message);

                    return false;
                } else {
                    halo.updateContentCompareProduct(count);
                }
            });

            $doc.on('click', '[data-compare-remove]', (event) => {
                event.preventDefault();
                event.stopPropagation();

                var id = $(event.currentTarget).data('compare-item'),
                    compareTable = $('[data-compare-product-popup] .compareTable'),
                    item = compareTable.find('.compareTable-row[data-product-compare-id="'+ id +'"]'),
                    handle = item.data('compare-product-handle');

                item.remove();
                    
                var count = JSON.parse(localStorage.getItem('compareItem')),
                    index = count.indexOf(handle),
                    $compareLink = $('a[data-compare-link]');

                if (index > -1) {
                    count.splice(index, 1);
                    count = halo.uniqueArray(count);
                    localStorage.setItem('compareItem', JSON.stringify(count));

                    Shopify.ProductCompare.setLocalStorageProductForCompare({
                        link: $compareLink,
                        onComplete: null
                    });
                }

                if(compareTable.find('tbody .compareTable-row').length < 2){
                    $body.removeClass('compare-product-show');
                }
            });
        },

        uniqueArray: function(list) {
            var result = [];

            $.each(list, function(index, element) {
                if ($.inArray(element, result) == -1) {
                    result.push(element);
                }
            });

            return result;
        },

        incrementCounterCompare: function(count, item, $link){
            const index = count.indexOf(item);

            count.push(item);
            count = halo.uniqueArray(count);

            localStorage.setItem('compareItem', JSON.stringify(count));

            Shopify.ProductCompare.updateCounterCompare($link);
        },

        decrementCounterCompare: function(count, item, $link){
            const index = count.indexOf(item);

            if (index > -1) {
                count.splice(index, 1);
                count = halo.uniqueArray(count);
                localStorage.setItem('compareItem', JSON.stringify(count));

                Shopify.ProductCompare.updateCounterCompare($link);
            }
        },

        updateContentCompareProduct: function(list){
            var popup = $('[data-compare-product-popup]'),
                compareTable = popup.find('.compareTable');

            compareTable.find('tbody').empty();

            $.ajax({
                type: 'get',
                url: window.routes.collection_all,
                cache: false,
                data: {
                    view: 'ajax_product_card_compare',
                    constraint: `limit=${list.length}+sectionId=list-compare+list_handle=` + encodeURIComponent(list)
                },
                beforeSend: function () {},
                success: function (data) {
                    compareTable.find('tbody').append(data);
                },
                error: function (xhr, text) {
                    alert($.parseJSON(xhr.responseText).description);
                },
                complete: function () {
                    $body.addClass('compare-product-show');
                }
            });
        },

        initProductView: function($scope){
            halo.productImageGallery($scope);
            halo.productLastSoldOut($scope);
            halo.productCustomerViewing($scope);
            halo.productCountdown($scope);
            halo.productNextPrev($scope);
            halo.productSizeChart($scope);
            halo.initVariantImageGroup($scope, window.variant_image_group);
        },

        initQuickView: function(){
            $doc.on('click', '[data-open-quick-view-popup]', (event) => {
                event.preventDefault();
                event.stopPropagation();

                var handle = $(event.currentTarget).data('product-handle');

                halo.updateContentQuickView(handle);
            });

            $doc.on('click', '[data-close-quick-view-popup]', (event) => {
                event.preventDefault();
                event.stopPropagation();

                $body.removeClass('quick-view-show');
            });

            $doc.on('click', '.background-overlay', (event) => {
                if($body.hasClass('quick-view-show')){
                    if (($(event.target).closest('[data-open-quick-view-popup]').length === 0) && ($(event.target).closest('[data-quick-view-popup]').length === 0)){
                        $body.removeClass('quick-view-show');
                    }
                }
            });
        },

        updateContentQuickView: function(handle){
            var popup = $('[data-quick-view-popup]'),
                popupContent = popup.find('.halo-popup-content');

            $.ajax({
                type: 'get',
                url: window.routes.root + '/products/' + handle + '?view=ajax_quick_view',
                beforeSend: function () {
                    popupContent.empty();
                },
                success: function (data) {
                    popupContent.html(data);
                },
                error: function (xhr, text) {
                    alert($.parseJSON(xhr.responseText).description);
                },
                complete: function () {
                    var $scope = popup.find('.quickView');

                    halo.productImageGallery($scope);
                    halo.productLastSoldOut($scope);
                    halo.productCustomerViewing($scope);
                    halo.productCountdown($scope);
                    halo.initVariantImageGroup($scope, window.variant_image_group_quick_view);
                    
                    if(window.wishlist.show){
                        Shopify.ProductWishlist.setProductForWishlist(handle);
                    }

                    $body.addClass('quick-view-show');

                    if (window.quick_view_buy_it_now && window.Shopify && Shopify.PaymentButton) {
                        Shopify.PaymentButton.init();
                    }

                    if($scope.find('.halo-socialShare').length > 0){
                        src = $scope.find('.halo-socialShare script').attr('src');

                        $.getScript(src)
                        .done(() => {
                            if(typeof addthis !== 'undefined') {
                                addthis.init();
                                addthis.layers.refresh();
                            }
                        });
                    }

                    if (halo.checkNeedToConvertCurrency()) {
                        Currency.convertAll(window.shop_currency, $('#currencies .active').attr('data-currency'), 'span.money', 'money_format');
                    }
                }
            });
        },

        productImageGallery: function($scope) {
            var sliderFor = $scope.find('.productView-for'),
                sliderNav = $scope.find('.productView-nav'),
                sliderForToShow = 6,
                sliderForToScroll = 1,
                mainArrows = sliderNav.data('arrow');

            if($scope.hasClass('layout-4')){
                mainArrows = true;
            }

            if(!$scope.hasClass('layout-5')){
                if(!sliderFor.hasClass('slick-initialized') && !sliderNav.hasClass('slick-initialized')) {
                    if($scope.hasClass('layout-1') || $scope.hasClass('layout-2')){
                        sliderFor.on('init',(event, slick) => {
                            sliderFor.find('.animated-loading').removeClass('animated-loading');
                        });

                        sliderFor.slick({
                            slidesToShow: sliderForToShow,
                            slidesToScroll: sliderForToScroll,
                            asNavFor: sliderNav,
                            arrows: true,
                            dots: false,
                            draggable: false,
                            adaptiveHeight: false,
                            focusOnSelect: true,
                            vertical: true,
                            verticalSwiping: true,
                            infinite: false,
                            nextArrow: '<button type="button" class="slick-arrow slick-next" aria-label="'+ window.accessibility.next_slide +'">' + window.slick.nextArrow + '</button>',
                            prevArrow: '<button type="button" class="slick-arrow slick-prev" aria-label="'+ window.accessibility.previous_slide +'">' + window.slick.prevArrow + '</button>',
                            responsive: [
                                {
                                    breakpoint: 1600,
                                    settings: {
                                        get slidesToShow() {
                                            if(sliderForToShow !== undefined && sliderForToShow !== null && sliderForToShow !== ''){
                                                if(sliderForToShow > 5){
                                                    return this.slidesToShow = sliderForToShow - 1;
                                                } else{
                                                    return this.slidesToShow = sliderForToShow;
                                                }
                                            } else {
                                                return this.slidesToShow = 1;
                                            }
                                        },
                                        slidesToScroll: sliderForToScroll
                                    }
                                },
                                {
                                    breakpoint: 1200,
                                    settings: {
                                        vertical: false,
                                        verticalSwiping: false
                                    }
                                }
                            ]
                        });
                    } else if($scope.hasClass('layout-3') || $scope.hasClass('layout-4')){
                        sliderFor.on('init',(event, slick) => {
                            sliderFor.find('.animated-loading').removeClass('animated-loading');
                        });

                        sliderFor.slick({
                            slidesToShow: sliderForToShow,
                            slidesToScroll: sliderForToScroll,
                            asNavFor: sliderNav,
                            arrows: true,
                            dots: false,
                            focusOnSelect: true,
                            infinite: false,
                            nextArrow: '<button type="button" class="slick-arrow slick-next" aria-label="'+ window.accessibility.next_slide +'">' + window.slick.nextArrow + '</button>',
                            prevArrow: '<button type="button" class="slick-arrow slick-prev" aria-label="'+ window.accessibility.previous_slide +'">' + window.slick.prevArrow + '</button>',
                            responsive: [
                                {
                                    breakpoint: 1600,
                                    settings: {
                                        get slidesToShow() {
                                            if(sliderForToShow !== undefined && sliderForToShow !== null && sliderForToShow !== ''){
                                                if(sliderForToShow > 5){
                                                    return this.slidesToShow = sliderForToShow - 1;
                                                } else{
                                                    return this.slidesToShow = sliderForToShow;
                                                }
                                            } else {
                                                return this.slidesToShow = 1;
                                            }
                                        },
                                        slidesToScroll: sliderForToScroll
                                    }
                                }
                            ]
                        });
                    }

                    sliderNav.slick({
                        fade: true,
                        arrows: mainArrows,
                        dots: false,
                        infinite: true,
                        slidesToShow: 1,
                        slidesToScroll: 1,
                        asNavFor: sliderFor,
                        nextArrow: '<button type="button" class="slick-arrow slick-arrow--circle slick-next" aria-label="'+ window.accessibility.next_slide +'">' + window.slick.nextArrow + '</button>',
                        prevArrow: '<button type="button" class="slick-arrow slick-arrow--circle slick-prev" aria-label="'+ window.accessibility.previous_slide +'">' + window.slick.prevArrow + '</button>'
                    });

                    if($scope.hasClass('layout-1') || $scope.hasClass('layout-2')){
                        if ($win.width() > 1199) {
                            if (sliderFor.find('.slick-arrow').length > 0) {
                                var height_for = sliderFor.outerHeight(),
                                    height_nav = sliderNav.outerHeight(),
                                    pos = (height_nav - height_for)/2;

                                sliderFor.parent().addClass('arrows-visible');
                                sliderFor.parent().css('top', pos);
                            } else {
                                sliderFor.parent().addClass('arrows-disable');
                            }
                        } else {
                            if (sliderFor.find('.slick-arrow').length > 0) {
                                sliderFor.parent().css('top', 'unset');
                            }
                        }
                    }

                    if (sliderNav.find('[data-youtube]').length > 0) {
                        if (typeof window.onYouTubeIframeAPIReady === 'undefined') {
                            window.onYouTubeIframeAPIReady = halo.initYoutubeCarousel.bind(window, sliderNav);

                            const tag = document.createElement('script');
                            tag.src = 'https://www.youtube.com/player_api';
                            const firstScriptTag = document.getElementsByTagName('script')[0];
                            firstScriptTag.parentNode.insertBefore(tag, firstScriptTag);
                        } else {
                            halo.initYoutubeCarousel(sliderNav);
                        }
                    }

                    if (sliderNav.find('[data-vimeo]').length > 0) {
                        sliderNav.on('beforeChange', (event, slick) => {
                            var currentSlide,
                                player,
                                command;

                            currentSlide = $(slick.$slider).find('.slick-current');
                            player = currentSlide.find('iframe').get(0);

                            command = {
                                'method': 'pause',
                                'value': 'true'
                            };

                            if (player != undefined) {
                                player.contentWindow.postMessage(JSON.stringify(command), '*');
                            }
                        });

                        sliderNav.on('afterChange', (event, slick) => {
                            var currentSlide,
                                player,
                                command;

                            currentSlide = $(slick.$slider).find('.slick-current');
                            player = currentSlide.find('iframe').get(0);

                            command = {
                                'method': 'play',
                                'value': 'true'
                            };

                            if (player != undefined) {
                                player.contentWindow.postMessage(JSON.stringify(command), '*');
                            }
                        });
                    }

                    if (sliderNav.find('[data-mp4]').length > 0) {
                        sliderNav.on('beforeChange', (event, slick) => {
                            var currentSlide,
                                player;

                            currentSlide = $(slick.$slider).find('.slick-current');
                            player = currentSlide.find('video').get(0);

                            if (player != undefined) {
                                player.pause();
                            }
                        });

                        sliderNav.on('afterChange', (event, slick) => {
                            var currentSlide,
                                player;

                            currentSlide = $(slick.$slider).find('.slick-current');
                            player = currentSlide.find('video').get(0);

                            if (player != undefined) {
                                player.play();
                            }
                        });
                    }
                }
            }

            var productFancybox = $scope.find('[data-fancybox]');

            if(productFancybox.length > 0){
                productFancybox.fancybox({
                    buttons: [
                        "zoom",
                        //"share",
                        "slideShow",
                        //"fullScreen",
                        //"download",
                        // "thumbs",
                        "close"
                    ]
                });
            }

            var productZoom = $scope.find('[data-zoom-image]');

            if ($win.width() > 1024) {
                productZoom.each((index, element) => {
                    var $this = $(element);
                    
                    if ($win.width() > 1024) {
                        $this.zoom({ url: $this.attr('data-zoom-image'), touch: false });
                    } else {
                        $this.trigger('zoom.destroy');
                    }
                });
            }

            $win.on('resize', () => {
                if($scope.hasClass('layout-1') || $scope.hasClass('layout-2')){
                    if ($win.width() > 1119) {
                        setTimeout(() => {
                            if (sliderFor.find('.slick-arrow').length > 0) {
                                var height_for = sliderFor.outerHeight(),
                                    height_nav = sliderNav.outerHeight(),
                                    pos = (height_nav - height_for)/2;

                                sliderFor.parent().addClass('arrows-visible');
                                sliderFor.parent().css('top', pos);
                            } else {
                                sliderFor.parent().addClass('arrows-disable');
                            }
                        }, 200);
                    } else {
                        setTimeout(() => {
                            if (sliderFor.find('.slick-arrow').length > 0) {
                                sliderFor.parent().css('top', 'unset');
                            }
                        }, 200);
                    }
                }
            });
        },

        initVariantImageGroup: function($scope, enable = false) {
            if(enable){
                if(!$scope.hasClass('layout-5')){
                    var inputChecked = $scope.find('[data-filter]:checked'),
                        sliderFor = $scope.find('.productView-for'),
                        sliderNav = $scope.find('.productView-nav');    

                    if(inputChecked.length > 0){
                        var className = inputChecked.data('filter');

                        if(className !== undefined) {
                            sliderNav.slick('slickUnfilter');
                            sliderFor.slick('slickUnfilter');

                            if(sliderNav.find(className).length && sliderFor.find(className).length) {
                                sliderNav.slick('slickFilter', className).slick('refresh');
                                sliderFor.slick('slickFilter', className).slick('refresh');
                            }
                        }
                    }

                    $doc.on('change', 'input[data-filter]', (event) => {
                        var className = $(event.currentTarget).data('filter');

                        sliderNav.slick('slickUnfilter');
                        sliderFor.slick('slickUnfilter');

                        if(className !== undefined) {

                            if(sliderNav.find(className).length && sliderFor.find(className).length) {
                                sliderNav.slick('slickFilter', className).slick('refresh');
                                sliderFor.slick('slickFilter', className).slick('refresh');
                            }
                        }
                    });
                }
            }
        },

        initYoutubeCarousel: function(slider) {
            slider.each((index, slick) => {
                const $slick = $(slick);

                if ($slick.find('[data-youtube]').length > 0) {
                    $slick.addClass('slick-slider--video');

                    halo.initYoutubeCarouselEvent(slick);
                }
            });
        },

        initYoutubeCarouselEvent: function(slick){
            var $slick = $(slick),
                $videos = $slick.find('[data-youtube]');

            bindEvents(slick);

            function bindEvents() {
                if ($slick.hasClass('slick-initialized')) {
                    onSlickVideoInit();
                }

                $slick.on('init', onSlickVideoInit);
                $slick.on('beforeChange', onSlickImageBeforeChange);
                $slick.on('afterChange', onSlickImageAfterChange);
            }

            function onPlayerReady(event) {
                $(event.target.getIframe()).closest('.slick-slide').data('youtube-player', event.target);

                setTimeout(function(){
                    if ($(event.target.getIframe()).closest('.slick-slide').hasClass('slick-active')) {
                        $slick.slick('slickPause');
                        event.target.playVideo();
                    }
                }, 200);
            }

            function onPlayerStateChange(event) {
                if (event.data === YT.PlayerState.PLAYING) {
                    $slick.slick('slickPause');
                }

                if (event.data === YT.PlayerState.ENDED) {
                    $slick.slick('slickNext');
                }
            }

            function onSlickVideoInit() {
                $videos.each((index, video) => {
                    const $video = $(video);
                    const id = `youtube_player_${Math.floor(Math.random() * 100)}`;

                    $video.attr('id', id);

                    const player = new YT.Player(id, {
                        host: 'http://www.youtube.com',
                        videoId: $video.data('youtube'),
                        wmode: 'transparent',
                        playerVars: {
                            autoplay: 0,
                            controls: 0,
                            disablekb: 1,
                            enablejsapi: 1,
                            fs: 0,
                            rel: 0,
                            showinfo: 0,
                            iv_load_policy: 3,
                            modestbranding: 1,
                            wmode: 'transparent',
                        },
                        events: {
                            onReady: onPlayerReady,
                            onStateChange: onPlayerStateChange,
                        },
                    });
                });
            }

            function onSlickImageBeforeChange(){
                const player = $slick.find('.slick-slide.slick-active').data('youtube-player');

                if (player) {
                    player.stopVideo();
                    $slick.removeClass('slick-slider--playvideo');
                }
            }

            function onSlickImageAfterChange(){
                const player = $slick.find('.slick-slide.slick-active').data('youtube-player');

                if (player) {
                    $slick.slick('slickPause');
                    $slick.addClass('slick-slider--playvideo');
                    player.playVideo();
                }
            }
        },

        productNextPrev: function($scope){
            var wrapper = $scope.find('.productView-nextProducts');

            if (wrapper.length > 0 && $win.width() > 1024) {
                const prodWrap = wrapper.find('.next-prev-modal'),
                    prodIcons = wrapper.find('.next-prev-icons'),
                    nextWrap = $('#next-product-modal'),
                    prevWrap = $('#prev-product-modal');

                prodIcons.on('mouseover', () => {
                    prodWrap.addClass('is-show');
                })
                .on('mouseleave', () => {
                    prodWrap.removeClass('is-show');
                });

                $('.next-icon', prodIcons).on('mouseover', () => {
                    prevWrap.removeClass('is-active');
                    nextWrap.addClass('is-active');
                });

                $('.prev-icon', prodIcons).on('mouseover', () => {
                    nextWrap.removeClass('is-active');
                    prevWrap.addClass('is-active');
                });

                prodWrap.on('mouseover', () => {
                    prodWrap.addClass('is-show');
                })
                .on('mouseleave', () => {
                    prodWrap.removeClass('is-show');
                });
            }
        },

        productSizeChart: function($scope){
            var sizeChartBtn =  $scope.find('[data-open-size-chart-popup]');

            sizeChartBtn.on('click', (event) => {
                event.preventDefault();
                event.stopPropagation();

                if(!$body.hasClass('size-chart-show')){
                    $body.addClass('size-chart-show');
                }
            });

            $doc.on('click', '[data-close-size-chart-popup]', () => {
                $body.removeClass('size-chart-show');
            });

            $doc.on('click', (event) => {
                if ($body.hasClass('size-chart-show')) {
                    if (($(event.target).closest('[data-open-size-chart-popup]').length === 0) && ($(event.target).closest('[data-size-chart-popup]').length === 0)) {
                        $body.removeClass('size-chart-show');
                    }
                }
            });
        },

        productLastSoldOut: function($scope) {
            var wrapper = $scope.find('[data-sold-out-product]');

            if (wrapper.length > 0) {
                var numbersProductList = wrapper.data('item').toString().split(','),
                    numbersProductItem = Math.floor(Math.random() * numbersProductList.length),
                    numbersHoursList = wrapper.data('hours').toString().split(','),
                    numbersHoursItem = Math.floor(Math.random() * numbersHoursList.length);

                wrapper.find('[data-sold-out-number]').text(numbersProductList[numbersProductItem]);
                wrapper.find('[data-sold-out-hours]').text(numbersHoursList[numbersHoursItem]);
                wrapper.show();
            }
        },

        productCustomerViewing: function($scope) {
            var wrapper = $scope.find('[data-customer-view]');

            if (wrapper.length > 0) {
                var numbersViewer = wrapper.data('customer-view'),
                    numbersViewerList =  JSON.parse('[' + numbersViewer + ']'),
                    numbersViewerTime = wrapper.data('customer-view-time'),
                    timeViewer =  parseInt(numbersViewerTime) * 1000;
                
                setInterval(function() {
                    var numbersViewerItem = (Math.floor(Math.random() * numbersViewerList.length));

                    wrapper.find('.text').text(window.customer_view.text.replace('[number]', numbersViewerList[numbersViewerItem]));
                }, timeViewer);
            }
        },

        productCountdown: function($scope){
            var wrapper = $scope.find('[data-countdown-id]'),
                countDown = wrapper.data('countdown'),
                countDownStyle = window.countdown.style,
                countDownDate = new Date(countDown).getTime(),
                countDownText = window.countdown.text;

            if(wrapper.length > 0) {
                var countdownfunction = setInterval(function() {
                    var now = new Date().getTime(),
                        distance = countDownDate - now;

                    if (distance < 0) {
                        clearInterval(countdownfunction);
                        wrapper.remove();
                    } else {
                        var days = Math.floor(distance / (1000 * 60 * 60 * 24)).toString().padStart(2, '0'),
                            hours = Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)).toString().padStart(2, '0'),
                            minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60)).toString().padStart(2, '0'),
                            seconds = Math.floor((distance % (1000 * 60)) / 1000).toString().padStart(2, '0'),
                            strCountDown;

                            if(countDownStyle == 1){
                                strCountDown = '<span class="text"><span>'+ countDownText +'</span></span><span class="num days">'+days+'<span>'+ window.countdown.days +'</span></span>\
                                    <span class="num hours">'+hours+'<span>'+ window.countdown.hour +'</span></span>\
                                    <span class="num minutes">'+minutes+'<span>'+ window.countdown.min +'</span></span>\
                                    <span class="num seconds">'+seconds+'<span>'+ window.countdown.sec +'</span></span>';
                            } else if(countDownStyle == 2){
                                strCountDown = '<span class="text"><span>'+ countDownText +'</span></span><span class="num days">'+days+'<span>'+ window.countdown.day +'</span></span>\
                                    <span class="num hours">'+hours+'</span><span class="seperate">:</span>\
                                    <span class="num minutes">'+minutes+'</span><span class="seperate">:</span>\
                                    <span class="num seconds">'+seconds+'</span>';
                            } else if(countDownStyle == 3){
                                strCountDown = '<span class="text"><span>'+ countDownText +'</span></span><span class="num days">'+days+'<span>'+ window.countdown.day +'</span></span> <span class="seperate">:</span>\
                                    <span class="num hours">'+hours+'</span><span class="seperate">:</span>\
                                    <span class="num minutes">'+minutes+'</span><span class="seperate">:</span>\
                                    <span class="num seconds">'+seconds+'</span>';
                            }

                        wrapper.html(strCountDown);
                    }
                }, 1000);
            }
        },

        initProductBundle: function() {
            var productBundle = $('[data-product-bundle]'),
                bundleList = productBundle.find('[data-bundle-slider]');

            if(bundleList.length > 0){
                if(!bundleList.hasClass('slick-initialized')){
                    bundleList.slick({
                        dots: true,
                        arrows: false,
                        slidesToShow: 2,
                        slidesToScroll: 1,
                        mobileFirst: true,
                        infinite: false,
                        nextArrow: '<button type="button" class="slick-arrow slick-arrow--circle slick-next" aria-label="'+ window.accessibility.next_slide +'">' + window.slick.nextArrow + '</button>',
                        prevArrow: '<button type="button" class="slick-arrow slick-arrow--circle slick-prev" aria-label="'+ window.accessibility.previous_slide +'">' + window.slick.prevArrow + '</button>',
                        responsive: [
                            {
                                breakpoint: 1200,
                                settings: {
                                    slidesToShow: 3,
                                    slidesToScroll: 1,
                                    dots: false,
                                    arrows: true
                                }
                            },
                            {
                                breakpoint: 551,
                                settings: {
                                    slidesToShow: 3,
                                    slidesToScroll: 1
                                }
                            }
                        ]
                    });

                    productBundle.find('.bundle-product-wrapper').removeClass('has-halo-block-loader');

                    bundleList.on('afterChange', function(){
                        bundleList.find('.bundle-product-item').removeClass('is-open');
                    });
                }
            }
        },

        initWishlist: function() {
            if(window.wishlist.show){
                Shopify.ProductWishlist.setLocalStorageProductForWishlist();

                $doc.on('click', '[data-wishlist]', (event) => {
                    event.preventDefault();
                    event.stopPropagation();

                    var $target = $(event.currentTarget),
                        id = $target.data('product-id'),
                        handle = $target.data('wishlist-handle'),
                        wishlistList = localStorage.getItem('wishlistItem') ? JSON.parse(localStorage.getItem('wishlistItem')) : [];
                        index = wishlistList.indexOf(handle),
                        wishlistContainer = $('[data-wishlist-content]');

                    if(!$target.hasClass('wishlist-added')){
                        $target
                            .addClass('wishlist-added')
                            .find('.text')
                            .text(window.wishlist.added);

                        if(wishlistContainer.length > 0) {
                            if(window.wishlist_layout == 'list') {
                                halo.setProductForWishlistPage(handle);
                            } else {
                                halo.setProductForWishlistPage2(wishlistList);
                            }
                        }

                        wishlistList.push(handle);
                        localStorage.setItem('wishlistItem', JSON.stringify(wishlistList));
                    } else {
                       $target
                            .removeClass('wishlist-added')
                            .find('.text')
                            .text(window.wishlist.add);

                        if(wishlistContainer.length > 0) {
                            if($('[data-wishlist-added="wishlist-'+ id +'"]').length > 0) {
                                $('[data-wishlist-added="wishlist-'+ id +'"]').remove();
                            }
                        }

                        wishlistList.splice(index, 1);
                        localStorage.setItem('wishlistItem', JSON.stringify(wishlistList));

                        if(wishlistContainer.length > 0) {
                            wishlistList = localStorage.getItem('wishlistItem') ? JSON.parse(localStorage.getItem('wishlistItem')) : [];

                            if (wishlistList.length > 0) {
                                halo.updateShareWishlistViaMail();
                            } else {
                                $('[data-wishlist-content]')
                                    .addClass('is-empty')
                                    .html(`\
                                    <div class="wishlist-content-empty text-center">\
                                        <span class="wishlist-content-text">${window.wislist_text.empty}</span>\
                                        <div class="wishlist-content-actions">\
                                            <a class="button button-2 button-continue" href="${window.routes.collection_all}">\
                                                ${window.wislist_text.continue_shopping}\
                                            </a>\
                                        </div>\
                                    </div>\
                                `);

                                $('[data-wishlist-footer]').hide();
                            }
                        }
                    }

                    Shopify.ProductWishlist.setProductForWishlist(handle);
                });
            }
        },

        initWishlistPage: function (){
            if(window.wishlist_page){
                if (typeof(Storage) !== 'undefined') {
                    var wishlistList = localStorage.getItem('wishlistItem') ? JSON.parse(localStorage.getItem('wishlistItem')) : [];

                    if (wishlistList.length > 0) {
                        wishlistList = JSON.parse(localStorage.getItem('wishlistItem'));

                        if(window.wishlist_layout == 'list') {
                            wishlistList.forEach((handle, index) => {
                                halo.setProductForWishlistPage(handle, index);
                            });
                        } else {
                            halo.setProductForWishlistPage2(wishlistList);
                        }
                    } else {
                        $('[data-wishlist-content]')
                            .addClass('is-empty')
                            .html(`\
                            <div class="wishlist-content-empty text-center">\
                                <span class="wishlist-content-text">${window.wislist_text.empty}</span>\
                                <div class="wishlist-content-actions">\
                                    <a class="button button-2 button-continue" href="${window.routes.collection_all}">\
                                        ${window.wislist_text.continue_shopping}\
                                    </a>\
                                </div>\
                            </div>\
                        `);

                        $('[data-wishlist-footer]').hide();
                    }
                } else {
                    alert('Sorry! No web storage support..');
                }
            }
        },

        setProductForWishlistPage: function(handle, index) {
            var wishlistContainer = $('[data-wishlist-content]');

            $.getJSON(window.routes.root + '/products/'+ handle +'.js', (product) => {
                var productHTML = '',
                    price_min = Shopify.formatMoney(product.price_min, window.money_format);

                productHTML += '<tr class="wishlist-row" data-wishlist-added="wishlist-'+ product.id +'" data-product-id="product-'+ product.handle +'">';
                productHTML += '<td class="wishlist-rowItem wishlist-image text-left">';
                productHTML += '<div class="item">';
                productHTML += '<a class="item-image" href="'+ product.url +'"><img src="'+ product.featured_image +'" alt="'+ product.featured_image.alt +'"></a></div>';
                productHTML += '</td>';
                productHTML += '<td class="wishlist-rowItem wishlist-meta text-left">';
                productHTML += '<div class="item">';
                productHTML += '<div class="item-info"><a class="item-vendor" href="'+ window.routes.root +'/collections/vendors?q='+ product.vendor +'">'+ product.vendor +'</a>';
                productHTML += '<a class="item-title link link-underline" href="'+ product.url +'"><span class="text">'+ product.title +'</span></a></div>';
                productHTML += '</div></td>';
                productHTML += '<td class="wishlist-rowItem wishlist-price text-left"><div class="item-price">'+ price_min +'</div></td>';
                productHTML += '<td class="wishlist-rowItem wishlist-add text-center">';
                productHTML += '<form action="/cart/add" method="post" class="variants" id="wishlist-product-form-'+ product.id +'" data-id="product-actions-'+ product.id +'" enctype="multipart/form-data">';

                if (product.available) {
                    if (product.variants.length == 1) {
                        productHTML += '<button data-btn-addToCart class="item-btn button add-to-cart-btn"data-form-id="#wishlist-product-form-' + product.id +'" type="submit">'+ window.variantStrings.addToCart +'</button><input type="hidden" name="id" value="'+ product.variants[0].id +'" />';
                    }

                    if (product.variants.length > 1){
                        productHTML += '<a class="item-btn button" title="'+product.title+'" href="'+ product.url +'">'+ window.variantStrings.select +'</a>';
                    }
                } else {
                    productHTML += '<button class="item-btn button add-to-cart-btn" type="submit" disabled>'+ window.variantStrings.select +'</button>';
                }

                productHTML += '</form></td>';
                productHTML += '<td class="wishlist-rowItem wishlist-remove text-center"><a class="item-remove wishlist-added" href="#" data-product-handle="'+ product.handle +'" data-wishlist data-id="'+ product.id +'"><svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" aria-hidden="true" focusable="false" role="presentation" class="icon icon-remove"><path d="M 10.3125 -0.03125 C 8.589844 -0.03125 7.164063 1.316406 7 3 L 2 3 L 2 5 L 6.96875 5 L 6.96875 5.03125 L 17.03125 5.03125 L 17.03125 5 L 22 5 L 22 3 L 17 3 C 16.84375 1.316406 15.484375 -0.03125 13.8125 -0.03125 Z M 10.3125 2.03125 L 13.8125 2.03125 C 14.320313 2.03125 14.695313 2.429688 14.84375 2.96875 L 9.15625 2.96875 C 9.296875 2.429688 9.6875 2.03125 10.3125 2.03125 Z M 4 6 L 4 22.5 C 4 23.300781 4.699219 24 5.5 24 L 18.59375 24 C 19.394531 24 20.09375 23.300781 20.09375 22.5 L 20.09375 6 Z M 7 9 L 8 9 L 8 22 L 7 22 Z M 10 9 L 11 9 L 11 22 L 10 22 Z M 13 9 L 14 9 L 14 22 L 13 22 Z M 16 9 L 17 9 L 17 22 L 16 22 Z"></path></svg></a></td>';
                productHTML += '</tr>';

                wishlistContainer.find('tbody').append(productHTML);

                if(index == wishlistContainer.find('[data-wishlist-added]').length - 1){
                    halo.updateShareWishlistViaMail();
                }
            });
        },

        setProductForWishlistPage2: function(list){
            var wishlistContainer = $('[data-wishlist-content]'),
                image_ratio = wishlistContainer.data('image-ratio'),
                portrait_aspect_ratio = wishlistContainer.data('portrait-aspect-ratio');

            $.ajax({
                type: 'get',
                url: window.routes.collection_all,
                cache: false,
                data: {
                    view: 'ajax_product_card_wishlist',
                    constraint: `limit=${list.length}+sectionId=list-wishlist+imageRatio=${image_ratio}+portraitAspectRatio=${portrait_aspect_ratio}+list_handle=` + encodeURIComponent(list)
                },
                beforeSend: function () {},
                success: function (data) {
                    wishlistContainer.html(data);

                    halo.updateShareWishlistViaMail();
                },
                error: function (xhr, text) {
                    alert($.parseJSON(xhr.responseText).description);
                },
                complete: function () {
                    if(window.product_swatch_style == 'slider'){
                        var product = wishlistContainer.find('.product');

                        halo.initProductCardSwatchSlider(product);
                    }

                    if(window.compare.show){
                        Shopify.ProductCompare.setLocalStorageProductForCompare({
                            link: $('a[data-compare-link]'),
                            onComplete: null
                        });
                    }

                    if (halo.checkNeedToConvertCurrency()) {
                        Currency.convertAll(window.shop_currency, $('#currencies .active').attr('data-currency'), 'span.money', 'money_format');
                    }
                }
            });
        },

        updateShareWishlistViaMail: function(){
            const regex = /(<([^>]+)>)/ig;

            var $share = $('[data-wishlist-share]'),
                href = 'mailto:?subject= Wish List&body=',
                product,
                title,
                url,
                price;

            $('[data-wishlist-added]').each((index, element) => {
                if(window.wishlist_layout == 'list') {
                    product = $(element);
                    price = product.find('.item-price .money').text();
                    title = product.find('.item-title .text').text();
                    url = product.find('.item-title').attr('href');
                } else {
                    product = $(element).find('.product-item').data('json-product');
                    price = Shopify.formatMoney(product.price_min, window.money_format);
                    title = product.title;
                    url = product.url;
                }

                href += encodeURIComponent(title + '\nPrice: ' + price.replace(regex, '') + '\nLink: ' + window.location.protocol + '//' + window.location.hostname + url +'\n\n');
            });

            $share.attr('href', href);
        },

        initLookbook: function(){
            $doc.on('click', '[data-open-lookbook-popup]', (event) =>{
                event.preventDefault();
                event.stopPropagation();

                var $target = $(event.currentTarget),
                    handle = $target.data('product-handle'),
                    width = $target.innerWidth(),
                    top = $target.offset().top,
                    left = $target.offset().left,
                    lookbook = $target.closest('.halo-lookbook-box'),
                    lookbook_top = lookbook.offset().top,
                    popup = lookbook.find('.halo-lookbook-popup'),
                    popupWidth = popup.innerWidth(),
                    str3 = width + "px",
                    str4 = popupWidth + "px",
                    newtop,
                    newleft;
                    list = [];

                top = top - lookbook_top;

                if (window.innerWidth > 767) {
                    if (left > (popupWidth + 31)) {
                        newleft = "calc(" + left + "px" + " - " + str4 + " + " + "2px" + ")";
                    } else {
                        newleft = "calc(" + left + "px" + " + " + str3 + " - " + "2px" + ")";
                    }

                    newtop = top + "px" ;
                } else {
                    newleft = 0;
                    newtop = top - 10 + "px";
                }

                list.push(handle);

                $.ajax({
                    type: 'get',
                    url: window.routes.collection_all,
                    cache: false,
                    data: {
                        view: 'ajax_product_card',
                        constraint: `limit=1+sectionId=list-lookbook+list_handle=` + encodeURIComponent(list)
                    },
                    beforeSend: function () {},
                    success: function (data) {
                        popup.find('.content').html(data);
                        popup.css({
                            'left': newleft,
                            'top': newtop
                        });
                    },
                    complete: function () {
                        lookbook.addClass('is-open');

                        if(window.product_swatch_style == 'slider'){
                            var product = popup.find('.product');

                            halo.initProductCardSwatchSlider(product);
                        }

                        if(window.compare.show){
                            Shopify.ProductCompare.setLocalStorageProductForCompare({
                                link: $('a[data-compare-link]'),
                                onComplete: null
                            });
                        }

                        if(window.wishlist.show){
                            Shopify.ProductWishlist.setLocalStorageProductForWishlist();
                        }

                        if (halo.checkNeedToConvertCurrency()) {
                            Currency.convertAll(window.shop_currency, $('#currencies .active').attr('data-currency'), 'span.money', 'money_format');
                        }
                    }
                });
            });

            $doc.on('click', '[data-close-lookbook-popup]', (event) =>{
                event.preventDefault();
                event.stopPropagation();

                var $target = $(event.currentTarget),
                    lookbook = $target.closest('.halo-lookbook-box');

                lookbook.removeClass('is-open');
            });

            $doc.on('click', (event) => {
                if (($(event.target).closest('[data-open-lookbook-popup]').length === 0) && ($(event.target).closest('.halo-lookbook-box').length === 0)) {
                    $('.halo-lookbook-box').removeClass('is-open');
                }
            });
        },

        initDynamicBrowserTabTitle: function() {
            if(window.dynamic_browser_title.show){
                var pageTitleContent = document.title,
                    newPageTitleContent = window.dynamic_browser_title.text;

                window.onblur = function () {
                    document.title = window.dynamic_browser_title.text;
                }

                window.onfocus = function () {
                    document.title = pageTitleContent;
                }
            }
        }
    }
})(jQuery);