class StickyAddToCart extends HTMLElement {
	constructor() {
		super();
		this.anchor = document.getElementById('product-add-to-cart') || this.closest('.productView');
        this.mark = document.querySelector('footer');
        this.inner = this.querySelector('.sticky-inner');
		this.toogle = this.querySelector('[data-toogle-content-sticky]');
        this.toogle?.addEventListener('click', this.toggleEvent.bind(this));
	}

	connectedCallback(){
		this.onScrollHandler = this.onScroll.bind(this);
        window.addEventListener('scroll', this.onScrollHandler, false);
	}

	disconnectedCallback() {
        window.removeEventListener('scroll', this.onScrollHandler);
    }

    onScroll() {
        let observer = new IntersectionObserver((entries, observer) => { 
            entries.forEach(entry => {
                if(entry.isIntersecting){
                    if(entry.boundingClientRect.top < 0) {
                        requestAnimationFrame(this.hide.bind(this));
                    }
                    
                    entry.target.src = entry.target.dataset.src;
                    observer.unobserve(entry.target);
                } else {
                    if (this.anchor && this.check(this.anchor, 100)) {
                        requestAnimationFrame(this.show.bind(this));

                        if(window.innerWidth > 550) {
                            if(document.body.classList.contains('scroll-up')){
                                let height = document.querySelector('.header-group').offsetHeight;

                                this.style.top = `${height}px`;
                            } else if(document.body.classList.contains('scroll-down')) {
                                this.style.top = 0;
                            }
                        } else {
                            if(document.querySelector('#Toolbar-halo-toolbar-mobile')) {
                                let height = document.querySelector('#Toolbar-halo-toolbar-mobile').offsetHeight;

                                this.style.bottom = `${height}px`;
                            }
                        }
                    } else{
                        requestAnimationFrame(this.hide.bind(this));
                    }
                }
            });
        }, {
            threshold: [0, 1]
        });

        observer.observe(this.mark);
    }

    check(element, threshold) {
        let rect = element.getBoundingClientRect().y;
        threshold = threshold ? threshold : 0;

        return rect + threshold < 0
    }

    hide() {
    	this.classList.remove('show-sticky', 'full-sticky', 'animate');

        if (this.inner.style.maxHeight) this.inner.style.maxHeight = null;
    }

    show() {
        this.classList.add('show-sticky', 'animate');
    }

    toggleEvent(event){
    	event.preventDefault();
        event.stopPropagation();

        if (this.inner.style.maxHeight){
            this.inner.style.maxHeight = null;
        } else {
            this.inner.style.maxHeight = `${this.inner.scrollHeight}px`;
        }

    	this.classList.toggle('full-sticky');
    }
}

customElements.define('sticky-add-to-cart', StickyAddToCart);