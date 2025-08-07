class ProductTabs extends HTMLElement {
	constructor() {
		super();

        this.tab = this.querySelectorAll('.tab-title');
        this.tabContent = this.querySelectorAll('.tab-content');
        this.link = this.querySelectorAll('.toggleLink');

        if (this.querySelector('.tabs-horizontal')) {
            this.tab[0].classList.add('is-open');
            this.tabContent[0].classList.add('is-active');
        }

        if(this.tab.length > 0) {
            this.tab.forEach((tab) => {
                tab.addEventListener('click', this.tabActive.bind(this));
            });
        }

        if(this.link.length > 0) {
            this.link.forEach((link) => {
                link.addEventListener('click', this.tabToggle.bind(this));
            });
        }
	}

    tabActive(event){
        event.preventDefault();
        event.stopPropagation();

        var $this = event.target,
            id = $this.getAttribute('href').replace('#', '');

        if(!$this.classList.contains('is-open')) {
            this.tab.forEach((element, index) => {
                element.classList.remove('is-open');
            });

            $this.classList.add('is-open');

            this.tabContent.forEach((element, index) => {
                if(element.getAttribute('id') == id){
                    element.classList.add('is-active');
                } else {
                    element.classList.remove('is-active');
                }
            });
        }
    }

    tabToggle(event){
        event.preventDefault();
        event.stopPropagation();

        var $this = event.target,
            $content = $this.parentNode.nextElementSibling;
        if($this.classList.contains('is-open')){
            $this.classList.remove('is-open');
            $($content).slideUp('slow');
        } else {
            $this.classList.add('is-open');
            $($content).slideDown('slow');
        }
    }
}

customElements.define('product-tab', ProductTabs);