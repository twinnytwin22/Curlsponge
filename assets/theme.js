(function ($) {
    var $body = $('body'),
        $doc = $(document),
        $html = $('html'),
        $win = $(window);

    // Detect events when page has loaded
    window.addEventListener('beforeunload', () => {
        document.body.classList.add('u-p-load');
    });

    window.addEventListener('DOMContentLoaded', () => {
        document.body.classList.add('p-load');

        document.dispatchEvent(new CustomEvent('page:loaded'));
    });

    window.addEventListener('pageshow', (event) => {
        // Removes unload class when the page was cached by the browser
        if (event.persisted) {
        document.body.classList.remove('u-p-load');
        }
    });

    document.addEventListener("DOMContentLoaded", function () {
        halo.init();
    });

    var halo = {
        init: function () {
            this.loaderScript();
            this.loaderProductBlock();
            this.initResizeMenu();
            this.initMultiTab();
            this.initMobileMenuCustom();
            this.initHeader();
            this.headerSearch();
            this.headerSearchEvent();
            this.footerSearch();
            this.initColorSwatch();
            this.initAddToCart();
            this.initQuickShop();
            this.initQuickCart();
            this.initBeforeYouLeave();
            this.initNotifyInStock();
            this.initCompareProduct();
            this.initQuickView();
            this.initWishlist();
            this.clickedActiveProductTabs();
            this.clickedActiveVideoBanner();
            this.initProductCardSwapVideo();
            this.initProductCardSwatch();
            this.initDynamicBrowserTabTitle();
            this.formMessage();
            this.initAskAnExpert();

            // Init Mobile Menu 
            if (window.innerWidth < 1025) {
                this.navSidebarMobile();
                this.navSidebarMobileToggle();
                this.navSidebarMobileTabToggle();
            }

            if($body.hasClass('template-product')) {
                this.initProductView($('.halo-productView'));
                this.buildRecommendationBlock();
                this.buildRecentlyViewedBlock();
                this.buildComplementaryProducts();
                this.initProductBundle();
            }

            if($body.hasClass('template-collection') || $body.hasClass('template-search')) {
                this.initInfiniteScrolling();
                this.initQuickShopProductList();
                this.initProductCardSwatchSliderForGrid();
            }

            if($body.hasClass('template-page')) {
                this.initWishlistPage();
            }

            let checkMenuMobile;
            window.innerWidth > 1024 ? checkMenuMobile = true : checkMenuMobile = false;

            $win.on('resize', () => {
                var resize = debounce(() => {
                    halo.headerSearch();
                }, 100);

                resize();
                if (window.innerWidth > 1024) {
                    document.body.classList.remove('menu-open')
                } else if (checkMenuMobile) {
                    checkMenuMobile = false;
                    this.navSidebarMobile();
                    this.navSidebarMobileToggle();
                    this.navSidebarMobileTabToggle();
                    this.initMultiTab();
                    this.initMobileMenuCustom();
                }
            });
        },
        
        checkNeedToConvertCurrency: function () {
            return (window.show_multiple_currencies && Currency.currentCurrency != window.shop_currency) || window.show_auto_currency;
        },

        loaderScript: function() {
            var load = () => {
                if (document.querySelector('[data-loader-script]')) {
                    document.querySelectorAll('[data-loader-script]').forEach((element) => {
                        let link = element.getAttribute('data-loader-script'),
                            top = element.getBoundingClientRect().top;

                        if (!element.classList.contains('is-load')){
                            if (top < window.innerHeight + 100) {
                                halo.buildScript(link);

                                document.querySelectorAll(`[data-loader-script="${link}"]`).forEach((section) => {
                                    section.classList.add('is-load');
                                });
                            }
                        }
                    });
                }
            }
            
            load();
            window.addEventListener('scroll', load);
        },

        buildScript: function(name) {
            var loadScript = document.createElement('script');

            loadScript.src = name;
            document.body.appendChild(loadScript);
        },

        buildStyleSheet: function(name, $this) {
            if (name == '') return;
            const loadStyleSheet = document.createElement("link");
            loadStyleSheet.rel = 'stylesheet';
            loadStyleSheet.type = 'text/css';
            loadStyleSheet.href = name;
            $this.parentNode.insertBefore(loadStyleSheet, $this);
        },

        initHeader: function() {
            const headerNavigation = document.querySelectorAll('.section-header-navigation'),
                headerTransparent = document.querySelectorAll('.section-header-navigation .background-transparent-2'),
                headerLine = document.querySelectorAll('.header-line');
            if (headerNavigation) {
                let index = headerNavigation.length + 20;
                headerNavigation.forEach((element) => {
                    element.setAttribute('data-index', index);
                    element.style.zIndex = index;
                    if(headerTransparent.length) {
                        headerLine.forEach((element) => {
                            element.style.zIndex = index + 4;
                        });
                    }
                    index--
                })

                const headerHeightTransparent = document.querySelectorAll('.section-header-navigation.enable-bg-transparent');
                if (headerHeightTransparent.length > 1 && document.body.classList.contains('template-index')) {
                    headerHeightTransparent.forEach((element) => {
                        const height = element.querySelectorAll('.transparent');
                        element.style.setProperty('--header-height', `${height[0].offsetHeight}px`);
                    })
                    const transformTransparent = document.querySelector('.section-header-navigation.enable-bg-transparent + .section-header-navigation.enable-bg-transparent'),
                        heigthTransform = document.querySelector('.enable-bg-transparent .transparent');
                    transformTransparent.style.transform = `translateY(${heigthTransform.offsetHeight}px)`
                } 
            }
        },

        headerSearch: function() {
            if($('.section-header-navigation').length == 1) {
                if(!window.hidden_search_header){
                    if ($win.width() < 1025) {
                        if ($('.header-mobile.header-mobile-style-full .header-mobile-search').length > 0 ){
                            if (!$('.header-mobile-search .header__seach--details').length){
                                $('.header-mobile-search .header__search--mobile').empty();
                                if($('.header .header__search').hasClass('show-icon')) {
                                    $('.header .header__search .header__seach--details').appendTo($('.header-mobile-search .header__search--mobile'));
                                } else if($('.header .header__search').hasClass('show-full')) {
                                    $('.header .header__search .header__seach--details.predictive-search-form').appendTo($('.header-mobile-search .header__search--mobile'));
                                }
                            }
                        }
                    } else {
                        if ($('.header-mobile.header-mobile-style-full .header-mobile-search').length > 0){
                            if (!$('.header .header__search .header__seach--details').length){
                                $('.header .header__search').empty();
                                $('.header-mobile.header-mobile-style-full .header-mobile-search .header__seach--details').appendTo($('.header .header__search'));
                            }
                        } else {
                            if (!$('.header .header__search').find('.header__seach--details').length){
                                $('.header .header__search').empty();
                                $('#search-form-mobile .halo-sidebar-wrapper').find('.header__seach--details').appendTo($('.header .header__search'));
                            }
                        }
                    }
                }
            } else {
                $('.section-header-navigation').each((index, element) => {
                    if(!window.hidden_search_header){
                        if ($win.width() < 1025) {
                            if ($('.header-mobile.header-mobile-style-full .header-mobile-search').length > 0 ){
                                if (!$('.header-mobile-search .header__seach--details').length){
                                    $('.header-mobile-search .header__search--mobile').empty();
                                    if($(element).find('.header .header__search').hasClass('show-icon')) {
                                        $(element).find('.header .header__search .header__seach--details').appendTo($('.header-mobile-search .header__search--mobile'));
                                    } else if($(element).find('.header .header__search').hasClass('show-full')) {
                                        $(element).find('.header .header__search .header__seach--details.predictive-search-form').appendTo($('.header-mobile-search .header__search--mobile'));
                                    }
                                }
                            }
                        } else {
                            if ($('.header-mobile.header-mobile-style-full .header-mobile-search').length > 0){
                                if (!$(element).find('.header .header__search .header__seach--details').length){
                                    $(element).find('.header .header__search').empty();
                                    $('.header-mobile.header-mobile-style-full .header-mobile-search .header__seach--details').appendTo($(element).find('.header .header__search'));
                                }
                            } else {
                                if (!$('.header .header__search').find('.header__seach--details').length){
                                    $(element).find('.header .header__search').empty();
                                    $('#search-form-mobile .halo-sidebar-wrapper').find('.header__seach--details').appendTo($(element).find('.header .header__search'));
                                }
                            }
                        }
                    }
                })
            }
        },

        headerSearchEvent: function(){
            if ($win.width() < 1025) {
                if ($('.header-mobile.header-mobile-style-full .header-mobile-search').length > 0 ){
                    $('.header-mobile.header-mobile-style-full .header-mobile-search input[name="q"]').focus(() => {
                        if(!$body.hasClass('open-drawer')){
                            $body.addClass('open-search');

                            $('details.header__seach--details').attr('open','true');
                        }
                    });
                }
            } else {
                if($('[class^="header header-"]').length == 1) {
                    if(!$body.hasClass('open-drawer')){
                        $('.header__search input[name="q"]').on('click', (event) => {
                            $body.addClass('open-search');
                            $('details.header__seach--details').attr('open','true');
                        });
                    }

                    $doc.on('click', '[data-open-search-popup]', (event) => {
                        event.preventDefault();
                        $body.addClass('open-search-popup');
                        $('.search-modal.search-modal-popup').attr('open','true');
                    });

                    $doc.on('click', '[data-close-search-popup]', (event) => {
                        event.preventDefault();
                        $body.removeClass('open-search-popup');
                        $('.search-modal.search-modal-popup').removeAttr('open');
                    });
                } else {
                    $('[class^="header header-"]').each((index, element) => {
                        if(!$body.hasClass('open-drawer')){
                            $(element).find('.header__search input[name="q"]').on('click', (event) => {
                                $body.addClass('open-search');
                                $(element).find('details.header__seach--details').attr('open','true');
                            });
                        }
    
                        $(element).on('click', '[data-open-search-popup]', (event) => {
                            event.preventDefault();
                            $body.addClass('open-search-popup');
                            $(element).find('.search-modal.search-modal-popup').attr('open','true');
                        });
    
                        $(element).on('click', '[data-close-search-popup]', (event) => {
                            event.preventDefault();
                            $body.removeClass('open-search-popup');
                            $(element).find('.search-modal.search-modal-popup').removeAttr('open');
                        });
                    });
                }
            }

            $doc.on('click', '[data-close-search-popup]', (event) => {
                event.preventDefault();
                $body.removeClass('open-search');
                $('details.header__seach--details').removeAttr('open');
            });

            if (!$body.hasClass('open-drawer')) {
                $doc.on('click', '[data-search-mobile]', (event) => {
                    event.preventDefault();
                    event.stopPropagation();
    
                    if(!$('#search-form-mobile .halo-sidebar-wrapper').find('.header__seach--details').length){
                        if ($('.header-mobile.header-mobile-style-full .header-mobile-search').length > 0 ){
                            $('.header-mobile.header-mobile-style-full .header-mobile-search .header__seach--details').appendTo($('#search-form-mobile .halo-sidebar-wrapper'));
                        }
                    }
    
                    $('details.header__seach--details').attr('open','true');
                });
            }

            $doc.on('click', '[data-search-close-sidebar]', (event) => {
                event.preventDefault();
                event.stopPropagation();

                if($('#search-form-mobile .halo-sidebar-wrapper').find('.header__seach--details').length > 0){
                    if ($('.header-mobile.header-mobile-style-full .header-mobile-search').length > 0 ){
                        $('#search-form-mobile .halo-sidebar-wrapper').find('.header__seach--details').appendTo($('.header-mobile.header-mobile-style-full .header-mobile-search'));
                    }
                }

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
                        $('.search-modal.search-modal-popup').removeAttr('open');
                    }
                }

                if($body.hasClass('open-drawer')){
                    if($(event.target).closest('.halo-sidebar-search').length === 0 && $(event.target).closest('[data-search-mobile]').length === 0){
                        if($('#search-form-mobile .halo-sidebar-wrapper').find('.header__seach--details').length > 0){
                            if ($('.header-mobile.header-mobile-style-full .header-mobile-search').length > 0 ){
                                $('#search-form-mobile .halo-sidebar-wrapper .header__seach--details').appendTo($('.header-mobile.header-mobile-style-full .header-mobile-search'));
                            }
                        }

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

        initResizeMenu: function() {
            if($('[class^="header header-"]').length == 1) {
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
                                const mainWidth = Math.round($main.width());
    
                                if($body.hasClass("rtl")) {
                                    const lastItemLeft = Math.round(($lastItem.offset().left + $lastItem.outerWidth()) - ($main.offset().left + $main.outerWidth()) + $lastItem.width());
    
                                    if ($dropdown.children().length > 0) {
                                        if($toggle.length > 0){
                                            const toggleLeft = Math.round(($toggle.offset().left + $toggle.outerWidth()) - ($main.offset().left + $main.outerWidth()) - $toggle.width());
    
                                            if (Math.abs(toggleLeft) > mainWidth) {
                                                $dropdown.prepend($lastItem);
                                            } else {
                                                break;
                                            }
                                        }
                                    } else if (Math.abs(lastItemLeft) < mainWidth) {
                                        $dropdown.prepend($lastItem);
                                        $toggle.removeClass('visually-hidden');
                                    } else {
                                        break;
                                    }
                                } else {
                                    const lastItemRight = Math.round($lastItem.offset().left - $main.offset().left + $lastItem.width());
    
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
                                }
                            } else{
                                break;
                            }
                        } while (true);
                    };
    
                    $win.on('resize', debounce(resize, 200));
    
                    resize();
                }
            } else {
                $('[class^="header header-"]').each((index, element) => {
                    if($(element).find('[data-resize-menu]').length > 0){
                        const $main = $(element).find('[data-resize-menu]'),
                            $toggle = $main.children('[data-menu-lv-toggle]'),
                            $dropdown = $toggle.find('[data-menu-lv-toggle-content]');
                        const resize = () => {
                            if (!$toggle.is('.visually-hidden')) {
                                $toggle.before($dropdown.children());
                                $toggle.addClass('visually-hidden');
                            }
        
                            if ($win.width() <= 1024) {
                                $(element).find('#HeaderNavigation').removeClass('has-resize-menu');
                                return;
                            } else{
                                $(element).find('#HeaderNavigation').removeClass('has-resize-menu');
                            }
                            
                            do {
                                const $lastItem = $main.children('.menu-lv-1:not(:last-child):last');
        
                                if($lastItem.length > 0){
                                    const mainWidth = Math.round($main.width());
        
                                    if($body.hasClass("rtl")) {
                                        const lastItemLeft = Math.round(($lastItem.offset().left + $lastItem.outerWidth()) - ($main.offset().left + $main.outerWidth()) + $lastItem.width());
        
                                        if ($dropdown.children().length > 0) {
                                            if($toggle.length > 0){
                                                const toggleLeft = Math.round(($toggle.offset().left + $toggle.outerWidth()) - ($main.offset().left + $main.outerWidth()) - $toggle.width());
        
                                                if (Math.abs(toggleLeft) > mainWidth) {
                                                    $dropdown.prepend($lastItem);
                                                } else {
                                                    break;
                                                }
                                            }
                                        } else if (Math.abs(lastItemLeft) < mainWidth) {
                                            $dropdown.prepend($lastItem);
                                            $toggle.removeClass('visually-hidden');
                                        } else {
                                            break;
                                        }
                                    } else {
                                        const lastItemRight = Math.round($lastItem.offset().left - $main.offset().left + $lastItem.width());
        
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
                                    }
                                } else{
                                    break;
                                }
                            } while (true);
                        };
        
                        $win.on('resize', debounce(resize, 200));
        
                        resize();
                    }
                })
            }
            
        },

        navSidebarMobile: function() {
            if($('.section-header-navigation').length == 1) {
                var buttonIconOpen = $('.mobileMenu-toggle'),
                    buttonClose = $('.halo-sidebar-close, .background-overlay');

                const menuSidebarMobileOpen = () => {
                    $body.addClass('menu-open');
                    $('.list-menu-loading').remove();

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
                            $('.nav-product-carousel.slick-initialized').each((index, element) => {
                                $(element).get(0).slick.setPosition();
                            });
                        }
                    }
                }

                if (document.body.matches('.menu-open')) {
                    menuSidebarMobileOpen();
                }

                buttonIconOpen.off('click.toggleCurrencyLanguage').on('click.toggleCurrencyLanguage', (event) =>{
                    event.preventDefault();
                    menuSidebarMobileOpen();
                });

                buttonClose.off('click.toggleCloseCurrencyLanguage').on('click.toggleCloseCurrencyLanguage', () =>{
                    $body.removeClass('menu-open');
                    $('#navigation-mobile').off('transitionend.toggleCloseMenu').on('transitionend.toggleCloseMenu', () => {
                        if (!$body.hasClass('menu-open')) {
                            var menuMobile = $('[data-navigation-mobile]'),
                                menuDesktop = $('#HeaderNavigation [data-navigation]');
    
                            if(window.mobile_menu == 'default'){
                                if(!$('.header .menu-tab').length){
                                    $('#navigation-mobile .site-nav-mobile.nav-menu-tab .menu-tab').appendTo($('.header .header-menu-tab'));
                                }
    
                                if(!$('.header .header-brands .header__brands').length){
                                    $('#navigation-mobile .site-nav-mobile.nav-menu-tab .header__brands').appendTo($('.header .header-brands'));
                                }
    
                                if(!$('.header .header__inline-customer_service .customer-service').length){
                                    $('#navigation-mobile .site-nav-mobile.nav-acc .service-mb .customer-service').appendTo($('.header .header__inline-customer_service'));
                                }
                            }
    
                            if(!$('.wrapper_language_currency .dropdown-language-currency').length){
                                $('#navigation-mobile .site-nav-mobile .dropdown-language-currency').appendTo($('.wrapper_language_currency'));
                            }
    
                            menuMobile.find('li').removeClass('is-open is-hidden');
    
                            if(window.mobile_menu == 'default' && !menuDesktop.children().length){
                                menuMobile.children().appendTo(menuDesktop);
    
                                if($('.nav-product-carousel').length > 0){
                                    $('.nav-product-carousel.slick-initialized').each((index, element) => {
                                        $(element).get(0).slick.setPosition();
                                    });
                                }
                            }
                        }
                    })
                        
                });

                $doc.on('click', '[data-menu-close-sidebar]', (event) => {
                    event.preventDefault();
                    event.stopPropagation();
                    $body.removeClass('menu-open');
                });
            } else {
                $('.section-header-navigation').each((index, element) => {
                    var buttonIconOpen = $('.mobileMenu-toggle'),
                    buttonClose = $('.halo-sidebar-close, .background-overlay');

                    const menuSidebarMobileOpen = () => {
                        $body.addClass('menu-open');
                        $('.list-menu-loading').remove();

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
                                $('.nav-product-carousel.slick-initialized').each((index, element) => {
                                    $(element).get(0).slick.setPosition();
                                });
                            }
                        }
                    }

                    if (document.body.matches('.menu-open')) {
                        menuSidebarMobileOpen();
                    }

                    buttonIconOpen.off('click.toggleCurrencyLanguage').on('click.toggleCurrencyLanguage', (event) =>{
                        event.preventDefault();
                        menuSidebarMobileOpen();
                    });

                    buttonClose.off('click.toggleCloseCurrencyLanguage').on('click.toggleCloseCurrencyLanguage', () =>{
                        $body.removeClass('menu-open');
                        $('#navigation-mobile').off('transitionend.toggleCloseMenu').on('transitionend.toggleCloseMenu', () => {
                            if (!$body.hasClass('menu-open')) {
                                var menuMobile = $('[data-navigation-mobile]'),
                                    menuDesktop = $('#HeaderNavigation [data-navigation]');
        
                                if(window.mobile_menu == 'default'){
                                    if(!$('.header .menu-tab').length){
                                        $('#navigation-mobile .site-nav-mobile.nav-menu-tab .menu-tab').appendTo($('.header .header-menu-tab'));
                                    }
        
                                    if(!$('.header .header-brands .header__brands').length){
                                        $('#navigation-mobile .site-nav-mobile.nav-menu-tab .header__brands').appendTo($('.header .header-brands'));
                                    }
        
                                    if(!$('.header .header__inline-customer_service .customer-service').length){
                                        $('#navigation-mobile .site-nav-mobile.nav-acc .service-mb .customer-service').appendTo($('.header .header__inline-customer_service'));
                                    }
                                }
        
                                if(!$('.wrapper_language_currency .dropdown-language-currency').length){
                                    $('#navigation-mobile .site-nav-mobile .dropdown-language-currency').appendTo($('.wrapper_language_currency'));
                                }
        
                                menuMobile.find('li').removeClass('is-open is-hidden');
        
                                if(window.mobile_menu == 'default' && !menuDesktop.children().length){
                                    menuMobile.children().appendTo(menuDesktop);
        
                                    if($('.nav-product-carousel').length > 0){
                                        $('.nav-product-carousel.slick-initialized').each((index, element) => {
                                            $(element).get(0).slick.setPosition();
                                        });
                                    }
                                }
                            }
                        })
                            
                    });

                    $doc.on('click', '[data-menu-close-sidebar]', (event) => {
                        event.preventDefault();
                        event.stopPropagation();
                        $body.removeClass('menu-open');
                    });
                })
            }
        },

        navSidebarMobileToggle: function() {
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
                    $parentLv1 = $target.parents('.menu-lv-1'),
                    $parentLv2 = $target.parents('.menu-lv-2'),
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
            let designMode, showMenu = true;
            let check = false;
            document.body.matches('.shopify-design-mode') ? designMode = true : designMode = false;
            document.body.matches('.menu-open') ? showMenu = true : showMenu = false;
                
            const loadMenuDefault = () => {
                if (check == false) {
                    check = false;

                    halo.initMobileMenuDefault(url)
                }
            }

            const loadMenuCustom = () => {
                if (check == false) {
                    check = true;

                    halo.initMobileMenuCustom()
                }
            }

            const loadCssMenu = () => {
                if (check == false) {
                    check = true;

                    let checkLoadEC = true; 
                    if (checkLoadEC) {
                        checkLoadEC = false;
                        const $menu = document.querySelector('.header-nav');
                        const urlStyleEC = $menu.dataset.urlStyleMenu;

                        halo.buildStyleSheet(urlStyleEC, $menu);
                    }
                }
            }

            if($('[data-menu-tab]').length > 0){
                $doc.on('click', '[data-menu-tab] li', (event) => {
                    var active = $(event.currentTarget).data('load-page'),
                        href= $(event.currentTarget).attr('href');

                    setCookie('page-url', active, 1);
                });

                var canonical = $('[canonical-shop-url]').attr('canonical-shop-url'),
                    pageUrl = getCookie('page-url'),
                    menuTabItem,
                    logoTabItem;

                if ((window.location.pathname.indexOf('/pages/') !== -1) && window.page_active && (window.page_active != pageUrl))  {
                    setCookie('page-url', window.page_active, 1);
                    pageUrl = window.page_active;
                }

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
                    url = window.routes.root + `/search?type=product&q=${active}&view=ajax_mega_menu`;

                if($body.hasClass('template-index')){
                    if ($win.width() < 1025) {
                        document.body.addEventListener('touchstart', () => {
                            loadCssMenu();
                        });

                        if(window.mobile_menu == 'default'){
                            window.addEventListener('load', () => {
                                if (designMode || showMenu) {
                                    loadMenuDefault();
                                }
                                else {
                                    document.body.addEventListener('click', () => {
                                        loadMenuDefault();
                                    }, false)
                                }
                            }, false)
                        } else {
                            window.addEventListener('load', () => {
                                if (designMode || showMenu) {
                                    loadMenuCustom();
                                }
                                else {
                                    document.body.addEventListener('click', () => {
                                        loadMenuCustom();
                                    }, false)
                                }
                            }, false)
                        }
                    } else {
                        $doc.on('mousemove', () => {
                            if (check == false) {
                                check = true;

                                let checkLoadEC = true; 
                                if (checkLoadEC) {
                                    checkLoadEC = false;
                                    const $menu = document.querySelector('.header-nav');
                                    const urlStyleEC = $menu.dataset.urlStyleMenu;

                                    halo.buildStyleSheet(urlStyleEC, $menu);
                                }

                                halo.initMenu(url);
                            }
                        });
                    }
                } else {
                    if ($win.width() < 1025) {
                        document.body.addEventListener('touchstart', () => {
                            loadCssMenu();
                        });

                        if(window.mobile_menu == 'default'){
                            window.addEventListener('load', () => {
                                if (designMode || showMenu) {
                                    loadMenuDefault();
                                }
                                else {
                                    document.body.addEventListener('click', () => {
                                        loadMenuDefault();
                                    }, false)
                                }
                            }, false)
                        } else {
                            window.addEventListener('load', () => {
                                if (designMode || showMenu) {
                                    loadMenuCustom();
                                }
                                else {
                                    document.body.addEventListener('click', () => {
                                        loadMenuCustom();
                                    }, false)
                                }
                            }, false)
                        }
                    } else {
                        if (check == false) {
                            check = true;

                            let checkLoadEC = true; 
                            if (checkLoadEC) {
                                checkLoadEC = false;
                                const $menu = document.querySelector('.header-nav');
                                const urlStyleEC = $menu.dataset.urlStyleMenu;

                                halo.buildStyleSheet(urlStyleEC, $menu);
                            }

                            halo.initMenu(url);
                        }
                    }
                }
            } else {
                var url = window.routes.root + '/search?view=ajax_mega_menu';

                if ($win.width() < 1025) {
                    document.body.addEventListener('touchstart', () => {
                        loadCssMenu();
                    });

                    if(window.mobile_menu == 'default'){
                        if (designMode || showMenu) {
                            loadMenuDefault();
                        }
                        else {
                            document.body.addEventListener("click",() => {
                                loadMenuDefault();
                            }, false)
                        }
                    } else {
                        window.addEventListener("load",() => {
                            if (designMode || showMenu) {
                                loadMenuCustom();
                            }
                            else {
                                document.body.addEventListener("click",() => {
                                    loadMenuCustom();
                                }, false)
                            }
                        }, false)
                    }
                } else {
                    $doc.on('mousemove', () => {
                        if (check == false) {
                            check = true;

                            let checkLoadEC = true; 
                            if (checkLoadEC) {
                                checkLoadEC = false;
                                const $menu = document.querySelector('.header-nav');
                                const urlStyleEC = $menu.dataset.urlStyleMenu;

                                halo.buildStyleSheet(urlStyleEC, $menu);
                            }

                            halo.initMenu(url);
                        }
                    });
                }
            }

            if(window.header_transparent){
                if ($win.width() > 1024) {
                    if (!$('.transparent').hasClass('.background-transparent-1')){
                        if ($('.header-nav.transparent .header__inline-menu > .list-menu').length > 0) {
                            $doc.on('mouseover', '.header-nav.transparent .header__inline-menu > .list-menu', event => {
                                $body.addClass('activeHeader');
                            })
                            .on('mouseleave', '.header-nav.transparent .header__inline-menu > .list-menu', event => {
                                $body.removeClass('activeHeader');
                            });
                        }
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
            if ($win.width() < 1025) {
                if(window.mobile_menu == 'custom'){
                    var chk = true,
                        menuElement = $('[data-section-type="menu"]'),
                        menuMobile = $('[data-navigation-mobile]'),
                        menuTabMobile = $('[data-navigation-tab-mobile]');
        
                    const loadMenu = () => {
                        if (chk) {
                            chk = false;
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
        
                            $('.list-menu-loading').remove();
                            menuTabMobile.html(tab);
                            menuMobile.html(content.innerHTML);
                        }
                    }
        
                    if (document.body.matches('.menu-open')) {
                        loadMenu();
                    }
        
                    document.body.addEventListener('click', () => {
                        loadMenu();
                    }, false);
                }
            }
        },

        sliderProductMegaMenu: function() {
            var productBlock = $('[data-product-megamenu]');

            productBlock.each((index, element) => {
                var self = $(element),
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
                            rtl: window.rtl_slick,
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
                            curTabContent = document.getElementById(curTab.getAttribute('data-target').replace('#', '')),
                            element = curTab.closest('[data-product-tabs]'),
                            tabLink = element.querySelectorAll('[data-product-tabs-title]'),
                            tabContent = element.querySelectorAll('[data-product-tabcontent]'),
                            tabArrow = element.querySelectorAll('[data-product-tabs-arrow]');

                        tabLink.forEach((tab) => {
                            tab.classList.remove('active');
                        });

                        tabContent.forEach((content) => {
                            content.classList.remove('active');
                        });

                        tabArrow.forEach((arrow) => {
                            arrow.classList.remove('active');
                            if (curTab.getAttribute('data-target') == arrow.getAttribute('data-target')){
                                arrow.classList.add('active');
                            }
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

                    tabLink.forEach((tab) => {
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
                    imageRatio = $block.data('image-ratio'),
                    ratio = $block.data('ratio'),
                    action = $block.data('show-add-to-cart'),
                    tabActive = $block.find('.product-tabs-content .tab-content.active'),
                    curTabContent = tabActive.find('.products-content'),
                    loading = tabActive.find('.loading'),
                    sectionId = $block.attr('sectionid') + url;

                if(url != ''){
                    $.ajax({
                        type: 'GET',
                        url: window.routes.root + '/collections/' + url,
                        cache: false,
                        data: {
                            view: 'ajax_product_block',
                            constraint: `limit=${limit}+layout=${layout}+sectionId=${sectionId}+imageRatio=${imageRatio}+action=${action}+portraitAspectRatio=${ratio}`
                        },
                        beforeSend: () => {
                            $block.addClass('ajax-loaded');
                        },
                        success: (data) => {
                            const dataMedia = halo.addMediaSize(data, imageRatio, ratio, action, limit);
                            curTabContent.html(dataMedia);
                        },
                        complete: () => {
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
                                Shopify.ProductCompare.setLocalStorageProductForCompare();
                            }

                            if(window.wishlist.show){
                                Shopify.ProductWishlist.setLocalStorageProductForWishlist();
                            }

                            if (halo.checkNeedToConvertCurrency()) {
                                var currencyCode = document.getElementById('currencies')?.querySelector('.active')?.getAttribute('data-currency');
                                Currency.convertAll(window.shop_currency, currencyCode, 'span.money', 'money_format');
                            }
                        },
                        error: (xhr, text) => {
                            loading.text(window.product_tabs.error).show();
                        }
                    });
                } else {
                    loading.text(window.product_tabs.no_collection).show();
                }
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
                    var currencyCode = document.getElementById('currencies')?.querySelector('.active')?.getAttribute('data-currency');
                    Currency.convertAll(window.shop_currency, currencyCode, 'span.money', 'money_format');
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
            halo.productBlockInfiniteScroll();
        },

        buildProductBlock: function() {
            var productBlock = $('[data-product-block]');

            if(productBlock.length > 0){
                var load = () => {
                    productBlock.each((index, element) => {
                        var top = element.getBoundingClientRect().top,
                            $block = $(element);

                        if (!$block.hasClass('ajax-loaded')) {
                            if(top < window.innerHeight){
                                var url = $block.data('collection'),
                                    layout = $block.data('layout'),
                                    limit = $block.data('limit'),
                                    imageRatio = $block.data('image-ratio'),
                                    ratio = $block.data('ratio'),
                                    action = $block.data('show-add-to-cart'),
                                    sectionId = $block.attr('sectionId');

                                if(url != null && url != undefined) {
                                    $.ajax({
                                        type: 'GET',
                                        url: window.routes.root + '/collections/' + url,
                                        cache: false,
                                        data: {
                                            view: 'ajax_product_block',
                                            constraint: `limit=${limit}+layout=${layout}+sectionId=${sectionId}+imageRatio=${imageRatio}+action=${action}+portraitAspectRatio=${ratio}`
                                        },
                                        beforeSend: () => {
                                            $block.addClass('ajax-loaded');
                                        },
                                        success: (data) => {
                                            if (url != '') {
                                                const dataMedia = halo.addMediaSize(data, imageRatio, ratio, action, limit);
                                                if (layout == 'grid') {
                                                    $block.find('.products-grid').html(dataMedia);
                                                } else if (layout == 'slider'){
                                                    $block.find('.products-carousel').html(dataMedia);
                                                } else if (layout == 'scroll'){
                                                    $block.find('.products-scroll').html(dataMedia);
                                                }
                                            }
                                        },
                                        complete: () => {
                                            if (layout == 'slider') {
                                                halo.productBlockSlider($block);
                                            }

                                            if (layout == 'scroll'){
                                                halo.productBlockScroller($block);
                                                halo.productBlockDraggable($block);
                                            }

                                            if(window.product_swatch_style == 'slider'){
                                                var productList = $block.find('.product');

                                                productList.each((index, element) => {
                                                    var product = $(element);

                                                    halo.initProductCardSwatchSlider(product);
                                                });
                                            }

                                            if(window.compare.show){
                                                Shopify.ProductCompare.setLocalStorageProductForCompare();
                                            }

                                            if(window.wishlist.show){
                                                Shopify.ProductWishlist.setLocalStorageProductForWishlist();
                                            }

                                            if (halo.checkNeedToConvertCurrency()) {
                                                var currencyCode = document.getElementById('currencies')?.querySelector('.active')?.getAttribute('data-currency');
                                                Currency.convertAll(window.shop_currency, currencyCode, 'span.money', 'money_format');
                                            }
                                        }
                                    });
                                } else {
                                    $block.addClass('ajax-loaded');

                                    if (layout == 'slider') {
                                        halo.productBlockSlider($block);
                                    }

                                    if (halo.checkNeedToConvertCurrency()) {
                                        var currencyCode = document.getElementById('currencies')?.querySelector('.active')?.getAttribute('data-currency');
                                        Currency.convertAll(window.shop_currency, currencyCode, 'span.money', 'money_format');
                                    }
                                }
                            }
                        }
                    });
                }

                load();
                window.addEventListener('scroll', load);
            }
        },

        addMediaSizeWishlist(data, imageRatio, ratio) {
            let htmlMedia = document.createElement('div');
            htmlMedia.innerHTML = data;

            // Media
            const $cardMedia = $(htmlMedia).find('.card-media');
            $cardMedia.removeClass('card-media--');
            $cardMedia.addClass(`card-media--${imageRatio}`);
            if (imageRatio == 'adapt' || imageRatio == 'portrait'){
                $cardMedia.css('padding-bottom', `${ratio}%`);
            } else if (imageRatio == 'square') {
                $cardMedia.css('padding-bottom', `100%`);
            }

            return $(htmlMedia).html();
        },

        addMediaSize(data, imageRatio, ratio, action, limit, productToShow, showMore) {
            let htmlMedia = document.createElement('div');
            htmlMedia.innerHTML = data;
            let rtData;

            // Media
            const $cardMedia = $(htmlMedia).find('.card-media');
            $cardMedia.removeClass('card-media--');
            $cardMedia.addClass(`card-media--${imageRatio}`);
            if (imageRatio == 'adapt'){
                $cardMedia.css('padding-bottom', `${$cardMedia.data('image-adapt')}%`);
            } else if (imageRatio == 'portrait') {
                $cardMedia.css('padding-bottom', `150%`);
            } else if (imageRatio == 'square') {
                $cardMedia.css('padding-bottom', `100%`);
            }

            // Action
            const $cardAction = $(htmlMedia).find('.card-action');
            if (action == true) {
                $cardAction.removeClass('d-none')
            } else {
                $cardAction.remove()
            }

            
            // Limit
            if (showMore) {
                rtData = $(htmlMedia).find('.product').splice(productToShow, limit);
            } else {
                $(htmlMedia).find(`.product:nth-child(n+${Number(limit) + 1})`).remove();
                rtData = $(htmlMedia).html()
            }

            return rtData;
        },

        buildCustomFeaturedProductBlock() {
            var productBlock = $('[data-custom-featured-product-block]');

            if(productBlock.length > 0){
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

                                if (window.Shopify && Shopify.PaymentButton) {
                                    Shopify.PaymentButton.init();
                                }

                                halo.productImageGallery($block.find('.productView'));
                                halo.initVariantImageGroup($block.find('.productView'));
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

                load();
                window.addEventListener('scroll', load);
            }
        },

        buildProductTabsBlock: function() {
            var productBlock = $('[data-product-tabs]'),
                productBlock2 = $('[data-product-tabs-2]');

            if(productBlock.length > 0 || productBlock2.length > 0) {
                var load = () => {
                    if(productBlock.length > 0){
                        productBlock.each((index, element) => {
                            var top = element.getBoundingClientRect().top,
                                url = element.querySelector('.tab-links.active').getAttribute('data-collection');

                            if (!element.classList.contains('ajax-loaded')) {
                                if (top < window.innerHeight) {
                                    halo.buildAjaxProductTab(element, url, false);
                                }
                            }
                        });
                    }

                    if(productBlock2.length > 0){
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
                }

                load();
                window.addEventListener('scroll', load);
            }
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
                        let video = event.currentTarget.querySelector('video');
                        if (video) video.play();
                    });

                    $doc.on('mouseout', '.product', (event) => {
                        let video = event.currentTarget.querySelector('video');
                        if (video) video.pause();
                    });
                }
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
                                rtl: window.rtl_slick,
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
                        } else if(wrapper.hasClass('halo-product-block-7')) {
                            var progressBar = wrapper.find('.scrollbar-thumb');

                            productGrid.on('init', (event, slick) => {
                                var percent = ((slick.currentSlide / (slick.slideCount - 1)) * 100) + '%';
                                progressBar.css('--percent', percent);
                            });

                            productGrid.slick({
                                mobileFirst: true,
                                adaptiveHeight: true,
                                vertical: false,
                                infinite: true,
                                slidesToShow: 1,
                                slidesToScroll: 1,
                                arrows: false,
                                dots: false,
                                rtl: window.rtl_slick,
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
                                            },
                                            get initialSlide() {
                                                if(itemToShow == 3.5 || itemToShow == 4.5 || itemToShow == 5.5) {
                                                    return this.initialSlide = 0.5;
                                                } else {
                                                    return this.initialSlide = 1;
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
                                            },
                                            get initialSlide() {
                                                if(itemToShow == 3.5 || itemToShow == 4.5 || itemToShow == 5.5) {
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
                                            },
                                            get initialSlide() {
                                                if(itemToShow == 3.5 || itemToShow == 4.5 || itemToShow == 5.5) {
                                                    return this.initialSlide = 0.5;
                                                } else {
                                                    return this.initialSlide = 1;
                                                }
                                            }
                                        }
                                    },
                                    {
                                        breakpoint: 991,
                                        settings: {
                                            slidesToShow: 4,
                                            slidesToScroll: 1,
                                            get initialSlide() {
                                                if(itemToShow == 3.5 || itemToShow == 4.5 || itemToShow == 5.5) {
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
                                            slidesToShow: 3,
                                            slidesToScroll: 1,
                                            get initialSlide() {
                                                if(itemToShow == 3.5 || itemToShow == 4.5 || itemToShow == 5.5) {
                                                    return this.initialSlide = 0.5;
                                                } else {
                                                    return this.initialSlide = 1;
                                                }
                                            }
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

                            if(productGrid.hasClass('halo-customArrow') && itemArrows){
                                var arrowsList = wrapper.find('.halo-block-header .arrows');

                                if(productGrid.find('.slick-arrow').length > 0) {
                                    arrowsList.append(productGrid.find('.slick-prev'));
                                    arrowsList.append(productGrid.find('.slick-next'));
                                }
                            }

                            productGrid.on('afterChange', (event, slick, nextSlide) => {
                                var percent = ((nextSlide / (slick.slideCount - 1)) * 100) + '%';
                                progressBar.css('--percent', percent);
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
                                rtl: window.rtl_slick,
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

                            var checkTabsArrow = wrapper.parents('.halo-product-tabs').find('.halo-block-header .arrows').attr('data-product-tabs-arrow');
                            if(typeof checkTabsArrow !== 'undefined' && checkTabsArrow !== false){
                                var arrowsList = wrapper.parents('.halo-product-tabs').find('.halo-block-header .arrows.active');

                                if(productGrid.find('.slick-arrow').length > 0) {
                                    arrowsList.append(productGrid.find('.slick-prev'));
                                    arrowsList.append(productGrid.find('.slick-next'));
                                }
                            } else {
                                if(productGrid.hasClass('halo-customArrow') && itemArrows){
                                    var arrowsList = wrapper.find('.halo-block-header .arrows');

                                    if(productGrid.find('.slick-arrow').length > 0) {
                                        arrowsList.append(productGrid.find('.slick-prev'));
                                        arrowsList.append(productGrid.find('.slick-next'));
                                    }
                                }
                            }
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
                            rtl: window.rtl_slick,
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

        productBlockScroller: function (wrapper) {
            const { Back } = window;
            const easingEffect = Back.easeInOut.config(1.7);

            let cursorWrapper = wrapper.get(0)?.querySelector('.products-cursor');

            if(!cursorWrapper) return;

            let innerCursor = cursorWrapper.querySelector('.products-cursor__inner'),
                imageCursor = cursorWrapper.querySelector('.products-cursor__image'),
                iconCursor = cursorWrapper.querySelector('.products-cursor__icon'),
                itemTween = wrapper.get(0)?.querySelectorAll('.products-scroll'),
                itemNotTween = wrapper.get(0)?.querySelectorAll('.card-product__group, .card-action, .card-title, .card-swatch, .variants-popup, .card-compare, .card-quickview, .card-product__group-icon'),
                clientX,
                clientY,
                scrollerBox,
                cursorSide = null,
                cursorInsideSwiper = false;

            document.addEventListener('mousemove', (event) => {
                clientX = event.clientX;
                clientY = event.clientY;
                docClientX = event.clientX;
                docClientY = event.clientY;
            });

            const render = () => {
                TweenMax.set(cursorWrapper, {
                    x: clientX,
                    y: clientY
                });
                
                requestAnimationFrame(render);
            };

            requestAnimationFrame(render);

            const wrapTween = TweenMax.to([cursorWrapper] , 0.1, {
                scale: 2.5,
                opacity: 1,
                backgroundColor: 'rgba(0,0,0,1)',
                ease: easingEffect,
                paused: true
            });

            const elementTween = TweenMax.to([imageCursor, iconCursor] , 0.1, {
                opacity: 1,
                ease: easingEffect,
                paused: true
            });

            const handleMouseEnter = (event) => {
                wrapTween.play();
                elementTween.play();
                cursorWrapper.classList.add('handleMouseEnter');
                cursorWrapper.classList.remove('handleMouseLeave');
            };

            const handleMouseLeave = (event) => {
                wrapTween.reverse();
                elementTween.reverse();
                cursorWrapper.classList.add('handleMouseLeave');
                cursorWrapper.classList.remove('handleMouseEnter');
            };

            itemTween.forEach(element => {
                element.addEventListener('mouseenter', handleMouseEnter);
                element.addEventListener('mouseleave', handleMouseLeave);
            });

            itemNotTween.forEach(element => {
                element.addEventListener('mouseenter', handleMouseLeave);
                element.addEventListener('mouseleave', handleMouseEnter);
            });
        },

        productBlockDraggable: function (wrapper) {
            const preventClick = (event) => {
                event.preventDefault();
                event.stopImmediatePropagation();
            }

            let itemScroll = wrapper.get(0)?.querySelector('.products-scroll'),
                isDown = false,
                isDragged = false,
                startX,
                scrollLeft;

            itemScroll.addEventListener('mousedown', (event) => {
                isDown = true;
                itemScroll.classList.add('active');
                startX = event.pageX - itemScroll.offsetLeft;
                scrollLeft = itemScroll.scrollLeft;
            });

            itemScroll.addEventListener('mouseleave', () => {
                isDown = false;
                itemScroll.classList.remove('active');
            });

            itemScroll.addEventListener('mouseup', () => {
                isDown = false;
                const elements = itemScroll.querySelectorAll('a, button');

                if(isDragged){
                    for(let i = 0; i < elements.length; i++){
                        elements[i].addEventListener('click', preventClick);
                    }
                } else{
                    for(let i = 0; i < elements.length; i++){
                        elements[i].removeEventListener('click', preventClick);
                    }
                }

                itemScroll.classList.remove('active');
                isDragged = false;
            });

            itemScroll.addEventListener('mousemove', (event) => {
                if(!isDown) return;
                isDragged = true;
                event.preventDefault();

                const x = event.pageX - itemScroll.offsetLeft;
                const walk = (x - startX) * 2;
                itemScroll.scrollLeft = scrollLeft - walk;
            });
        },

        productBlockInfiniteScroll: function() {
            if($('[data-product-infinite]').length > 0) {
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
                    } else {
                        window.location = element.data('href');
                    }
                });
            }
        },

        doProductBlockInfiniteScroll: function(element, url){
            var block = element.closest('.halo-product-block'),
                limit = parseInt(element.getAttribute('data-limit')),
                action = element.getAttribute('data-show-add-to-cart'),
                total = parseInt(element.getAttribute('data-total')),
                imageRatio = element.getAttribute('data-image-ratio'),
                ratio = element.getAttribute('data-ratio'),
                sectionId = element.getAttribute('sectionId'),
                page = parseInt(element.getAttribute('data-page')),
                text, length, shuffle, productGrid;

            $.ajax({
                type: 'GET',
                url: window.routes.root + '/collections/' + url,
                cache: false,
                data: {
                    view: 'ajax_product_block_load_more',
                    constraint: `limit=${limit}+page=${page}+sectionId=${sectionId}+imageRatio=${imageRatio}+action=${action}+portraitAspectRatio=${ratio}`
                },
                success: (data) => {
                    const dataMedia = halo.addMediaSize(data, imageRatio, ratio, action, limit, $(block).find('.products-grid .product').length, true);
                    const itemsFromResponse = dataMedia.length;

                    if(!block.classList.contains('halo-product-tabs')){
                        productGrid = $(block).find('.products-grid');
                        shuffle = false;

                        productGrid.append(dataMedia);
                        length = block.querySelectorAll('.products-grid .product').length;
                    } else {
                        productGrid = $(block).find('.tab-content.active .products-grid');
                        shuffle = true;

                        productGrid.append(dataMedia);
                        length = block.querySelectorAll('.tab-content.active .product').length;
                    }

                    if(length < $(data).length){
                        text = window.button_load_more.default;

                        element.setAttribute('data-page', page + 1);
                        element.innerHTML = text;
                        element.classList.remove('is-loading');
                    } else {
                        if (Number(total) > $(data).length && $(data).length <= length) {
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
                complete: () => {
                    if(window.product_swatch_style == 'slider'){
                        var productList = $(block).find('.product');

                        productList.each((index, element) => {
                            var product = $(element);

                            halo.initProductCardSwatchSlider(product);
                        });
                    }

                    if(window.compare.show){
                        Shopify.ProductCompare.setLocalStorageProductForCompare();
                    }

                    if(window.wishlist.show){
                        Shopify.ProductWishlist.setLocalStorageProductForWishlist();
                    }

                    if (halo.checkNeedToConvertCurrency()) {
                        var currencyCode = document.getElementById('currencies')?.querySelector('.active')?.getAttribute('data-currency');
                        Currency.convertAll(window.shop_currency, currencyCode, 'span.money', 'money_format');
                    }
                }
            });
        },

        buildRecommendationBlock: function(){
            if(document.querySelector('[data-recommendations-block]')){
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
                            Shopify.ProductCompare.setLocalStorageProductForCompare();
                        }

                        if(window.wishlist.show){
                            Shopify.ProductWishlist.setLocalStorageProductForWishlist();
                        }

                        if (halo.checkNeedToConvertCurrency()) {
                            var currencyCode = document.getElementById('currencies')?.querySelector('.active')?.getAttribute('data-currency');
                            Currency.convertAll(window.shop_currency, currencyCode, 'span.money', 'money_format');
                        }
                    }
                })
                .catch(e => {
                    console.error(e);
                });
            }
        },

        buildRecentlyViewedBlock: function(){
            var productBlock = $('[data-recently-viewed-block]');
            var shownSection = 0;

            if(productBlock.length > 0){
                Shopify.Products.record({
                    name: 'shopify_recently_viewed_section',
                    expire: productBlock.attr('data-expire-day'),
                    max: 25
                });

                var list = Shopify.Products.show({
                    name: 'shopify_recently_viewed_section'
                });

                var doAlong = function () {
                    if (list.length == 0){
                        productBlock.remove();
                    } else {
                        var productHandleQueue = list;
                        var url = window.routes.root + '/products/' + productHandleQueue[shownSection] + '?view=ajax_section_recently_viewed';
                        var layout = productBlock.data('layout'),
                            limit = productBlock.data('limit'),
                            imageRatio = productBlock.data('image-ratio'),
                            ratio = productBlock.data('ratio'),
                            action = productBlock.data('show-add-to-cart');

                        if (productHandleQueue.length && shownSection < productHandleQueue.length && shownSection < Number(productBlock.data('limit')) && !productBlock.hasClass('ajax-loaded')) {
                            $.ajax({
                                type: 'get',
                                url: url,
                                cache: false,
                                success: function (product) {
                                    const dataMedia = halo.addMediaSize(product, imageRatio, ratio, action, limit);
                                    if (layout == 'grid') {
                                        productBlock.find('.products-grid').append(dataMedia);
                                    } else if (layout == 'slider'){
                                        productBlock.find('.products-carousel').append(dataMedia);
                                    }
                                    shownSection++;
                                    doAlong();
                                }
                            });
                        } else {
                            productBlock.addClass('ajax-loaded');
                            if (layout == 'slider') {
                                halo.productBlockSlider(productBlock);
                            }

                            if(window.product_swatch_style == 'slider'){
                                var productList = productBlock.find('.product');

                                productList.each((index, element) => {
                                    var product = $(element);

                                    halo.initProductCardSwatchSlider(product);
                                });
                            }

                            if(window.compare.show){
                                Shopify.ProductCompare.setLocalStorageProductForCompare();
                            }

                            if(window.wishlist.show){
                                Shopify.ProductWishlist.setLocalStorageProductForWishlist();
                            }

                            if (halo.checkNeedToConvertCurrency()) {
                                var currencyCode = document.getElementById('currencies')?.querySelector('.active')?.getAttribute('data-currency');
                                Currency.convertAll(window.shop_currency, currencyCode, 'span.money', 'money_format');
                            }
                        }
                    }
                }
                doAlong();
            }
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
                        mediaList = [],
                        icon;

                    $target.parents('.swatch').find('.swatch-label').removeClass('is-active');
                    $target.addClass('is-active');

                    if(window.enable_swatch_name){
                        if(productTitle.hasClass('card-title-change')){
                            productTitle.find('[data-change-title]').text(' - ' + title);
                        } else {
                            productTitle.addClass('card-title-change').append('<span data-change-title> - ' + title + '</span>');
                        }
                    }

                    const selectedVariant = productJson.variants.find(variant => variant.id === variantId)

                    if (selectedVariant.compare_at_price > selectedVariant.price) {
                        product.find('.price__sale .price-item--regular').html(Shopify.formatMoney(selectedVariant.compare_at_price, window.money_format));
                        product.find('.price__sale .price-item--sale').html(Shopify.formatMoney(selectedVariant.price, window.money_format));
                        const labelSale = `-${Math.round((selectedVariant.compare_at_price - selectedVariant.price) * 100 / selectedVariant.compare_at_price)}%`;
                        product.find('.price__label_sale .label_sale').html(labelSale);
                    } else {
                        product.find('.price__regular .price-item').html(Shopify.formatMoney(selectedVariant.price, window.money_format));
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
                                    productAction.text(window.variantStrings.soldOut).prop('disabled', true);
                                }
                            } else {
                                if(productAction.hasClass('is-notify-me')){
                                    icon = '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" aria-hidden="true" focusable="false" role="presentation" class="icon icon-mail">\
                                                <path d="M 1 3 L 1 5 L 1 18 L 3 18 L 3 5 L 19 5 L 19 3 L 3 3 L 1 3 z M 5 7 L 5 7.1777344 L 14 12.875 L 23 7.125 L 23 7 L 5 7 z M 23 9.2832031 L 14 15 L 5 9.4160156 L 5 21 L 14 21 L 14 17 L 17 17 L 17 14 L 23 14 L 23 9.2832031 z M 19 16 L 19 19 L 16 19 L 16 21 L 19 21 L 19 24 L 21 24 L 21 21 L 24 21 L 24 19 L 21 19 L 21 16 L 19 16 z"/>\
                                            </svg>';

                                    productAction.find('.text').text(window.notify_me.button);
                                    productAction.find('.icon').remove();
                                    productAction.append(icon);
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
                                productAction.text(window.variantStrings.addToCart).prop('disabled', false);
                            } else {
                                icon = '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" class="icon icon-cart" aria-hidden="true" focusable="false" role="presentation">\
                                            <path d="M 4.4140625 1.9960938 L 1.0039062 2.0136719 L 1.0136719 4.0136719 L 3.0839844 4.0039062 L 6.3789062 11.908203 L 5.1816406 13.824219 C 4.7816406 14.464219 4.7609531 15.272641 5.1269531 15.931641 C 5.4929531 16.590641 6.1874063 17 6.9414062 17 L 19 17 L 19 15 L 6.9414062 15 L 6.8769531 14.882812 L 8.0527344 13 L 15.521484 13 C 16.248484 13 16.917531 12.604703 17.269531 11.970703 L 20.873047 5.4863281 C 21.046047 5.1763281 21.041328 4.7981875 20.861328 4.4921875 C 20.681328 4.1871875 20.352047 4 19.998047 4 L 5.25 4 L 4.4140625 1.9960938 z M 6.0820312 6 L 18.298828 6 L 15.521484 11 L 8.1660156 11 L 6.0820312 6 z M 7 18 A 2 2 0 0 0 5 20 A 2 2 0 0 0 7 22 A 2 2 0 0 0 9 20 A 2 2 0 0 0 7 18 z M 17 18 A 2 2 0 0 0 15 20 A 2 2 0 0 0 17 22 A 2 2 0 0 0 19 20 A 2 2 0 0 0 17 18 z"/>\
                                        </svg>';

                                productAction.find('.text').text(window.variantStrings.addToCart);
                                productAction.find('.icon').remove();
                                productAction.append(icon).prop('disabled', false);
                            }
                        }
                    } else {
                        if(window.quick_shop.show && window.quick_shop.type == '1') {
                            if (productJson != undefined) {
                                halo.checkStatusSwatchQuickShop(product, productJson);
                                product.find(`.swatch-element[data-value="${title}"]`).find('.single-label').trigger('click');
                            }
                        }
                    }

                    if (productJson != undefined) {
                        mediaList = productJson.media.filter((index, element) => {
                            return element.alt === title;
                        });

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
                let checkLoadQV = true;
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

                    if (checkLoadQV) {
                        checkLoadQV = false;
                        if(document.querySelector('.halo-add-to-cart-popup')) {
                            const $popupCart = document.querySelector('.halo-add-to-cart-popup');
                            const urlStyleQuickCart = $popupCart.dataset.urlStyleQuickCart;
                            const urlStylePC = $popupCart.dataset.urlStylePopupCart;
    
                            halo.buildStyleSheet(urlStyleQuickCart, $popupCart);
                            halo.buildStyleSheet(urlStylePC, $popupCart);
                        } else if(document.querySelector('.halo-add-to-cart-popup-2')) {
                            const $popupCart2 = document.querySelector('.halo-add-to-cart-popup-2');
                            const urlStylePC2 = $popupCart2.dataset.urlStylePopupCart2;
    
                            halo.buildStyleSheet(urlStylePC2, $popupCart2);
                        }
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

                if(window.quick_shop.type == '1'){
                    if(window.product_swatch){
                        product.find('.swatch-label.is-active').trigger('click');
                    } else {
                        product.find('.swatch-element.available').eq('0').find('.single-label').trigger('click');
                    }
                } else if (window.quick_shop.type == '2') {
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

                    if (selectedVariant.compare_at_price > selectedVariant.price) {
                        product.find('.price__sale .price-item--regular').html(Shopify.formatMoney(selectedVariant.compare_at_price, window.money_format));
                        product.find('.price__sale .price-item--sale').html(Shopify.formatMoney(selectedVariant.price, window.money_format));
                        const labelSale = `-${Math.round((selectedVariant.compare_at_price - selectedVariant.price) * 100 / selectedVariant.compare_at_price)}%`;
                        product.find('.price__label_sale .label_sale').html(labelSale);
                    } else {
                        product.find('.price__regular .price-item').html(Shopify.formatMoney(selectedVariant.price, window.money_format));
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
                let optionIndex = parseInt(element.getAttribute('data-option-index')),
                    swatchElement = element.querySelectorAll('.swatch-element');

                switch (optionIndex) {
                    case 0:
                        swatchElement.forEach((item) => {
                            let optionValue = item.getAttribute('data-value');

                            var optionSoldout = variantList.find((variant) => {
                                if (optionColor == 1) {
                                    return variant.option2 == optionValue && variant.available;
                                } else {
                                    if (optionColor == 2) {
                                        return variant.option3 == optionValue && variant.available;
                                    } else {
                                        return variant.option1 == optionValue && variant.available;
                                    }
                                }
                            });

                            var optionUnavailable = variantList.find((variant) => {
                                if (optionColor == 1) {
                                    return variant.option2 == optionValue;
                                } else {
                                    if (optionColor == 2) {
                                        return variant.option3 == optionValue;
                                    } else {
                                        return variant.option1 == optionValue;
                                    }
                                }
                            });

                            if(optionSoldout == undefined){
                                if (optionUnavailable == undefined) {
                                    item.classList.remove('soldout', 'available');
                                    item.classList.add('unavailable');
                                    item.querySelector('input[type="radio"]').checked = false;
                                } else {
                                    item.classList.remove('unavailable', 'available');
                                    item.classList.add('soldout');
                                    item.querySelector('input[type="radio"]').checked = false;
                                    item.querySelector('input[type="radio"]').removeAttribute('disabled');
                                    item.querySelector('.single-action').setAttribute('data-variant-id', optionUnavailable.title);
                                }
                            } else {
                                item.classList.remove('soldout', 'unavailable');
                                item.classList.add('available');
                                item.querySelector('input[type="radio"]').removeAttribute('disabled');
                            }
                        });

                        break;
                    case 1:
                        swatchElement.forEach((item) => {
                            let optionValue = item.getAttribute('data-value');

                            var optionSoldout = variantList.find((variant) => {
                                if (optionColor == 1) {
                                    return variant.option2 == selectedOption1 && variant.option1 == optionValue && variant.available;
                                } else {
                                    if (optionColor == 2) {
                                        return variant.option3 == selectedOption1 && variant.option1 == optionValue && variant.available;
                                    } else {
                                        return variant.option1 == selectedOption1 && variant.option2 == optionValue && variant.available;
                                    }
                                }
                            });

                            var optionUnavailable = variantList.find((variant) => {
                                if (optionColor == 1) {
                                    return variant.option2 == selectedOption1 && variant.option1 == optionValue;
                                } else {
                                    if (optionColor == 2) {
                                        return variant.option3 == selectedOption1 && variant.option1 == optionValue;
                                    } else {
                                        return variant.option1 == selectedOption1 && variant.option2 == optionValue;
                                    }
                                }
                            });

                            if(optionSoldout == undefined){
                                if (optionUnavailable == undefined) {
                                    item.classList.remove('soldout', 'available');
                                    item.classList.add('unavailable');
                                    item.querySelector('input[type="radio"]').checked = false;
                                } else {
                                    item.classList.remove('unavailable', 'available');
                                    item.classList.add('soldout');
                                    item.querySelector('input[type="radio"]').removeAttribute('disabled');
                                    item.querySelector('.single-action').setAttribute('data-variant-id', optionUnavailable.title);

                                    if(item.querySelector('input[type="radio"]:checked')) {
                                        item.querySelector('input[type="radio"]').checked = false;
                                        if(element.querySelectorAll('.swatch-element.available')[0]) {
                                            let newItem = element.querySelectorAll('.swatch-element.available')[0].querySelector('.single-option');

                                            newItem.checked = true;
                                            $(newItem).trigger('change');
                                        }
                                    }
                                }
                            } else {
                                item.classList.remove('soldout', 'unavailable');
                                item.classList.add('available');
                                item.querySelector('input[type="radio"]').removeAttribute('disabled');
                            }
                        });

                        break;
                    case 2:
                        swatchElement.forEach((item) => {
                            let optionValue = item.getAttribute('data-value');

                            var optionSoldout = variantList.find((variant) => {
                                if (optionColor == 1) {
                                    return variant.option2 == selectedOption1 && variant.option1 == selectedOption2 && variant.option3 == optionValue && variant.available;
                                } else {
                                    if (optionColor == 2) {
                                        return variant.option3 == selectedOption1 && variant.option1 == selectedOption2 && variant.option2 == optionValue && variant.available;
                                    } else {
                                        return variant.option1 == selectedOption1 && variant.option2 == selectedOption2 && variant.option3 == optionValue && variant.available;
                                    }
                                }
                            });

                            var optionUnavailable = variantList.find((variant) => {
                                if (optionColor == 1) {
                                    return variant.option2 == selectedOption1 && variant.option1 == selectedOption2 && variant.option3 == optionValue;
                                } else {
                                    if (optionColor == 2) {
                                        return variant.option3 == selectedOption1 && variant.option1 == selectedOption2 && variant.option2 == optionValue;
                                    } else {
                                        return variant.option1 == selectedOption1 && variant.option2 == selectedOption2 && variant.option3 == optionValue;
                                    }
                                }
                            });

                            if(optionSoldout == undefined){
                                if (optionUnavailable == undefined) {
                                    item.classList.remove('soldout', 'available');
                                    item.classList.add('unavailable');
                                    item.querySelector('input[type="radio"]').checked = false;
                                } else {
                                    item.classList.remove('unavailable', 'available');
                                    item.classList.add('soldout');
                                    item.querySelector('input[type="radio"]').removeAttribute('disabled');
                                    item.querySelector('.single-action').setAttribute('data-variant-id', optionUnavailable.title);

                                    if(item.querySelector('input[type="radio"]:checked')) {
                                        item.querySelector('input[type="radio"]').checked = false;
                                        if(element.querySelectorAll('.swatch-element.available')[0]) {
                                            let newItem = element.querySelectorAll('.swatch-element.available')[0].querySelector('.single-option');

                                            newItem.checked = true;
                                            $(newItem).trigger('change');
                                        }
                                    }
                                }
                            } else {
                                item.classList.remove('soldout', 'unavailable');
                                item.classList.add('available');
                                item.querySelector('input[type="radio"]').removeAttribute('disabled');
                            }
                        });

                        break;
                }
            });

            variantPopup.find('.selector-wrapper:not(.option-color)').each((index, element) => {
                if (!element.querySelector('.swatch-element').querySelector('input:checked')) {
                    if (element.querySelectorAll('.swatch-element.available')[0]) {
                        let newItem = element.querySelectorAll('.swatch-element.available')[0].querySelector('.single-option');

                        $(newItem).trigger('change');
                    } else if (element.querySelectorAll('.swatch-element.soldout')[0]) {
                        let newItem = element.querySelectorAll('.swatch-element.soldout')[0].querySelector('.single-option');

                        $(newItem).trigger('change');
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
                type: 'GET',
                url: window.routes.root + `/products/${handle}?view=ajax_quick_shop`,
                beforeSend: () => {
                    $('.card').removeClass('quick-shop-show');
                },
                success: (data) => {
                    popupContent.append(data);
                },
                error: (xhr, text) => {
                    alert($.parseJSON(xhr.responseText).description);
                },
                complete: () => {
                    product.addClass('quick-shop-show');
                }
            });
        },

        initAddToCart: function() {
            let checkLoadQV = true;

            $doc.on('click', '[data-btn-addtocart]', (event) => {
                event.preventDefault();
                event.stopPropagation();

                var $target = $(event.currentTarget);
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

                if (checkLoadQV) {
                    checkLoadQV = false;
                    if(document.querySelector('.halo-add-to-cart-popup')) {
                        const $popupCart = document.querySelector('.halo-add-to-cart-popup');
                        const urlStyleQuickCart = $popupCart.dataset.urlStyleQuickCart;
                        const urlStylePC = $popupCart.dataset.urlStylePopupCart;

                        halo.buildStyleSheet(urlStyleQuickCart, $popupCart);
                        halo.buildStyleSheet(urlStylePC, $popupCart);
                    } else if(document.querySelector('.halo-add-to-cart-popup-2')) {
                        const $popupCart2 = document.querySelector('.halo-add-to-cart-popup-2');
                        const urlStylePC2 = $popupCart2.dataset.urlStylePopupCart2;

                        halo.buildStyleSheet(urlStylePC2, $popupCart2);
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
                    } else {
                        setCookie('added-item', response.key, 1);
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
                                halo.updateQuickCart(cart);
                            } else {
                                $body.addClass('cart-sidebar-show');
                                halo.updateQuickCart(cart);
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

        isRunningIniframe: function() {
            try {
                return window.self !== window.top;
            } catch (e) {
                return true;
            }
        },

        redirectTo: function(url){
            if (halo.isRunningIniframe() && !window.iframeSdk) {
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
                        rtl: window.rtl_slick,
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
                                var currencyCode = document.getElementById('currencies')?.querySelector('.active')?.getAttribute('data-currency');
                                Currency.convertAll(window.shop_currency, currencyCode, 'span.money', 'money_format');
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
                let checkLoadQC = true; 
                if(window.quick_cart.type == 'popup'){
                    halo.initDropdownCart();

                    $doc.on('mousemove', () => {
                        if (checkLoadQC) {
                            checkLoadQC = false;
                            const $quickCart = document.querySelector('.halo-quick-cart-popup');
                            const urlStyleQC = $quickCart.dataset.urlStyleQuickCart;

                            halo.buildStyleSheet(urlStyleQC, $quickCart);
                        }
                    });
                } else {
                    halo.initSidebarCart();

                    $doc.on('mousemove', () => {
                        if (checkLoadQC) {
                            checkLoadQC = false;
                            const $cartSidebar = document.querySelector('.halo-cart-sidebar');
                            const urlStyleCB = $cartSidebar.dataset.urlStyleCartSidebar;

                            halo.buildStyleSheet(urlStyleCB, $cartSidebar);
                        }
                    });
                }
            }

            halo.initEventQuickCart();
        },

        initEventQuickCart: function(){
            halo.removeItemQuickCart();
            halo.updateQuantityItemQuickCart();
            halo.editQuickCart();
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

                $doc.on('click', '[data-infinite-scrolling]', (event) => {
                    var linkInfinite = $(event.currentTarget),
                        url = linkInfinite.attr('href');

                    event.preventDefault();
                    event.stopPropagation();

                    halo.doAjaxInfiniteScrollingGetContent(url, linkInfinite);
                });
            }
        },

        doAjaxInfiniteScrollingGetContent: function(url, link){
            $.ajax({
                type: 'GET',
                url: url,
                beforeSend: () => {
                    link.text(link.attr('data-loading-more'));
                    link.addClass('is-loading');
                },
                success: (data) => {
                    halo.ajaxInfiniteScrollingMapData(data);
                },
                error: (xhr, text) => {
                    alert($.parseJSON(xhr.responseText).description);
                },
                complete: () => {
                    link.text(link.attr('data-load-more'));
                    link.removeClass('is-loading');
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
                    Shopify.ProductCompare.setLocalStorageProductForCompare();
                }

                if(window.wishlist.show){
                    Shopify.ProductWishlist.setLocalStorageProductForWishlist();
                }

                if (halo.checkNeedToConvertCurrency()) {
                    var currencyCode = document.getElementById('currencies')?.querySelector('.active')?.getAttribute('data-currency');
                    Currency.convertAll(window.shop_currency, currencyCode, 'span.money', 'money_format');
                }
            }
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
                            rtl: window.rtl_slick,
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
                            rtl: window.rtl_slick,
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
                const cartItems = document.querySelector('cart-items');

                if(cartItems) cartItems.update(cart);
            }
        },

        updatePopupCart: function(cart, layout) {
            if(layout == 1){
                if(!$.isEmptyObject(cart)) {
                    const cartPopup = document.querySelector('add-to-cart-popup');
                    if(cartPopup) cartPopup.update(cart);
                }
            } else {
                if(!$.isEmptyObject(cart)) {
                    const cartItems = document.querySelector('quick-upsell-cart-items');
                    if(cartItems) cartItems.update(cart);
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
                let checkLoadQV = true;
                $doc.on('click', '[data-open-cart-popup]', (event) => {
                    event.preventDefault();
                    event.stopPropagation();   
                    
                    Shopify.getCart((cart) => {
                        $body.addClass('cart-dropdown-show');
                        halo.updateQuickCart(cart);
                    });

                    if (checkLoadQV) {
                        checkLoadQV = false;
                        if(document.querySelector('.halo-add-to-cart-popup')) {
                            const $popupCart = document.querySelector('.halo-add-to-cart-popup');
                            const urlStyleQuickCart = $popupCart.dataset.urlStyleQuickCart;
                            const urlStylePC = $popupCart.dataset.urlStylePopupCart;
    
                            halo.buildStyleSheet(urlStyleQuickCart, $popupCart);
                            halo.buildStyleSheet(urlStylePC, $popupCart);
                        } else if(document.querySelector('.halo-add-to-cart-popup-2')) {
                            const $popupCart2 = document.querySelector('.halo-add-to-cart-popup-2');
                            const urlStylePC2 = $popupCart2.dataset.urlStylePopupCart2;
    
                            halo.buildStyleSheet(urlStylePC2, $popupCart2);
                        }
                    }
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
                        halo.updateQuickCart(cart);
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

        updateQuickCart: function (cart) {
            if(!$.isEmptyObject(cart)){
                const cartItems = document.querySelector('quick-cart-items');

                if(cartItems) cartItems.update(cart);
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
                        halo.updateQuickCart(cart);
                    } else if($body.hasClass('cart-sidebar-show')) {
                        halo.updateQuickCart(cart);
                    } else {
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
                        halo.updateQuickCart(cart);
                    } else if($body.hasClass('cart-sidebar-show')) {
                        halo.updateQuickCart(cart);
                    } else {
                        halo.updatePopupCart(cart, 2);
                    }
                });
            });
        },

        editQuickCart: function() {
            let checkLoadEC = true; 

            $doc.on('click', '[data-open-edit-cart]', (event) => {
                event.preventDefault();
                event.stopPropagation();

                var $target = $(event.currentTarget),
                    url = $target.data('edit-cart-url'),
                    itemId = $target.data('edit-cart-id'),
                    itemLine = $target.data('line'),
                    quantity = $target.data('edit-cart-quantity'),
                    listProperty = $target.closest('[data-cart-item]').find('[data-property-item]');

                const modal = $('[data-edit-cart-popup]'),
                    modalContent = modal.find('.halo-popup-content');

                if (checkLoadEC) {
                    checkLoadEC = false;
                    const $editCart = document.querySelector('.halo-edit-cart-popup');
                    const urlStyleEC = $editCart.dataset.urlStyleEditCart;

                    halo.buildStyleSheet(urlStyleEC, $editCart);
                }

                $.ajax({
                    type: 'GET',
                    url: url,
                    cache: false,
                    dataType: 'html',
                    success: (data) => {
                        const html = new DOMParser().parseFromString(data, 'text/html');

                        modalContent.html(html.getElementById('shopify-section-halo-edit-cart').innerHTML);
                        modalContent
                            .find('[data-template-cart-edit]')
                            .attr({
                                'data-cart-update-id': itemId,
                                'data-line': itemLine
                            });

                        var productItem = modalContent.find('.product-edit-item');
                        productItem.find('input[name="quantity"]').val(quantity);

                        if(listProperty.length > 0) {
                            listProperty.each((index, property) => {
                                var propertyName = property.getAttribute('data-property-name'),
                                    propertyValue = property.getAttribute('data-property-value');

                                    productItem.find('[name="properties['+ propertyName +']"]').val(propertyValue);
                            });
                        }
                    },
                    error: (xhr, text) => {
                        alert($.parseJSON(xhr.responseText).description);
                    },
                    complete: () => {
                        $body.addClass('edit-cart-show');

                        if (halo.checkNeedToConvertCurrency()) {
                            var currencyCode = document.getElementById('currencies')?.querySelector('.active')?.getAttribute('data-currency');
                            Currency.convertAll(window.shop_currency, currencyCode, 'span.money', 'money_format');
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

                            var ajaxCaller = (data) => {
                                return $.ajax(data);
                            }

                            product.each((index, element) => {
                                var item = $(element),
                                    variantId = item.find('input[name="id"]').val(),
                                    qty = parseInt(item.find('input[name="quantity"]').val());

                                if(product.find('[name^="properties"]').length > 0) {
                                    var productPropertyList = product.find('[name^="properties"]');
                                    var productProprerty = '';
                                    
                                    for(var i = 0; i < product.find('[name^="properties"]').length; i++){
                                        if($(productPropertyList[i]).val() != '') {
                                            productProprerty = productProprerty + `&${$(productPropertyList[i]).attr('name')}=${$(productPropertyList[i]).val()}`;
                                        }
                                    }
                                    productHandleQueue.push(ajaxCaller({
                                        type: 'POST',
                                        url: `${window.routes.cart}/add.js`,
                                        data: `quantity=${qty}&id=${variantId}${productProprerty}`,
                                        dataType: 'json',
                                        async: false
                                    }));
                                } else {
                                    productHandleQueue.push(ajaxCaller({
                                        type: 'POST',
                                        url: `${window.routes.cart}/add.js`,
                                        data: `quantity=${qty}&id=${variantId}`,
                                        dataType: 'json',
                                        async: false
                                    }));
                                }
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
                                            halo.updateQuickCart(cart);
                                        } else if($body.hasClass('cart-sidebar-show')) {
                                            halo.updateQuickCart(cart);
                                        } else {
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

        initNotifyInStock: function() {
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
                setTimeout(() => {
                    $('.halo-notify-popup .form-field').removeClass('hidden')
                    $('.halo-notify-popup .form-message').addClass('hidden')
                }, 700)
            });

            $doc.on('click', (event) => {
                if($body.hasClass('notify-me-show')){
                    if (($(event.target).closest('[data-open-notify-popup]').length === 0) && ($(event.target).closest('[data-notify-popup]').length === 0)){
                        $body.removeClass('notify-me-show');
                        setTimeout(() => {
                            $('.halo-notify-popup .form-field').removeClass('hidden')
                            $('.halo-notify-popup .form-message').addClass('hidden')
                        }, 700)
                    }
                }
            });
        },

        notifyInStockPopup: function($target){
            var variant,
                product = $target.parents('.product-item'),
                title = product.find('.card-title').data('product-title'),
                link = window.location.host + product.find('.card-title').data('product-url'),
                popup = $('[data-notify-popup]');

            if($target.hasClass('is-notify-me')){
                variant = product.find('.card-swatch .swatch-label.is-active').attr('title');
            } else {
                variant = $target.data('variant-id');
            }

            popup.find('.halo-notify-product-title').val($.trim(title));
            popup.find('.halo-notify-product-link').val(link);
            if(variant){
                popup.find('.halo-notify-product-variant').val(variant);
            }
            $body.addClass('notify-me-show');
        },

        initAskAnExpert: function(){
            $doc.on('click', '[data-open-ask-an-expert]', (event) => {
                event.preventDefault();
                event.stopPropagation();

                var askAnExpert = $('[data-ask-an-expert-popup]'),
                    modalContent = askAnExpert.find('.halo-popup-content'),
                    url;

                if($body.hasClass('template-product')){
                    var handle = $('.productView').data('product-handle');

                    url = window.routes.root + '/products/' + handle + '?view=ajax_ask_an_expert';
                } else if($body.hasClass('quick-view-show')){
                    var handle = $('.halo-quickView').data('product-quickview-handle');

                    url = window.routes.root + '/products/' + handle + '?view=ajax_ask_an_expert';
            } else {
                    url = window.routes.root + '/search?view=ajax_ask_an_expert';
                }

                $.ajax({
                    type: 'get',
                    url: url,
                    beforeSend: function () {
                        modalContent.empty();
                    },
                    success: function (data) {
                        modalContent.html(data);
                    },
                    error: function (xhr, text) {
                        alert($.parseJSON(xhr.responseText).description);
                    },
                    complete: function () {
                        $body.addClass('ask-an-expert-show');
                    }
                });
            });

            $doc.on('click', '[data-close-ask-an-expert]', (event) => {
                event.preventDefault();
                event.stopPropagation();

                $body.removeClass('ask-an-expert-show');
                if($body.hasClass('recently-popup-mb-show')){
                    $body.removeClass('recently-popup-mb-show');
                }
            });

            $doc.on('click', (event) => {
                if($body.hasClass('ask-an-expert-show')){
                    if (($(event.target).closest('[data-open-ask-an-expert]').length === 0) && ($(event.target).closest('#halo-ask-an-expert-popup').length === 0)){
                        $body.removeClass('ask-an-expert-show');
                    }
                }
            });
        },

        resetForm: function(form){
            $('.form-field', form).removeClass('form-field--success form-field--error');
            $('input[type=email], input[type=text], textarea', form).val('');
        },

        formMessage: function() {
            const error = window.location.href.indexOf('form_type=contact') > -1;

            if (window.location.href.indexOf('contact_posted=true') > -1 || error) {
                const formMessage = $(`[data-form-message="${this.getCookie('contact_form')}"]`);
                let delay = 400;
                if ($body.hasClass('template-product')) delay = 1600;

                switch(formMessage.data('form-message')) {
                    case 'ask':
                        setTimeout(() => {$body.addClass('ask-an-expert-show')}, delay)
                        this.changeStateforContactForm(formMessage, error)
                        $('.halo-notify-popup .form-message').addClass('hidden')
                        break;
                    case 'contact':
                        formMessage.removeClass('hidden')
                        this.changeStateforContactForm(formMessage, error)
                        $('.halo-notify-popup .form-message').addClass('hidden')
                        break;
                    case 'notifyMe':
                        $('.halo-notify-popup .form-field').addClass('hidden')
                        setTimeout(() => {$body.addClass('notify-me-show')}, delay)
                        this.changeStateforContactForm(formMessage, error)
                        break;
                }
            }

            $(document).on('click', '[data-button-message]', (event) => {
              this.setCookie('contact_form', $(event.target).data('button-message'), 1);
            })
        },

        changeStateforContactForm(formMessage, error) {
            window.history.pushState('object', document.title, location.href.split('?')[0])
            if (error) {$('.newsletter-form__message--error').addClass('hidden'); $('html, body').animate({scrollTop: formMessage.offset().top - window.innerHeight/2}, 700)}
        },
        setCookie(cname, cvalue, exdays){
            const d = new Date();
            d.setTime(d.getTime() + (exdays * 24 * 60 * 60 * 1000));
            const expires = 'expires=' + d.toUTCString();
            document.cookie = cname + '=' + cvalue + ';' + expires + ';path=/';
        },

        getCookie(cname) {
            const name = cname + '=';
            const ca = document.cookie.split(';');

            for (var i = 0; i < ca.length; i++) {
                var c = ca[i];
                while (c.charAt(0) === ' ') {
                    c = c.substring(1);
                }
                if (c.indexOf(name) === 0) {
                    return c.substring(name.length, c.length);
                }
            }

            return '';
        },

        initCompareProduct: function() {
            if(window.compare.show){
                Shopify.ProductCompare.setLocalStorageProductForCompare();

                halo.setAddorRemoveProductForCompare();
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

        setAddorRemoveProductForCompare: function() {
            $doc.on('change', '[data-product-compare] input', (event) => {
                var item = event.currentTarget.closest('.card-compare'),
                    handle = event.currentTarget.value,
                    compareList = JSON.parse(localStorage.getItem('compareItem')) || [];

                compareList = halo.uniqueArray(compareList);

                if(event.currentTarget.checked) {
                    if(item.querySelector('.compare-icon')){
                        item.querySelector('.compare-icon').classList.add('is-checked');
                    }

                    if(item.querySelector('.text')){
                        item.querySelector('.text').innerText = window.compare.added;
                    }

                    item.querySelector('input').setAttribute('checked', true);

                    if(window.card.layout == '4' || window.card.layout == '5'){
                        item.querySelector('label').inerHTML = `<span class="visually-hidden">${window.compare.added}</span>${window.compare.added}`;
                    }

                    halo.incrementCounterCompare(compareList, handle);
                } else {
                    if(item.querySelector('.compare-icon')){
                        item.querySelector('.compare-icon').classList.remove('is-checked');
                    }

                    if(item.querySelector('.text')){
                        item.querySelector('.text').innerText = window.compare.add;
                    }

                    item.querySelector('input').removeAttribute('checked');

                    if(window.card.layout == '4' || window.card.layout == '5'){
                        item.querySelector('label').inerHTML = `<span class="visually-hidden">${window.compare.add}</span>${window.compare.add}`;
                    }

                    halo.decrementCounterCompare(compareList, handle);
                }
            });
        },

        setProductForCompare: function() {
            $doc.on('click', '[data-compare-link]', (event) => {
                event.preventDefault();
                event.stopPropagation();

                var compareList = JSON.parse(localStorage.getItem('compareItem')) || [];

                if (compareList.length <= 1) {
                    alert(window.compare.message);

                    return false;
                } else {
                    halo.updateContentCompareProduct(compareList, 0);
                }
            });

            $doc.on('click', '[data-compare-remove]', (event) => {
                event.preventDefault();
                event.stopPropagation();

                var compareTable = $('[data-compare-product-popup] .compareTable'),
                    item = compareTable.find(`.compareTable-row[data-product-compare-id="${event.currentTarget.getAttribute('data-compare-item')}"]`),
                    handle = item.data('compare-product-handle');

                item.remove();
                    
                var compareList = JSON.parse(localStorage.getItem('compareItem')) || [],
                    index = compareList.indexOf(handle);

                if (index > -1) {
                    compareList.splice(index, 1);
                    compareList = halo.uniqueArray(compareList);
                    localStorage.setItem('compareItem', JSON.stringify(compareList));

                    Shopify.ProductCompare.setLocalStorageProductForCompare();
                }

                if(compareTable.find('tbody .compareTable-row').length < 2){
                    $body.removeClass('compare-product-show');
                }
            });
        },

        uniqueArray: function(list) {
            var result = [];

            list.forEach((element) => {
                if (result.indexOf(element) == -1) {
                    result.push(element);
                }
            });

            return result;
        },

        incrementCounterCompare: function(compareList, item) {
            compareList.push(item);
            compareList = halo.uniqueArray(compareList);

            localStorage.setItem('compareItem', JSON.stringify(compareList));

            Shopify.ProductCompare.updateCounterCompare();
        },

        decrementCounterCompare: function(compareList, item) {
            const index = compareList.indexOf(item);

            if (index > -1) {
                compareList.splice(index, 1);
                compareList = halo.uniqueArray(compareList);

                localStorage.setItem('compareItem', JSON.stringify(compareList));

                Shopify.ProductCompare.updateCounterCompare();
            }
        },

        updateContentCompareProduct: function(list, count){
            const compareTable = $('[data-compare-product-popup] .compareTable'),
                url = window.routes.root + '/products/' + list[count] + '?view=ajax_product_card_compare';

            if (count == 0) compareTable.find('tbody').empty();

            if (list.length > count) {
                $.ajax({
                    type: 'get',
                    url: url,
                    cache: false,
                    success: function (data) {
                        compareTable.find('tbody').append(data);
                        count++;
                        halo.updateContentCompareProduct(list, count);
                    }
                });
            } else {
                $body.addClass('compare-product-show');
            }
        },

        initProductView: function($scope){
            halo.productImageGallery($scope);
            halo.productCustomCursor($scope);
            halo.initVariantImageGroup($scope);
        },

        initQuickView: function(){
            let checkLoadQV = true;
            $doc.on('click', '[data-open-quick-view-popup]', (event) => {
                event.preventDefault();
                event.stopPropagation();

                if (checkLoadQV) {
                    checkLoadQV = false;
                    const $quickView = document.querySelector('.halo-quick-view-popup');
                    const urlStyleProduct = $quickView.dataset.urlStyleProduct;
                    const urlStyleQV = $quickView.dataset.urlStyleQuickView;

                    halo.buildStyleSheet(urlStyleProduct, $quickView);
                    halo.buildStyleSheet(urlStyleQV, $quickView);
                }

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
                type: 'GET',
                url: window.routes.root + `/products/${handle}?view=ajax_quick_view`,
                beforeSend: () => {
                    popupContent.empty();
                },
                success: (data) => {
                    const html = new DOMParser().parseFromString(data, 'text/html');

                    popupContent.html(html.getElementById('shopify-section-halo-quick-view').innerHTML);
                },
                error: (xhr, text) => {
                    alert($.parseJSON(xhr.responseText).description);
                },
                complete: () => {
                    var $scope = popup.find('.quickView');
                    
                    halo.productImageGallery($scope);
                    halo.initVariantImageGroup($scope);
                    
                    if(window.wishlist.show){
                        Shopify.ProductWishlist.setProductForWishlist(handle);
                    }

                    if (window.quick_view_buy_it_now && window.Shopify && Shopify.PaymentButton) {
                        Shopify.PaymentButton.init();
                    }

                    $body.addClass('quick-view-show');

                    if (halo.checkNeedToConvertCurrency()) {
                        var currencyCode = document.getElementById('currencies')?.querySelector('.active')?.getAttribute('data-currency');
                        Currency.convertAll(window.shop_currency, currencyCode, 'span.money', 'money_format');
                    }
                }
            });
        },

        productImageGallery: function($scope) {
            var sliderFor = $scope.find('.productView-for'),
                sliderNav = $scope.find('.productView-nav'),
                sliderForToShow = 6,
                sliderForToScroll = 1,
                checkSwipe = '',
                mainArrows = sliderNav.data('arrow');
                mainDots = sliderNav.data('dot');

            if(typeof sliderFor.data('item-to-show') != 'undefined') {
                sliderForToShow = parseInt(sliderFor.data('item-to-show'));
            }

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
                            rtl: window.rtl_slick,
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
                            rtl: window.rtl_slick,
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

                    if (sliderNav.find('.deferred-media').length > 0) {
                        checkSwipe = false;
                    } else {
                        checkSwipe = true;
                    }

                    sliderNav.slick({
                        fade: true,
                        arrows: mainArrows,
                        dots: mainDots,
                        infinite: true,
                        slidesToShow: 1,
                        slidesToScroll: 1,
                        swipe: checkSwipe,
                        asNavFor: sliderFor,
                        rtl: window.rtl_slick,
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
                        if (typeof window.onYouTubeiframeAPIReady === 'undefined') {
                            window.onYouTubeiframeAPIReady = halo.initYoutubeCarousel.bind(window, sliderNav);

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
                           var currentSlide = $(slick.$slider).find('.slick-current'),
                                player = currentSlide.find('iframe').get(0),
                                command = {
                                    'method': 'pause',
                                    'value': 'true'
                                };

                            if (player != undefined) {
                                player.contentWindow.postMessage(JSON.stringify(command), '*');
                            }
                        });

                        sliderNav.on('afterChange', (event, slick) => {
                            var currentSlide = $(slick.$slider).find('.slick-current'),
                                player = currentSlide.find('iframe').get(0),
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
                            var currentSlide = $(slick.$slider).find('.slick-current'),
                                player = currentSlide.find('video').get(0);

                            if (player != undefined) {
                                player.pause();
                            }
                        });

                        sliderNav.on('afterChange', (event, slick) => {
                            var currentSlide = $(slick.$slider).find('.slick-current'),
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

        productCustomCursor: function($scope) {
            if ($scope.find('.productView-cursor').length > 0){
                const { Back } = window;

                this.cursorWrapper = $scope.get(0).querySelector('.productView-cursor');
                this.outerCursor = this.cursorWrapper.querySelector('.productView-cursor__outer');
                this.counterCursor = this.cursorWrapper.querySelector('.productView-cursor__counter')

                document.addEventListener('mousemove', (event) => {
                    this.clientX = event.clientX;
                    this.clientY = event.clientY;
                });

                const render = () => {
                    TweenMax.set(this.cursorWrapper, {
                        x: this.clientX,
                        y: this.clientY
                    });
                    
                    requestAnimationFrame(render);
                };

                requestAnimationFrame(render);

                this.fullCursorSize = 34;

                this.enlargeCursorTween = TweenMax.to(this.outerCursor, 0.3, {
                    width: this.fullCursorSize,
                    height: this.fullCursorSize,
                    ease: this.easing,
                    paused: true
                });

                const handleMouseEnter = () => {
                    this.enlargeCursorTween.play();
                    this.cursorWrapper.classList.add('handleMouseEnter');
                    this.cursorWrapper.classList.remove('handleMouseLeave');
                };

                const handleMouseLeave = () => {
                    this.enlargeCursorTween.reverse();
                    this.cursorWrapper.classList.add('handleMouseLeave');
                    this.cursorWrapper.classList.remove('handleMouseEnter');
                };

                this.gallery = $scope.get(0).querySelectorAll('.productView-image.is-image, .product__modal-opener');

                this.gallery.forEach(element => {
                    element.addEventListener('mouseenter', handleMouseEnter);
                    element.addEventListener('mouseleave', handleMouseLeave);
                });

                this.galleryImage = $scope.get(0).querySelectorAll('[data-cursor-image]');

                this.galleryImage.forEach(element => {
                    element.addEventListener('mouseover', (event) => {
                        let imagesInView = new Array();

                        imagesInView.push(event.currentTarget.dataset.index);
                        this.counterCursor.querySelector('span').innerText = imagesInView[0];
                    });
                });

                var isInViewport = (element, excludePartials) => {
                    let elementTop = element.getBoundingClientRect.top,
                        elementBottom = elementTop + element.offsetHeight,
                        viewportTop = document.documentElement.scrollTop,
                        viewportBottom = viewportTop + window.innerHeight;

                    if (excludePartials) {
                        let bottomVisible = (elementBottom - viewportTop) / element.offsetHeight,
                            isInView = elementBottom > viewportTop && elementTop < viewportBottom;

                        return isInView && bottomVisible > 0.5;
                    }

                    return elementBottom > viewportTop && elementTop < viewportBottom;
                }

                if ($scope.hasClass('layout-5')) {
                    $win.on('resize scroll', () => {
                        let imagesInView = new Array();

                        this.galleryImage.forEach(element => {
                            if (isInViewport(element, true)) {
                                imagesInView.push(element.dataset.index);

                                this.counterCursor.querySelector('span').innerText = imagesInView[0];
                            }
                        });
                    });
                }
            }
        },

        initVariantImageGroup: function($scope) {
            if($scope.attr('data-variant-image-grouped') == 'true' && !$scope.hasClass('layout-5')){
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
        },

        buildComplementaryProducts: function(){
            if(document.querySelector('[data-complementary-product]')){
                var $this = document.querySelector('[data-complementary-product]');

                fetch($this.dataset.url)
                .then(response => response.text())
                .then(text => {
                    const html = document.createElement('div');
                    html.innerHTML = text;
                    const recommendations = html.querySelector('[data-complementary-product]');
                    if (recommendations && recommendations.innerHTML.trim().length) {
                        $this.innerHTML = recommendations.innerHTML;

                        if (halo.checkNeedToConvertCurrency()) {
                            var currencyCode = document.getElementById('currencies')?.querySelector('.active')?.getAttribute('data-currency');
                            Currency.convertAll(window.shop_currency, currencyCode, 'span.money', 'money_format');
                        }
                    }

                    if($('#complementary-product-data').find('.products-carousel').length > 0){
                        var slider = $('#complementary-product-data').find('.products-carousel'),
                            itemArrows = slider.data('item-arrows'),
                            itemDots = slider.data('item-dots'),
                            itemRows = slider.data('item-rows'),
                            itemToShow = slider.data('item-to-show');
                            
                        productsCarousel(slider);
                    }

                    function productsCarousel(slider){
                        if(!slider.hasClass('slick-slider')) {
                            slider.slick({
                                dots: itemDots,
                                arrows: itemArrows,
                                get slidesToShow() {
                                    if ($('#complementary-product-data').hasClass('style-1')) {
                                        return this.slidesToShow = itemToShow;
                                    } 
                                },
                                get rows() {
                                    if ($('#complementary-product-data').hasClass('style-2')) {
                                        return this.rows = itemRows;
                                    }
                                },
                                slidesToScroll: 1,
                                slidesPerRow: 1,
                                infinite: false,
                                rtl: window.rtl_slick,
                                nextArrow: '<button type="button" class="slick-arrow slick-arrow--circle slick-next" aria-label="'+ window.accessibility.next_slide +'">' + window.slick.nextArrow + '</button>',
                                prevArrow: '<button type="button" class="slick-arrow slick-arrow--circle slick-prev" aria-label="'+ window.accessibility.previous_slide +'">' + window.slick.prevArrow + '</button>',
                                responsive: [
                                    {
                                        breakpoint: 1025,
                                        settings: {
                                            get slidesToShow() {
                                                if ($('#complementary-product-data').hasClass('style-1')) {
                                                    return this.slidesToShow = 2;
                                                }
                                                if ($('#complementary-product-data').hasClass('style-2')) {
                                                    return this.slidesToShow = 1;
                                                } 
                                            }
                                        }
                                    },
                                    {
                                        breakpoint: 992,
                                        settings: {
                                            get slidesToShow() {
                                                if ($('#complementary-product-data').hasClass('style-1')) {
                                                    return this.slidesToShow = 3;
                                                }
                                                if ($('#complementary-product-data').hasClass('style-2')) {
                                                    return this.slidesToShow = 1;
                                                } 
                                            }
                                        }
                                    },
                                    {
                                        breakpoint: 768,
                                        settings: {
                                            get slidesToShow() {
                                                if ($('#complementary-product-data').hasClass('style-1')) {
                                                    return this.slidesToShow = 2;
                                                }
                                                if ($('#complementary-product-data').hasClass('style-2')) {
                                                    return this.slidesToShow = 1;
                                                } 
                                            }
                                        }
                                    },
                                    {
                                        breakpoint: 321,
                                        settings: {
                                            slidesToShow: 1
                                        }
                                    }
                                ]
                            });
                        }
                    }
                })
                .catch(e => {
                    console.error(e);
                });
            }
        },

        initYoutubeCarousel: function(slider) {
            slider.each((index, slick) => {
                const $slick = $(slick);
                
                if ($slick.find('[data-youtube]').length > 0) {
                    $slick.addClass('slick-slider--video');

                    halo.initYoutubeCarouselEvent($slick);
                }
            });
        },

        initYoutubeCarouselEvent: function($slick){
            var $videos = $slick.find('[data-youtube]');

            bindEvents();

            function bindEvents() {
                if ($slick.hasClass('slick-initialized')) {
                    onSlickVideoInit();
                }

                $slick.on('init', onSlickVideoInit);
                $slick.on('beforeChange', onSlickImageBeforeChange);
                $slick.on('afterChange', onSlickImageAfterChange);
            }

            function onPlayerReady(event) {
                $(event.target.getiframe()).closest('.slick-slide').data('youtube-player', event.target);

                setTimeout(function(){
                    if ($(event.target.getiframe()).closest('.slick-slide').hasClass('slick-active')) {
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
                    const id = `youtube_player_${Math.floor(Math.random() * 100)}`;

                    video.setAttribute('id', id);

                    const player = new YT.Player(id, {
                        host: 'http://www.youtube.com',
                        videoId: video.getAttribute('data-youtube'),
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
                        rtl: window.rtl_slick,
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
                                halo.setProductForWishlistPage2(wishlistList, 0);
                            }
                        }

                        wishlistList.push(handle);
                        Shopify.ProductWishlist.setWishlistCounter(wishlistList.length);
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
                        Shopify.ProductWishlist.setWishlistCounter(wishlistList.length);

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
                            halo.setProductForWishlistPage2(wishlistList, 0);
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

        setProductForWishlistPage2: function(list, shownSection){
            var wishlistContainer = $('[data-wishlist-content]'),
                imageRatio = wishlistContainer.data('image-ratio'),
                ratio = wishlistContainer.data('portrait-aspect-ratio');

            const url = window.routes.root + '/products/' + list[shownSection] + '?view=ajax_product_card_wishlist';

            if (shownSection < list.length) {
                $.ajax({
                    type: 'get',
                    url: url,
                    cache: false,
                    success: function (data) {
                        const dataMedia = halo.addMediaSizeWishlist(data, imageRatio, ratio);
                        wishlistContainer.append(dataMedia);
                        shownSection++;

                        halo.updateShareWishlistViaMail();
                        halo.setProductForWishlistPage2(list, shownSection);
                    }
                });
            } else {
                if(window.product_swatch_style == 'slider'){
                    var product = wishlistContainer.find('.product');

                    halo.initProductCardSwatchSlider(product);
                }

                if(window.compare.show){
                    Shopify.ProductCompare.setLocalStorageProductForCompare();
                }

                if (halo.checkNeedToConvertCurrency()) {
                    var currencyCode = document.getElementById('currencies')?.querySelector('.active')?.getAttribute('data-currency');
                    Currency.convertAll(window.shop_currency, currencyCode, 'span.money', 'money_format');
                }
            }
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

        initDynamicBrowserTabTitle: function() {
            if(window.dynamic_browser_title.show){
                var pageTitleContent = document.title,
                    newPageTitleContent = window.dynamic_browser_title.text;

                window.onblur = () => {
                    document.title = window.dynamic_browser_title.text;
                }

                window.onfocus = () => {
                    document.title = pageTitleContent;
                }
            }
        }
    }
})(jQuery);