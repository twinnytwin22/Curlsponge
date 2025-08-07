class VariantEditCartSelects extends HTMLElement {
    constructor() {
        super();
        this.item = this.closest('.product-edit-item');
        this.variants = this.getVariantData();

        this.onVariantInit = debounce(() => {
            this.updateOptions();
            this.updateMasterId();
            this.updateVariants(this.variants);
            this.updateAttribute(false, !this.currentVariant.available);
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
        const type = document.getElementById(`product-edit-options-${this.dataset.product}`)?.getAttribute('data-type');

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

        const itemImage = this.item.querySelector('.product-edit-image');

        if (itemImage) {
            itemImage.querySelector('img').setAttribute('src', this.currentVariant?.featured_image.src);
            itemImage.querySelector('img').setAttribute('srcset', this.currentVariant?.featured_image.src);
            itemImage.querySelector('img').setAttribute('alt', this.currentVariant?.featured_image.alt);
        }
    }

    updatePrice(){
        const itemPrice = this.item.querySelector('.product-edit-price');

        if (!itemPrice) return;

        let price = this.currentVariant?.price,
            compare_at_price = this.currentVariant?.compare_at_price;

        const priceDiv = itemPrice.querySelector('.price');
        const comparePriceDiv = itemPrice.querySelector('.compare-price');

        priceDiv.innerHTML = Shopify.formatMoney(price, window.money_format);
        priceDiv.style.display = 'inline-block';

        if(compare_at_price > price) {
            comparePriceDiv.innerHTML = Shopify.formatMoney(compare_at_price, window.money_format);
            comparePriceDiv.style.display = 'inline-block';

            priceDiv.classList.add('new-price');
        } else {
            comparePriceDiv.style.display = 'none';

            priceDiv.classList.remove('new-price');
        }

        if (this.checkNeedToConvertCurrency()) {
            let currencyCode = document.getElementById('currencies')?.querySelector('.active')?.getAttribute('data-currency');

            Currency.convertAll(window.shop_currency, currencyCode, 'span.money', 'money_format');
        }
    }

    updateAttribute(unavailable = true, disable = true){
        this.alertBox = this.item.querySelector('.alertBox');
        this.quantityInput = this.item.querySelector('input[name="quantity"]');
        this.notifyMe = this.item.querySelector('.product-edit-notifyMe');
        this.productMessage = this.item.querySelector('.quantity__message');

        let quantityInputValue = parseInt(this.quantityInput?.value),
            quantityInputMaxValue;

        if(unavailable){
            let text = window.variantStrings.unavailable;

            this.item.classList.remove('isChecked');
            this.quantityInput.setAttribute('disabled', true);
            this.alertBox.querySelector('.alertBox-message').textContent = text;
            this.alertBox.style.display = 'block';

            if(this.productMessage) {
                this.productMessage.innerHTML = '';
                this.productMessage.style.display = 'none';
            }

            if(this.notifyMe){
                this.notifyMe.style.display = 'none';
            }
        } else {
            if (disable) {
                let text = window.variantStrings.soldOut;

                this.item.classList.remove('isChecked');
                this.quantityInput.setAttribute('disabled', true);
                this.alertBox.querySelector('.alertBox-message').textContent = text;
                this.alertBox.style.display = 'block';
                
                if(this.productMessage) {
                    this.productMessage.innerText = '';
                    this.productMessage.style.display = 'none';
                }

                if(this.notifyMe){
                    this.notifyMe.querySelector('.halo-notify-product-variant').value = this.currentVariant.title;
                    this.notifyMe.querySelector('.notifyMe-text').innerHTML = '';
                    this.notifyMe.style.display = 'block';
                }
            } else{
                let inventory = this.currentVariant?.inventory_management,
                    productId = this.item.getAttribute('data-cart-edit-id'),
                    arrayInVarName,
                    inven_array,
                    inven_num, 
                    inventoryQuantity;

                this.quantityInput.removeAttribute('disabled');
                this.alertBox.querySelector('.alertBox-message').innerHTML = '';
                this.alertBox.style.display = 'none';

                if(inventory != null) {
                    arrayInVarName = `edit_cart_inven_array_${productId}`;
                    inven_array = window[arrayInVarName];

                    if(inven_array != undefined) {
                        inven_num = inven_array[this.currentVariant.id];
                        inventoryQuantity = parseInt(inven_num);

                        if (typeof inventoryQuantity != 'undefined'){
                            if(inventoryQuantity > 0) {
                                this.quantityInput.setAttribute('data-quantity', inventoryQuantity);
                            } else {
                                this.quantityInput.removeAttribute('data-quantity');
                            }
                        } else {
                            this.quantityInput.setAttribute('data-quantity', inventoryQuantity);
                        }
                    }
                }

                if(inventoryQuantity > 0) {
                    quantityInputMaxValue = parseInt(this.quantityInput?.getAttribute('data-quantity'));

                    if(quantityInputValue > quantityInputMaxValue){
                        this.item.classList.remove('isChecked');
                        this.productMessage.innerHTML = window.inventory_text.warningQuantity.replace('[inventory]', quantityInputMaxValue);
                        this.productMessage.style.display = 'block';
                    } else {
                        this.item.classList.add('isChecked');
                        this.productMessage.innerHTML = '';
                        this.productMessage.style.display = 'none';
                    }
                } else {
                    this.item.classList.add('isChecked');

                    this.alertBox.querySelector('.alertBox-message').innerHTML = '';
                    this.alertBox.style.display = 'none';
                }

                if(this.notifyMe) this.notifyMe.style.display = 'none';

                if (this.checkNeedToConvertCurrency()) {
                    let currencyCode = document.getElementById('currencies')?.querySelector('.active')?.getAttribute('data-currency');

                    Currency.convertAll(window.shop_currency, currencyCode, 'span.money', 'money_format');
                }
            }

            const productForm = document.querySelector(`#product-form-edit-${this.dataset.product}`);
            if (!productForm) return;

            const input = productForm.querySelector('input[name="id"]');
            if (input) {
                input.value = this.currentVariant.id;
                input.dispatchEvent(new Event('change', { bubbles: true }));
            }
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

customElements.define('variant-edit-selects', VariantEditCartSelects);

class VariantEditCartRadios extends VariantEditCartSelects {
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

customElements.define('variant-edit-radios', VariantEditCartRadios);

class QuantityEditCartInput extends HTMLElement {
    constructor() {
        super();
        this.input = this.querySelector('input');
        this.item = this.closest('.product-edit-item');
        this.input.addEventListener('change', this.onInputChange.bind(this));
    }

    onInputChange(event) {
        event.preventDefault();

        let inputValue = parseInt(this.input.value),
            inputMaxValue = parseInt(this.input.dataset.quantity),
            productMessage = this.item.querySelector('.quantity__message');

        if(inputValue < 1) {
            inputValue = 1;

            this.input.value = inputValue;
        } else {
            if (inputMaxValue < inputValue) {
                productMessage.innerHTML = window.inventory_text.warningQuantity.replace('[inventory]', inputMaxValue);
                productMessage.style.display = 'block';
                this.item.classList.remove('isChecked');
            } else {
                productMessage.innerHTML = '';
                productMessage.style.display = 'none';
                this.item.classList.add('isChecked');
            }
        }
    }
}

customElements.define('quantity-edit-cart-input', QuantityEditCartInput);