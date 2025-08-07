class AZTable extends HTMLElement {
    constructor() {
        super();

        this.azTable = document.getElementById('haloAZTable');
        this.azWrapper = document.getElementById('haloAZWrapper');
        this.mapPopup = document.getElementById('halo-map-popup');

        if(!this.azTable || !this.azWrapper) return;

        if(this.azTable.querySelector('a')){
	        this.azTable.querySelectorAll('a').forEach((azButton) => {
	        	azButton.addEventListener('click', this.onClickHandler.bind(this));
	        });
	    }

	    if(this.azWrapper.querySelector('[data-open-map-popup]')){
	        this.azWrapper.querySelectorAll('[data-open-map-popup]').forEach((mapButton) => {
	        	mapButton.addEventListener('click', this.onClickOpenMap.bind(this));
	        });
	    }

	    if(document.querySelector('[data-close-map-popup]')){
	    	document.querySelector('[data-close-map-popup]').addEventListener(
                'click',
                this.onClickCloseMap.bind(this)
            );
	    }

	    document.body.addEventListener('click', this.onBodyClickEvent.bind(this));
    }

    onClickHandler(event) {
        event.preventDefault();

        this.azTable.querySelectorAll('li').forEach((element) =>{
        	element.classList.remove('is-active');
        });

        event.target.closest('li').classList.add('is-active');

        var letter = event.target.getAttribute('data-href');

        this.azWrapper.querySelectorAll('.az-group').forEach((element) =>{
        	element.classList.remove('is-active');
        });

        if (letter != undefined && letter != null) {
            this.azWrapper.classList.remove('active-all');
            this.azWrapper.querySelector(`[data-letter="${letter}"]`).classList.add('is-active');
        } else {
            this.azWrapper.classList.add('active-all');
        }
    }

    onClickOpenMap(event){
    	event.preventDefault();
        event.stopPropagation();

        let url = event.target.getAttribute('data-href'),
            title = event.target.getAttribute('data-title'),
            content = `<iframe src="${url}" width="100%" height="500" style="border:0;" allowfullscreen=""></iframe>`;

    	this.mapPopup.querySelector('.halo-popup-title').innerText = title;
    	this.mapPopup.querySelector('.map').innerHTML = content;

    	document.body.classList.add('map-popup-show');
    }

    onClickCloseMap(event){
        document.body.classList.remove('map-popup-show');
    }

    onBodyClickEvent(event){
        if(document.body.classList.contains('map-popup-show')){
            if ((!this.mapPopup.contains(event.target)) && (!(event.target).closest('[data-open-map-popup]'))){
                this.onClickCloseMap();
            }
        }
    }
}

customElements.define('aztable-items', AZTable);