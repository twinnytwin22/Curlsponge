class QuickSearch extends HTMLElement {
	constructor() {
		super();

        this.quickSearch = this;
        this.productToShow = this.getAttribute('data-product-to-show');
        this.headerInput = document.querySelector('input[name="q"]');
        this.headerSearchIcon = document.querySelector('[data-open-search-popup]');
        this.searchResults = this.getElementsByClassName('quickSearchResultsContent')[0];
        this.searchResultsWidget = this.getElementsByClassName('quickSearchResultsWidget')[0];

        this.debouncedOnBeforeFocus = debounce((event) => {
            this.doBeforeQuickSearch();
        }, 100);

        this.debouncedOnFocus = debounce((event) => {
            this.doQuickSearch();
        }, 200);

        this.headerInput.addEventListener('focus', this.debouncedOnBeforeFocus.bind(this));
        this.headerInput.addEventListener('input', this.debouncedOnFocus.bind(this));

        if(this.headerSearchIcon){
            this.headerSearchIcon.addEventListener('click', this.debouncedOnBeforeFocus.bind(this));
        }

        if(window.innerWidth <= 1024){
            if(document.querySelector('[data-search-mobile]')){
                document.querySelectorAll('[data-search-mobile]').forEach((button) => {
                    button.addEventListener('click', this.doBeforeQuickSearch.bind(this));
                });
            }
        }
	}

    doBeforeQuickSearch(){
        this.renderQuickSearchFromBlock();
    }

    doQuickSearch(){
        if (this.headerInput.value.trim() === '') {
            this.searchResults.classList.remove('is-show');
            this.searchResults.classList.add('is-hidden');
            this.searchResultsWidget.classList.remove('is-hidden');
            this.searchResultsWidget.classList.add('is-show');

            return; 
        } else {
            if (this.headerInput.value.length > 2){
                this.quickSearch.classList.add('is-loading');

                var keyword = this.headerInput.value;
                var limit = this.productToShow;
                var url = `/search?view=ajax_quick_search&q=${keyword}*&type=product`;

                this.renderQuickSearchFromFetch(url, keyword, limit);
            }
        }
    }

    renderQuickSearchFromBlock(){
        if(!this.searchResultsWidget.classList.contains('ajax-loaded')){
            var $block = $(this.searchResultsWidget).find('.quickSearchProduct'),
                url = $block.data('collection'),
                layout = 'grid',
                limit = $block.data('limit'),
                image_ratio = $block.data('image-ratio'),
                portrait_aspect_ratio = $block.data('ratio'),
                action = true,
                sectionId = 'list-result';

            if(url != null && url != undefined) {
                $.ajax({
                    type: 'get',
                    url: window.routes.root + '/collections/' + url,
                    cache: false,
                    data: {
                        view: 'ajax_product_card_search',
                        constraint: `limit=${limit}+layout=${layout}+sectionId=${sectionId}+imageRatio=${image_ratio}+action=${action}+portraitAspectRatio=${portrait_aspect_ratio}`
                    },
                    beforeSend: function () {
                        $block.parents('.quickSearchResultsWidget').addClass('ajax-loaded');
                    },
                    success: function (data) {
                        if (url != '') {
                            $block.find('.products-grid').html(data);
                        }
                    },
                    complete: function () {
                        if(window.product_swatch_style == 'slider'){
                            var productList = $block.find('.product');

                            productList.each((index, element) => {
                                var product = $(element),
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

                        if ((window.show_multiple_currencies && Currency.currentCurrency != shopCurrency) || window.show_auto_currency) {
                            Currency.convertAll(window.shop_currency, $('#currencies .active').attr('data-currency'), 'span.money', 'money_format');
                        }
                    }
                });
            } else{
                $block.parents('.quickSearchResultsWidget').addClass('ajax-loaded');

                if ((window.show_multiple_currencies && Currency.currentCurrency != shopCurrency) || window.show_auto_currency) {
                    Currency.convertAll(window.shop_currency, $('#currencies .active').attr('data-currency'), 'span.money', 'money_format');
                }
            }
        }
    }
   
    renderQuickSearchFromFetch(url, keyword, limit){
        fetch(url)
        .then(response => response.json())
        .then((responseText) => {
            const products = responseText.results;

            var count = responseText.results_count,
                searchQuery;

            if(window.search == 'product'){
                searchQuery = `/search?q=${keyword}&type=product&options%5Bprefix%5D=last`;
            } else {
                searchQuery = responseText.url;
            }

            if(products.length > 0){
                this.searchResults.getElementsByClassName('productEmpty')[0].style.display = 'none';

                var list = []; 

                products.forEach(product => {
                    list.push(product.handle);
                });

                var quickSearch = this.quickSearch,
                    searchResults = this.searchResults,
                    searchResultsWidget = this.searchResultsWidget;

                $.ajax({
                    type: 'get',
                    url: window.routes.collection_all,
                    cache: false,
                    data: {
                        view: 'ajax_product_card_search_2',
                        constraint: `limit=${limit}+sectionId=list-result+list_handle=` + encodeURIComponent(list)
                    },
                    beforeSend: function () {},
                    success: function (data) {
                        searchResults.getElementsByClassName('productGrid')[0].innerHTML = data;
                        searchResults.getElementsByClassName('productViewAll')[0].style.display = 'block';
                        searchResults.getElementsByClassName('button-view-all')[0].setAttribute('href', searchQuery);
                        searchResults.getElementsByClassName('button-view-all')[0].innerText = count;
                    },
                    complete: function () {
                        quickSearch.classList.remove('is-loading');
                        searchResultsWidget.classList.remove('is-show');
                        searchResultsWidget.classList.add('is-hidden');
                        searchResults.classList.remove('is-hidden');
                        searchResults.classList.add('is-show');

                        if(window.product_swatch_style == 'slider'){
                            var productList = searchResults.querySelectorAll('.product');

                            productList.forEach((element) => {
                                var product = $(element),
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
                        
                        if ((window.show_multiple_currencies && Currency.currentCurrency != shopCurrency) || window.show_auto_currency) {
                            Currency.convertAll(window.shop_currency, $('#currencies .active').attr('data-currency'), 'span.money', 'money_format');
                        }
                    }
                });
            } else {
                this.searchResults.getElementsByClassName('productGrid')[0].innerHTML = '';
                this.searchResults.getElementsByClassName('productViewAll')[0].style.display = 'none';
                this.searchResults.getElementsByClassName('productEmpty')[0].style.display = 'block';
                this.searchResults.getElementsByClassName('keyword')[0].innerHTML = `<strong>${keyword}.</strong>`;
                this.searchResults.getElementsByClassName('link')[0].setAttribute('href', searchQuery);
                this.quickSearch.classList.remove('is-loading');
                this.searchResultsWidget.classList.remove('is-show');
                this.searchResultsWidget.classList.add('is-hidden');
                this.searchResults.classList.remove('is-hidden');
                this.searchResults.classList.add('is-show');
            }
        });
    }
}

customElements.define('quick-search', QuickSearch);