Shopify.SearchByAllTypes = (() => {
	var config = {
		sectionId: 'main-page-article-grid',
        onComplete: null
	};
	return {
		renderResultTable: () => {
    		const section = document.getElementById(config.sectionId);

    		if(!section) return;

    		let url = section.getAttribute('data-url'),
                id = section.getAttribute('data-id');

    		fetch(url)
            .then(response => response.text())
            .then(responseText => {
                const html = responseText;
                const parsedHTML = new DOMParser().parseFromString(html, 'text/html');
                const resultElements = parsedHTML.querySelector(`div[id="${config.sectionId}"]`)?.querySelector('template').content.firstElementChild.cloneNode(true)

                if(resultElements && resultElements.innerHTML.trim().length) {
                    section.innerHTML = resultElements.innerHTML;
                } else {
                    section.remove();
                }
            })
            .catch(e => {
                console.error(e);
            });
		}
	}
})();