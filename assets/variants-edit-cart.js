class VariantEditCartSelects extends HTMLElement {
    constructor() {
        super();
        this.variantSelect = this;
        this.item = $(this.variantSelect).closest('.product-edit-item');
        this.variants = this.getVariantData();

        this.onVariantInit = debounce(() => {
            this.updateOptions();
            this.updateMasterId();
            this.updateVariants(this.variants);
            this.updateProductInfo();
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
            this.updateProductInfo();
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

    updateMedia() {
        if (!this.currentVariant || !this.currentVariant?.featured_image) return;
        const itemImage = this.item.find('.product-edit-image');
        const image = this.currentVariant?.featured_image;

        if (!itemImage) return;

        itemImage.find('img').attr({
            'src': image.src,
            'srcset': image.src,
            'alt': image.alt
        });
    }

    updatePrice(){
        const itemPrice = this.item.find('.product-edit-price');

        if (!itemPrice) return;

        var price = this.currentVariant?.price,
            compare_at_price = this.currentVariant?.compare_at_price;

        itemPrice.find('.price').html(Shopify.formatMoney(price, window.money_format)).show();

        if(compare_at_price > price) {
            itemPrice.find('.compare-price').html(Shopify.formatMoney(compare_at_price, window.money_format)).show();
            itemPrice.find('.price').addClass('new-price');
        } else {
            itemPrice.find('.compare-price').hide();
            itemPrice.find('.price').removeClass('new-price');
        }

        if (this.checkNeedToConvertCurrency()) {
            Currency.convertAll(window.shop_currency, $('#currencies .active').attr('data-currency'), 'span.money', 'money_format');
        }
    }

    updateProductInfo() {
        if(this.currentVariant){
            var inventory = this.currentVariant?.inventory_management;

            if(inventory != null) {
                var productId = this.item.data('cart-edit-id'),
                    arrayInVarName = 'edit_cart_inven_array_' + productId,
                    inven_array = window[arrayInVarName];

                if(inven_array != undefined) {
                    var inven_num = inven_array[this.currentVariant.id],
                        inventoryQuantity = parseInt(inven_num);

                    this.item.find('input[name="quantity"]').attr('data-inventory-quantity', inventoryQuantity);

                    if(this.item.find('.product-edit-hotStock').length > 0){
                        var hotStock = this.item.find('.product-edit-hotStock'),
                            maxStock = hotStock.data('edit-cart-hot-stock');

                        if(inventoryQuantity > 0 && inventoryQuantity <= maxStock){
                            var textStock = window.inventory_text.hotStock.replace('[inventory]', inventoryQuantity);
                            hotStock.text(textStock).show();
                        } else {
                            hotStock.hide();
                        }
                    }
                }
            }

            const productForm = document.querySelector(`#product-form-edit-${this.dataset.product}`);
            if (!productForm) return;
            const input = productForm.querySelector('input[name="id"]');
            if (!input) return;
            input.value = this.currentVariant.id;
            input.dispatchEvent(new Event('change', { bubbles: true }));
        }
    }

    updateAttribute(unavailable = true, disable = true){
        var alertBox = this.item.find('.alertBox'),
            quantityInput = this.item.find('input[name="quantity"]'),
            notifyMe = this.item.find('.product-edit-notifyMe'),
            hotStock = this.item.find('.productView-hotStock');

        if(unavailable){
            this.item.removeClass('isChecked');
            quantityInput.attr('disabled', true);
            alertBox.find('.alertBox-message').text(window.variantStrings.unavailable_message);
            alertBox.show();
            notifyMe.hide();

            if(hotStock.length > 0){
                hotStock.hide();
            }
        } else {
            if (disable) {
                this.item.removeClass('isChecked');
                quantityInput.attr('disabled', true);
                alertBox.find('.alertBox-message').text(window.variantStrings.soldOut_message);
                alertBox.show();

                this.item.find('.quantity__message').empty().hide();

                if(notifyMe.length > 0){
                    notifyMe.find('input[name="halo-notify-product-variant"]').val(this.currentVariant.title);
                    notifyMe.find('.notifyMe-text').empty();
                    notifyMe.show();
                }
            } else{
                this.item.addClass('isChecked')
                quantityInput.attr('disabled', false);
                alertBox.find('.alertBox-message').text('');
                alertBox.hide();

                if(notifyMe.length > 0){
                    notifyMe.hide;
                }
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
        this.item = $(this.input).closest('.product-edit-item');
        this.input.addEventListener('change', this.onInputChange.bind(this));
    }

    onInputChange(event) {
        event.preventDefault();
        var inputValue = this.input.value;
        var inventoryQuantity = parseInt(this.input.dataset.quantity);

        if(inputValue < 1) {
            inputValue = 1;

            this.input.value =  inputValue;
        } else {
            if (inventoryQuantity < inputValue) {
                var message = window.inventory_text.warningQuantity.replace('[inventory]', inventoryQuantity);

                inputValue = inventoryQuantity;
                this.input.value =  inputValue;

                this.item.find('.quantity__message').text(message).show();
                this.item.removeClass('isChecked');
            } else {
                this.item.addClass('isChecked');
                this.item.find('.quantity__message').empty().hide();
            }
        }
    }
}

customElements.define('quantity-edit-cart-input', QuantityEditCartInput);