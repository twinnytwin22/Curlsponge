class SomeonePurchase extends HTMLElement {
	constructor() {
		super();

		this.popup = this;
        
        if (this.popup.getElementsByClassName('data-product').length == 0) return;

		this.time = this.popup.getAttribute('data-notification-time');
		this.timeText = this.popup.querySelector('[data-time-text]').textContent;

		this.timeText = this.timeText.replace(/(\r\n|\n|\r)/gm, '');

		if (getCookie('notification-popup') === ''){
			var initSomeonePurchasePopup = this.initSomeonePurchasePopup,
				popup = this.popup,
				timeText = this.timeText;

			var timer = setInterval(function() {
				if(popup.innerHTML.length > 0){
                	initSomeonePurchasePopup(popup, timeText);
				}
            }, this.time);
		} else {
			this.remove();
		}

		this.querySelector('[data-close-notification-popup]').addEventListener(
            'click',
            this.setClosePopup.bind(this)
        );

      	if(window.innerWidth < 1025){
            var elementToolbarMb = document.getElementsByClassName('halo-toolbar-mobile');

            if(!elementToolbarMb.length == 0){
                var height = elementToolbarMb[0].offsetHeight;

                if(window.innerWidth < 551){
                    this.style.bottom = height  + 'px';
                } else {
				    this.style.bottom = height + 15 + 'px';
                }

                document.body.style.paddingBottom = height  + 'px';
            }
        }
	}

    setClosePopup(expiresDate = 1) {
        setCookie('notification-popup', 'closed', expiresDate);

        this.popup.classList.remove('is-active');
        this.popup.remove();
    }

    initSomeonePurchasePopup(popup, text){
    	if(popup.classList.contains('is-active')){
    		popup.classList.remove('is-active');
    	} else {
    		var product = popup.getElementsByClassName('data-product'),
    			popupImage = popup.getElementsByClassName('product-image'),
    			popupName = popup.getElementsByClassName('product-name'),
    			productLength= product.length,
                i = Math.floor(Math.random() * productLength),
                productItem = product[i],
                image = productItem.getAttribute('data-image'),
                title = productItem.getAttribute('data-title'),
                url = productItem.getAttribute('data-url'),
                local =  productItem.getAttribute('data-local'),
                time = productItem.getAttribute('data-time');

            popup.classList.add('is-active');

            popupImage[0].setAttribute('href', url);
            popupImage[0].textContent = '';
            const imgEl = document.createElement('img');
            imgEl.src = image;
            imgEl.alt = title;
            imgEl.title = title;
            popupImage[0].appendChild(imgEl);

            const svgEl = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
            svgEl.setAttribute('aria-hidden', 'true');
            svgEl.setAttribute('focusable', 'false');
            svgEl.setAttribute('data-prefix', 'fal');
            svgEl.setAttribute('data-icon', 'external-link');
            svgEl.setAttribute('role', 'img');
            svgEl.setAttribute('viewBox', '0 0 512 512');
            svgEl.setAttribute('class', 'svg-inline--fa fa-external-link fa-w-16 fa-3x');
            const pathEl = document.createElementNS('http://www.w3.org/2000/svg', 'path');
            pathEl.setAttribute('d', 'M440,256H424a8,8,0,0,0-8,8V464a16,16,0,0,1-16,16H48a16,16,0,0,1-16-16V112A16,16,0,0,1,48,96H248a8,8,0,0,0,8-8V72a8,8,0,0,0-8-8H48A48,48,0,0,0,0,112V464a48,48,0,0,0,48,48H400a48,48,0,0,0,48-48V264A8,8,0,0,0,440,256ZM500,0,364,.34a12,12,0,0,0-12,12v10a12,12,0,0,0,12,12L454,34l.7.71L131.51,357.86a12,12,0,0,0,0,17l5.66,5.66a12,12,0,0,0,17,0L477.29,57.34l.71.7-.34,90a12,12,0,0,0,12,12h10a12,12,0,0,0,12-12L512,12A12,12,0,0,0,500,0Z');
            svgEl.appendChild(pathEl);
            popupImage[0].appendChild(svgEl);

            popupName[0].setAttribute('href', url);
            popupName[0].textContent = '';
            const nameSpan = document.createElement('span');
            nameSpan.className = 'text';
            nameSpan.textContent = title;
            popupName[0].appendChild(nameSpan);

            popup.querySelector('[data-time-text]').innerText = text.replace('[time]', time).replace('[location]', local);
    	}
    }
}

customElements.define('notification-popup', SomeonePurchase);