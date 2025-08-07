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