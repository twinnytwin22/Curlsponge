class CookieConsent extends HTMLElement {
	constructor() {
		super();  

        this.cookie = this;

		if (getCookie('cookie-consent') === ''){
            this.cookie.style.display = "block";

			if(this.cookie.classList.contains('full-width')){
                var cookieHeight = this.cookie.offsetHeight;

                if(cookieHeight > 0){
                    document.body.style.paddingBottom = cookieHeight + "px";
                }

                var w = window.innerWidth;

                window.addEventListener('resize', () => {
                    if (window.innerWidth == w) {
                        return
                    }

                    w = window.innerWidth;

                    var cookieHeight = this.cookie.offsetHeight;

                    if(cookieHeight > 0){
                        document.body.style.paddingBottom = cookieHeight + "px";
                    }
                });
            }
		} else {
            this.remove();
        }

		this.querySelector('[data-accept-cookie]').addEventListener(
            'click',
            this.setClosePopup.bind(this)
        );
	}

    setClosePopup(event, expiresDate = 1) {
        event.preventDefault();
        
        setCookie('cookie-consent', 'closed', expiresDate);
        this.cookie.remove();

        if(this.cookie.classList.contains('full-width')){
            document.body.style.paddingBottom = "0px";
        }
    }
}

customElements.define('cookie-consent', CookieConsent);