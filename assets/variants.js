class VariantSelects extends HTMLElement {
    constructor() {
        super();
        this.item = this.closest('.productView');
        this.variants = this.getVariantData();
        this.onVariantInit();
        this.addEventListener('change', this.onVariantChange.bind(this));
    }

    onVariantInit(){
        this.updateOptions();
        this.updateMasterId();
        this.updateMedia(2000);
        this.updateVariants(this.variants);
    }

    onVariantChange(event) {
        this.updateOptions();
        this.updateMasterId();
        this.updateVariants(this.variants);
        this.updatePickupAvailability();

        if (!this.currentVariant) {
            this.updateAttribute(true);
            this.updateStickyAddToCart(true);
        } else {
            this.updateMedia(200);
            this.updateURL();
            this.updateProductInfo();
            this.updateAttribute(false, !this.currentVariant.available);
            this.updateStickyAddToCart(false, !this.currentVariant.available);
        }
    }

    updateVariants(variants){
        const options = Array.from(this.querySelectorAll('.product-form__input'));
        const type = document.getElementById(`product-option-${this.dataset.product}`)?.getAttribute('data-type');

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
        
        const newMedia = document.querySelector(
            `[data-media-id="${this.dataset.section}-${this.currentVariant.featured_media.id}"]`
        );

        if (!newMedia) return;
        
        window.setTimeout(() => {
            $(newMedia).trigger('click');
        }, time);
    }

    updateURL() {
        if (!this.currentVariant) return;

        window.history.replaceState({ }, '', `${this.dataset.url}?variant=${this.currentVariant.id}`);
    }

    updatePickupAvailability() {
        const pickUpAvailability = document.querySelector('pickup-availability');

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
                const id = `product-price-${this.dataset.product}`;
                const html = new DOMParser().parseFromString(responseText, 'text/html')
                const destination = document.getElementById(id);
                const source = html.getElementById(id);

                if (source && destination) {
                    destination.innerHTML = source.innerHTML;
                }

                if (this.checkNeedToConvertCurrency()) {
                    let currencyCode = document.getElementById('currencies')?.querySelector('.active')?.getAttribute('data-currency');

                    Currency.convertAll(window.shop_currency, currencyCode, 'span.money', 'money_format');
                }

                destination?.classList.remove('visibility-hidden');
        });
    }

    updateAttribute(unavailable = true, disable = true){
        this.quantityInput = this.item.querySelector('input[name="quantity"]');
        this.inventoryProp = this.item.querySelector('[data-inventory]');
        this.skuProp = this.item.querySelector('[data-sku]');
        this.productMessage = this.item.querySelector('.productView-message');
        this.notifyMe = this.item.querySelector('.productView-notifyMe');
        this.hotStock = this.item.querySelector('.productView-hotStock');
        this.sticky = this.item.querySelector('.productView-stickyCart');
        const addButton = document.getElementById(`product-form-${this.dataset.product}`)?.querySelector('[name="add"]');
        const productForms = document.querySelectorAll(`#product-form-${this.dataset.product}, #product-form-installment-${this.dataset.product}`);

        let quantityInputValue = parseInt(this.quantityInput?.value),
            quantityInputMaxValue,
            alertText = window.inventory_text.max,
            alertMessage = `<div class="alertBox alertBox--error"><p class="alertBox-message">${alertText}</p></div>`;

        if(unavailable){
            let text = window.variantStrings.unavailable;

            this.quantityInput.setAttribute('disabled', true);

            if(this.notifyMe){
                this.notifyMe.style.display = 'none';
            }

            if(this.hotStock){
                this.hotStock.style.display = 'none';
            }

            if(this.productMessage) {
                this.productMessage.style.display = 'none';
            }

            addButton.setAttribute('disabled', true);
            addButton.textContent = text;
        } else {
            if (disable) {
                let text = window.variantStrings.soldOut;

                this.quantityInput.setAttribute('data-price', this.currentVariant?.price);
                this.quantityInput.setAttribute('disabled', true);
                addButton.setAttribute('disabled', true);
                addButton.textContent = text;

                if(this.inventoryProp){
                    this.inventoryProp.querySelector('.productView-info-value').textContent = window.inventory_text.outOfStock;
                }

                if(this.notifyMe){
                    this.notifyMe.querySelector('input[name="halo-notify-product-variant"]').value = this.currentVariant.title;
                    this.notifyMe.querySelector('.notifyMe-text').innerHTML = '';
                    this.notifyMe.style.display = 'block';
                }

                if(this.productMessage) {
                    this.productMessage.style.display = 'none';
                }

                if(this.hotStock){
                    this.hotStock.style.display = 'none';
                }
            } else{
                let text,
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
                                this.quantityInput.setAttribute('data-inventory-quantity', inventoryQuantity);
                            } else {
                                this.quantityInput.removeAttribute('data-inventory-quantity');
                            }
                        } else {
                            this.quantityInput.setAttribute('data-inventory-quantity', inventoryQuantity);
                        }
                    }
                }

                if(window.subtotal.show) {
                    let price = this.currentVariant?.price,
                        subTotal = 0;

                    subTotal = quantityInputValue * price;
                    subTotal = Shopify.formatMoney(subTotal, window.money_format);

                    if(window.subtotal.layout == '1') {
                        if (typeof inventoryQuantity != 'undefined'){
                            if(inventoryQuantity > 0) {
                                text = window.subtotal.text.replace('[value]', subTotal);
                            } else {
                                text = window.subtotal.text_2.replace('[value]', subTotal);
                            }
                        } else {
                            text = window.subtotal.text.replace('[value]', subTotal);
                        }
                    } else {
                        const subtotalLabel = document.getElementById(`product-form-${this.dataset.product}`)?.querySelector('[data-product-subtotal]');

                        subtotalLabel.innerHTML = subTotal;

                        if (subtotalLabel.closest('.productView-subTotal').style.display === 'none') {
                            subtotalLabel.closest('.productView-subTotal').style.display = 'block';
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

                this.quantityInput.setAttribute('data-price', this.currentVariant?.price);
                this.quantityInput.removeAttribute('disabled');

                addButton.innerHTML = text;

                if(inventoryQuantity > 0) {
                    addButton.classList.remove('button-text-pre-order');
                    quantityInputMaxValue = parseInt(this.quantityInput?.getAttribute('data-inventory-quantity'));

                    if(quantityInputValue > quantityInputMaxValue){
                        addButton.setAttribute('disabled', true);

                        if(this.productMessage) {
                            this.productMessage.innerHTML = alertMessage;
                            this.productMessage.style.display = 'block';
                        }
                    } else {
                        addButton.removeAttribute('disabled');

                        if(this.productMessage) {
                            this.productMessage.innerHTML = '';
                            this.productMessage.style.display = 'none';
                        }
                    }

                    if(this.inventoryProp){
                        this.inventoryProp.querySelector('.productView-info-value').textContent = window.inventory_text.inStock;
                    }

                    if(this.hotStock){
                        let maxStock = parseInt(this.hotStock.getAttribute('data-hot-stock'));

                        if(0 < inventoryQuantity && inventoryQuantity <= maxStock){
                            let textStock = window.inventory_text.hotStock.replace('[inventory]', inventoryQuantity);

                            this.hotStock.innerHTML = textStock;
                            this.hotStock.style.display = 'block';
                        } else {
                            this.hotStock.innerHTML = '';
                            this.hotStock.style.display = 'none';
                        }
                    }
                } else{
                    addButton.removeAttribute('disabled');
                    addButton.classList.add('button-text-pre-order');

                    if(this.inventoryProp){
                        this.inventoryProp.querySelector('.productView-info-value').textContent = window.inventory_text.inStock;
                    }

                    if(this.hotStock){
                        this.hotStock.style.display = 'none';
                    }

                    if(this.productMessage) {
                        this.productMessage.innerHTML = '';
                        this.productMessage.style.display = 'none';
                    }
                }

                if(this.notifyMe){
                    this.notifyMe.style.display = 'none';
                }

                if (this.checkNeedToConvertCurrency()) {
                    let currencyCode = document.getElementById('currencies')?.querySelector('.active')?.getAttribute('data-currency');

                    Currency.convertAll(window.shop_currency, currencyCode, 'span.money', 'money_format');
                }
            }

            if(this.skuProp && this.currentVariant.sku){
                this.skuProp.querySelector('.productView-info-value').textContent = this.currentVariant.sku;
            }

            if(this.sticky){
                this.sticky.querySelector('.select__select').value = this.currentVariant.id;
            }  
        
            productForms.forEach((productForm) => {
                const input = productForm.querySelector('input[name="id"]');

                input.value = this.currentVariant.id;
                input.dispatchEvent(new Event('change', { bubbles: true }));
            });
        }
    }

    updateStickyAddToCart(unavailable = true, disable = true){
        this.sticky = this.item.querySelector('.productView-stickyCart');

        if (!this.sticky) return;

        const itemImage = this.sticky.querySelector('.sticky-image');
        const option = this.sticky.querySelector('.select__select');
        const input = document.getElementById(`product-form-sticky-${this.dataset.product}`)?.querySelector('input[name="id"]');
        const button = document.getElementById(`product-form-sticky-${this.dataset.product}`)?.querySelector('[name="add"]');

        if(unavailable){
            let text = window.variantStrings.unavailable;

            button.setAttribute('disabled', true);
            button.textContent = text;
        } else {
            if (this.currentVariant?.featured_media) {
                itemImage.querySelector('img').setAttribute('src', this.currentVariant?.featured_image.src);
                itemImage.querySelector('img').setAttribute('srcset', this.currentVariant?.featured_image.src);
                itemImage.querySelector('img').setAttribute('alt', this.currentVariant?.featured_image.alt);
            }

            option.value = this.currentVariant.id;
            input.value = this.currentVariant.id;

            if (disable) {
                let text = window.variantStrings.soldOut;

                button.setAttribute('disabled', true);
                button.textContent = text;
            } else {
                let inventory = this.currentVariant?.inventory_management,
                    arrayInVarName,
                    inven_array,
                    inven_num, 
                    inventoryQuantity,
                    text;

                if(inventory != null) {
                    arrayInVarName = `product_inven_array_${this.dataset.product}`;
                    inven_array = window[arrayInVarName];

                    if(inven_array != undefined) {
                        inven_num = inven_array[this.currentVariant.id];
                        inventoryQuantity = parseInt(inven_num);
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

                button.removeAttribute('disabled');
                button.textContent = text;
            }
        }
    }

    getVariantData() {
        this.variantData = this.variantData || JSON.parse(this.querySelector('[type="application/json"]').textContent);

        return this.variantData;
    }

    checkNeedToConvertCurrency() {
        return (window.show_multiple_currencies && Currency.currentCurrency != shopCurrency) || window.show_auto_currency;
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

        let inputValue = parseInt(this.input.value),
            inputMaxValue = parseInt(this.input.getAttribute('data-inventory-quantity')),
            productMessage = this.input.closest('form')?.querySelector('.productView-message');
        
        const addButton = document.getElementById(`product-form-${this.input.dataset.product}`)?.querySelector('[name="add"]');

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

        if(window.subtotal.show) {
            let text,
                price = this.input.dataset.price,
                subTotal = 0;

            subTotal = inputValue * price;
            subTotal = Shopify.formatMoney(subTotal, window.money_format);

            if(window.subtotal.layout == '1') {
                if(!addButton.classList.contains('button-text-pre-order')){
                    text = window.subtotal.text.replace('[value]', subTotal);
                } else{
                    text = window.subtotal.text_2.replace('[value]', subTotal);
                }

                addButton.innerHTML = text;
            } else {
                const subtotalLabel = document.getElementById(`product-form-${this.input.dataset.product}`)?.querySelector('[data-product-subtotal]');
                
                subtotalLabel.innerHTML = subTotal;

                if (subtotalLabel.closest('.productView-subTotal').style.display === 'none') {
                    subtotalLabel.closest('.productView-subTotal').style.display = 'block';
                }
            }

            if (this.checkNeedToConvertCurrency()) {
                let currencyCode = document.getElementById('currencies')?.querySelector('.active')?.getAttribute('data-currency');

                Currency.convertAll(window.shop_currency, currencyCode, 'span.money', 'money_format');
            }
        }
    }

    checkNeedToConvertCurrency() {
        return (window.show_multiple_currencies && Currency.currentCurrency != shopCurrency) || window.show_auto_currency;
    }
}

customElements.define('quantity-input', QuantityInput);
