class VariantQuickShopSelects extends HTMLElement {
    constructor() {
        super();
        this.popup = this.closest('.card-QuickShop');
        this.variants = this.getVariantData();

        this.onVariantInit = debounce(() => {
            this.updateOptions();
            this.updateMasterId();
            this.updateMedia(500);
            this.updatePrice();
            this.updateVariants(this.variants);
        }, 500);

        this.onVariantInit();
        this.addEventListener('change', this.onVariantChange.bind(this));
    }

    onVariantChange(event) {
        this.updateOptions();
        this.updateMasterId();
        this.updateVariants(this.variants);

        if (!this.currentVariant) {
            this.updateAttribute(true);
        } else {
            this.updateMedia();
            this.updatePrice();
            this.updateAttribute(false, !this.currentVariant.available);
        }
    }

    updateVariants(variants){
        const options = Array.from(this.querySelectorAll('.product-form__input'));
        const type = document.getElementById(`product-card-option-${this.dataset.product}`)?.getAttribute('data-type');

        let selectedOption1;
        let selectedOption2;
        let selectedOption3;
        let selectedOption;

        if (variants) {
            this.item = this.popup.closest('.card');

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
                                    label.classList.remove('available', 'soldout');
                                    label.classList.add('unavailable');
                                } else {
                                    label.classList.remove('available', 'unavailable');
                                    label.classList.add('soldout');
                                }
                            } else {
                                label.classList.remove('soldout', 'unavailable');
                                label.classList.add('available');
                            }
                        });
                    }
                };

                var updateVariant = (optionSoldout, optionUnavailable, element, optionIndex) => {
                    var label = element.nextSibling;

                    if(optionSoldout == undefined){
                        if (optionUnavailable == undefined) {
                            label.classList.remove('available', 'soldout');
                            label.classList.add('unavailable');
                        } else {
                            label.classList.remove('available', 'unavailable');
                            label.classList.add('soldout');
                        }
                    } else {
                        label.classList.remove('soldout', 'unavailable');
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
                                    option.classList.remove('available', 'soldout');
                                    option.classList.add('unavailable');
                                    option.setAttribute('disabled','disabled');
                                } else {
                                    option.classList.remove('available', 'unavailable');
                                    option.classList.add('soldout');
                                    option.removeAttribute('disabled');
                                }
                            } else {
                                option.classList.remove('soldout', 'unavailable');
                                option.classList.add('available');
                                option.removeAttribute('disabled');
                            }
                        });
                    }
                };

                var updateVariant = (optionSoldout, optionUnavailable, element) => {
                    if(optionSoldout == undefined){
                        if (optionUnavailable == undefined) {
                            element.classList.remove('available', 'soldout');
                            element.classList.add('unavailable');
                            element.setAttribute('disabled','disabled');
                        } else {
                            element.classList.remove('available', 'unavailable');
                            element.classList.add('soldout');
                            element.removeAttribute('disabled');
                        }
                    } else {
                        element.classList.remove('soldout', 'unavailable');
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

            if(this.item.querySelector(`.swatch-label[title="${selectedOption1}"]`)){
                selectedOption = selectedOption1;
            } else if(this.item.querySelector(`.swatch-label[title="${selectedOption2}"]`)){
                selectedOption = selectedOption2;
            } else{
                selectedOption = selectedOption3;
            }

            if(this.item.querySelector(`.swatch-label[title="${selectedOption}"]`)){
                this.productTitle = this.item.querySelector('.card-title');

                if(this.item.querySelector('.swatch-label')){
                    this.item.querySelectorAll('.swatch-label').forEach((label) =>{
                        if (label.getAttribute('title') == selectedOption) {
                            label.classList.add('is-active');
                        } else {
                            label.classList.remove('is-active');
                        }
                    });
                }

                if(window.enable_swatch_name){
                    if(this.productTitle.classList.contains('card-title-change')){
                        this.productTitle.querySelector('[data-change-title]').innerText = ' - ' + selectedOption;
                    } else {
                        let spanText = document.createElement('span', { 'data-change-title' : '' });

                        spanText.innerText = ' - ' + selectedOption;

                        this.productTitle.classList.add('card-title-change');
                        this.productTitle.appendChild(spanText);
                    }
                }

                if(this.item.querySelector('a:not(.single-action)')){
                    let productHref = this.productTitle.getAttribute('href');

                    this.item.querySelectorAll('a:not(.single-action)').forEach((link) =>{
                        link.setAttribute('href', productHref.split('?variant=')[0]+'?variant='+ this.currentVariant.id);
                    });
                }
            }

            options.forEach((fieldset) => {
                const optionIndex = parseInt(fieldset.getAttribute('data-option-index'));

                renderVariant(optionIndex, fieldset);
                checkVariant();
            });
        }
    }

    updateOptions() {
        this.options = Array.from(this.querySelectorAll('select'), (select) => select.value);
    }

    updateMasterId() {
        this.currentVariant = this.getVariantData().find((variant) => {
            return !variant.options.map((option, index) => {
                return this.options[index] === option;
            }).includes(false);
        });
    }

    updateMedia() {
        if (!this.currentVariant || !this.currentVariant?.featured_image) return;

        this.item = this.popup.closest('.card');
        const itemImage = this.item.querySelector('.card-media');

        if (!itemImage) return;

        itemImage.querySelector('img').setAttribute('src', this.currentVariant?.featured_image.src);
        itemImage.querySelector('img').setAttribute('srcset', this.currentVariant?.featured_image.src);
        itemImage.querySelector('img').setAttribute('alt', this.currentVariant?.featured_image.alt);
    }

    updatePrice() {
        fetch(`${this.dataset.url}?variant=${this.currentVariant.id}&view=quick_shop`)
            .then((response) => response.text())
            .then((responseText) => {
                const html = new DOMParser().parseFromString(responseText, 'text/html')
                const id = `product-price-${html.querySelector('.halo-page-padding[id*="ProductSection-"]').dataset.sectionId}-${this.dataset.product}`;
                const destination = document.getElementById(`product-quick-shop-price-${this.dataset.product}`);
                const source = html.getElementById(id);

                if (source && destination) {
                    destination.innerHTML = source.innerHTML;
                }

                if (this.checkNeedToConvertCurrency()) {
                    let currencyCode = document.getElementById('currencies')?.querySelector('.active')?.getAttribute('data-currency');

                    Currency.convertAll(window.shop_currency, currencyCode, 'span.money', 'money_format');
                }
        });
    }

    updateAttribute(unavailable = true, disable = true){
        this.item = this.popup.closest('.card');
        this.notifyMe = this.item.querySelector('.card-notifyMe');
        const addButton = document.getElementById(`product-quick-shop-form-${this.dataset.product}`)?.querySelector('[name="add"]');
        const productForms = document.querySelectorAll(`#product-quick-shop-form-${this.dataset.product}`);

        if(unavailable){
            let text = window.variantStrings.unavailable;

            addButton.setAttribute('disabled', true);
            addButton.textContent = text;

            if(this.notifyMe){
                this.notifyMe.style.display = 'none';
            }
        } else {
            if (disable) {
                let text = window.variantStrings.soldOut;

                addButton.setAttribute('disabled', true);
                addButton.textContent = text;

                if(this.notifyMe){
                    this.notifyMe.querySelector('.halo-notify-product-variant').value = this.currentVariant.title;
                    this.notifyMe.querySelector('.notifyMe-text').innerHTML = '';
                    this.notifyMe.style.display = 'block';
                }
            } else{
                let text,
                    inventory = this.currentVariant?.inventory_management,
                    arrayInVarName,
                    inven_array,
                    inven_num, 
                    inventoryQuantity;

                if(inventory != null) {
                    arrayInVarName = `product_quick_shop_inven_array_${this.dataset.product}`;
                    inven_array = window[arrayInVarName];

                    if(inven_array != undefined) {
                        inven_num = inven_array[this.currentVariant.id];
                        inventoryQuantity = parseInt(inven_num);
                    }
                }

                if (typeof inventoryQuantity != 'undefined'){
                    if(inventoryQuantity > 0) {
                        text = window.variantStrings.addToCart;
                    } else {
                        text = window.variantStrings.preOrder;
                    }
                } else{
                    text = window.variantStrings.addToCart;
                }

                addButton.removeAttribute('disabled');
                addButton.textContent = text;

                if(this.notifyMe){
                    this.notifyMe.style.display = 'none';
                }

                if (this.checkNeedToConvertCurrency()) {
                    let currencyCode = document.getElementById('currencies')?.querySelector('.active')?.getAttribute('data-currency');
                    
                    Currency.convertAll(window.shop_currency, currencyCode, 'span.money', 'money_format');
                }
            }

            const productForms = document.querySelectorAll(`#product-quick-shop-form-${this.dataset.product}`);
        
            productForms.forEach((productForm) => {
                const input = productForm.querySelector('input[name="id"]');

                input.value = this.currentVariant.id;
                input.dispatchEvent(new Event('change', { bubbles: true }));
            });
        }
    }

    getVariantData() {
        this.variantData = this.variantData || JSON.parse(this.querySelector('[type="application/json"]').textContent);

        return this.variantData;
    }

    checkNeedToConvertCurrency() {
        return (window.show_multiple_currencies && Currency.currentCurrency != window.shop_currency) || window.show_auto_currency;
    }
}

customElements.define('variant-quick-shop-selects', VariantQuickShopSelects);

class VariantQuickShopRadios extends VariantQuickShopSelects {
    constructor() {
        super();
    }

    updateOptions() {
        const fieldsets = Array.from(this.querySelectorAll('fieldset'));

        this.options = fieldsets.map((fieldset) => {
            return Array.from(fieldset.querySelectorAll('input')).find((radio) => radio.checked).value;
        });
    }
}

customElements.define('variant-quick-shop-radios', VariantQuickShopRadios);