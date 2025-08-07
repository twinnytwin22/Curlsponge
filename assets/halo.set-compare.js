Shopify.ProductCompare = (() => {
	var config = {
		link: $('a[data-compare-link]'),
        onComplete: null
	};
	return {
		setLocalStorageProductForCompare: (params) => {
			var params = params || {};

    		$.extend(config, params);

    		var $link = config.link,
    			count = JSON.parse(localStorage.getItem('compareItem')),
                items = $('[data-product-compare-handle]');

            if(count !== null){ 
                if(items.length > 0) {
                    items.each((index, element) => {
                        var item = $(element),
                            handle = item.data('product-compare-handle');

                        if(count.indexOf(handle) >= 0) {
                            item.find('.compare-icon').addClass('is-checked');
                            item.find('.text').text(window.compare.added);
                            item.find('input').prop('checked', true);

                            if(window.card.layout == '4' || window.card.layout == '5'){
		                        item.find('label').html(`<span class="visually-hidden">${window.compare.added}</span>${window.compare.added}`);
		                    }
                        } else {
                            item.find('.compare-icon').removeClass('is-checked');
                            item.find('.text').text(window.compare.add);
                            item.find('input').prop('checked', false);

                            if(window.card.layout == '4' || window.card.layout == '5'){
		                        item.find('label').html(`<span class="visually-hidden">${window.compare.add}</span>${window.compare.add}`);
		                    }
                        }
                    });

                    this.updateCounterCompare($link);
                }
            }
		},

		updateCounterCompare: ($link) => {
			var count = JSON.parse(localStorage.getItem('compareItem'));

	        if (count.length > 1) {
	            $link.parent().addClass('is-show');
	            $link.find('span.countPill').html(count.length);
	        } else {
	            $link.parent().removeClass('is-show');
	        }
		}
	}
})();