class VariantSelects extends HTMLElement {
    constructor() {
        super();
        this.item = this.closest('[data-product-detail]');
        this.variants = this.getVariantData();
        this.onVariantInit();
        this.addEventListener('change', this.onVariantChange.bind(this));
    }

    onVariantInit(){
        this.updateOptions();
        this.updateMasterId();
        this.updateVariants(this.variants);
    }

    onVariantChange(event) {
        this.updateOptions();
        this.updateMasterId();
        this.updateVariants(this.variants);
        this.updateOtherVariants(this.variants);
        this.updatePickupAvailability();

        if (!this.currentVariant) {
            this.updateAttribute(true);
        } else {
            this.updateMedia(200);
            this.updateURL();
            this.updateProductInfo();
            this.updateAttribute(false, !this.currentVariant.available);
            this.updateShareUrl();
        }
    }

    updateVariants(variants, list, other = false){
        const options = list || Array.from(this.querySelectorAll('.product-form__input'));
        const originalOptions = Array.from(this.querySelectorAll('.product-form__input'));

        let selectedOption1;
        let selectedOption2;
        let selectedOption3;

        if (variants) {
            if (this.nodeName == 'VARIANT-RADIOS') {
                if (options[0]) {
                    if(other) {
                        let thisId = Array.from(originalOptions[0].querySelectorAll('input')).find((radio) => radio.checked).getAttribute('id');
                        const lastKey = thisId.split('-')[thisId.split('-').length-1].length;
                        thisId = thisId.includes('sticky') ? thisId.replace('-sticky', '') : `${thisId.substring(0, thisId.length - lastKey)}sticky-${thisId.substring(thisId.length - lastKey)}`;
                        options[0].querySelector(`[id^="${thisId}"]`).checked = true;
                    }

                    selectedOption1 = Array.from(options[0].querySelectorAll('input')).find((radio) => radio.checked).value;
                    options[0].querySelector('[data-header-option]').textContent = selectedOption1;
                }

                if (options[1]) {
                    if(other) {
                        let thisId = Array.from(originalOptions[1].querySelectorAll('input')).find((radio) => radio.checked).getAttribute('id');
                        const lastKey = thisId.split('-')[thisId.split('-').length-1].length;
                        thisId = thisId.includes('sticky') ? thisId.replace('-sticky', '') : `${thisId.substring(0, thisId.length - lastKey)}sticky-${thisId.substring(thisId.length - lastKey)}`;
                        options[1].querySelector(`[id^="${thisId}"]`).checked = true;
                    }

                    selectedOption2 = Array.from(options[1].querySelectorAll('input')).find((radio) => radio.checked).value;
                    options[1].querySelector('[data-header-option]').textContent = selectedOption2;
                }

                if (options[2]) {
                    if(other) {
                        let thisId = Array.from(originalOptions[2].querySelectorAll('input')).find((radio) => radio.checked).getAttribute('id');
                        const lastKey = thisId.split('-')[thisId.split('-').length-1].length;
                        thisId = thisId.includes('sticky') ? thisId.replace('-sticky', '') : `${thisId.substring(0, thisId.length - lastKey)}sticky-${thisId.substring(thisId.length - lastKey)}`;
                        options[2].querySelector(`[id^="${thisId}"]`).checked = true;
                    }

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
                    if(other) {
                        let orignSelectedOption1 = originalOptions[0].querySelector('select').value;
                        options[0].querySelector('select').value = orignSelectedOption1;
                    }

                    selectedOption1 = options[0].querySelector('select').value;
                    options[0].querySelector('[data-header-option]').textContent = selectedOption1;
                }

                if (options[1]) {
                    if(other) {
                        let orignSelectedOption2 = originalOptions[1].querySelector('select').value;
                        options[1].querySelector('select').value = orignSelectedOption2;
                    }

                    selectedOption2 = options[1].querySelector('select').value;
                    options[1].querySelector('[data-header-option]').textContent = selectedOption2;
                }

                if (options[2]) {
                    if(other) {
                        let orignSelectedOption3 = originalOptions[2].querySelector('select').value;
                        options[2].querySelector('select').value = orignSelectedOption3;
                    }

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

            options.forEach((fieldset) => {
                const optionIndex = parseInt(fieldset.getAttribute('data-option-index'));

                renderVariant(optionIndex, fieldset);
                checkVariant();
            });
        }
    }

    updateOtherVariants(variants){
        this.other = Array.from(this.item.querySelectorAll('variant-selects, variant-radios')).filter((selector) => {
            return selector != this;
        });

        if (this.other.length) {
            const options = Array.from(this.other[0].querySelectorAll('.product-form__input'));
            this.updateVariants(variants, options, true);
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

    updateMedia(time) {
        if (!this.currentVariant || !this.currentVariant?.featured_media) return;
        
        const newMedia = this.item.querySelector(
            `[data-media-id="${this.dataset.section}-${this.currentVariant.featured_media.id}"]`
        );

        if (!newMedia) return;
        
        window.setTimeout(() => {
            $(newMedia.closest('.slick-slider')).slick('slickGoTo', newMedia.getAttribute('data-slick-index'));
        }, time);

        window.setTimeout(() => {
            $(newMedia).trigger('click');
        }, time);
    }

    updateURL() {
        if (!this.currentVariant || this.dataset.updateUrl === 'false') return;

        window.history.replaceState({ }, '', `${this.dataset.url}?variant=${this.currentVariant.id}`);
    }

    updateShareUrl() {
        const shareButton = document.getElementById(`Share-${this.dataset.section}`);
        if (!shareButton || !shareButton.updateUrl) return;
        shareButton.updateUrl(`${window.shopUrl}${this.dataset.url}?variant=${this.currentVariant.id}`);
    }

    updatePickupAvailability() {
        const pickUpAvailability = this.item.querySelector('pickup-availability');

        if (!pickUpAvailability) return;

        if (this.currentVariant?.available) {
            pickUpAvailability.fetchAvailability(this.currentVariant.id);
        } else {
            pickUpAvailability.removeAttribute('available');
            pickUpAvailability.innerHTML = '';
        }
    }

    updateProductInfo() {
        fetch(`${this.dataset.url}?variant=${this.currentVariant.id}&section_id=${this.dataset.section}`)
            .then((response) => response.text())
            .then((responseText) => {
                const html = new DOMParser().parseFromString(responseText, 'text/html');

                if(this.dataset.updateTemplate === 'true') {
                    const content = document.createElement('div');

                    content.appendChild(html.querySelector(`#halo-custom-featured-product-${this.dataset.section} template`).content.firstElementChild.cloneNode(true));
                    html.querySelector(`#halo-custom-featured-product-${this.dataset.section}`).innerHTML = content.innerHTML;
                }

                this.updateDescription(html);
                this.updateInventory(html);
                this.updateProperty(html);
                this.updateOthers(html);

                if (this.checkNeedToConvertCurrency()) {
                    let currencyCode = document.getElementById('currencies')?.querySelector('.active')?.getAttribute('data-currency');

                    Currency.convertAll(window.shop_currency, currencyCode, 'span.money', 'money_format');
                }
        });
    }

    updateAttribute(unavailable = true, disable = true){
        this.quantityInput = this.item.querySelector('input[name="quantity"]');
        this.inventoryProp = this.item.querySelector('[data-inventory]');
        this.skuProp = this.item.querySelector('[data-sku]');
        this.productMessage = this.item.querySelector(`#product-message-${this.dataset.section}-${this.dataset.product}`);
        this.notifyMe = this.item.querySelector(`#product-sold-out-${this.dataset.section}-${this.dataset.product}`);
        const productForms = this.item.querySelectorAll(`#product-form-${this.dataset.section}-${this.dataset.product}, #product-sticky-form-${this.dataset.section}-${this.dataset.product}, #product-form-installment-${this.dataset.section}-${this.dataset.product}`);

        let quantityInputValue = parseInt(this.quantityInput?.value),
            quantityInputMaxValue,
            alertText = window.inventory_text.max,
            alertMessage = `<div class="alertBox alertBox--error"><p class="alertBox-message">${alertText}</p></div>`,
            subtotal = window[`subtotal_${this.dataset.product}`];

        if(unavailable){
            let text = window.variantStrings.unavailable;

            this.quantityInput?.setAttribute('disabled', true);

            if(this.item.querySelector('.quantity__button')){
                this.item.querySelectorAll('.quantity__button').forEach((button) =>{
                    button.setAttribute('disabled', true);
                });
            }

            if(this.notifyMe) this.notifyMe.style.display = 'none';
            if(this.productMessage) this.productMessage.style.display = 'none';

            productForms.forEach((productForm) => {
                const addButton = productForm.querySelector('[name="add"]');

                if(addButton) {
                    addButton.setAttribute('disabled', true);
                    addButton.textContent = text;
                }
            });

            if (this.dataset.updateCart === 'true') this.item.classList.remove('isChecked');
        } else {
            if (disable) {
                let text = window.variantStrings.soldOut;

                this.quantityInput?.setAttribute('data-price', this.currentVariant?.price);
                this.quantityInput?.setAttribute('disabled', true);

                if(this.item.querySelector('.quantity__button')){
                    this.item.querySelectorAll('.quantity__button').forEach((button) =>{
                        button.setAttribute('disabled', true);
                    });
                }

                productForms.forEach((productForm) => {
                    const addButton = productForm.querySelector('[name="add"]');

                    if(addButton) {
                        addButton.setAttribute('disabled', true);
                        addButton.textContent = text;
                    }
                });

                if(this.inventoryProp) this.inventoryProp.querySelector('.productView-info-value').textContent = window.inventory_text.outOfStock;

                if(this.notifyMe){
                    this.notifyMe.querySelector('.halo-notify-product-variant').value = this.currentVariant.title;
                    this.notifyMe.querySelector('.notifyMe-text').innerHTML = '';
                    this.notifyMe.style.display = 'block';
                }

                if(this.productMessage) this.productMessage.style.display = 'none';
                if (this.dataset.updateCart === 'true') this.item.classList.remove('isChecked');
            } else{
                let text,
                    originalText,
                    inventory = this.currentVariant?.inventory_management,
                    arrayInVarName,
                    inven_array,
                    inven_num, 
                    inventoryQuantity;

                if(inventory != null) {
                    arrayInVarName = `product_inven_array_${this.dataset.product}`;
                    inven_array = window[arrayInVarName];

                    if(inven_array != undefined) {
                        inven_num = inven_array[this.currentVariant.id];
                        inventoryQuantity = parseInt(inven_num);

                        if (typeof inventoryQuantity != 'undefined'){
                            if(inventoryQuantity > 0) {
                                this.quantityInput?.setAttribute('data-inventory-quantity', inventoryQuantity);
                            } else {
                                this.quantityInput?.removeAttribute('data-inventory-quantity');
                            }
                        } else {
                            this.quantityInput?.setAttribute('data-inventory-quantity', inventoryQuantity);
                        }
                    }
                }

                if(subtotal) {
                    let price = this.currentVariant?.price,
                        subTotal = 0;

                    subTotal = quantityInputValue * price;
                    subTotal = Shopify.formatMoney(subTotal, window.money_format);

                    if(subtotal.layout == 1) {
                        if (typeof inventoryQuantity != 'undefined'){
                            if(inventoryQuantity > 0) {
                                text = subtotal.text.replace('[value]', subTotal);
                                originalText = window.variantStrings.addToCart;
                            } else {
                                text = subtotal.text_2.replace('[value]', subTotal);
                                originalText = window.variantStrings.preOrder;
                            }
                        } else {
                            text = subtotal.text.replace('[value]', subTotal);
                            originalText = window.variantStrings.addToCart;
                        }
                    } else {
                        const subtotalLabel = document.getElementById(`product-form-${this.dataset.section}-${this.dataset.product}`)?.querySelector('[data-product-subtotal]');

                        if (subtotalLabel) {
                            subtotalLabel.innerHTML = subTotal;

                            if (subtotalLabel.closest('.productView-subTotal').style.display === 'none') {
                                subtotalLabel.closest('.productView-subTotal').style.display = 'block';
                            }
                        }

                        if (typeof inventoryQuantity != 'undefined'){
                            if(inventoryQuantity > 0) {
                                text = window.variantStrings.addToCart;
                            } else  {
                                text = window.variantStrings.preOrder;
                            }
                        } else{
                            text = window.variantStrings.addToCart;
                        }
                    }
                } else {
                    if (typeof inventoryQuantity != 'undefined'){
                        if(inventoryQuantity > 0) {
                            text = window.variantStrings.addToCart;
                        } else  {
                            text = window.variantStrings.preOrder;
                        }
                    } else{
                        text = window.variantStrings.addToCart;
                    }
                }

                this.quantityInput?.setAttribute('data-price', this.currentVariant?.price);
                this.quantityInput?.removeAttribute('disabled');

                if(this.item.querySelector('.quantity__button')){
                    this.item.querySelectorAll('.quantity__button').forEach((button) =>{
                        button.removeAttribute('disabled');
                    });
                }

                productForms.forEach((productForm) => {
                    const addButton = productForm.querySelector('[name="add"]');

                    if(addButton){
                        if(addButton.classList.contains('button-text-change')) {
                            addButton.innerHTML = text;
                        } else {
                            addButton.innerHTML = originalText || text;
                        }
                    }
                });

                if(inventoryQuantity > 0) {
                    productForms.forEach((productForm) => {
                        const addButton = productForm.querySelector('[name="add"]');

                        if(addButton) addButton.classList.remove('button-text-pre-order');
                    });

                    quantityInputMaxValue = parseInt(this.quantityInput?.getAttribute('data-inventory-quantity'));

                    if(quantityInputValue > quantityInputMaxValue){
                        productForms.forEach((productForm) => {
                            const addButton = productForm.querySelector('[name="add"]');

                            if(addButton) addButton.setAttribute('disabled', true);
                        });

                        if(this.productMessage) {
                            this.productMessage.innerHTML = alertMessage;
                            this.productMessage.style.display = 'block';
                        }

                        if (this.dataset.updateCart === 'true') this.item.classList.remove('isChecked');
                    } else {
                        productForms.forEach((productForm) => {
                            const addButton = productForm.querySelector('[name="add"]');

                            if(addButton) addButton.removeAttribute('disabled');
                        });

                        if(this.productMessage) {
                            this.productMessage.innerHTML = '';
                            this.productMessage.style.display = 'none';
                        }

                        if (this.dataset.updateCart === 'true') this.item.classList.add('isChecked');
                    }

                    if(this.inventoryProp) this.inventoryProp.querySelector('.productView-info-value').textContent = window.inventory_text.inStock;
                } else{
                    productForms.forEach((productForm) => {
                        const addButton = productForm.querySelector('[name="add"]');

                        if(addButton) {
                            addButton.removeAttribute('disabled');
                            addButton.classList.add('button-text-pre-order');
                        }
                    });

                    if(this.inventoryProp) this.inventoryProp.querySelector('.productView-info-value').textContent = window.inventory_text.inStock;

                    if(this.productMessage) {
                        this.productMessage.innerHTML = '';
                        this.productMessage.style.display = 'none';
                    }

                    if (this.dataset.updateCart === 'true') this.item.classList.add('isChecked');
                }

                if(this.notifyMe) this.notifyMe.style.display = 'none';

                if (this.checkNeedToConvertCurrency()) {
                    let currencyCode = document.getElementById('currencies')?.querySelector('.active')?.getAttribute('data-currency');

                    Currency.convertAll(window.shop_currency, currencyCode, 'span.money', 'money_format');
                }
            }

            if(this.skuProp && this.currentVariant.sku){
                this.skuProp.querySelector('.productView-info-value').textContent = this.currentVariant.sku;
            }
        
            productForms.forEach((productForm) => {
                const input = productForm.querySelector('input[name="id"]');

                input.value = this.currentVariant.id;
                input.dispatchEvent(new Event('change', { bubbles: true }));
            });
        }
    }

    updateDescription(html) {
        const id = `[data-product-description-${this.dataset.section}-${this.dataset.product}]`;
        const destination = this.item.querySelector(id);
        const source = html.querySelector(id);

        if (source && destination) {
            destination.innerHTML = source.innerHTML;
            
            if (destination.closest('.toggle-content--height')){
                destination.style.maxHeight = null;
            }
        }
    }

    updateInventory(html) {
        const id = `#product-inventory-${this.dataset.section}-${this.dataset.product}`;
        const destination = this.item.querySelector(id);
        const source = html.querySelector(id);
        
        if (!destination || !source) return;

        const inventoryText = destination.querySelector('.text');
        const inventoryProgress = destination.querySelector('.progress');
        const stock = parseFloat(source.querySelector('.progress')?.dataset.stock) || 0;
        const maxStock = parseFloat(source.querySelector('.progress')?.dataset.maxStock) || 0;
        const percent = source.querySelector('.progress').dataset.progressPercent;

        if (stock > 0 && stock < maxStock) {
            destination.classList.remove('is-hide');
            inventoryProgress.style.setProperty(`--progress-percent`, percent);
        } else {
            destination.classList.add('is-hide');
            inventoryProgress.style.setProperty(`--progress-percent`, '0%');
        }

        inventoryText.innerHTML = source.querySelector('.text').innerHTML;
        inventoryProgress.setAttribute('data-stock', stock);
        inventoryProgress.setAttribute('data-progress-percent', percent);
    }

    updateOthers(html) {
        this.getSectionsToRender().forEach((section) => {
            const destination = this.item.querySelector(section.selector);
            const source = html.querySelector(section.selector);
            
            if (source && destination) {
                destination.innerHTML = source.innerHTML;
            }

            destination?.classList.remove('visibility-hidden');
        });
    }

    updateProperty(html) {
        const id = `#product-property-${this.dataset.section}-${this.dataset.product}`;
        const destination = this.item.querySelector(id);
        const source = html.querySelector(id);

        if(destination) {
            if (source) {
                destination.innerHTML = source.innerHTML;
                destination.style.display = 'table';
            } else{
                destination.style.display = 'none';
            }
        } else {
            if (source) {
                this.item.querySelector('.productView-options')?.insertBefore(source, this.item.querySelector('.productView-form'));
            }
        }
    }

    getVariantData() {
        this.variantData = this.variantData || JSON.parse(this.querySelector('[type="application/json"]').textContent);

        return this.variantData;
    }

    getSectionsToRender() {
        return [{
            id: `Price`,
            selector: `#product-price-${this.dataset.section}-${this.dataset.product}`
        },
        {
            id: `Sticky-Price`,
            selector: `#product-sticky-price-${this.dataset.section}-${this.dataset.product}`
        },
        {
            id: `Sticky-Image`,
            selector: `#product-sticky-featured-image-${this.dataset.section}-${this.dataset.product}`
        },
        {
            id: `Edit-Cart-Image`,
            selector: `#product-edit-featured-image-${this.dataset.section}-${this.dataset.product}`
        }];
    }

    checkNeedToConvertCurrency() {
        return (window.show_multiple_currencies && Currency.currentCurrency != window.shop_currency) || window.show_auto_currency;
    }
}

customElements.define('variant-selects', VariantSelects);

class VariantRadios extends VariantSelects {
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

customElements.define('variant-radios', VariantRadios);

class QuantityInput extends HTMLElement {
    constructor() {
        super();

        this.input = this.querySelector('input');
        this.changeEvent = new Event('change', { bubbles: true });
        this.input.addEventListener('change', this.onInputChange.bind(this));

        this.querySelectorAll('button').forEach(
            (button) => button.addEventListener('click', this.onButtonClick.bind(this))
        );
    }

    onButtonClick(event) {
        event.preventDefault();
        const previousValue = this.input.value;

        event.target.name === 'plus' ? this.input.stepUp() : this.input.stepDown();

        if (previousValue !== this.input.value) this.input.dispatchEvent(this.changeEvent);
    }

    onInputChange(event) {
        event.preventDefault();

        const productMessage = this.input.closest('form')?.querySelector(`product-message-${this.dataset.section}-${this.dataset.product}`);
        const addButton = document.getElementById(`product-form-${this.input.dataset.section}-${this.input.dataset.product}`)?.querySelector('[name="add"]');

        let inputValue = parseInt(this.input.value),
            inputMaxValue = parseInt(this.input.getAttribute('data-inventory-quantity')),
            subtotal = window[`subtotal_${this.input.dataset.product}`];

        if(inputValue < 1) {
            inputValue = 1;

            this.input.value = inputValue;
        } else {
            if (inputMaxValue < inputValue) {
                addButton?.setAttribute('disabled', true);

                var alertText = window.inventory_text.max,
                    alertMessage = `<div class="alertBox alertBox--error"><p class="alertBox-message">${alertText}</p></div>`;

                if(productMessage) {
                    productMessage.innerHTML = alertMessage;

                    if (productMessage.style.display === 'none') {
                        productMessage.style.display = 'block';
                    }
                }

                if(this.input.dataset.updateCart === 'true') this.closest('.product-edit-item')?.classList.remove('isChecked');
            } else {
                addButton?.removeAttribute('disabled');

                if(productMessage) {
                    productMessage.innerHTML = '';

                    if (productMessage.style.display === 'block') {
                        productMessage.style.display = 'none';
                    }
                }

                if(this.input.dataset.updateCart === 'true') this.closest('.product-edit-item')?.classList.add('isChecked');
            }
        }

        if(subtotal) {
            let text,
                price = this.input.dataset.price,
                subTotal = 0;

            subTotal = inputValue * price;
            subTotal = Shopify.formatMoney(subTotal, window.money_format);

            if(subtotal.layout == 1) {
                if(!addButton?.classList.contains('button-text-pre-order')){
                    text = subtotal.text.replace('[value]', subTotal);
                } else{
                    text = subtotal.text_2.replace('[value]', subTotal);
                }

                if (addButton) addButton.innerHTML = text;
            } else {
                const subtotalLabel = document.getElementById(`product-form-${this.input.dataset.section}-${this.input.dataset.product}`)?.querySelector('[data-product-subtotal]');
                
                if (subtotalLabel) {
                    subtotalLabel.innerHTML = subTotal;

                    if (subtotalLabel.closest('.productView-subTotal').style.display === 'none') {
                        subtotalLabel.closest('.productView-subTotal').style.display = 'block';
                    }
                }
            }

            if (this.checkNeedToConvertCurrency()) {
                let currencyCode = document.getElementById('currencies')?.querySelector('.active')?.getAttribute('data-currency');

                Currency.convertAll(window.shop_currency, currencyCode, 'span.money', 'money_format');
            }
        }
    }

    checkNeedToConvertCurrency() {
        return (window.show_multiple_currencies && Currency.currentCurrency != window.shop_currency) || window.show_auto_currency;
    }
}

customElements.define('quantity-input', QuantityInput);
