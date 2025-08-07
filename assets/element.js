class AdminPopupiframe extends HTMLElement {
    constructor() {
        super();

        this.button = this.querySelector('.admin-popup-btn');
        this.switch = this.querySelector('.switch-rtl');
        
        
        if(this.button) {
            this.hasLiveChatEvent();
            this.button.addEventListener('click', this.toggleEvent.bind(this));
        }

        if(this.switch) {
            this.input = this.switch.querySelector('input');
            this.firstEvent();
            this.input.addEventListener('change', this.rtlEvent.bind(this));
        }
    }

    toggleEvent(event) {
        event.preventDefault();
        event.stopPropagation();

        this.classList.toggle('is-active');
    }

    rtlEvent(event) {
        event.preventDefault();
        event.stopPropagation();

        if(document.querySelector('.halo-sidebar')) {
            document.querySelectorAll('.halo-sidebar').forEach((sidebar) => {
                sidebar.style.transition = 'transform 0s';
            });

            setTimeout(() => {
                document.querySelectorAll('.halo-sidebar').forEach((sidebar) => {
                    sidebar.style.transition = 'transform 0.3s';
                });
            }, 1000);
        }

        if(event.target.checked) {
            this.switch.classList.add('switch-rtl-checked');

            document.documentElement.setAttribute('dir', 'rtl');
            document.body.classList.add('rtl');

            setCookie('cookie-rtl', 'closed', 1);

            window.rtl_slick = true;

            $('.slick-slider').slick('slickSetOption', 'rtl', true);
            $('.slick-slider').slick('refresh');
        } else {
            this.switch.classList.remove('switch-rtl-checked');

            document.documentElement.removeAttribute('dir');
            document.body.classList.remove('rtl');

            deleteCookie('cookie-rtl');

            window.rtl_slick = false;

            $('.slick-slider').slick('slickSetOption', 'rtl', false);
            $('.slick-slider').slick('refresh');
        }
    }

    firstEvent() {
        if (getCookie('cookie-rtl') === 'closed'){
            this.input.checked = true;
            this.switch.classList.add('switch-rtl-checked');

            document.documentElement.setAttribute('dir', 'rtl');
            document.body.classList.add('rtl');

            if(document.querySelector('.halo-sidebar')) {
                document.querySelectorAll('.halo-sidebar').forEach((sidebar) => {
                    sidebar.style.transition = 'transform 0s';
                });

                setTimeout(() => {
                    document.querySelectorAll('.halo-sidebar').forEach((sidebar) => {
                        sidebar.style.transition = 'transform 0.3s';
                    });
                }, 500);
            }

            window.rtl_slick = true;

            $('.slick-slider').slick('slickSetOption', 'rtl', true);
            $('.slick-slider').slick('refresh');
        }
    }

    hasLiveChatEvent() {
        if (document.querySelector('.crisp-client')) {
            document.querySelector('.admin-popup-iframe').style.bottom = '8.5rem';
        }
    }
}

customElements.define('admin-popup-iframe', AdminPopupiframe);

class AddToCartPopup extends HTMLElement {
    constructor() {
        super();

        this.querySelector('[id^="PopupClose-"]').addEventListener('click', this.hide.bind(this, false));
        this.addEventListener('keyup', (event) => {
            if (event.code && event.code.toUpperCase() === 'ESCAPE') this.hide();
        });

        document.body.addEventListener('click', (event) => {
            if(this.hasAttribute('open') && !this.contains(event.target)) {
                this.hide();
            }
        });
    }

    show() {
        this.setAttribute('open', '');
    }

    hide() {
        this.removeAttribute('open');
    }

    update(cart) {
        let key = getCookie('added-item'),
            items = cart.items.filter(item => item.key === key),
            itemTitle = this.querySelector('.product-title .title'),
            itemImage = this.querySelector('.product-image');
        const image = `<img src="${cart.items[0].featured_image.url}" alt="${cart.items[0].featured_image.alt}" />`;
        const image_ratio = (1 / cart.items[0].featured_image.aspect_ratio) * 100;

        itemImage.setAttribute('href',cart.items[0].url);
        itemImage.style.setProperty('--image-ratio', `${image_ratio}%`);
        itemImage.innerHTML = image;
        itemTitle.setAttribute('href', cart.items[0].url);
        itemTitle.innerHTML = items[0].product_title;

        this.show();

        if(document.querySelector('[data-cart-count]')) {
            Shopify.getCart((cartTotal) => {
                document.querySelectorAll('[data-cart-count]').forEach((cartCounter) => {
                    cartCounter.innerText = cartTotal.item_count;
                });
            });
        }
    }
}

customElements.define('add-to-cart-popup', AddToCartPopup);

class AnnouncementBar extends HTMLElement {
    constructor() {
        super();

        this.button = this.querySelector('button');
        this.button.addEventListener('click', this.close.bind(this));
    }

    close(event) {
        event.preventDefault();
        event.stopPropagation();

        this.closest('.shopify-section').remove();
    }
}

customElements.define('announcement-bar', AnnouncementBar);

class ActiveTabs extends HTMLElement {
    constructor() {
        super();

        this.tabLink = this.querySelectorAll('[data-tabs-title]');
        this.tabContent = this.querySelectorAll('[data-tabs-content]');

        if(this.tabLink.length) {
            this.tabLink.forEach(tabLink => tabLink.addEventListener('click', this.tabEvent.bind(this)));
        }

        if(this.tabContent.length) {
            this.querySelectorAll('.card-header').forEach(tabList => tabList.addEventListener('click', this.listEvent.bind(this)));
        }
    }

    tabEvent(event) {
        event.preventDefault();
        event.stopPropagation();

        if(!event.currentTarget.classList.contains('active')) {
            let curTab = event.currentTarget,
                curTabContent = this.querySelector(curTab.getAttribute('data-target'));

            this.querySelector('.active[data-tabs-title]')?.classList.remove('active');
            this.querySelector('.active[data-tabs-content]')?.classList.remove('active');

            curTab.classList.add('active');
            curTabContent.classList.add('active');
        }
    }

    listEvent(event) {
        const btn = event.currentTarget;
        const content = btn.nextElementSibling;

        btn.parentElement.classList.toggle('is-open');

        btn.classList.toggle('collapsed');

        if (content.style.maxHeight){
            content.style.maxHeight = null;
        } else {
            content.style.maxHeight = content.scrollHeight + 'px';
        }
    }
}

customElements.define('active-tab', ActiveTabs);

class BeforeAfterSlider extends HTMLElement {
    constructor() {
        super();

        this.active = false;
        this.touch = undefined;
        this.button = this.querySelector('.before-after-slider__button');
        this.init();
    }

    init() {
        this.button.addEventListener('touchstart', this.startEvent.bind(this));
        document.body.addEventListener('touchend', this.endEvent.bind(this));
        document.body.addEventListener('touchmove', this.bindEvent.bind(this));
    
        this.button.addEventListener('mousedown', this.startEvent.bind(this));
        document.body.addEventListener('mouseup', this.endEvent.bind(this));
        document.body.addEventListener('mousemove', this.bindEvent.bind(this));
    }

    startEvent() {
        this.active = true;
        this.classList.add('is-scrolling');
    }

    endEvent() {
        this.active = false;
        this.classList.remove('is-scrolling');
    }

    bindEvent(event) {
        if (!this.active) return;

        if (event.type == 'touchmove') {
            this.touch = event.changedTouches[0];
        }
        let posX = event.pageX || this.touch.pageX;

        const min = 20;
        const box = this.getBoundingClientRect();
        const { left, width } = box;
        const delta = posX - left;

        let percent = (delta / width) * 100;
        let minPercent = (min / width) * 100;

        if (percent < minPercent)  percent = minPercent;
        if (percent > 100 - minPercent)  percent = 100 - minPercent;
        this.style.setProperty('--percent', `${percent}%`);
    }
}

customElements.define('before-after-slider', BeforeAfterSlider)

class BannerTab extends HTMLElement {
    constructor() {
        super();

        this.tabLinks = this.querySelectorAll('[data-banner-tab-title]');
        this.tabContents = this.querySelectorAll('[data-banner-tab-content]');

        if(this.tabLinks.length) {
            this.tabLinks.forEach(tabLink => tabLink.addEventListener('click', this.tabEvent.bind(this)));
        }
    }

    tabEvent(event) {
        event.preventDefault();
        event.stopPropagation();

        if(!event.currentTarget.classList.contains('active')) {
            let curTab = event.currentTarget,
                curTabContent = this.querySelector(curTab.getAttribute('data-banner-tab'));

            this.querySelector('.active[data-banner-tab-title]')?.classList.remove('active');
            this.querySelector('.active[data-banner-tab-content]')?.classList.remove('active');

            curTab.classList.add('active');
            curTabContent.classList.add('active');
        }
    }
}

customElements.define('banner-tab', BannerTab);

class CategoryDropdownList extends HTMLElement {
    constructor() {
        super();

        if(this.querySelector('.icon-dropdown')) {
            this.querySelectorAll('.icon-dropdown').forEach((toggle) =>{
                toggle.addEventListener('click', this.toggleEvent.bind(this));
            });
        }
    }

    toggleEvent(event) {
        event.preventDefault();
        event.stopPropagation();

        const _parent = event.currentTarget.parentNode;

        _parent.classList.toggle('is-clicked');
    }
}

customElements.define('category-dropdown-list', CategoryDropdownList);

class CartShippingMessage extends HTMLElement {
    constructor() {
        super();

        this.progress = this.querySelector('[data-shipping-progress]');
        this.message = this.querySelector('[data-shipping-message]');
        this.freeshipText1 = this.dataset.firstText;
        this.freeshipText2 = this.dataset.secondText;
        this.freeshipText3 = this.dataset.thirdText;
        this.price = parseInt(this.dataset.price);

        this.calculator();
    }

    calculator() {
        fetch('/cart.js')
            .then((response) => response.json())
            .then((cart) => {
                let freeshipText,
                    classLabel = 'none',
                    total = (cart.total_price/100).toFixed(2),
                    percent = ((total/this.price) * 100).toFixed(2);

                if(total == 0) {
                    freeshipText = this.freeshipText1.replace('{{ price }}', Shopify.formatMoney(this.price * 100, window.money_format));
                } else if (total >= this.price) {
                    freeshipText = this.freeshipText2;
                    classLabel = 'progress-free';
                    percent = 100;
                } else {
                    let extraPrice = (Math.abs(this.price - total)).toFixed(2);

                    if(percent <= 30) {
                        classLabel = 'progress-30';
                    } else if(percent <= 60) {
                        classLabel = 'progress-60';
                    } else if(percent <= 100) {
                        classLabel = 'progress-99';
                    }

                    freeshipText = this.freeshipText3.replace('{{ price }}', Shopify.formatMoney(extraPrice * 100, window.money_format));
                }

                this.progress.classList.add(classLabel);
                this.message.classList.add(classLabel);
                this.message.innerHTML = freeshipText;
                this.progress.querySelector('.progress-meter')?.style.setProperty('--percent', `${percent}%`);
                if(this.classList.contains('style-3') && this.progress.querySelector('.progress-meter')){
                    this.progress.querySelector('.progress-meter').innerHTML = `${percent}%`;
                }
            })
            .catch(console.error)
            .finally(() => {
                if (this.checkNeedToConvertCurrency()) {
                    let currencyCode = document.getElementById('currencies')?.querySelector('.active')?.getAttribute('data-currency');

                    Currency.convertAll(window.shop_currency, currencyCode, 'span.money', 'money_format');
                }
            });
    }

    checkNeedToConvertCurrency() {
        return (window.show_multiple_currencies && Currency.currentCurrency != window.shop_currency) || window.show_auto_currency;
    }
}

customElements.define('cart-shipping-message', CartShippingMessage);

class CollapseButton extends HTMLElement {
    constructor() {
        super();

        this.button = this.querySelector('[data-collapse-button]');
        this.dropdown = this.nextElementSibling;

        if(this.dropdown.classList.contains('is-expanded')){
            this.expandByDefault();
        }

        this.button.addEventListener('click', this.toggleEvent.bind(this));
    }

    expandByDefault() {
        if (this.dropdown.style.maxHeight){
            this.dropdown.style.maxHeight = null;
        } else {
            this.dropdown.style.maxHeight = this.dropdown.scrollHeight + 'px';
        }
    }

    toggleEvent(event) {
        event.preventDefault();
        event.stopPropagation();

        this.button.classList.toggle('is-clicked');
        this.dropdown.classList.toggle('is-expanded');
    
        if (this.dropdown.style.maxHeight){
            this.dropdown.style.maxHeight = null;
        } else {
            this.dropdown.style.maxHeight = this.dropdown.scrollHeight + 'px';
        }
    }
}

customElements.define('collapse-button', CollapseButton);

class CountDown extends HTMLElement {
    constructor() {
        super();

        this.countDownTime = this.dataset.countdown;
        this.countDownDate = new Date(this.countDownTime).getTime();
        this.countDownType = this.dataset.type;

        this.initCountdown(this.countDownDate, this.countDownType);
    }

    initCountdown(time, type) {
        var countdown = setInterval(() => {
            let now = new Date().getTime();
            let distance = time - now;

            if (distance < 0) {
                clearInterval(countdown);
                this.remove();
            } else {
                let day = Math.floor(distance / (1000 * 60 * 60 * 24)),
                    hour = Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)),
                    minute = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60)),
                    second = Math.floor((distance % (1000 * 60)) / 1000),
                    content;

                if(type == 'banner') {
                    content = `<span class="time-item"><span class="num">${day}</span><span class="text">${window.countdown.days}</span></span>\
                        <span class="time-item"><span class="num">${hour}</span><span class="text">${window.countdown.hours}</span></span>\
                        <span class="time-item"><span class="num">${minute}</span><span class="text">${window.countdown.mins}</span></span>\
                        <span class="time-item"><span class="num">${second}</span><span class="text">${window.countdown.secs}</span></span>`;

                    this.querySelector('.banner-countdown--countdown').innerHTML = content;
                    this.closest('.banner-countdown').classList.add('is-show');
                } else if (type == 'product-block') {
                    if(window.countdown.style == 1){
                        content = `<span class="text"><span>${window.countdown.text}</span></span>\
                            <span class="num days">${day}<span>${window.countdown.days}</span></span>\
                            <span class="num hours">${hour}<span>${window.countdown.hour}</span></span>\
                            <span class="num minutes">${minute}<span>${window.countdown.min}</span></span>\
                            <span class="num seconds">${second}<span>${window.countdown.sec}</span></span>`;
                    } else if(window.countdown.style == 2){
                        content = `<span class="text"><span>${window.countdown.text}</span></span>\
                            <span class="num days">${day}<span>${window.countdown.day}</span></span>\
                            <span class="num hours">${hour}</span>\
                            <span class="seperate">:</span>\
                            <span class="num minutes">${minute}</span>\
                            <span class="seperate">:</span>\
                            <span class="num seconds">${second}</span>`;
                    } else if(window.countdown.style == 3){
                        content = `<span class="text"><span>${window.countdown.text}</span></span>\
                            <span class="num days">${day}<span>${window.countdown.day}</span></span>\
                            <span class="seperate">:</span>\
                            <span class="num hours">${hour}</span>\
                            <span class="seperate">:</span>\
                            <span class="num minutes">${minute}</span>\
                            <span class="seperate">:</span>\
                            <span class="num seconds">${second}</span>`;
                    }

                    this.querySelector('.product-tabs-countdown--countdown').innerHTML = content;
                    this.closest('.product-tabs-countdown').classList.add('is-show');
                } else if (type == 'product'){
                    if(window.countdown.style == 1){
                        content = `<span class="text"><span>${window.countdown.text}</span></span>\
                            <span class="num days">${day}<span>${window.countdown.days}</span></span>\
                            <span class="num hours">${hour}<span>${window.countdown.hour}</span></span>\
                            <span class="num minutes">${minute}<span>${window.countdown.min}</span></span>\
                            <span class="num seconds">${second}<span>${window.countdown.sec}</span></span>`;
                    } else if(window.countdown.style == 2){
                        content = `<span class="text"><span>${window.countdown.text}</span></span>\
                            <span class="num days">${day}<span>${window.countdown.day}</span></span>\
                            <span class="num hours">${hour}</span>\
                            <span class="seperate">:</span>\
                            <span class="num minutes">${minute}</span>\
                            <span class="seperate">:</span>\
                            <span class="num seconds">${second}</span>`;
                    } else if(window.countdown.style == 3){
                        content = `<span class="text"><span>${window.countdown.text}</span></span>\
                            <span class="num days">${day}<span>${window.countdown.day}</span></span>\
                            <span class="seperate">:</span>\
                            <span class="num hours">${hour}</span>\
                            <span class="seperate">:</span>\
                            <span class="num minutes">${minute}</span>\
                            <span class="seperate">:</span>\
                            <span class="num seconds">${second}</span>`;
                    } else if(window.countdown.style == 4){
                        content = `<span class="time-item"><span class="num">${day}</span><span class="text">${window.countdown.days}</span></span>\
                            <span class="time-item"><span class="num">${hour}</span><span class="text">${window.countdown.hours}</span></span>\
                            <span class="time-item"><span class="num">${minute}</span><span class="text">${window.countdown.mins}</span></span>\
                            <span class="time-item"><span class="num">${second}</span><span class="text">${window.countdown.secs}</span></span>`;
                    }

                    this.querySelector('.countdown-coundtdown').innerHTML = content;
                    this.closest('.productView-countDown').classList.add('is-show');
                }
            }
        }, 1000);
    }
}

customElements.define('count-down', CountDown);

class CustomerViewing extends HTMLElement {
    constructor() {
        super();

        this.customerList = this.dataset.customer.toString().split(',');
        this.time = parseInt(this.dataset.time) * 1000;

        this.loadContent();
    }

    loadContent() {
        setInterval(() => {
            let index = Math.floor(Math.random() * this.customerList.length);

            this.querySelector('.text').innerText = window.customer_view.text.replace('[number]', this.customerList[index]);
        }, this.time);
    }
}

customElements.define('customer-viewing', CustomerViewing);

class CustomModal extends HTMLElement {
    constructor() {
        super();
        this.querySelector('[id^="ModalClose-"]').addEventListener('click', this.hide.bind(this, false));

        this.addEventListener('keyup', (event) => {
            if (event.code && event.code.toUpperCase() === 'ESCAPE') this.hide();
        });

        this.addEventListener('click', (event) => {
            if (event.target === this) this.hide();
        });
    }

    show(opener) {
        this.openedBy = opener;
        document.body.classList.add('overflow-hidden');
        this.setAttribute('open', '');
        trapFocus(this, this.querySelector('[role="dialog"]'));
        window.pauseAllMedia();
    }

    hide() {
        document.body.classList.remove('overflow-hidden');
        document.body.dispatchEvent(new CustomEvent('modalClosed'));
        removeTrapFocus(this.openedBy);
        this.removeAttribute('open');
        window.pauseAllMedia();
    }
}

customElements.define('custom-modal', CustomModal);

class CustomInformationModal extends CustomModal {
    constructor() {
        super();
    }

    connectedCallback() {
        if (this.moved) return;
        this.moved = true;
        document.body.appendChild(this);
    }
}

customElements.define('custom-information-modal', CustomInformationModal);

class CustomModalOpener extends HTMLElement {
    constructor() {
        super();
        const button = this.querySelector('button') || this.querySelector('[data-modal-opener]');
        button?.addEventListener('click', (event) => {
            event.preventDefault();

            const modal = document.querySelector(this.getAttribute('data-modal'));
            if (modal) modal.show(button);
        });
  }
}

customElements.define('custom-modal-opener', CustomModalOpener);

class DetailsDisclosure extends HTMLElement {
    constructor() {
        super();
        this.mainDetailsToggle = this.querySelector('details');
        this.content = this.mainDetailsToggle.querySelector('summary').nextElementSibling;

        this.mainDetailsToggle.addEventListener('focusout', this.onFocusOut.bind(this));
        this.mainDetailsToggle.addEventListener('toggle', this.onToggle.bind(this));
    }

    onToggle() {
        if (!this.animations) this.animations = this.content.getAnimations();

        if (this.mainDetailsToggle.hasAttribute('open')) {
            this.animations.forEach(animation => animation.play());
        } else {
            this.animations.forEach(animation => animation.cancel());
        }
    }

    onFocusOut() {
        setTimeout(() => {
            if (!this.contains(document.activeElement)) this.close();
        });
    }

    close() {
        this.mainDetailsToggle.removeAttribute('open');
        this.mainDetailsToggle.querySelector('summary').setAttribute('aria-expanded', false);
    }
}

customElements.define('details-disclosure', DetailsDisclosure);

class GlobalCheckbox extends HTMLElement {
    constructor() {
        super();

        this.input = this.querySelector('input');

        if(this.input) {
            this.input.addEventListener('change', this.toggleEvent.bind(this));
        }
    }

    toggleEvent(event) {
        let targetId = event.target.getAttribute('data-target');
        const targetDiv = document.querySelector(targetId);

        if(targetDiv) {
            if(event.target.checked){
                targetDiv.removeAttribute('disabled');
            } else{
                targetDiv.setAttribute('disabled', true);
            }
        }
    }
}

customElements.define('global-checkbox', GlobalCheckbox);

class LanguageCurrency extends HTMLElement {
    constructor() {
        super();

        this.toggle = this.querySelector('[data-language-currency-toggle]');
        this.dropdown = this.querySelector('[data-language-currency-dropdown]');

        this.toggle.addEventListener('click', this.toggleEvent.bind(this));
        document.body.addEventListener('click', this.onBodyClickEvent.bind(this));
    }

    toggleEvent(event) {
        event.preventDefault();
        event.stopPropagation();

        this.dropdown.classList.toggle('show');
    }

    onBodyClickEvent(event){
        if ((!this.toggle.contains(event.target)) && (!this.dropdown.contains(event.target))){
            this.dropdown.classList.remove('show');
        }
    }
}

customElements.define('language-currency', LanguageCurrency);

class LoadingBannerImage extends HTMLElement {
    constructor() {
        super();

        this.image = this.querySelector('img');

        if (this.image) {
            this.loading();

            const observer = new MutationObserver((changes) => {
                changes.forEach((change) => {
                    if (change.attributeName.includes('src') || change.attributeName.includes('srcset')) {
                        this.loading();
                    }
                });
            });

            observer.observe(this.image, {
                attributes: true
            });
        }
    }

    loading() {
        if (!this.image.complete) {
            this.parentNode.classList.add('loading');

            this.image.addEventListener('load', () => {
                this.parentNode.classList.remove('loading');
                this.parentNode.classList.add('loaded');

                setTimeout(() => {
                    this.parentNode.classList.add('completed');
                }, 1100);
            }, false);
        }
    }
}

customElements.define('loading-banner', LoadingBannerImage);

class LookbookPoint extends HTMLElement {
    constructor() {
        super();

        const icon = this.querySelector('.point-icon');
        if (!icon) return;
        document.body.addEventListener('click', this.onBodyEvent.bind(this));

        if(window.innerWidth > 1025) {
            icon.addEventListener('mouseover', () => {
                const popup = document.querySelector(this.getAttribute('data-popup'));
                if (popup) { 
                    popup.show(icon);
                    this.setAttribute('open', '');
                };
            });
        } else {
            icon.addEventListener('click', (event) => {
                event.preventDefault();
                event.stopPropagation();

                const popup = document.querySelector(this.getAttribute('data-popup'));
                if (popup) {
                    popup.show();
                    this.setAttribute('open', '');
                }
            });
        }
    }

    onBodyEvent(event){
        if (!this.contains(event.target)){
            this.removeAttribute('open');
        }
    }
}

customElements.define('lookbook-point', LookbookPoint);

class LookbookPopup extends HTMLElement {
    constructor() {
        super();

        this.wrapper = this.closest('.lookbook-box');
        this.point = document.querySelector(`[data-popup="#${this.getAttribute('id')}"`);
        document.body.addEventListener('click', this.onBodyEvent.bind(this));

        const resizeObserver = new ResizeObserver(entries => this.initPosition());
        resizeObserver.observe(document.body);
    }

    connectedCallback() {
        if (this.moved) return;
        this.moved = true;
        this.wrapper.appendChild(this);
    }

    onBodyEvent(event){
        if ((!this.contains(event.target)) && (!this.point.contains(event.target))){
            this.hide();
        }
    }

    initPosition() {
        if(this.hasAttribute('open')) {
            this.wrapperRect = this.wrapper.getBoundingClientRect();
            this.pointRect = this.point.getBoundingClientRect();

            let top = this.pointRect.top - this.wrapperRect.top;
            let left = this.pointRect.left - this.wrapperRect.left;
            let elementW = left + this.offsetWidth;
            let elementH = top + this.offsetHeight;

            this.style.setProperty(`--top`, `${top}px`);
            this.style.setProperty(`--left`, `${left}px`);

            if(elementW > this.wrapper.offsetWidth) {
                this.classList.add('position-right');
            } else {
                this.classList.remove('position-right');
            }

            if(elementH > this.wrapper.offsetHeight) {
                this.classList.add('position-bottom');
            } else {
                this.classList.remove('position-bottom');
            }
        }
    }

    show(opener) {
        this.setAttribute('open', '');
        this.initPosition();
    }

    hide() {
        this.removeAttribute('open');
    }
}

customElements.define('lookbook-popup', LookbookPopup);

class MobileSidebarButton extends HTMLElement {
    constructor() {
        super();

        this.addEventListener('click', this.open.bind(this));

        if(document.querySelector('[data-close-sidebar]')) {
            document.querySelectorAll('[data-close-sidebar]').forEach((closeButton) => {
                closeButton.addEventListener('click', this.close.bind(this));
            })
        }

        document.body.addEventListener('click', this.onBodyClickEvent.bind(this));
    }

    open(event) {
        event.preventDefault();
        event.stopPropagation();

        document.body.classList.add('open-mobile-sidebar');
    }

    close(event) {
        event.preventDefault();
        event.stopPropagation();

        document.body.classList.remove('open-mobile-sidebar');
    }

    onBodyClickEvent(event){
        if(document.querySelector('.page-sidebar')) {
            if ((!this.contains(event.target)) && (!document.querySelector('.page-sidebar').contains(event.target))){
                document.body.classList.remove('open-mobile-sidebar');
            }
        }
    }
}

customElements.define('mobile-sidebar-button', MobileSidebarButton);

class MoreLessButton extends HTMLElement {
    constructor() {
        super();

        this.textShowMore = this.getAttribute('data-show-more-text');
        this.textShowLess = this.getAttribute('data-show-less-text');
        this.target = this.getAttribute('data-target');
        this.targetDiv = document.querySelector(this.target);

        this.addEventListener('click', this.toggleEvent.bind(this));
    }

    toggleEvent(event) {
        event.preventDefault();
        event.stopPropagation();

        if(this.targetDiv) {
            if(this.classList.contains('is-less')) {
                this.parentElement.classList.remove('full');
                this.classList.remove('is-less');
                this.classList.add('is-show');
                this.innerText = this.textShowMore;
                this.targetDiv.style.maxHeight = '300px';
            } else {
                this.parentElement.classList.add('full');
                this.classList.remove('is-show');
                this.classList.add('is-less');
                this.innerText = this.textShowLess;
                this.targetDiv.style.maxHeight = 'unset';
            }
        }
    }
}

customElements.define('more-less-button', MoreLessButton);

class MoreLessContent extends HTMLElement {
    constructor() {
        super();

        this.textShowMore = this.getAttribute('data-show-more-text');
        this.textShowLess = this.getAttribute('data-show-less-text');
        this.toggle = this.querySelector('button');

        this.toggle?.addEventListener('click', this.toggleEvent.bind(this));
    }

    toggleEvent(event) {
        event.preventDefault();
        event.stopPropagation();

        if(this.toggle.classList.contains('less')){
            this.toggle.classList.remove('less');
            this.toggle.classList.add('more');
            this.toggle.querySelector('.text').innerText = this.textShowMore;
            this.classList.remove('show-full');
        } else {
            this.toggle.classList.remove('more');
            this.toggle.classList.add('less');
            this.toggle.querySelector('.text').innerText = this.textShowLess;
            this.classList.add('show-full');
        }
    }
}

customElements.define('more-less-content', MoreLessContent);

class ProductRating extends HTMLElement {
    constructor() {
        super();

        this.button = this.querySelector('.spr-badge');
        this.target = this.getAttribute('data-target');
        this.targetDiv = document.querySelector(this.target);

        if(this.button && this.targetDiv) {
            this.button.addEventListener('click', this.scrollTo.bind(this));
        }
    }

    scrollTo(event) {
        event.preventDefault();
        event.stopPropagation();

        this.targetDiv.scrollIntoView({behavior: "smooth", block: "start", inline: "nearest"});
    }
}

customElements.define('product-rating', ProductRating);

class PreloadScreen extends HTMLElement {
    constructor() {
    super();
        document.addEventListener('page:loaded', () => {
            setTimeout(() => {
            this.setAttribute('loaded', true);
            }, 300);
        });
    }
}

customElements.define('preload-screen', PreloadScreen);

class QuickCartItems extends HTMLElement {
    constructor() {
        super();

        this.modal = this.closest('custom-modal');
    }

    itemSlider() {
        if(this.querySelector('[data-product-item-cart]')) {
            this.querySelectorAll('[data-product-item-cart]').forEach((element) =>{
                let productGrid = $(element).find('.products-carousel'),
                    itemToShow = productGrid.data('item-to-show'),
                    itemDots = productGrid.data('item-dots'),
                    itemArrows = productGrid.data('item-arrows');

                if(productGrid.length > 0){
                    if(!productGrid.hasClass('slick-initialized')){
                        productGrid.on('init', (event, slick) => {
                            var productFrist = productGrid.find('.product:eq(0)'),
                                contentHeight = productFrist.find('.product-bottom').outerHeight(),
                                boxHeight = productGrid.outerHeight(),
                                pos = (boxHeight - contentHeight)/2;

                            if((window.innerWith > 1025) && (itemArrows == true)){
                                slick.$nextArrow[0].style.top = pos;
                                slick.$prevArrow[0].style.top = pos;
                            }
                        });

                        productGrid.slick({
                            mobileFirst: true,
                            adaptiveHeight: false,
                            infinite: false,
                            vertical: false,
                            slidesToShow: 1,
                            slidesToScroll: 1,
                            dots: true,
                            arrows: false,
                            rtl: window.rtl_slick,
                            nextArrow: '<button type="button" class="slick-arrow slick-arrow--circle slick-next" aria-label="'+ window.accessibility.next_slide +'">' + window.slick.nextArrow + '</button>',
                            prevArrow: '<button type="button" class="slick-arrow slick-arrow--circle slick-prev" aria-label="'+ window.accessibility.previous_slide +'">' + window.slick.prevArrow + '</button>',
                            responsive: [
                            {
                                breakpoint: 1600,
                                settings: {
                                    dots: itemDots,
                                    arrows: itemArrows,
                                    get slidesToShow() {
                                        if(itemToShow !== undefined && itemToShow !== null && itemToShow !== ''){
                                            return itemToShow;
                                        } else {
                                            return 1;
                                        }
                                    }
                                }
                            },
                            {
                                breakpoint: 1400,
                                settings: {
                                    dots: itemDots,
                                    arrows: itemArrows,
                                    get slidesToShow() {
                                        if(itemToShow !== undefined && itemToShow !== null && itemToShow !== ''){
                                            if(itemToShow == 5){
                                                return itemToShow - 1;
                                            } else {
                                                return itemToShow;
                                            }
                                        } else {
                                            return 1;
                                        }
                                    }
                                }
                            },
                            {
                                breakpoint: 1025,
                                settings: {
                                    dots: itemDots,
                                    arrows: itemArrows,
                                    get slidesToShow() {
                                        if(itemToShow !== undefined && itemToShow !== null && itemToShow !== ''){
                                            if(itemToShow == 5){
                                                return itemToShow - 2;
                                            } else if (itemToShow == 4) {
                                                return itemToShow - 1;
                                            } else {
                                                return itemToShow;
                                            }
                                        } else {
                                            return 1;
                                        }
                                    }
                                }
                            },
                            {
                                breakpoint: 992,
                                settings: {
                                    slidesToShow: 2
                                }
                            }]
                        });

                        productGrid.on('afterChange', (event, slick) => {
                            var productFrist = productGrid.find('.product:eq(0)'),
                                contentHeight = productFrist.find('.product-bottom').outerHeight(),
                                boxHeight = productGrid.outerHeight(),
                                pos = (boxHeight - contentHeight)/2;

                            if((window.innerWidth > 1025) && (itemArrows == true)){
                                slick.$nextArrow[0].style.top = pos;
                                slick.$prevArrow[0].style.top = pos;
                            }
                        });
                    }
                }
            });
        }
    }

    collectionSlider () {
        if(this.querySelector('[data-product-collection-cart]')) {
            this.querySelectorAll('[data-product-collection-cart]').forEach((element) =>{
                var self = $(element),
                    productGrid = self.find('.products-carousel'),
                    itemDots = productGrid.data('item-dots'),
                    itemArrows = productGrid.data('item-arrows');

                if(productGrid.length > 0){
                    if(!productGrid.hasClass('slick-initialized')){
                        productGrid.slick({
                            mobileFirst: true,
                            adaptiveHeight: false,
                            infinite: false,
                            vertical: false,
                            slidesToShow: 1,
                            slidesToScroll: 1,
                            dots: true,
                            arrows: false,
                            rtl: window.rtl_slick,
                            nextArrow: '<button type="button" class="slick-arrow slick-arrow--circle slick-next" aria-label="'+ window.accessibility.next_slide +'">' + window.slick.nextArrow + '</button>',
                            prevArrow: '<button type="button" class="slick-arrow slick-arrow--circle slick-prev" aria-label="'+ window.accessibility.previous_slide +'">' + window.slick.prevArrow + '</button>',
                            responsive: [
                            {
                                breakpoint: 1025,
                                settings: {
                                    dots: itemDots,
                                    arrows: itemArrows
                                }
                            }]
                        });
                    }
                }
            });
        }
    }

    update(cart) {
        const loadingClass = 'has-halo-block-loader';

        this.classList.add(loadingClass);

        fetch(`${window.routes.cart}?view=${this.dataset.view}`)
            .then((response) => response.text())
            .then((responseText) => {
                const html = new DOMParser().parseFromString(responseText, 'text/html');

                this.getElementToRender().forEach((section) => {
                    const destination = this.querySelector(section.selector);
                    const source = html.querySelector(section.selector);
                    
                    if (source && destination) {
                        destination.innerHTML = source.innerHTML;
                    }
                });
            })
            .catch((e) => {
                console.error(e);
            })
            .finally(() => {
                this.itemSlider();
                this.collectionSlider();
                this.classList.remove(loadingClass);
                if (this.modal) this.modal.show();

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
            id: `Cart-Content`,
            selector: `#Cart-Content-${this.dataset.section}`
        },
        {
            id: `Cart-Item`,
            selector: `#Cart-Item-${this.dataset.section}`
        },
        {
            id: `Cart-Total`,
            selector: `#Cart-Total-${this.dataset.section}`
        }];
    }

    checkNeedToConvertCurrency() {
        return (window.show_multiple_currencies && Currency.currentCurrency != window.shop_currency) || window.show_auto_currency;
    }
}

customElements.define('quick-cart-items', QuickCartItems);

class QuickUpsellCartItems extends QuickCartItems {
    constructor() {
        super();
    }
}

customElements.define('quick-upsell-cart-items', QuickUpsellCartItems);

class ShareButton extends DetailsDisclosure {
    constructor() {
        super();

        this.elements = {
            shareButton: this.querySelector('button'),
            shareSummary: this.querySelector('summary'),
            closeButton: this.querySelector('.share-button__close'),
            successMessage: this.querySelector('[id^="ShareMessage"]'),
            urlInput: this.querySelector('input')
        }

        this.urlToShare = this.elements.urlInput ? this.elements.urlInput.value : document.location.href;

        if (navigator.share) {
            this.mainDetailsToggle.setAttribute('hidden', '');
            this.elements.shareButton.classList.remove('hidden');
            this.elements.shareButton.addEventListener('click', () => { navigator.share({ url: document.location.href, title: document.title }) });
        } else {
            this.mainDetailsToggle.addEventListener('toggle', this.toggleDetails.bind(this));
            this.mainDetailsToggle.querySelector('.share-button__copy').addEventListener('click', this.copyToClipboard.bind(this));
            this.mainDetailsToggle.querySelector('.share-button__close').addEventListener('click', this.close.bind(this));
        }
    }

    toggleDetails() {
        if (!this.mainDetailsToggle.open) {
            this.elements.successMessage.classList.add('hidden');
            this.elements.successMessage.textContent = '';
            this.elements.closeButton.classList.add('hidden');
            this.elements.shareSummary.focus();
        }
    }

    copyToClipboard() {
        navigator.clipboard.writeText(this.elements.urlInput.value).then(() => {
            this.elements.successMessage.classList.remove('hidden');
            this.elements.successMessage.textContent = window.accessibilityStrings.shareSuccess;
            this.elements.closeButton.classList.remove('hidden');
            this.elements.closeButton.focus();
        });
    }

    updateUrl(url) {
        this.urlToShare = url;
        this.elements.urlInput.value = url;
    }
}

customElements.define('share-button', ShareButton);

class SplitSilder extends HTMLElement {
    constructor() {
        super();

        this.items = this.querySelectorAll('.item');

        if(this.items.length > 0) {
            this.items.forEach((item) => {
                item.addEventListener('mouseover', this.activeItem.bind(this));
                item.addEventListener('touchstart', this.activeItem.bind(this));
            });
        }
    }

    activeItem(event) {
        const _target = event.currentTarget;
        const _targetActive = this.querySelector('.item-active');

        if(!_target.classList.contains('item-active')) {
            if(_targetActive) _targetActive.classList.remove('item-active');
            _target.classList.add('item-active');
        }
    }
}

customElements.define('split-slider', SplitSilder);

class SoldInLastProduct extends HTMLElement {
    constructor() {
        super();

        this.quantityList = this.dataset.item.toString().split(',');
        this.timeList = this.dataset.hours.toString().split(',');
        this.quantityIndex = Math.floor(Math.random() * this.quantityList.length);
        this.timeIndex = Math.floor(Math.random() * this.timeList.length);

        if((this.dataset.item === '') || (this.dataset.hours === '')) this.remove();
        this.loadContent();
    }

    loadContent() {
        this.querySelector('[data-sold-out-number]').innerText = this.quantityList[this.quantityIndex];
        this.querySelector('[data-sold-out-hours]').innerText = this.timeList[this.timeIndex];
    }
}

customElements.define('sold-in-last-product', SoldInLastProduct);

class SideDrawer extends HTMLElement {
    constructor() {
        super();

        this.addEventListener('keyup', (evt) => evt.code === 'Escape' && this.close());
        this.querySelector('[id^="Drawer-Overlay-"]')?.addEventListener('click', this.close.bind(this));
    }

    connectedCallback() {
    if (this.moved) return;
        this.moved = true;
        if(!this.dataset.moved) document.body.appendChild(this);
    }

    open(triggeredBy) {
        if (triggeredBy) this.setActiveElement(triggeredBy);
        setTimeout(() => {this.classList.add('active')});
        document.body.classList.add('open-drawer');
    }

    close() {
        this.classList.remove('active');
        removeTrapFocus(this.activeElement);
        document.body.classList.remove('open-drawer');
    }

    setActiveElement(element) {
        this.activeElement = element;
    }
}

customElements.define('side-drawer', SideDrawer);

class SideDrawerOpener extends HTMLElement {
    constructor() {
        super();

        const button = this.querySelector('button');

        if (!button) return;
        button.addEventListener('click', () => {
            const drawer = document.querySelector(this.getAttribute('data-side-drawer'));
            if (drawer) drawer.open(button);
        });
    }
}

customElements.define('side-drawer-opener', SideDrawerOpener);

class ToggleButton extends HTMLElement {
    constructor() {
        super();

        this.target = this.getAttribute('data-target');
        this.targetDiv = document.querySelector(this.target);

        this.addEventListener('click', this.toggleEvent.bind(this));
        document.body.addEventListener('click', this.onBodyClickEvent.bind(this));
    }

    toggleEvent(event) {
        event.preventDefault();
        event.stopPropagation();

        if(this.targetDiv) {
            this.targetDiv.classList.add('active');
        }
    }

    onBodyClickEvent(event){
        if ((!this.targetDiv.contains(event.target)) && (!this.contains(event.target)) &&(this.targetDiv.classList.contains('active'))){
            this.targetDiv.classList.remove('active');
        }
    }
}

customElements.define('toggle-button', ToggleButton);

class ToggleMobileColumn extends HTMLElement {
    constructor() {
        super();

        this.toggle = this.querySelectorAll('[data-toggle-column]');

        if(this.toggle.length && checkViewport(551)) {
            this.toggle.forEach((toggle) => {
                toggle.addEventListener('click', this.toggleEvent.bind(this));
            })
        }
    }

    toggleEvent(event) {
        event.preventDefault();
        event.stopPropagation();

        const curTab = event.currentTarget;
        const content = curTab.nextElementSibling;

        curTab.classList.toggle('is-clicked');

        if (content.style.maxHeight){
            content.style.maxHeight = null;
        } else {
            content.style.maxHeight = content.scrollHeight + 'px';
        }
    }
}

customElements.define('toggle-mobile-column', ToggleMobileColumn);
