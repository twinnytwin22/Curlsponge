class ProductTabs extends HTMLElement {
	constructor() {
		super();

        this.tab = this.querySelectorAll('.tab-title');
        this.tabContent = this.querySelectorAll('.tab-content');
        this.link = this.querySelectorAll('.toggleLink');
        this.readMore = this.querySelectorAll('[data-description-toogle]');

        for (var i = 0; i < this.tab.length; i++) {
            this.tab[i].addEventListener(
                'click',
                this.tabActive.bind(this)
            );
        }

        for (var i = 0; i < this.link.length; i++) {
            this.link[i].addEventListener(
                'click',
                this.tabToggle.bind(this)
            );
        }

        for (var i = 0; i < this.readMore.length; i++) {
            this.readMore[i].addEventListener(
                'click',
                this.readMoreReadLess.bind(this)
            );
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

    readMoreReadLess(event){
        event.preventDefault();
        event.stopPropagation();

        var $this = event.target,
            $parent = event.target.closest('.tab-descriptionShowmore'),
            id = $this.getAttribute('href').replace('#', ''),
            textShowMore = $this.getAttribute('data-show-more-text'),
            textShowLess = $this.getAttribute('data-show-less-text'),
            content = document.getElementById(`${id}`);

        if($this.classList.contains('is-less')) {
            $parent.classList.remove('full');
            $this.classList.remove('is-less');
            $this.classList.add('is-show');
            $this.innerText = textShowMore;
            content.style.maxHeight = '300px';
        } else {
            $this.classList.remove('is-show');
            $parent.classList.add('full');
            $this.classList.add('is-less');
            $this.innerText = textShowLess;
            content.style.maxHeight = 'unset';
        }
    }
}

customElements.define('product-tab', ProductTabs);