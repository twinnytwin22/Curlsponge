class CollectionFilterByTagForm extends HTMLElement {
	constructor() {
		super();

		this.queryParams();

		this.debouncedOnSubmit = debounce((event) => {
            this.onSubmitHandler(event);
        }, 500);

        this.querySelector('form').addEventListener('input', this.debouncedOnSubmit.bind(this));

        if(this.querySelector('[data-clear-filter]')){
        	this.querySelectorAll('[data-clear-filter]').forEach((clearButton) => {
                clearButton.addEventListener('click', this.onClickClearButtonHandler.bind(this));
            });
        }

        this.querySelectorAll('[data-clear-all-filter]').forEach((clearAllButton) => {
            clearAllButton.addEventListener('click', this.onClickClearAllButtonHandler.bind(this));
        });
	}

	queryParams() {
        Shopify.queryParams = {};

        if (location.search.length > 0) {
            for (var aKeyValue, i = 0, aCouples = location.search.substr(1).split('&'); i < aCouples.length; i++) {
                aKeyValue = aCouples[i].split('=');

                if (aKeyValue.length > 1) {
                    Shopify.queryParams[decodeURIComponent(aKeyValue[0])] = decodeURIComponent(aKeyValue[1]);
                }
            }
        }
    }

    createURLHash(baseLink) {
        var newQuery = $.param(Shopify.queryParams).replace(/%2B/g, '+');

        if (baseLink) {
            if (newQuery != "") {
                return baseLink + "?" + newQuery;
            } else {
                return baseLink;
            }
        } else {
            if (newQuery != "") {
                return location.pathname + "?" + newQuery;
            } else {
                return location.pathname;
            }
        }
    }

    updateURLHash(baseLink) {
        delete Shopify.queryParams.page;

        var newurl = this.createURLHash(baseLink);

        history.pushState({
            param: Shopify.queryParams
        }, newurl, newurl);
    }

    onSubmitHandler(event) {
        event.preventDefault();

        var $target = event.target,
        	form = $target.closest('form'),
        	newTags = [],
        	tagName = event.target.value,
        	tagPos;

        if (Shopify.queryParams.constraint) {
            newTags = Shopify.queryParams.constraint.split('+');
        }

        if (!window.show_multiple_choice && !$target.is(':checked')) {
        	var refinedWiget = form.querySelector('.refined-widgets'),
        		otherTag;

        	if(refinedWiget){
        		otherTag = refinedWiget.querySelector('input:checked');
        	}

            if (otherTag) {
                tagName = otherTag.value;

                if (tagName) {
                    tagPos = newTags.indexOf(tagName);

                    if (tagPos >= 0) {
                        newTags.splice(tagPos, 1);
                    }
                }
            }
        }

        if (tagName) {
            tagPos = newTags.indexOf(tagName);

            if (tagPos >= 0) {
                newTags.splice(tagPos, 1);
            } else {
                newTags.push(tagName);
            }
        }

        if (newTags.length > 0) {
            Shopify.queryParams.constraint = newTags.join('+');
        } else {
            delete Shopify.queryParams.constraint;
        }

        this.updateURLHash();

        var newUrl = this.createURLHash();
        this.renderPage(newUrl);
    }

    onClickClearButtonHandler(event) {
    	event.preventDefault();
    	event.stopPropagation();

    	var currentTags = [],
           	listTags = event.target.closest('.js-filter'),
           	selectedTag,
           	tagName,
           	tagPos;

        if (Shopify.queryParams.constraint) {
            currentTags = Shopify.queryParams.constraint.split('+');
        }

        listTags.querySelectorAll('input:checked').forEach((element) => {
        	tagName = element.value;

        	if (tagName) {
                tagPos = currentTags.indexOf(tagName);

                if (tagPos >= 0) {
                    currentTags.splice(tagPos, 1);
                }
            }
        });

        if (currentTags.length > 0) {
            Shopify.queryParams.constraint = currentTags.join('+');
        } else {
            delete Shopify.queryParams.constraint;
        }

        this.updateURLHash();

        var newUrl = this.createURLHash();
        this.renderPage(newUrl);
    }

    onClickClearAllButtonHandler(event) {
    	event.preventDefault();
    	event.stopPropagation();

    	delete Shopify.queryParams.constraint;

    	this.updateURLHash();
        this.renderPage(new URL(event.currentTarget.href).href);
    }

    getSections() {
    	return [
	      	{
	        	id: 'main-collection-product-grid',
	        	section: document.getElementById('main-collection-product-grid').dataset.id,
	      	}
	    ]
  	}

  	renderPage(href) {
	    const sections = this.getSections();

	    // document.getElementById('CollectionProductGrid').querySelector('.collection').classList.add('is-loading');
        document.body.classList.add('has-halo-loader');

	    sections.forEach((section) => {
	      	this.renderSectionFromFetch(href, section);
	    });
	}

	renderSectionFromFetch(url, section) {
    	fetch(url)
  		.then(response => response.text())
  		.then((responseText) => {
    		const html = responseText;

            this.renderFilters(html);
	        this.renderProductGrid(html);
      	});
  	}

    renderFilters(html) {
        const innerHTML = new DOMParser().parseFromString(html, 'text/html').getElementById('main-collection-filters').innerHTML;

        document.getElementById('main-collection-filters').innerHTML = innerHTML;
    }

    renderProductGrid(html) {
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
            // document.getElementById('CollectionProductGrid').scrollIntoView();
            window.scrollTo({
                top: document.getElementById('CollectionProductGrid').getBoundingClientRect().top + window.pageYOffset - 50,
                behavior: 'smooth'
            });
        }

        document.body.classList.remove('has-halo-loader');
  	}

    setActiveViewModeMediaQuery(ajaxLoading = true){
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

    initViewModeLayout(column) {
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
}

customElements.define('collection-filters-form', CollectionFilterByTagForm);