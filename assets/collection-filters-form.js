class CollectionFiltersForm extends HTMLElement {
    constructor() {
        super();
        this.filterData = [];
        this.onActiveFilterClick = this.onActiveFilterClick.bind(this);

        this.debouncedOnSubmit = debounce((event) => {
            this.onSubmitHandler(event);
        }, 500);

        this.debouncedOnClick = debounce((event) => {
            this.onClickHandler(event);
        }, 500);

        this.querySelector('form').addEventListener('input', this.debouncedOnSubmit.bind(this));

        if(this.querySelector('#filter__price--apply')){
            this.querySelector('#filter__price--apply').addEventListener('click', this.debouncedOnClick.bind(this));
        }
    }

    static setListeners() {
        const onHistoryChange = (event) => {
            const searchParams = event.state ? event.state.searchParams : CollectionFiltersForm.searchParamsInitial;
            if (searchParams === CollectionFiltersForm.searchParamsPrev) return;
            CollectionFiltersForm.renderPage(searchParams, null, false);
        }

        window.addEventListener('popstate', onHistoryChange);
    }

    static toggleActiveFacets(disable = true) {
        document.querySelectorAll('.js-facet-remove').forEach((element) => {
            element.classList.toggle('disabled', disable);
        });
    }

    static renderPage(searchParams, event, updateURLHash = true) {
        CollectionFiltersForm.searchParamsPrev = searchParams;

        const sections = CollectionFiltersForm.getSections();

        // document.getElementById('CollectionProductGrid').querySelector('.collection').classList.add('is-loading');
        document.body.classList.add('has-halo-loader');

        sections.forEach((section) => {
            const url = `${window.location.pathname}?section_id=${section.section}&${searchParams}`;
            const filterDataUrl = element => element.url === url;

            CollectionFiltersForm.filterData.some(filterDataUrl) ?
            CollectionFiltersForm.renderSectionFromCache(filterDataUrl, section, event) :
            CollectionFiltersForm.renderSectionFromFetch(url, section, event);
        });

        if (updateURLHash) CollectionFiltersForm.updateURLHash(searchParams);
    }

    static renderSectionFromFetch(url, section, event) {
        fetch(url)
        .then(response => response.text())
        .then((responseText) => {
            const html = responseText;
            CollectionFiltersForm.filterData = [...CollectionFiltersForm.filterData, { html, url }];
            CollectionFiltersForm.renderFilters(html, event);
            CollectionFiltersForm.renderProductGrid(html);
        });
    }

    static renderSectionFromCache(filterDataUrl, section, event) {
        const html = this.filterData.find(filterDataUrl).html;
        this.renderFilters(html, event);
        this.renderProductGrid(html);
    }

    static renderProductGrid(html) {
        const innerHTML = new DOMParser()
            .parseFromString(html, 'text/html')
            .getElementById('CollectionProductGrid')
            .querySelector('.collection').innerHTML;

        document.getElementById('CollectionProductGrid').querySelector('.collection').innerHTML = innerHTML;

        if(document.querySelector('[data-toolbar]')){
            this.setActiveViewModeMediaQuery(true);
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

        if(window.product_swatch_style == 'slider'){
            var productList =document.getElementById('CollectionProductGrid').querySelectorAll('.product');

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

        if(window.innerWidth < 1025){
            // document.getElementById('CollectionProductGrid').scrollIntoView({behavior: "smooth", block: "end", inline: "nearest"});
            window.scrollTo({
                top: document.getElementById('CollectionProductGrid').getBoundingClientRect().top + window.pageYOffset - 50,
                behavior: 'smooth'
            });
        }

        document.body.classList.remove('has-halo-loader');
    }

    static renderFilters(html, event) {
        const parsedHTML = new DOMParser().parseFromString(html, 'text/html');

        const facetDetailsElements = parsedHTML.querySelectorAll('#CollectionFiltersForm .js-filter');
        const indexTarget = event?.target.closest('.js-filter')?.dataset.index;
        const matchesIndex = (element) => element.dataset.index === indexTarget;
        const facetsToRender = Array.from(facetDetailsElements).filter(element => !matchesIndex(element));
        const countsToRender = Array.from(facetDetailsElements).find(matchesIndex);

        facetsToRender.forEach((element) => {
            document.querySelector(`.js-filter[data-index="${element.dataset.index}"]`).innerHTML = element.innerHTML;
        });

        if (document.querySelector(`.facets__reset[data-index="${indexTarget}"]`)){
            document.querySelector(`.facets__reset[data-index="${indexTarget}"]`).style.display = 'block';
        }

        CollectionFiltersForm.renderActiveFacets(parsedHTML);

        if (countsToRender) CollectionFiltersForm.renderCounts(countsToRender, event.target.closest('.js-filter'));
    }

    static renderActiveFacets(html) {
        const activeFacetElementSelectors = ['.refined-widgets'];

        activeFacetElementSelectors.forEach((selector) => {
            const activeFacetsElement = html.querySelector(selector);
            if (!activeFacetsElement) return;
            
            var refineBlock =  document.querySelector(selector);
            refineBlock = activeFacetsElement.innerHTML;
            
            if(document.querySelector(selector).querySelector('li')){
                document.querySelector(selector).style.display = "block";
            } else {
                document.querySelector(selector).style.display = "none";
            }
        });

        CollectionFiltersForm.toggleActiveFacets(false);
    }

    static renderCounts(source, target) {
        const countElementSelectors = ['.facets__count'];

        countElementSelectors.forEach((selector) => {
            const targetElement = target.querySelector(selector);
            const sourceElement = source.querySelector(selector);

            if (sourceElement && targetElement) {
                target.querySelector(selector).outerHTML = source.querySelector(selector).outerHTML;
            }
        });
    }

    static updateURLHash(searchParams) {
        history.pushState({ searchParams }, '', `${window.location.pathname}${searchParams && '?'.concat(searchParams)}`);
    }
    

    static getSections() {
        return [{
            id: 'main-collection-product-grid',
            section: document.getElementById('main-collection-product-grid').dataset.id,
        }]
    }

    static setActiveViewModeMediaQuery(ajaxLoading = true){
        var mediaView = document.querySelector('[data-view-as]'),
            mediaViewMobile = document.querySelector('[data-view-as-mobile]'),
            viewMode = mediaView.querySelector('.icon-mode.active'),
            viewModeMobile = mediaViewMobile.querySelector('.icon-mode.active'),
            column = parseInt(viewMode.dataset.col),
            windowWidth = window.innerWidth;

        if(column != 1){
            if(document.querySelector('.sidebar--layout_vertical')){
                if (windowWidth < 768) {
                    if (column == 3 || column == 4 || column == 5) {
                        column = 2;
                        viewMode.classList.remove('active');
                        viewModeMobile.classList.remove('active');
                        mediaView.querySelector('.grid-2').classList.add('active');
                        mediaViewMobile.querySelector('.grid-2').classList.add('active');
                    }
                } else if (windowWidth <= 1100 && windowWidth >= 768) {
                    if (column == 5 || column == 4 || column == 3) {
                        column = 2;
                        viewMode.classList.remove('active');
                        viewModeMobile.classList.remove('active');
                        mediaView.querySelector('.grid-2').classList.add('active');
                        mediaViewMobile.querySelector('.grid-2').classList.add('active');
                    }
                } else if (windowWidth < 1599 && windowWidth > 1100) {
                    if (column == 5 || column == 4) {
                        column = 3;
                        viewMode.classList.remove('active');
                        viewModeMobile.classList.remove('active');
                        mediaView.querySelector('.grid-3').classList.add('active');
                        mediaViewMobile.querySelector('.grid-3').classList.add('active');
                    }
                } else if (windowWidth < 1700 && windowWidth >= 1599) {
                    if (column == 5) {
                        column = 4;
                        viewMode.classList.remove('active');
                        viewModeMobile.classList.remove('active');
                        mediaView.querySelector('.grid-4').classList.add('active');
                        mediaViewMobile.querySelector('.grid-4').classList.add('active');
                    }
                }
            } else{
                if (windowWidth < 768) {
                    if (column == 3 || column == 4 || column == 5) {
                        column = 2;
                        viewMode.classList.remove('active');
                        viewModeMobile.classList.remove('active');
                        mediaView.querySelector('.grid-2').classList.add('active');
                        mediaViewMobile.querySelector('.grid-2').classList.add('active');
                    }
                } else if (windowWidth < 992 && windowWidth >= 768) {
                    if (column == 4 || column == 5) {
                        column = 3;
                        viewMode.classList.remove('active');
                        viewModeMobile.classList.remove('active');
                        mediaView.querySelector('.grid-3').classList.add('active');
                        mediaViewMobile.querySelector('.grid-3').classList.add('active');
                    }
                } else if (windowWidth < 1600 && windowWidth >= 992) {
                    if (column == 5) {
                        column = 4;
                        viewMode.classList.remove('active');
                        viewModeMobile.classList.remove('active');
                        mediaView.querySelector('.grid-4').classList.add('active');
                        mediaViewMobile.querySelector('.grid-4').classList.add('active');
                    }
                }
            }
            
            this.initViewModeLayout(column);
        } else{
            if(ajaxLoading){
                this.initViewModeLayout(column);
            }
        }
    }

    static initViewModeLayout(column) {
        const productListing = document.getElementById('CollectionProductGrid').querySelector('.productListing');

        if (!productListing) return;

        switch (column) {
            case 1:
                productListing.classList.remove('productGrid', 'column-5', 'column-4', 'column-3', 'column-2');
                productListing.classList.add('productList');

                break;
            default:
                switch (column) {
                    case 2:
                        productListing.classList.remove('productList', 'column-5', 'column-4', 'column-3');
                        productListing.classList.add('productGrid', 'column-2');

                        break;
                    case 3:
                        productListing.classList.remove('productList', 'column-5', 'column-4', 'column-2');
                        productListing.classList.add('productGrid', 'column-3');

                        break;
                    case 4:
                        productListing.classList.remove('productList', 'column-5', 'column-3', 'column-2');
                        productListing.classList.add('productGrid', 'column-4');

                        break;
                    case 5:
                        productListing.classList.remove('productList', 'column-4', 'column-3', 'column-2');
                        productListing.classList.add('productGrid', 'column-5');

                        break;
                }
        };
    }

    onClickHandler(event) {
        event.preventDefault();

        const form = event.target.closest('form');
        const inputs = form.querySelectorAll('input[type="number"]');
        const minInput = inputs[0];
        const maxInput = inputs[1];

        if (maxInput.value) minInput.setAttribute('max', maxInput.value);
        if (minInput.value) maxInput.setAttribute('min', minInput.value);

        if (minInput.value === '') {
            maxInput.setAttribute('min', 0);
            minInput.value = Number(minInput.getAttribute('min'));
        }

        if (maxInput.value === '') {
            minInput.setAttribute('max', maxInput.getAttribute('max'));
            maxInput.value = Number(maxInput.getAttribute('max'));
        }

        const formData = new FormData(form);
        const searchParams = new URLSearchParams(formData).toString();

        CollectionFiltersForm.renderPage(searchParams, event);
    }

    onSubmitHandler(event) {
        event.preventDefault();

        if(!event.target.classList.contains('filter__price')){
            const formData = new FormData(event.target.closest('form'));
            const searchParams = new URLSearchParams(formData).toString();
            CollectionFiltersForm.renderPage(searchParams, event);
        }
    }

    onSubmitHandlerFromSortBy(event, form){
        event.preventDefault();

        if(!event.target.classList.contains('filter__price')){
            const formData = new FormData(form);
            const searchParams = new URLSearchParams(formData).toString();
            CollectionFiltersForm.renderPage(searchParams, event);
        }
    }

    onActiveFilterClick(event) {
        event.preventDefault();
        CollectionFiltersForm.toggleActiveFacets();
        const url = event.currentTarget.href.indexOf('?') == -1 ? '' : event.currentTarget.href.slice(event.currentTarget.href.indexOf('?') + 1);
        CollectionFiltersForm.renderPage(url);
    }
}

CollectionFiltersForm.filterData = [];
CollectionFiltersForm.searchParamsInitial = window.location.search.slice(1);
CollectionFiltersForm.searchParamsPrev = window.location.search.slice(1);
customElements.define('collection-filters-form', CollectionFiltersForm);
CollectionFiltersForm.setListeners();

class PriceRange extends HTMLElement {
    constructor() {
        super();
        this.rangeSliderPrice();
        this.querySelectorAll('input').forEach((element) => {
            element.addEventListener('change', this.onRangeChange.bind(this))
        });
        this.setMinAndMaxValues();
    }

    onRangeChange(event) {
        this.adjustToValidValues(event.currentTarget);
        this.setMinAndMaxValues();
    }

    setMinAndMaxValues() {
        const inputs = this.querySelectorAll('input');
        const minInput = inputs[0];
        const maxInput = inputs[1];
        
        if (maxInput.value) minInput.setAttribute('max', maxInput.value);
        if (minInput.value) maxInput.setAttribute('min', minInput.value);
        if (minInput.value === '') maxInput.setAttribute('min', 0);
        if (maxInput.value === '') minInput.setAttribute('max', maxInput.getAttribute('max'));
    }

    adjustToValidValues(input) {
        const value = Number(input.value);
        const min = Number(input.getAttribute('min'));
        const max = Number(input.getAttribute('max'));

        if (value < min) input.value = min;
        if (value > max) input.value = max;
    }

    rangeSliderPrice(){
        var rangeS = this.querySelectorAll("input[type=range]"),
            numberS = this.querySelectorAll("input[type=number]");
        
        rangeS.forEach((element) => {
            element.oninput = () => {
                var slide1 = parseFloat(rangeS[0].value),
                    slide2 = parseFloat(rangeS[1].value);

                if (slide1 > slide2) {
                    [slide1, slide2] = [slide2, slide1];
                }

                numberS[0].value = slide1;
                numberS[1].value = slide2;
            }
        });

        numberS.forEach((element) => {
            element.oninput = () => {
                var number1 = parseFloat(numberS[0].value),
					checkValue1 = number1 != number1,
                    number2 = parseFloat(numberS[1].value),
 					checkValue2 = number2 != number2;

                if(!checkValue1){
                	rangeS[0].value = number1;
                }

                if(!checkValue2){
                	rangeS[1].value = number2;
                }   
            }
        });
    }
}

customElements.define('price-range', PriceRange);

class FacetRemove extends HTMLElement {
    constructor() {
        super();
        this.querySelector('a').addEventListener('click', (event) => {
            event.preventDefault();
            const form = this.closest('collection-filters-form') || document.querySelector('collection-filters-form');
            form.onActiveFilterClick(event);
        });
    }
}

customElements.define('facet-remove', FacetRemove);
