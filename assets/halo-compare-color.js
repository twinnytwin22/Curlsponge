class CompareColor extends HTMLElement {
	constructor() {
		super();

        this.imageList = this.querySelector('.halo-compareColors-image');
        this.textList = this.querySelector('.halo-compareColors-text');

        if(document.querySelector('[data-open-compare-color-popup]')){
            document.querySelector('[data-open-compare-color-popup]').addEventListener(
                'click',
                this.setOpenPopup.bind(this)
            );
        }

        if(document.querySelector('[data-close-compare-color-popup]')){
            document.querySelector('[data-close-compare-color-popup]').addEventListener(
                'click',
                this.setClosePopup.bind(this)
            );
        }

        this.debouncedOnChange = debounce((event) => {
            this.onChangeHandler(event);
        }, 0);

        this.querySelector('ul').addEventListener('input', this.debouncedOnChange.bind(this));

        document.querySelector('.background-overlay')?.addEventListener('click', this.onBackgroundClick.bind(this));
    }

    setOpenPopup(event){
        event.preventDefault();
        event.stopPropagation();

        document.body.classList.add('compare-color-show');
    }

    setClosePopup(){
        document.body.classList.remove('compare-color-show');
    }

    onChangeHandler(event){
        event.preventDefault();

        let input = event.target,
            id = event.target.value,
            label = event.target.nextElementSibling;

        if(input.checked){
            let title = label.getAttribute('title'),
                image = label.getAttribute('data-variant-img');

            const item = document.createElement('div');

            item.innerHTML = `<div class="item item-${id} item-compare-color">\
                                <span class="image"><img src="${image}" alt="${title}"></span>\
                                <span class="title text-center">${title}</span>\
                            </div>`;

            this.imageList.appendChild(item.firstElementChild.cloneNode(true));
        } else {
            if(this.imageList.querySelector(`.item-${id}`)){
                this.imageList.querySelector(`.item-${id}`).remove();
            }
        }

        if(this.imageList.querySelectorAll('.item').length > 0){
            this.textList.style.display = 'none';
        } else{
            this.textList.style.display = 'block';
        }
    }

    onBackgroundClick(event){
        this.setClosePopup();
    }
}

customElements.define('compare-color', CompareColor);