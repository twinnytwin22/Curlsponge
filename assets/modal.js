class ModalDialog extends HTMLElement {
    constructor() {
        super();

        this.querySelector('[id^="ModalClose-"]').addEventListener('click', this.hide.bind(this));

        this.addEventListener('keyup', () => {
            if(event.code.toUpperCase() === 'ESCAPE') this.hide();
        });

        if (this.classList.contains('product-media-modal')) {
            this.addEventListener('pointerup', (event) => {
                if (event.pointerType === 'mouse' && !event.target.closest('deferred-media, product-model')) this.hide();
            });
        } else {
            this.addEventListener('click', (event) => {
                if (event.target.nodeName === 'MODAL-DIALOG') this.hide();
            });
        }
    }

    show(opener) {
        this.openedBy = opener;

        document.body.classList.add('overflow-hidden');
        this.setAttribute('open', '');
        trapFocus(this);
    }

    hide() {
        document.body.classList.remove('overflow-hidden');
        this.removeAttribute('open');
        removeTrapFocus(this.openedBy);
    }
}

customElements.define('modal-dialog', ModalDialog);

class ModalOpener extends HTMLElement {
    constructor() {
        super();

        const button = this.querySelector('button');
        
        button?.addEventListener('click', () => {
            document.querySelector(this.getAttribute('data-modal'))?.show(button);
        });
    }
}

customElements.define('modal-opener', ModalOpener);

class ProductModal extends ModalDialog {
    constructor() {
        super();
    }

    hide() {
        super.hide();
    }

    show(opener) {
        super.show(opener);
        this.showActiveMedia();
    }

    showActiveMedia() {
        this.querySelectorAll(`[data-media-id]:not([data-media-id="${this.openedBy.getAttribute("data-media-id")}"])`).forEach((element) => {
            element.classList.remove('active');
        })

        const activeMedia = this.querySelector(`[data-media-id="${this.openedBy.getAttribute("data-media-id")}"]`);
        const activeMediaTemplate = activeMedia.querySelector('template');
        const activeMediaContent = activeMediaTemplate ? activeMediaTemplate.content : null;
        
        activeMedia.classList.add('active');
        activeMedia.scrollIntoView();

        const container = this.querySelector('[role="document"]');
        container.scrollLeft = (activeMedia.width - container.clientWidth) / 2;

        if (activeMedia.nodeName == 'DEFERRED-MEDIA' && activeMediaContent && activeMediaContent.querySelector('.js-youtube')) {
            activeMedia.loadContent();
        }
    }
}

customElements.define('product-modal', ProductModal);