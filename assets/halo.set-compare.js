Shopify.ProductCompare = (() => {
	return {
		setLocalStorageProductForCompare: () => {
    		var compareList = JSON.parse(localStorage.getItem('compareItem'));

            if(compareList !== null){ 
                if(document.querySelector(`[data-product-compare-handle]`)){
                    document.querySelectorAll(`[data-product-compare-handle]`).forEach((item) => {
                        var handle = item.getAttribute('data-product-compare-handle');

                        if(compareList.indexOf(handle) !== -1) {
                            if(item.querySelector('.compare-icon')){
                                item.querySelector('.compare-icon').classList.add('is-checked');
                            }

                            if(item.querySelector('.text')){
                                item.querySelector('.text').innerText = window.compare.added;
                            }

                            item.querySelector('input').setAttribute('checked', true);

                            if(window.card.layout == '4' || window.card.layout == '5'){
		                        item.querySelector('label').inerHTML = `<span class="visually-hidden">${window.compare.added}</span>${window.compare.added}`;
		                    }
                        } else {
                            if(item.querySelector('.compare-icon')){
                                item.querySelector('.compare-icon').classList.remove('is-checked');
                            }

                            if(item.querySelector('.text')){
                                item.querySelector('.text').innerText = window.compare.add;
                            }

                            item.querySelector('input').removeAttribute('checked');

                            if(window.card.layout == '4' || window.card.layout == '5'){
		                        item.querySelector('label').inerHTML = `<span class="visually-hidden">${window.compare.add}</span>${window.compare.add}`;
		                    }
                        }

                        Shopify.ProductCompare.updateCounterCompare();
                    });
                }
            }
		},

		updateCounterCompare: () => {
			var compareList = JSON.parse(localStorage.getItem('compareItem')),
                compareLink = document.querySelector('a[data-compare-link]');

            if(compareLink){
    	        if (compareList.length > 1) {
    	            compareLink.closest('.halo-compareProduct').classList.add('is-show');

                    if(compareLink.querySelector('span.countPill')){
                        compareLink.querySelector('span.countPill').innerText = compareList.length;
                    }
    	        } else {
    	            compareLink.closest('.halo-compareProduct').classList.remove('is-show');
    	        }
            }
		}
	}
})();