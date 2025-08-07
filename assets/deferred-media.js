class DeferredMedia extends HTMLElement {
    constructor() {
        super();
        this.querySelector('[id^="Deferred-Poster-"]')?.addEventListener('click', this.loadContent.bind(this));
    }

    loadContent(focus = true) {
        window.pauseAllMedia();
        if (!this.getAttribute('loaded')) {
            const content = document.createElement('div');
            content.appendChild(this.querySelector('template').content.firstElementChild.cloneNode(true));

            this.setAttribute('loaded', true);
            const deferredElement = this.appendChild(content.querySelector('video, model-viewer, iframe'));
            if (focus) deferredElement.focus();
            if (deferredElement.nodeName == 'VIDEO' && deferredElement.getAttribute('autoplay')) {
                // force autoplay for safari
                deferredElement.play();
            }
        }
    }
}

customElements.define('deferred-media', DeferredMedia);
// if (!customElements.get('deferred-media')) {
// }