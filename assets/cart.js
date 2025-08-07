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

class CartItems extends HTMLElement {
    constructor() {
        super();

        this.cartCountDown = document.getElementById(`CartCountdown-${this.dataset.section}`);
        this.initCartCountdown();
    }

    initCartCountdown(){
        if(!this.cartCountDown) return;

        if(!this.cartCountDown.classList.contains('is-running')){
            var duration = this.cartCountDown.getAttribute('data-cart-countdown') * 60,
                element = this.cartCountDown.querySelector('.time');

            this.cartCountDown.classList.add('is-running');
            this.startTimerCartCountdown(duration, element);
        }
    }

    startTimerCartCountdown(duration, element){
        var timer = duration, minutes, seconds, text;

        var startCoundown = setInterval(() => {
            minutes = parseInt(timer / 60, 10);
            seconds = parseInt(timer % 60, 10);

            minutes = minutes < 10 ? "0" + minutes : minutes;
            seconds = seconds < 10 ? "0" + seconds : seconds;
            text = minutes + ":" + seconds;

            element.innerText = text;

            if (--timer < 0) {
                clearInterval(startCoundown);
                this.cartCountDown.remove();
            }
        }, 1000);
    }
}

customElements.define('cart-items', CartItems);