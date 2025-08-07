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

        var $item = event.currentTarget.closest('.item'),
            $popup = document.getElementById('halo-global-custom-information-popup'),
            $popupContent = $popup.querySelector('.halo-popup-content'),
            $popupTitle =  $popup.querySelector('.halo-popup-title'),
            title = $item.querySelector('.title')?.innerHTML,
            content = $item.querySelector('.desc_popup')?.innerHTML;

        $popupTitle.innerHTML = title;
        $popupContent.innerHTML = content;

        document.body.classList.add('custom-info-show');
    }

    setClosePopup() {
        document.body.classList.remove('custom-info-show');
    }

    onBodyClickEvent(event){
        if (($(event.target).closest('#halo-global-custom-information-popup').length === 0) && ($(event.target).closest('[data-custom-information]').length === 0) && document.querySelector('body').classList.contains('custom-info-show')){
            this.setClosePopup();
        }
    }
}

customElements.define('product-custom-info', ProductCustomInfo);