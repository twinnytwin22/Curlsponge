(() => {
	var halo = {
		init: () => {
			if(document.querySelector('[data-open-ask-an-expert]')){
				document.querySelectorAll('[data-open-ask-an-expert]').forEach((button) => {
	                button.addEventListener('click', halo.open.bind(this));
	            });
			}

			if(document.querySelector('[data-close-ask-an-expert]')){
				document.querySelectorAll('[data-close-ask-an-expert]').forEach((button) => {
	                button.addEventListener('click', halo.close.bind());
	            });
			}

			document.body.addEventListener('click', halo.onBodyClickEvent.bind(this));
		},

		open: (event) => {
			event.preventDefault();
			event.stopPropagation();

			halo.update();
		},

		close: () => {
			document.body.classList.remove('ask-an-expert-show');
		},

		update: () => {
			const askAnExpert = document.querySelector('[data-ask-an-expert-popup]');
        	const modalContent = askAnExpert.querySelector('.halo-popup-content');

            let url, handle;

            if(document.body.classList.contains('template-product')){
            	handle = document.querySelector('.productView')?.getAttribute('data-product-handle');
            	url = window.routes.root + `/products/${handle}?view=ajax_ask_an_expert`;
            } else {
            	url = window.routes.root + `/search?view=ajax_ask_an_expert`;
            }

            modalContent.innerHTML = '';

            fetch(url)
	        .then(response => response.text())
	        .then((responseText) => {
	            const html = responseText;

	            modalContent.innerHTML = html;

	            if(document.body.classList.contains('quick-view-show')){
	            	document.body.classList.remove('quick-view-show');
	            	document.body.classList.add('ask-an-expert-show');
	            } else {
	            	document.body.classList.add('ask-an-expert-show');
	            }

	            halo.action();
	        });
		},

		action: () => {
			const submitBtn = document.getElementById('halo-ask-an-expert-button');

			if(!submitBtn) return;

			submitBtn.addEventListener('click', halo.send.bind(this));
		},

		send: (event) => {
			const askAnExpert = document.querySelector('[data-ask-an-expert-popup]');
			const askAnExpertForm = askAnExpert.querySelector('.halo-ask-an-expert-form');
            const askAnExpertMessage = askAnExpert.querySelector('.message');

			let proceed = true,
				alertMessage,
				emailReg = /^([\w-\.]+@([\w-]+\.)+[\w-]{2,4})?$/;

			askAnExpertForm.querySelectorAll('input[required], textarea[required]').forEach((element) => {
				if(!element.value.trim()) {
					element.closest('.form-field').classList.remove('form-field--success');
                    element.closest('.form-field').classList.add('form-field--error');

                    alertMessage = `<div class="alertBox alertBox--error"><p class="alertBox-message">${window.ask_an_expert.error_2}</p></div>`;
					
					askAnExpertMessage.innerHTML = alertMessage;
					askAnExpertMessage.style.display = 'block';

					proceed = false;
				} else {
                    element.closest('.form-field').classList.remove('form-field--error');
					element.closest('.form-field').classList.add('form-field--success');

					askAnExpertMessage.innerHTML = '';
					askAnExpertMessage.style.display = 'none';
				}

				if((element.getAttribute('name') == 'askAnExpertMail') && (!emailReg.test(element.value))) {
					element.closest('.form-field').classList.remove('form-field--success');
                    element.closest('.form-field').classList.add('form-field--error');

                    alertMessage = `<div class="alertBox alertBox--error"><p class="alertBox-message">${window.ask_an_expert.error_1}</p></div>`;
					
					askAnExpertMessage.innerHTML = alertMessage;
					askAnExpertMessage.style.display = 'block';

					proceed = false;
				}
			});

			if(proceed) {
				let postedData = {},
					toMail = window.ask_an_expert.mail,
                    subjectMail =window.ask_an_expert.subject,
                    labelMail =window.ask_an_expert.label,
                    customerName = askAnExpert.querySelector('[name="askAnExpertName"]')?.value,
                    customerMail = askAnExpert.querySelector('input[name="askAnExpertMail"]')?.value,
                    customerPhone = askAnExpert.querySelector('[name="askAnExpertPhone"]')?.value,
                    typeRadio1 = askAnExpert.querySelector('input[name=askAnExpertRadioFirst]:checked')?.value,
                    typeRadio2 = askAnExpert.querySelector('input[name=askAnExpertRadioSecond]:checked')?.value,
                    customerMessage = askAnExpert.querySelector('[name="askAnExpertMessage"]')?.value,
                    message = `<div style='border: 1px solid #e6e6e6;padding: 30px;max-width: 500px;margin: 0 auto;'>\
                                <h2 style='margin-top:0;margin-bottom:30px;color: #000000;'>${subjectMail}</h2>\
                                <p style='border-bottom: 1px solid #e6e6e6;padding-bottom: 23px;margin-bottom:25px;color: #000000;'>You received a new message from your online store's ask an expert form.</p>\
                                <table style='width:100%;'>`;

                if(askAnExpert.querySelector('.ask-an-expert')?.classList.contains('has-product')){
                	let productName = askAnExpert.querySelector('[name="halo-product-title"]')?.value,
                        productUrl = askAnExpert.querySelector('[name="halo-product-link"]')?.value,
                        productImage = askAnExpert.querySelector('[name="halo-product-image"]')?.value;

                    message += `<tr>\
                                <td style="border-bottom: 1px solid #e6e6e6; padding-bottom: 25px; margin-bottom:25px; width:50%;">\
                                    <img style="width: 100px" src="${productImage}" alt="${productName}" title="${productName}">\
                                </td>\
                                <td style="border-bottom: 1px solid #e6e6e6; padding-bottom: 25px; margin-bottom:25px;">\
                                    <a href="${productUrl}">${productName}</a>\
                                </td>\
                            </tr>`;
                }

                message += `<tr><td style="padding-right: 10px; vertical-align: top; width:50%;"><strong>${window.ask_an_expert.customer_name}: </strong></td><td>${customerName}</td></tr>\
                            <tr><td style="padding-right: 10px; vertical-align: top; width:50%;"><strong>${window.ask_an_expert.customer_mail}: </strong></td><td>${customerMail}</td></tr>\
                            <tr><td style="padding-right: 10px; vertical-align: top; width:50%;"><strong>${window.ask_an_expert.customer_phone}: </strong></td><td>${customerPhone}</td></tr>\
                            <tr><td style="padding-right: 10px; vertical-align: top; width:50%;"><strong>${window.ask_an_expert.type_radio1} </strong></td><td>${typeRadio1}</td></tr>\
                            <tr><td style="padding-right: 10px; vertical-align: top; width:50%;"><strong>${window.ask_an_expert.type_radio2}: </strong></td><td>${typeRadio2}</td></tr>\
                            <tr><td style="padding-right: 10px; vertical-align: top; width:50%;"><strong>${window.ask_an_expert.customer_message}? </strong></td><td>${customerMessage}</td></tr>\
                        </table></div>`;

                postedData = {
                    'api': 'i_send_mail',
                    'email': toMail,
                    'email_from': customerMail,
                    'from_name': labelMail,
                    'subject': subjectMail,
                    'message': message
                };

                $.post('//themevale.net/tools/sendmail/quotecart/sendmail.php', postedData, (response) => {
                	if (response.type == 'error') {
                    	message = `<div class="alertBox alertBox--error">\
		                    		<p class="alertBox-message">${response.text}</p>\
		                    	</div>`;
                    } else {
                   		message = `<div class="alertBox alertBox--success">\
                   				<p class="alertBox-message">${window.notify_me.success}</p>\
                   			</div>`;
                    	
                    	resetForm(askAnExpertForm);
                    	askAnExpertForm.style.display = 'none';
                    }

                    askAnExpertMessage.innerHTML = message;
					askAnExpertMessage.style.display = 'block';
                });
			}
		},

		onBodyClickEvent: (event) => {
			if(document.body.classList.contains('ask-an-expert-show')){
				if ((!document.querySelector('[data-ask-an-expert-popup]').contains(event.target)) && (!(event.target).closest('[data-open-ask-an-expert]'))){
		            halo.close();
		        }
			}
		}
	}

	halo.init();
})();