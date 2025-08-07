Shopify.Products = (() => {
	var cookie = {
		read: (name) => {
			var list = [],
				data = getCookie(name);

			if (data !== null && data !== undefined && data !== '') {
                list = data.split(' ');
            }

            return list;
		},

		set: (params, list) => {
			if (window.location.pathname.indexOf('/products/') !== -1) {
				let handle = document.querySelector('.productView[data-product-handle]').getAttribute('data-product-handle'),
                    position = list.indexOf(handle);

                if (position === -1) {
                	list.unshift(handle);
                 	list = list.splice(0, params.max);
                } else {
                	list.splice(position, 1);
                    list.unshift(handle);
                }

                cookie.write(params.name, params.expire, list);
			}
		},

		write: (name, day, list) => {
			setCookie(name, list.join(' '), { expires: day, path: '/', domain: window.location.hostname });
		},

		destroy: (name, day) => {
			setCookie(name, null, { expires: day, path: '/', domain: window.location.hostname });
		}
	}

	return {
		show: (params) => {
			var list = cookie.read(params.name);

			return list;
		},

		record: (params) => {
			var list = cookie.read(params.name);

			cookie.set(params, list);
		}
	}
})();