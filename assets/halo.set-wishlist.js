Shopify.ProductWishlist = (() => {
	return {
		setLocalStorageProductForWishlist: () => {
            var wishlistList = localStorage.getItem('wishlistItem') ? JSON.parse(localStorage.getItem('wishlistItem')) : [];

            localStorage.setItem('wishlistItem', JSON.stringify(wishlistList));

            if (wishlistList.length > 0) {
                Shopify.ProductWishlist.setWishlistCounter(wishlistList.length);

                wishlistList = JSON.parse(localStorage.getItem('wishlistItem'));
                
                wishlistList.forEach((handle) => {
                    Shopify.ProductWishlist.setProductForWishlist(handle);
                });
            }
        },

        setProductForWishlist: (handle) => {
            var wishlistList = JSON.parse(localStorage.getItem('wishlistItem')),
                index = wishlistList.indexOf(handle);

            if(document.querySelector(`[data-wishlist-handle="${handle}"]`)){
                document.querySelectorAll(`[data-wishlist-handle="${handle}"]`).forEach((item) => {
                    if(index >= 0) {
                        item.classList.add('wishlist-added');

                        if(item.querySelector('.text')){
                            item.querySelector('.text').innerText = window.wishlist.added;
                        }
                    } else {
                        item.classList.remove('wishlist-added');

                        if(item.querySelector('.text')){
                            item.querySelector('.text').innerText = window.wishlist.add;
                        }
                    }
                });
            }
        },

        setWishlistCounter: (count) => {
            document.querySelectorAll(`[data-wishlist-count]`).forEach((counter) => {
                counter.innerText = count;
            });
        }
	}
})();