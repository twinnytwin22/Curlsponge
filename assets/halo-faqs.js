class FAQs extends HTMLElement {
    constructor() {
        super();

        this.filter = document.getElementById('haloFAQsFilter');
        this.faqsPopup = document.getElementById('halo-faqs-popup');

        if(this.filter){
            this.filterToggle = this.filter.querySelector('[data-faqs-filter]');
            this.filterDropdown = this.filter.querySelector('.faqs-filterDropdown-menu');

            if(this.filterToggle){
                this.filterToggle.addEventListener('click', this.onClickFilterHandler.bind(this));
            }

            if(this.filterDropdown.querySelector('.text')){
                this.filterDropdown.querySelectorAll('.text').forEach((filterButton) => {
                    filterButton.addEventListener('click', this.onClickFilterButtonHandler.bind(this));
                });
            }
        }

        if(this.querySelector('.faqs-2')){
            this.querySelectorAll('.card-header').forEach((headerButton) => {
                headerButton.addEventListener('click', this.onClickHeaderButtonHandler.bind(this));
            });
        }

        if(this.querySelector('.faqs-3') && this.querySelector('[data-open-faqs-popup]')){
            this.querySelectorAll('[data-open-faqs-popup]').forEach((popupButton) => {
                popupButton.addEventListener('click', this.onClickPopupButtonHandler.bind(this));
            });

            if(document.querySelector('[data-close-faqs-popup]')){
                document.querySelector('[data-close-faqs-popup]').addEventListener(
                    'click',
                    this.onClickClosePopupButtonHandler.bind(this)
                );
            }
        }

        document.body.addEventListener('click', this.onBodyClickEvent.bind(this));
    }

    onClickFilterHandler(event){
        if(this.filterDropdown.classList.contains('is-show')){
            this.filterDropdown.classList.remove('is-show');
        } else {
            this.filterDropdown.classList.add('is-show');
        }
    }

    onClickFilterButtonHandler(event){
        const btn = event.target.closest('li');

        if(!btn.classList.contains('is-active')){
            let filterValue = btn.getAttribute('data-value'),
                filterText = event.target.innerText;

            this.filterToggle.querySelector('.text').innerText = filterText;

            this.filterDropdown.querySelectorAll('li').forEach((element) => {
                element.classList.remove('is-active');
            });

            btn.classList.add('is-active');

            if(filterValue !== undefined && filterValue !== null){
                this.querySelectorAll('.faqs-paragraph').forEach((element) => {
                    if(element.getAttribute('id') == filterValue){
                        element.classList.remove('is-hidden');
                        element.classList.add('is-active');
                    } else {
                        element.classList.remove('is-active');
                        element.classList.add('is-hidden');
                    }
                });
            } else {
                this.querySelectorAll('.faqs-paragraph').forEach((element) => {
                    element.classList.remove('is-hidden', 'is-active');
                });
            }

            this.filterDropdown.classList.remove('is-show');
        }
    }

    onClickHeaderButtonHandler(event){
        const btn = event.currentTarget;
        const content = btn.nextElementSibling;

        btn.classList.toggle('collapsed');

        if (content.style.maxHeight){
            content.style.maxHeight = null;
        } else {
            content.style.maxHeight = content.scrollHeight + 'px';
        }
    }

    onClickPopupButtonHandler(event){
        const btn = event.currentTarget;

        let title = btn.getAttribute('data-title'),
            content = btn.nextElementSibling.innerHTML;

        btn.classList.add('is-active');

        this.faqsPopup.querySelector('.halo-popup-title').innerText = title;
        this.faqsPopup.querySelector('.faqs-content').innerHTML = content;

        document.body.classList.add('faqs-popup-show');
    }

    onClickClosePopupButtonHandler(event){
        event.preventDefault();
        event.stopPropagation();

        document.body.classList.remove('faqs-popup-show');

        this.querySelectorAll('[data-open-faqs-popup]').forEach((popupButton) => {
            popupButton.classList.remove('is-active');
        });
    }

    onBodyClickEvent(event){
        if(this.filter){
            if(this.filterDropdown.classList.contains('is-show')){
                if ((!this.filterDropdown.contains(event.target)) && (!(event.target).closest('[data-faqs-filter]'))){
                    this.filterDropdown.classList.remove('is-show');
                }
            }
        }

        if(document.body.classList.contains('faqs-popup-show')){
            if ((!this.faqsPopup.contains(event.target)) && (!(event.target).closest('[data-open-faqs-popup]'))){
                document.body.classList.remove('faqs-popup-show');

                this.querySelectorAll('[data-open-faqs-popup]').forEach((popupButton) => {
                    popupButton.classList.remove('is-active');
                });
            }
        }
    }
}

customElements.define('faqs-item', FAQs);