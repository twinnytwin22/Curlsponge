class PredictiveSearch extends HTMLElement {
  constructor() {
    super();
    this.cachedResults = {};
    this.input = this.querySelector('input[type="search"]');
    this.isOpen = false;
    this.predictiveSearchResults = this.querySelector('[data-predictive-search]');
    this.quickSearchTrendingProduct = this.querySelector('[data-quick-trendingProduct]');
    this.setupEventListeners();
  }

  setupEventListeners() {
    const form = this.querySelector('form.search');
    form.addEventListener('submit', this.onFormSubmit.bind(this));

    this.input.addEventListener('input', debounce((event) => {
      this.onChange(event);
    }, 300).bind(this));
    this.input.addEventListener('focus', this.onFocus.bind(this));
    this.addEventListener('focusout', this.onFocusOut.bind(this));
    this.addEventListener('keyup', this.onKeyup.bind(this));
    this.addEventListener('keydown', this.onKeydown.bind(this));
  }

  getQuery() {
    return this.input.value.trim();
  }

  onChange() {
    const searchTerm = this.getQuery();

    if (!searchTerm.length) {
      this.close(true);
      return;
    }

    this.getSearchResults(searchTerm);
  }

  onFormSubmit(event) {
    if (!this.getQuery().length || this.querySelector('[aria-selected="true"] a')) event.preventDefault();
  }

  onFocus() {
    const searchTerm = this.getQuery();

    if (!searchTerm.length) return;

    if (this.getAttribute('results') === 'true') {
      this.open();
      this.setShowPredictive();
    } else {
      this.getSearchResults(searchTerm);
      this.setShowPredictive();
    }
  }

  onFocusOut() {
    setTimeout(() => {
      if (!this.contains(document.activeElement)) this.close();
    })
  }

  onKeyup(event) {
    if (!this.getQuery().length) this.close(true);
    event.preventDefault();

    switch (event.code) {
      case 'ArrowUp':
        this.switchOption('up')
        break;
      case 'ArrowDown':
        this.switchOption('down');
        break;
      case 'Enter':
        this.selectOption();
        break;
    }
  }

  onKeydown(event) {
    // Prevent the cursor from moving in the input when using the up and down arrow keys
    if (
      event.code === 'ArrowUp' ||
      event.code === 'ArrowDown'
    ) {
      event.preventDefault();
    }
  }

  switchOption(direction) {
    if (!this.getAttribute('open')) return;

    const moveUp = direction === 'up';
    const selectedElement = this.querySelector('[aria-selected="true"]');
    const allElements = this.querySelectorAll('li');
    let activeElement = this.querySelector('li');

    if (moveUp && !selectedElement) return;

    this.statusElement.textContent = '';

    if (!moveUp && selectedElement) {
      activeElement = selectedElement.nextElementSibling || allElements[0];
    } else if (moveUp) {
      activeElement = selectedElement.previousElementSibling || allElements[allElements.length - 1];
    }

    if (activeElement === selectedElement) return;

    activeElement.setAttribute('aria-selected', true);
    if (selectedElement) selectedElement.setAttribute('aria-selected', false);

    this.setLiveRegionText(activeElement.textContent);
    this.input.setAttribute('aria-activedescendant', activeElement.id);
  }

  selectOption() {
    const selectedProduct = this.querySelector('[aria-selected="true"] a, [aria-selected="true"] button');

    if (selectedProduct) selectedProduct.click();
  }

  getSearchResults(searchTerm) {
    const queryKey = searchTerm.replace(" ", "-").toLowerCase();
    this.setLiveRegionLoadingState();

    if (this.cachedResults[queryKey]) {
      this.renderSearchResults(this.cachedResults[queryKey]);
      return;
    }

    fetch(`${window.routes.predictive_search_url}?q=${encodeURIComponent(searchTerm)}&${encodeURIComponent('resources[type]')}=product&${encodeURIComponent('resources[limit]')}=4&section_id=predictive-search`)
      .then((response) => {
        if (!response.ok) {
          var error = new Error(response.status);
          this.close();
          throw error;
        }

        return response.text();
      })
      .then((text) => {
        const resultsMarkup = new DOMParser().parseFromString(text, 'text/html').querySelector('#shopify-section-predictive-search').innerHTML;
        this.cachedResults[queryKey] = resultsMarkup;
        this.renderSearchResults(resultsMarkup);
        // this.updateViewAllLink(searchTerm);
      })
      .catch((error) => {
        this.close();
        throw error;
      });
  }

  setLiveRegionLoadingState() {
    this.statusElement = this.statusElement || this.querySelector('.predictive-search-status');
    this.loadingText = this.loadingText || this.getAttribute('data-loading-text');

    this.setLiveRegionText(this.loadingText);
    this.setAttribute('loading', true);
  }

  setLiveRegionText(statusText) {
    this.statusElement.setAttribute('aria-hidden', 'false');
    this.statusElement.textContent = statusText;

    setTimeout(() => {
      this.statusElement.setAttribute('aria-hidden', 'true');
    }, 1000);
  }

  renderSearchResults(resultsMarkup) {
    this.predictiveSearchResults.innerHTML = resultsMarkup;
    this.setAttribute('results', true);

    this.setLiveRegionResults();
    this.open();
    this.setShowPredictive();
    this.setOthers();
  }

  setLiveRegionResults() {
    this.removeAttribute('loading');
    this.setLiveRegionText(this.querySelector('[data-predictive-search-live-region-count-value]').textContent);
  }

  open() {
    this.setAttribute('open', true);
    this.input.setAttribute('aria-expanded', true);
    this.isOpen = true;
  }

  close(clearSearchTerm = false) {
    if (clearSearchTerm) {
      this.input.value = '';
      this.removeAttribute('results');
      this.setHiddenPredictive();
    }

    const selected = this.querySelector('[aria-selected="true"]');

    if (selected) selected.setAttribute('aria-selected', false);

    this.input.setAttribute('aria-activedescendant', '');
    this.removeAttribute('open');
    this.input.setAttribute('aria-expanded', false);
    this.resultsMaxHeight = false
    this.predictiveSearchResults.removeAttribute('style');
    this.isOpen = false;
  }

  setShowPredictive() {
    this.predictiveSearchResults.classList.add('is-show');
    this.predictiveSearchResults.classList.remove('is-hidden');
    this.quickSearchTrendingProduct.classList.remove('is-show');
    this.quickSearchTrendingProduct.classList.add('is-hidden');
  }

  setHiddenPredictive() {
    this.predictiveSearchResults.classList.add('is-hidden');
    this.predictiveSearchResults.classList.remove('is-show');
    this.quickSearchTrendingProduct.classList.add('is-show');
    this.quickSearchTrendingProduct.classList.remove('is-hidden');
  }

  setOthers() {
    if(window.product_swatch_style == 'slider'){
        let productList = this.querySelectorAll('.product');

        if(productList.length > 0) {
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
    }

    if(window.compare.show){
        Shopify.ProductCompare.setLocalStorageProductForCompare();
    }

    if(window.wishlist.show){
        Shopify.ProductWishlist.setLocalStorageProductForWishlist();
    }

    if (this.checkNeedToConvertCurrency()) {
        let currencyCode = document.getElementById('currencies')?.querySelector('.active')?.getAttribute('data-currency');

        Currency.convertAll(window.shop_currency, currencyCode, 'span.money', 'money_format');
    }
  }

  checkNeedToConvertCurrency() {
    return (window.show_multiple_currencies && Currency.currentCurrency != window.shop_currency) || window.show_auto_currency;
}
}

customElements.define('predictive-search', PredictiveSearch);