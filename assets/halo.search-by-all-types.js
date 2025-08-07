Shopify.SearchByAllTypes = (() => {
	var config = {
		sectionId: 'main-search',
        onComplete: null
	};
	return {
		renderResultTable: (params) => {
			var params = params || {};

    		$.extend(config, params);

    		this.section = document.getElementById(config.sectionId);

    		if(!this.section) return;

    		this.url = this.section.getAttribute('data-url');
    		this.id = this.section.getAttribute('data-id');

    		fetch(this.url)
            .then(response => response.text())
            .then(responseText => {
                const html = responseText;
                const parsedHTML = new DOMParser().parseFromString(html, 'text/html');
                const resultElements = parsedHTML.querySelector(`div[id="${config.sectionId}"]`)?.querySelector('template').content.firstElementChild.cloneNode(true)

                if(resultElements && resultElements.innerHTML.trim().length) {
                    this.section.innerHTML = resultElements.innerHTML;
                } else {
                    this.section.remove();
                }
            })
            .catch(e => {
                console.error(e);
            });
		}
	}
})();