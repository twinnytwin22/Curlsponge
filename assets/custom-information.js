class ProductCustomInfo extends HTMLElement {
	constructor() {
		super();

        if(this.querySelector('[data-custom-information]')){
            this.querySelectorAll('[data-custom-information]').forEach((button) => {
                button.addEventListener('click', this.setOpenPopup.bind(this));
            });
        }

        if(document.querySelector('[data-close-custom-information]')){
            document.querySelector('[data-close-custom-information]').addEventListener(
                'click',
                this.setClosePopup.bind(this)
            );
        }

        document.body.addEventListener('click', this.onBodyClickEvent.bind(this));
	}

    setOpenPopup(event) {
        event.preventDefault();

        if(!document.getElementById('halo-global-custom-information-popup')) return;

        let item = event.currentTarget.closest('.item'),
            popup = document.getElementById('halo-global-custom-information-popup'),
            popupContent = popup.querySelector('.halo-popup-content'),
            popupTitle = popup.querySelector('.halo-popup-title'),
            title = item.querySelector('.title')?.innerHTML,
            content = item.querySelector('.popup-desc')?.innerHTML;

        popupTitle.innerHTML = title;
        popupContent.innerHTML = content;

        document.body.classList.add('custom-info-show');
    }

    setClosePopup() {
        document.body.classList.remove('custom-info-show');
    }

    onBodyClickEvent(event){
        if(document.body.classList.contains('custom-info-show')){
            if ((!document.querySelector('#halo-global-custom-information-popup').contains(event.target)) && (!(event.target).closest('[data-custom-information]'))){
                this.setClosePopup();
            }
        }
    }
}

customElements.define('product-custom-info', ProductCustomInfo);