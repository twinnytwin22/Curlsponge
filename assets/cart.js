class CartItems extends HTMLElement {
    constructor() {
        super();

        this.header = this.querySelector('.page-header');
        this.cart = this.querySelector('[data-cart]');
    }

    update(cart) {
        const loadingClass = 'has-halo-block-loader';

        this.cart.classList.add(loadingClass);

        fetch(`${window.routes.cart}?section_id=${this.dataset.section}`)
            .then((response) => response.text())
            .then((responseText) => {
                const html = new DOMParser().parseFromString(responseText, 'text/html');

                if(cart.item_count > 0){
                    this.getElementToRender().forEach((section) => {
                        const destination = this.querySelector(section.selector);
                        const source = html.querySelector(section.selector);
                        
                        if (source && destination) {
                            destination.innerHTML = source.innerHTML;
                        }
                    });
                } else {
                    this.header.innerHTML = html.querySelector('.page-header').innerHTML;
                    this.cart.innerHTML = html.querySelector('#main-cart-items').innerHTML;
                }
            })
            .catch((e) => {
                console.error(e);
            })
            .finally(() => {
                this.cart.classList.remove(loadingClass);

                if(document.querySelector('[data-cart-count]')) {
                    document.querySelectorAll('[data-cart-count]').forEach((cartCounter) => {
                        cartCounter.innerText = cart.item_count;
                    });
                }

                if (this.checkNeedToConvertCurrency()) {
                    let currencyCode = document.getElementById('currencies')?.querySelector('.active')?.getAttribute('data-currency');

                    Currency.convertAll(window.shop_currency, currencyCode, 'span.money', 'money_format');
                }
            });
    }

    getElementToRender() {
        return [{
            id: `Cart-Table`,
            selector: `#Cart-Table-${this.dataset.section}`
        },
        {
            id: `Cart-Shipping-Message`,
            selector: `#Cart-Shipping-Message-${this.dataset.section}`
        },
        {
            id: `Cart-Wrapping`,
            selector: `#Cart-Wrapping-${this.dataset.section}`
        },
        {
            id: `Cart-Subtotal`,
            selector: `#Cart-Subtotal-${this.dataset.section}`
        },
        {
            id: `Cart-Grandtotal`,
            selector: `#Cart-Grandtotal-${this.dataset.section}`
        }];
    }

    checkNeedToConvertCurrency() {
        return (window.show_multiple_currencies && Currency.currentCurrency != window.shop_currency) || window.show_auto_currency;
    }
}

customElements.define('cart-items', CartItems);

class CouponCode extends HTMLElement {
    constructor() {
        super();

        if (localStorage.getItem('storedDiscount')){  
            var discountStored = localStorage.getItem('storedDiscount');   
            document.querySelector('input[name="discount"]').value = localStorage.getItem('storedDiscount');  
        }

        this.addEventListener('change', debounce((event) => {
            fetch(`/discount/${event.target.value}`)
            .then((response) => response.text())
            .then((responseText) => {});
        }, 300));

        document.querySelector('form[action="/cart"]').addEventListener('submit', (event) => {
            var discountStored = document.querySelector('input[name="discount"]').value;

            localStorage.setItem('storedDiscount', discountStored);  
        });
    }
}

customElements.define('coupon-code', CouponCode);

class CartCountdown extends HTMLElement {
    constructor() {
        super();

        this.init();
    }

    init(){
        if(!this.classList.contains('is-running')){
            let duration = parseInt(this.dataset.cartCountdown) * 60,
                element = this.querySelector('.time');

            this.classList.add('is-running');
            this.countdown(duration, element);
        }
    }

    countdown(duration, element){
        let timer = duration,
            minutes,
            seconds,
            text;

        let startCoundown = setInterval(() => {
            minutes = parseInt(timer / 60, 10);
            seconds = parseInt(timer % 60, 10);

            minutes = minutes < 10 ? "0" + minutes : minutes;
            seconds = seconds < 10 ? "0" + seconds : seconds;
            text = minutes + ":" + seconds;

            element.innerText = text;

            if (--timer < 0) {
                clearInterval(startCoundown);
                this.remove();
            }
        }, 1000);
    }
}

customElements.define('cart-countdown', CartCountdown);

class CartGiftWrapping extends HTMLElement {
    constructor() {
        super();

        this.id = this.dataset.id;
        this.quantity = parseInt(this.dataset.quantity);
        this.cartItem = parseInt(this.dataset.cartItem);
        this.addedGiftWrapping = this.dataset.addedGiftWrapping;
        this.input = this.querySelector('[name="attributes[gift-wrapping]"]');
        this.input?.addEventListener("change", (event) => {
            event.target.checked ? this.addGiftWrapping() : this.removeGiftWrapping();
        });

        if (this.cartItem == 1 && this.addedGiftWrapping == 'true') {
            this.removeGiftWrapping();
        }
    }

    addGiftWrapping() {
        const body = JSON.stringify({
            updates: {
                [this.id]: this.quantity
            },
            attributes: {
                'gift-wrapping': true
            },
            sections_url: window.location.pathname
        });

        fetch(`${window.routes.cart_update_url}`, {...fetchConfig(), ...{ body }})
            .then((response) => response.json())
            .then((response) => {
                window.location.href = window.routes.cart;
            })
            .catch((e) => {
                console.error(e);
            });
    }

    removeGiftWrapping() {
        const body = JSON.stringify({
            updates: {
                [this.id]: 0
            },
            attributes: {
                'gift-wrapping': ''
            },
            sections_url: window.location.pathname
        });

        fetch(`${window.routes.cart_update_url}`, {...fetchConfig(), ...{ body }})
            .then((response) => response.json())
            .then((response) => {
                window.location.href = window.routes.cart;
            })
            .catch((e) => {
                console.error(e);
            });
    }
}

customElements.define('gift-wrapping', CartGiftWrapping);