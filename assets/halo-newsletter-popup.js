class NewsletterPopup extends HTMLElement {
	constructor() {
		super();

		this.popup = this;
        this.timeToShow = this.popup.getAttribute('data-delay');
        this.expiresDate = parseInt(this.popup.getAttribute('data-expire'));

		if (getCookie('newsletter-popup') === ''){
            var popup = this.popup;

            setTimeout(function() {
                document.body.classList.add('newsletter-show');
            }, this.timeToShow);
		} else {
            if(!document.querySelector('[data-open-newsletter-popup]')){
                this.remove();
            }
        }

        document.body.addEventListener('click', this.onBodyClickEvent.bind(this));

        this.querySelector('[data-close-newsletter-popup]').addEventListener(
            'click',
            this.setClosePopup.bind(this)
        );

        if(document.querySelector('[data-open-newsletter-popup]')){
    		document.querySelectorAll('[data-open-newsletter-popup]').forEach((button) => {
                button.addEventListener('click', this.setOpenPopup.bind(this));
            });
        }

        this.querySelector('#ContactPopup').addEventListener(
            'submit',
            this.setClosePopup.bind(this)
        );
	}

    setOpenPopup(event) {
        event.preventDefault();
        
        document.body.classList.add('newsletter-show');
    }

    setClosePopup() {
        setCookie('newsletter-popup', 'closed', this.expiresDate);
        document.body.classList.remove('newsletter-show');
    }

    onBodyClickEvent(event){
        if(document.body.classList.contains('newsletter-show')){ 
            if ((!this.contains(event.target)) && (!(event.target).closest('[data-open-newsletter-popup]')) && (!(event.target).closest('[data-newsletter-popup]'))){
                this.setClosePopup();
            }
        }
    }
}

customElements.define('newsletter-popup', NewsletterPopup);