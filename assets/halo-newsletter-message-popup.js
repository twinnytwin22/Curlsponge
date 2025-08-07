class NewsletterMessagePopup extends HTMLElement {
    constructor() {
        super();

        this.querySelector('[data-close-newsletter-message-popup]').addEventListener(
            'click',
            this.close.bind(this)
        );

        document.body.addEventListener('click', this.onBodyClickEvent.bind(this));
    }

    close(){
        document.body.classList.remove('newsletter-message-show');
    }

    onBodyClickEvent(event){
        if(document.body.classList.contains('newsletter-message-show')){
            if (!this.contains(event.target)){
                this.close();
            }
        }
    }
}

customElements.define('newsletter-message-popup', NewsletterMessagePopup);