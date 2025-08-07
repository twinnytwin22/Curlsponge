Shopify.FeaturedProduct = (() => {
	var config = {
        block: '[data-custom-featured-product-block]',
        onComplete: null
    };

    var onQuantityChange = (event) => {
    	event.preventDefault();

    	var	input = event.target,
    		item = input.closest('.customProductView'),
    		inputValue = parseInt(input.value),
            inputMaxValue = parseInt(input.getAttribute('data-inventory-quantity')),
            productMessage = item.querySelector('.customProductView-message'),
            subTotalSetting = `subtotal_${item.dataset.product}`,
            subTotalConfig = window[subTotalSetting];

        const addButton = document.getElementById(`featured-product-form-${item.dataset.product}`)?.querySelector('[name="add"]');

       	if(inputValue < 1) {
            inputValue = 1;

            this.input.value = inputValue;
        } else {
            if (inputMaxValue < inputValue) {
                addButton.setAttribute('disabled', true);

                var alertText = window.inventory_text.max,
                    alertMessage = `<div class="alertBox alertBox--error"><p class="alertBox-message">${alertText}</p></div>`;

                productMessage.innerHTML = alertMessage;

                if (productMessage.style.display === 'none') {
                    productMessage.style.display = 'block';
                }
            } else {
                addButton.removeAttribute('disabled');

                productMessage.innerHTML = '';

                if (productMessage.style.display === 'block') {
                    productMessage.style.display = 'none';
                }
            }
        }

        if(subTotalConfig.show) {
        	var price = parseInt(input.dataset.price),
                subTotal = 0;

            subTotal = inputValue * price;
            subTotal = Shopify.formatMoney(subTotal, window.money_format);

            if(!addButton.classList.contains('button-text-pre-order')){
                text = subTotalConfig.text.replace('[value]', subTotal);
            } else {
                text = subTotalConfig.text_2.replace('[value]', subTotal);
            }

            addButton.innerHTML = text;

            if (checkNeedToConvertCurrency()) {
                var currencyCode = document.getElementById('currencies')?.querySelector('.active')?.getAttribute('data-currency');

	            Currency.convertAll(window.shop_currency, currencyCode, 'span.money', 'money_format');
	        }
        }
    };

    var onVariantInit = (item) => {
    	updateOptions(item);
    	updateMasterId(item);
    	updateVariants(item);
    };

    var onVariantChange = (event) => {
    	var item = event.target.closest('.customProductView');

    	updateOptions(item);
    	updateMasterId(item);
    	updateVariants(item);

    	if (!item.currentVariant) {
    		updateAttribute(item, true);
    	} else {
    		updateMedia(item, 200);
    		updateAttribute(item, false, !item.currentVariant.available);
    		updateProductInfo(item);
    	}
    };

    var updateOptions = (item) => {
    	const type = item.querySelector('[id^=featured-product-option-]')?.dataset.type;

    	if(type == 'button') {
    		const fieldsets = Array.from(item.querySelectorAll('fieldset'));

	        item.options = fieldsets.map((fieldset) => {
	            return Array.from(fieldset.querySelectorAll('input')).find((radio) => radio.checked).value;
	        });
    	} else {
    		item.options = Array.from(item.querySelectorAll('select'), (select) => select.value);
    	}
    };

    var updateMasterId = (item) => {
        item.currentVariant = getVariantData(item).find((variant) => {
            return !variant.options.map((option, index) => {
                return item.options[index] === option;
            }).includes(false);
        });
    }

    var getVariantData = (item) => {
        item.variantData = item.variantData || JSON.parse(item.querySelector('[type="application/json"]').textContent);
        return item.variantData;
    };

    var updateVariants = (item) => {
    	const options = Array.from(item.querySelectorAll('.product-form__input'));
    	const type = item.querySelector('[id^=featured-product-option-]')?.dataset.type;
    	const variants = getVariantData(item);

    	let selectedOption1;
        let selectedOption2;
        let selectedOption3;

        if (variants) {
        	if (type == 'button') {
                if (options[0]) {
                    selectedOption1 = Array.from(options[0].querySelectorAll('input')).find((radio) => radio.checked).value;
                    options[0].querySelector('[data-header-option]').textContent = selectedOption1;
                }

                if (options[1]) {
                    selectedOption2 = Array.from(options[1].querySelectorAll('input')).find((radio) => radio.checked).value;
                    options[1].querySelector('[data-header-option]').textContent = selectedOption2;
                }

                if (options[2]) {
                    selectedOption3 = Array.from(options[2].querySelectorAll('input')).find((radio) => radio.checked).value;
                    options[2].querySelector('[data-header-option]').textContent = selectedOption3;
                }

                var checkVariant = () => {
                    var optionsSize = parseInt(options.length);

                    if(optionsSize > 1){
                        var variantList = variants.filter((variant) => {
                            switch (optionsSize) {
                                case 2: return variant.option2 === selectedOption2;
                                case 3: return variant.option3 === selectedOption3;
                            }
                        });

                        var input1List = options[0].querySelectorAll('.product-form__radio');

                        input1List.forEach((input) => {
                            var label = input.nextSibling;
                            var optionSoldout = Array.from(variantList).find((variant) => {
                                return variant.option1 == input.value && variant.available;
                            });

                            var optionUnavailable = Array.from(variantList).find((variant) => {
                                return variant.option1 == input.value;
                            });

                            if(optionSoldout == undefined){
                                if (optionUnavailable == undefined) {
                                    label.classList.remove('available');
                                    label.classList.remove('soldout');
                                    label.classList.add('unavailable');
                                } else {
                                    label.classList.remove('available');
                                    label.classList.remove('unavailable');
                                    label.classList.add('soldout');
                                }
                            } else {
                                label.classList.remove('soldout');
                                label.classList.remove('unavailable');
                                label.classList.add('available');
                            }
                        });
                    }
                };

                var updateVariant = (optionSoldout, optionUnavailable, element, optionIndex) => {
                    var label = element.nextSibling;

                    if(optionSoldout == undefined){
                        if (optionUnavailable == undefined) {
                            label.classList.remove('available');
                            label.classList.remove('soldout');
                            label.classList.add('unavailable');
                        } else {
                            label.classList.remove('available');
                            label.classList.remove('unavailable');
                            label.classList.add('soldout');
                        }
                    } else {
                        label.classList.remove('soldout');
                        label.classList.remove('unavailable');
                        label.classList.add('available');
                    }
                };

                var renderVariant = (optionIndex, fieldset) => {
                    const inputList = fieldset.querySelectorAll('.product-form__radio');

                    inputList.forEach((input) => {
                        const inputVal = input.value;

                        const optionSoldout = variants.find((variant) => {
                            switch (optionIndex) {
                                case 0: return variant.option1 == inputVal && variant.available;
                                case 1: return variant.option1 == selectedOption1 && variant.option2 == inputVal && variant.available;
                                case 2: return variant.option1 == selectedOption1 && variant.option2 == selectedOption2 && variant.option3 == inputVal && variant.available;
                            }
                        });

                        const optionUnavailable = variants.find((variant) => {
                            switch (optionIndex) {
                                case 0: return variant.option1 == inputVal;
                                case 1: return variant.option1 == selectedOption1 && variant.option2 == inputVal;
                                case 2: return variant.option1 == selectedOption1 && variant.option2 == selectedOption2 && variant.option3 == inputVal;
                            }
                        });

                        updateVariant(optionSoldout, optionUnavailable, input, optionIndex);
                    });
                };
            } else {
                if (options[0]) {
                    selectedOption1 = options[0].querySelector('select').value;
                    options[0].querySelector('[data-header-option]').textContent = selectedOption1;
                }

                if (options[1]) {
                    selectedOption2 = options[1].querySelector('select').value;
                    options[1].querySelector('[data-header-option]').textContent = selectedOption2;
                }

                if (options[2]) {
                    selectedOption3 = options[2].querySelector('select').value;
                    options[2].querySelector('[data-header-option]').textContent = selectedOption3;
                }

                var checkVariant = () => {
                    var optionsSize = parseInt(options.length);

                    if(optionsSize > 1){
                        var variantList = variants.filter((variant) => {
                            switch (optionsSize) {
                                case 2: return variant.option2 === selectedOption2;
                                case 3: return variant.option3 === selectedOption3;
                            }
                        });

                        var option1List = options[0].querySelectorAll('option');

                        option1List.forEach((option) => {
                            var optionSoldout = Array.from(variantList).find((variant) => {
                                return variant.option1 == option.value && variant.available;
                            });

                            var optionUnavailable = Array.from(variantList).find((variant) => {
                                return variant.option1 == option.value;
                            });

                            if(optionSoldout == undefined){
                                if (optionUnavailable == undefined) {
                                    option.classList.remove('available');
                                    option.classList.remove('soldout');
                                    option.classList.add('unavailable');
                                    option.setAttribute('disabled','disabled');
                                } else {
                                    option.classList.remove('available');
                                    option.classList.remove('unavailable');
                                    option.classList.add('soldout');
                                    option.removeAttribute('disabled');
                                }
                            } else {
                                option.classList.remove('soldout');
                                option.classList.remove('unavailable');
                                option.classList.add('available');
                                option.removeAttribute('disabled');
                            }
                        });
                    }
                };

                var updateVariant = (optionSoldout, optionUnavailable, element) => {
                    if(optionSoldout == undefined){
                        if (optionUnavailable == undefined) {
                            element.classList.remove('available');
                            element.classList.remove('soldout');
                            element.classList.add('unavailable');
                            element.setAttribute('disabled','disabled');
                        } else {
                            element.classList.remove('available');
                            element.classList.remove('unavailable');
                            element.classList.add('soldout');
                            element.removeAttribute('disabled');
                        }
                    } else {
                        element.classList.remove('soldout');
                        element.classList.remove('unavailable');
                        element.classList.add('available');
                        element.removeAttribute('disabled');
                    }
                };

                var renderVariant = (optionIndex, select) => {
                    const optionList = select.querySelectorAll('option');

                    optionList.forEach((option) => {
                        const optionVal = option.getAttribute('value');

                        const optionSoldout = variants.find((variant) => {
                            switch (optionIndex) {
                                case 0: return variant.option1 == optionVal && variant.available;
                                case 1: return variant.option1 == selectedOption1 && variant.option2 == optionVal && variant.available;
                                case 2: return variant.option1 == selectedOption1 && variant.option2 == selectedOption2 && variant.option3 == optionVal && variant.available;
                            }
                        });

                        const optionUnavailable = variants.find((variant) => {
                            switch (optionIndex) {
                                case 0: return variant.option1 == optionVal;
                                case 1: return variant.option1 == selectedOption1 && variant.option2 == optionVal;
                                case 2: return variant.option1 == selectedOption1 && variant.option2 == selectedOption2 && variant.option3 == optionVal;
                            }
                        });

                        updateVariant(optionSoldout, optionUnavailable, option);
                    });
                };
            }

            options.forEach((fieldset) => {
                const optionIndex = parseInt(fieldset.getAttribute('data-option-index'));

                renderVariant(optionIndex, fieldset);
                checkVariant();
            });
        }
    };

    var updateAttribute = (item, unavailable = true, disable = true) => {
    	const addButton = document.getElementById(`featured-product-form-${item.dataset.product}`)?.querySelector('[name="add"]');
    	const productForms = document.querySelectorAll(`#featured-product-form-${item.dataset.product}, #featured-product-form-installment-${item.dataset.product}`);

    	var quantityInput = item.querySelector('input[name="quantity"]'),
            quantityInputValue = parseInt(quantityInput.value),
            quantityInputMaxValue,
            productMessage = item.querySelector('.customProductView-message'),
            productLink = item.querySelector('.customProductView-link a'),
            productTitle = item.querySelector('.customProductView-title a'),
            productHref = item.dataset.url + `?variant=${item.currentVariant.id}`,
            notifyMe = item.querySelector('.customProductView-notifyMe'),
            hotStock = item.querySelector('.customProductView-hotStock'),
            alertText = window.inventory_text.max,
            alertMessage = `<div class="alertBox alertBox--error"><p class="alertBox-message">${alertText}</p></div>`;

        if(quantityInput){
        	quantityInputValue = parseInt(quantityInput.value);
        }

        if(unavailable){
        	var text = window.variantStrings.unavailable;

        	quantityInput.setAttribute('disabled', true);
            addButton.setAttribute('disabled', true);
            addButton.textContent = text;
            productMessage.style.display == 'none';

            if(hotStock){
                hotStock.style.display == 'none';
            }

            if(notifyMe){
            	notifyMe.style.display = 'none';
            }
        } else {
        	if (disable) {
        		var text = window.variantStrings.soldOut;

                quantityInput.setAttribute('data-price', item.currentVariant?.price);
                quantityInput.setAttribute('disabled', true);
                addButton.setAttribute('disabled', true);
                addButton.textContent = text;
                productMessage.style.display = 'none';

                if(hotStock){
                    hotStock.style.display = 'none';
                }

                if(notifyMe){
                    notifyMe.querySelector('input[name="halo-notify-product-variant"]').value = item.currentVariant.title;
                    notifyMe.querySelector('.notifyMe-text').innerHTML = '';

                    if (notifyMe.style.display === 'none') {
                       	notifyMe.style.display = 'block';
                    }
                }
        	} else {
        		var text,
        			inventory = item.currentVariant?.inventory_management,
                    arrayInVarName,
                    inven_array,
                    inven_num, 
                    inventoryQuantity,
                    subTotalSetting = `subtotal_${item.dataset.product}`,
                    subTotalConfig = window[subTotalSetting];

                if(inventory != null) {
                	arrayInVarName = `custom_product_inven_array_${item.dataset.product}`;
                    inven_array = window[arrayInVarName];

                    if(inven_array != undefined) {
                        inven_num = inven_array[item.currentVariant.id];
                        inventoryQuantity = parseInt(inven_num);

                        if (typeof inventoryQuantity != 'undefined'){
                            if(inventoryQuantity > 0) {
                                quantityInput.setAttribute('data-inventory-quantity', inventoryQuantity);
                            } else {
                                quantityInput.removeAttribute('data-inventory-quantity');
                            }
                        } else {
                             quantityInput.setAttribute('data-inventory-quantity', inventoryQuantity);
                        }
                    }
                }

                if(subTotalConfig.show) {
                	var price = item.currentVariant?.price,
                        subTotal = 0;

                    subTotal = quantityInputValue * price;
                    subTotal = Shopify.formatMoney(subTotal, window.money_format);

                    if (typeof inventoryQuantity != 'undefined'){
                        if(inventoryQuantity > 0) {
                            text = subTotalConfig.text.replace('[value]', subTotal);
                        } else {
                            text = subTotalConfig.text_2.replace('[value]', subTotal);
                        }
                    } else {
                        text = subTotalConfig.text.replace('[value]', subTotal);
                    }
                } else {
                    if (typeof inventoryQuantity != 'undefined'){
                    	if(inventoryQuantity > 0) {
                            text = window.variantStrings.addToCart;
                        } else {
                            text = window.variantStrings.preOrder;
                        }
                    } else {
                        text = window.variantStrings.addToCart;
                    }
                }

                quantityInput.setAttribute('data-price', item.currentVariant?.price);
                quantityInput.removeAttribute('disabled');

                addButton.innerHTML = text;

                if(inventoryQuantity > 0) {
                	addButton.classList.remove('button-text-pre-order');
                	quantityInputMaxValue = parseInt(quantityInput.getAttribute('data-inventory-quantity'));

                	if(quantityInputValue > quantityInputMaxValue){
                        addButton.setAttribute('disabled', true);
                        productMessage.innerHTML = alertMessage;
                        
                        if (productMessage.style.display === 'none') {
                           	productMessage.style.display = 'block';
                        }
                    } else {
                        addButton.removeAttribute('disabled');
                        productMessage.style.display = 'none';
                    }

                    if(hotStock){
                    	var maxStock = parseInt(hotStock.getAttribute('data-hot-stock')),
                    		textStock = window.inventory_text.hotStock;

                    	if(inventoryQuantity <= maxStock){
                            textStock = textStock.replace('[inventory]', inventoryQuantity);
                            hotStock.innerHTML = textStock;

                            if (hotStock.style.display === 'none') {
	                           	hotStock.style.display = 'block';
	                        }
                        } else {
                            hotStock.style.display = 'none';
                        }
                    }
                } else {
                	addButton.removeAttribute('disabled');
                    addButton.classList.add('button-text-pre-order');
                }

                if(notifyMe){
                	notifyMe.style.display = 'none';
                }
        	}

        	if(productLink){
        		productLink.setAttribute('href', productHref);
        	}

        	if(window.enable_swatch_name){
        		if(item.querySelector('.product-form__swatch')) {
	        		var selectedOption = item.querySelector('.product-form__swatch [data-header-option]').innerText;

	        		if(productTitle.classList.contains('text-change')){
	                    productTitle.querySelector('[data-change-title]').innerHTML = ' - ' + selectedOption;
	                } else {
	                    productTitle.classList.add('text-change');
	                    productTitle.querySelector('.text').innerHTML = productTitle.querySelector('.text').innerHTML + `<span data-change-title> - ${selectedOption}</span>`;
	                }
        		}

        		productTitle.setAttribute('href', productHref);
        	} else {
        		productTitle.setAttribute('href', productHref);
        	}

        	productForms.forEach((productForm) => {
                const input = productForm.querySelector('input[name="id"]');

                input.value = item.currentVariant.id;
                input.dispatchEvent(new Event('change', { bubbles: true }));
            });
        }

        if (checkNeedToConvertCurrency()) {
            var currencyCode = document.getElementById('currencies')?.querySelector('.active')?.getAttribute('data-currency');

            Currency.convertAll(window.shop_currency, currencyCode, 'span.money', 'money_format');
        }
    };

    var updateProductInfo = (item) => {
    	fetch(`${item.dataset.url}?variant=${item.currentVariant.id}&view=quick_view`)
            .then((response) => response.text())
            .then((responseText) => {
                const id = `product-price-${item.dataset.product}`;
                const html = new DOMParser().parseFromString(responseText, 'text/html')
                const destination = document.getElementById(`customProduct-price-${item.dataset.product}`);
                const source = html.getElementById(id);

                if (source && destination) {
                    destination.querySelector('.price').innerHTML = source.querySelector('.price').innerHTML;
                }

                if (checkNeedToConvertCurrency()) {
                    var currencyCode = document.getElementById('currencies')?.querySelector('.active')?.getAttribute('data-currency');
                    
                    Currency.convertAll(window.shop_currency, currencyCode, 'span.money', 'money_format');
                }

                destination?.classList.remove('visibility-hidden');
        });
    };

    var updateMedia = (item, time) => {
        if (!item.currentVariant || !item.currentVariant?.featured_media) return;
        
        const newMedia = document.querySelector(
            `[data-media-id="${item.dataset.product}-${item.currentVariant.featured_media.id}"]`
        );

        if (!newMedia){
        	return;
        } else{
        	var slideIndex = parseInt(newMedia.closest('.customProductView-image').getAttribute('data-slick-index')),
        		slider = item.querySelector('.customProductView-nav');
	        
	        window.setTimeout(() => {
	            $(slider).slick('slickGoTo', slideIndex);
	        }, time);
        }
    };

    var checkNeedToConvertCurrency = () => {
    	return (window.show_multiple_currencies && Currency.currentCurrency != shopCurrency) || window.show_auto_currency;
    };

    var finalize = function() {
        if (config.onComplete) {
            try {
                config.onComplete();
            } catch (error) {}
        }
    };

    return {
    	onReady: function (params) {
    		var params = params || {};
            $.extend(config, params);

            var item = document.getElementById(params.block);

            if(!item) return;

            onVariantInit(item);
            finalize();
    	},

    	onInit: function(params) {
    		var params = params || {};
            $.extend(config, params);

            var item = document.getElementById(params.block);

            if(!item) return;

            var debouncedOnVariantChange = debounce((event) => {
            	if(!event.target.classList.contains('quantity__input')){
	            	onVariantChange(event);
            	} else {
            		onQuantityChange(event);
            	}
	        }, 50);

	        item.addEventListener('input', debouncedOnVariantChange.bind(this));
	        item.addEventListener('select', debouncedOnVariantChange.bind(this));
    	}
    }
})();