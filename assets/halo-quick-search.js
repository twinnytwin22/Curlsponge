if (!customElements.get('quick-search')) {
    class QuickSearch extends HTMLElement {
        constructor() {
            super();

            this.quickSearch = this;
            this.headerInput = document.querySelector('input[name="q"]');
            this.headerSearchIcon = document.querySelector('[data-open-search-popup]');
            this.searchResultsWidget = this.quickSearch.getElementsByClassName('quickSearchResultsWidget')[0];

            this.debouncedOnBeforeFocus = debounce((event) => {
                this.doBeforeQuickSearch();
            }, 100);

            this.headerInput.addEventListener('focus', this.debouncedOnBeforeFocus.bind(this));

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

        renderQuickSearchFromBlock(){
            if(!this.searchResultsWidget.classList.contains('ajax-loaded')){
                const block = this.searchResultsWidget.querySelector('.quickSearchProduct');

                let url = block?.getAttribute('data-collection'),
                    limit = this.quickSearch.getAttribute('data-limit'),
                    layout = 'grid',
                    imageRatio = this.quickSearch.getAttribute('data-image-ratio'),
                    ratio = this.quickSearch.getAttribute('data-ratio'),
                    action = true,
                    sectionId = 'list-result-block';

                if(url != null && url != undefined) {
                    $.ajax({
                        type: 'GET',
                        url: window.routes.root + '/collections/' + url,
                        cache: false,
                        data: {
                            view: 'ajax_product_card_search',
                            constraint: `limit=${limit}+layout=${layout}+sectionId=${sectionId}+imageRatio=${imageRatio}+action=${action}+portraitAspectRatio=${ratio}`
                        },
                        beforeSend: () => {
                            block.closest('.quickSearchResultsWidget').classList.add('ajax-loaded');
                        },
                        success: (data) => {
                            if (url != '') {
                                const dataMedia = this.addMediaSize(data, imageRatio, ratio, action, limit);
                                block.querySelector('.products-grid').innerHTML = dataMedia;
                            }
                        },
                        complete: () => {
                            if(window.product_swatch_style == 'slider'){
                                var productList = block.querySelectorAll('.product');

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
                                Shopify.ProductCompare.setLocalStorageProductForCompare();
                            }

                            if(window.wishlist.show){
                                Shopify.ProductWishlist.setLocalStorageProductForWishlist();
                            }

                            if ((window.show_multiple_currencies && Currency.currentCurrency != window.shop_currency) || window.show_auto_currency) {
                                let currencyCode = document.getElementById('currencies')?.querySelector('.active')?.getAttribute('data-currency');

                                Currency.convertAll(window.shop_currency, currencyCode, 'span.money', 'money_format');
                            }
                        }
                    });
                } else{
                    this.searchResultsWidget.classList.add('ajax-loaded');

                    if ((window.show_multiple_currencies && Currency.currentCurrency != window.shop_currency) || window.show_auto_currency) {
                        let currencyCode = document.getElementById('currencies')?.querySelector('.active')?.getAttribute('data-currency');

                        Currency.convertAll(window.shop_currency, currencyCode, 'span.money', 'money_format');
                    }
                }
            }
        }

        addMediaSize(data, imageRatio, ratio, action, limit) {
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

            // Action
            const $cardAction = $(htmlMedia).find('.card-action');
            if (action == true) {
                $cardAction.removeClass('d-none')
            } else {
                $cardAction.remove()
            }

            // Limit
            $(htmlMedia).find(`.product:nth-child(n+${Number(limit) + 1})`).remove();

            return $(htmlMedia).html();
        }
    }

    customElements.define('quick-search', QuickSearch);
}