(async function () {
	// 不在产品页面则推出
	if (window.ShopifyAnalytics.meta.page.pageType !== "product") {
		return;
	}
	// 产品对象
	var product = JSON.parse(
		document.querySelector("#sealoop_product").textContent
	);
	// 获取屏幕宽度
	var screenWidth = document.body.clientWidth / 3;
	// 产品ID
	var shopify_product_id = product.id;
	// 变体对象
	var variants = product.variants;
	// 选中的变体id
	var selected_variant_id = JSON.parse(
		document.querySelector("#sealoop_product_selected_or_first_variant")
			.textContent
	);
	var selected_variant = null;
	var selected_variant_isExist_plan = false;
	// 对应的url选中变体(默认)
	var url_variant_id = window.location.href.split("variant=")[1];
	// 产品对应的计划列表
	var plan = product.selling_plan_groups;
	// 获取钱币格式
	var money_format = JSON.parse(
		document.querySelector("#sealoop_money_format").textContent
	);
	var priceformat = money_format.replace(/<[^>]+>/g, "").split("{")[0];
	// 页面form表单对象数组
	var form_elementArr = document.forms;
	var shopify_payment_button = null;
	// 店铺域名
	var domain = Shopify.shop;
	var description = null;
	// 组件模板
	var template = 1;
	// 翻译数据
	var translationData = {};

	let customStyle = "";

	if (domain === "betternotebook-8689.myshopify.com") {
		customStyle += `div#sealoop_subscription_plan {
			margin-top: -50px;
	}`;
	}

	if (!plan) {
		return;
	}
	const ENV = "prod";
	const baseUrl =
		ENV.indexOf("dev") === -1
			? "https://subapi.sealapps.com/"
			: "https://subapitest.uppercommerce.com/";

	const shopSetting = await getShopSetting();
	if (shopSetting.data.is_subscription_enabled !== 1) {
		return;
	}

	isExistParentAndUpdateElement();
	// const initRes = await checkUserTurnover();
	// if (!initRes) return;
	handleInit();

	// async function checkUserTurnover() {
	//     params = {
	//         domain: domain ,
	//     }
	//     let url = "https://subapitest.uppercommerce.com/api/v1/cTerminal/selTurnover";
	//     return request2(params, url).then(res => {
	//         let subUserTurnoverDate = res.data;
	//
	//         if (subUserTurnoverDate['type'] == 2 && subUserTurnoverDate['turnover_total'] >= subUserTurnoverDate['turnover_standard'] ){
	//             return false;
	//         }
	//         return true;
	//     }).catch(err => {
	//         return false;
	//     })
	//
	// }

	function request2(params, url, callback, method = "POST") {
		return new Promise(resolve => {
			const xmlHttp = new XMLHttpRequest();
			// post请求方式
			xmlHttp.open(method, url, true);
			// 添加http头，发送信息至服务器时的内容编码类型
			xmlHttp.setRequestHeader("Content-Type", "application/json");
			// 发送数据，请求体数据
			xmlHttp.send(JSON.stringify(params));
			// 发送数据
			xmlHttp.onreadystatechange = function () {
				// 请求完成
				if (
					(xmlHttp.readyState == 4 && xmlHttp.status == 200) ||
					xmlHttp.status == 304
				) {
					// 从服务器上获取数据
					const json = JSON.parse(this.responseText);
					const { code, data } = json;
					if (code === 200) {
						if (callback) {
							callback(data);
						}
						resolve(json);
					} else if (code !== 500) {
						resolve(json);
					}
				}
			};
		});
	}

	// 获取店铺设置
	function getShopSetting() {
		return requestIni(
			{ shopify_product_id },
			baseUrl + "api/v1/setting/getShopSettings",
			undefined,
			"GET"
		);
	}

	//获取组件模板类型
	function getTemplate() {
		let url = baseUrl + "api/v1/guide/getStep";

		const params = {
			step: 3,
		};
		return requestIni(params, url)
			.then(res => {
				if (res.code != 200) {
					return false;
				}

				template = res.data.style;

				if (shopify_payment_button != null) {
					importStyles();
					selectDescription();
					VariantListener();
				}
				return true;
			})
			.catch(err => {
				return false;
			});
	}

	function getTranslation() {
		let url = baseUrl + "api/v1/getTranslateByC";
		const params = {};
		return requestIni(params, url)
			.then(res => {
				if (res.code != 200) {
					return false;
				}
				translationData = res.data;
				return true;
			})
			.catch(err => {
				return false;
			});
	}

	function requestIni(params, url, callback, method = "POST") {
		return new Promise(resolve => {
			const xmlHttp = new XMLHttpRequest();

			if (method === "GET") {
				url += Object.keys(params)
					.reduce((pre, item) => pre + "&" + item + "=" + params[item], "")
					.replace("&", "?");
			}

			// post请求方式
			xmlHttp.open(method, url, true);
			// 添加http头，发送信息至服务器时的内容编码类型及验证数据
			xmlHttp.setRequestHeader("Content-Type", "application/json");
			xmlHttp.setRequestHeader("authorization", domain);
			// 发送数据
			if (method === "POST") {
				xmlHttp.send(JSON.stringify(params || {}));
			} else if (method === "GET") {
				xmlHttp.send();
			}
			xmlHttp.onreadystatechange = function () {
				// 请求完成

				if (
					(xmlHttp.readyState == 4 && xmlHttp.status == 200) ||
					xmlHttp.status == 304
				) {
					// 从服务器上获取数据
					const json = JSON.parse(this.responseText);
					const { code, data } = json;
					if (code === 200) {
						if (callback) {
							callback(data);
						}
						resolve(json);
					} else if (code !== 500) {
						resolve(json);
					}
				}
			};
		});
	}

	// 验证对象是否存在
	function isExistParentAndUpdateElement() {
		if (form_elementArr != null) {
			for (let i = 0; i < form_elementArr.length; i++) {
				if (form_elementArr[i].action.indexOf("/cart/add") != -1) {
					const children = form_elementArr[i].elements;

					if (domain === "regenerativcollagen.myshopify.com") {
						if (form_elementArr[i].offsetParent !== null)
							shopify_payment_button = form_elementArr[i];
					}
					if (!shopify_payment_button) {
						for (let i = 0; i < children.length; i++) {
							if (children[i].getAttribute("type") === "submit") {
								shopify_payment_button = children[i].parentElement;
								break;
							}
						}
					}

					if (shopify_payment_button) break;
				}
			}
		}
	}

	function handleInit() {
		// 验证插入位置
		if (shopify_payment_button == null) {
			return;
		} else {
			let html =
				'<div id="sealoop_subscription_plan">' +
				'<input type="hidden" name="selling_plan" class="selling_plan"/>';
			html += '<div class="sub-plan-head"></div>';
			html += '<div class="sub-plan-group-box"></div></div>';
			shopify_payment_button.insertAdjacentHTML("afterBegin", html);
		}
		// 计划列表添加监听
		document
			.querySelector(".sub-plan-group-box")
			.addEventListener("click", evt => {
				const dom = evt.target;
				checkGroupShow(dom);
			});
		getTranslation();
		getTemplate();
	}

	// 初始化
	function getVarData() {
		variants.forEach(v => {
			if (v.id == selected_variant_id) {
				selected_variant = v;
			}
		});
		initSubPlanGroup();
	}

	function initSubPlanGroup() {
		let html = "";
		selected_variant_isExist_plan = false;
		plan.forEach(vv => {
			// 判断计划是否属于该app
			if (vv.app_id == "auto-subscription") {
				vv.price_data = [];

				selected_variant.selling_plan_allocations.forEach(v => {
					// 判断选中变体订阅计划是否有对应的计划
					vv.selling_plans.forEach(val => {
						if (val.id == v.selling_plan_id) {
							// 改变变体是否拥有计划状态
							selected_variant_isExist_plan = true;
							vv.price_data.push({
								id: val.id,
								price: returnFloat(v.price / 100),
								per_delivery_price: v.per_delivery_price / 100,
							});
							v.discount_type = val.price_adjustments[0].value_type;
							v.discount_value = val.price_adjustments[0].value;
						}

						if (description != null) {
							description.forEach(d => {
								if (d.resource_id == val.id) {
									if (d.description == null) {
										d.description = "";
									}
									val.description = d.description;
								}
							});
						}
					});
				});
				// 添加订阅计划列表选项
				if (template == 1) {
					html += cubeCreateHtml(vv);
				}
				if (template == 2) {
					html += radioCreateHtml(vv);
				}
				if (template == 3) {
					html += dropDownCreateHtml(vv);
				}
			}
		});
		let headHtml = "";
		// 判断选中变体是否拥有计划
		if (selected_variant_isExist_plan) {
			// requires_selling_plan:是否仅限订阅购买
			if (product.requires_selling_plan) {
				headHtml += `<legend id="purchase-options" class="sub_legend">${translationData.options}</legend>`;
				switch (template) {
					// cube模板
					case 1:
						headHtml += `<div class="Sealapp-Subscription-Option"></div>`;
						break;
					// raido模板
					case 2:
						headHtml += `<div class="Sealapp-Subscription-Option Sealapp-Subscription_Unfurl">`;
						break;
					// dropDown模板
					case 3:
						headHtml += `<div class="Sealapp-Subscription-Option Sealapp-Subscription_DownList">`;
						break;
				}
			} else {
				// 添加头部：Purchase Options
				headHtml +=
					'<legend id="purchase-options" class="sub_legend" style="display:none ">Purchase Options</legend>';
				switch (template) {
					// cube模板
					case 1:
						headHtml += `<div class="Sealapp-Subscription-Option">
									<div class="Sealapp-Subscription-Option_One-Time Sealapp-Subscription-Option_Rectangle" style="background-color: rgb(242, 247, 254); border: 1px solid rgb(144, 178, 228);">
										<input class="sub-plan-selector-group-item" name="sub-plan-selector-group" value="" style="display:none" checked />
										<div class="Sealapp-Subscription-Option_Rectangle-top">${
											translationData.option1
										}</div>
											<div class="Sealapp-Subscription-Option_Rectangle_bottom"> ${
												priceformat + returnFloat(selected_variant.price / 100)
											} (${translationData.app_full_price})</div>
									</div>
								</div>`;
						break;
					// raido模板
					case 2:
						headHtml += `<div class="Sealapp-Subscription-Option Sealapp-Subscription_Unfurl">
									<div class="Sealapp-Subscription-Option_One-Time Sealapp-Subscription-Option_Unfurl">
											<label for="PolarisRadioButton1" class="Sealapp-Subscription-Option_Unfurl_Label">
													<span class="Sealapp-Subscription-Option_label-radio">
															<input id="PolarisRadioButton1" type="radio" class="Sealapp-Subscription-Option_label-radio-Input" value="" name="sub-plan-selector-group" checked>
													</span>
													<span>${translationData.option1}</span>
													<span class="Sealapp-Subscription-Option_price">${
														priceformat +
														returnFloat(selected_variant.price / 100)
													}</span>
											</label>
									</div>`;
						break;
					// dropDown模板
					case 3:
						headHtml += `<div class="Sealapp-Subscription-Option Sealapp-Subscription_DownList">
									<div class="Sealapp-Subscription-Option_One-Time Sealapp-Subscription-Option_DownList">
											<label for="PolarisRadioButton1" class="Sealapp-Subscription-Option_DownList_Label">
													<span class="Sealapp-Subscription-Option_label-radio">
															<input id="PolarisRadioButton1" type="radio" class="Sealapp-Subscription-Option_label-radio-Input" value="" name="sub-plan-selector-group" checked>
													</span>
													<span>${translationData.option1}</span>
													<span class="Sealapp-Subscription-Option_price">${
														priceformat +
														returnFloat(selected_variant.price / 100)
													}</span>
											</label>
									</div>`;
						break;
				}
			}
			document.querySelector(".sub-plan-head").innerHTML = headHtml;
			document
				.querySelector(".Sealapp-Subscription-Option")
				.insertAdjacentHTML("beforeend", html);
		} else {
			document.querySelector(".sub-plan-head").innerHTML = headHtml;
		}

		// 给对应的模板添加事件监听和默认选中第一个
		if (template == 1) {
			if (product.requires_selling_plan) {
				var cubeInput = document.querySelector(
					"[name=sub-plan-selector-group]"
				);
				cubeInput.checked = true;
				var cubeEl = document.querySelector(
					".Sealapp-Subscription-Option_Rectangle"
				);
				cubeEl.style.backgroundColor = "#f2f7fe";
				cubeEl.style.border = "1px solid #90b2e4";
				// 赋予sellingPlan选中计划值
				if (document.querySelector(".selling_plan") != null) {
					document.querySelector(".selling_plan").value = cubeInput.value
						? cubeInput.value
						: "";
				}
			}
			cubeEvent();
		}
		if (template == 2) {
			if (product.requires_selling_plan) {
				var radioParentInput = document.querySelector(
					"input[name=sub-plan-selector-group]"
				);
				var radioChildInput = document.querySelector(
					"input[name=sub-plan-selector-group-item]"
				);
				radioParentInput.checked = true;
				radioChildInput.checked = true;
				var radioEl = document.querySelector(
					".Sealapp-Subscription-Option_Unfurl"
				);
				var radioElChild = radioEl.querySelector(
					".Sealapp-Subscription-Option-Child_Unfurl"
				);
				radioEl.style.backgroundColor = "#f2f7fe";
				radioEl.style.border = "1px solid #90b2e4";
				radioElChild.style.display = "block";
				// 赋予sellingPlan选中计划值
				if (document.querySelector(".selling_plan") != null) {
					document.querySelector(".selling_plan").value = radioChildInput.value
						? radioChildInput.value
						: "";
				}
			}
			radioSelect();
		}
		if (template == 3) {
			if (product.requires_selling_plan) {
				var listParentInput = document.querySelector(
					"input[name=sub-plan-selector-group]"
				);
				var listChildInput = document.querySelector(
					"input[name=sub-plan-selector-group-item]"
				);
				listParentInput.checked = true;
				listChildInput.checked = true;
				var listEl = document.querySelector(
					".Sealapp-Subscription-Option_DownList"
				);
				var listElChild = listEl.querySelector(
					".Sealapp-Subscription-Option-Child_DownList"
				);
				var listElChildSelect = listEl.querySelector(".dropDownList-container");
				var selectTitle = listElChildSelect.querySelector(
					".Subscription-Option_DownList-Childs"
				).innerText;
				listElChild.querySelector(".dropDown-price").innerText = selectTitle;
				listEl.style.backgroundColor = "#f2f7fe";
				listElChild.style.display = "block";
				listElChildSelect.style.display = "none";

				// 赋予sellingPlan选中计划值
				if (document.querySelector(".selling_plan") != null) {
					document.querySelector(".selling_plan").value = listChildInput.value
						? listChildInput.value
						: "";
				}
			}
			dropDownSelect();
		}
	}

	// 构建cube模板的内容
	function cubeCreateHtml(plan) {
		let html = "";
		if (plan.price_data && plan.price_data.length > 0) {
			// 遍历plan中的所有selling_plan
			plan.selling_plans.forEach(v => {
				let discount_type = v.price_adjustments[0].value_type;
				let discount_value = v.price_adjustments[0].value;
				let discount = "";
				// 判断要显示的折扣格式
				switch (discount_type) {
					case "percentage":
						if (discount_value > 0) {
							discount =
								"(" +
								discount_value +
								"% " +
								translationData.app_off_price +
								")";
						} else {
							discount = "";
						}
						break;
					case "fixed_amount":
						if (discount_value > 0) {
							discount =
								"(" +
								priceformat +
								discount_value / 100 +
								" " +
								translationData.app_off_price +
								")";
						} else {
							discount = "";
						}
						break;
					case "none":
						discount = "(" + translationData.app_full_price + ")";
						break;
				}
				plan.price_data.forEach(vv => {
					if (vv.id == v.id) {
						if (v.description == null) {
							v.description = "";
						}
						html += `<div class="Sealapp-Subscription-Option_Other-Time Sealapp-Subscription-Option_Rectangle">`;

						if (v.description) {
							html += `<div class="plan-name">
																	<div class="Sealapp-Subscription-Option_Rectangle-top">${v.name}</div>
																	<div data-v-f6026308="" class="help">
																		<svg t="1673860449261" class="icon" viewBox="0 0 1024 1024" version="1.1" xmlns="http://www.w3.org/2000/svg" p-id="2891" width="15" height="15">
																			<path d="M568.944 494.933c0-17.067-5.689-28.444-17.067-34.133-11.378-11.378-22.756-17.067-39.822-17.067s-28.444 5.689-39.822 17.067c-11.378 11.378-17.067 22.756-17.067 34.133v244.622c0 17.067 5.689 28.444 17.067 34.133 11.378 11.378 22.756 17.067 39.822 17.067s28.444-5.689 39.822-17.067 17.067-22.756 17.067-34.133V494.933z m-56.888-250.311c-17.067 0-34.133 5.689-45.511 17.067-17.067 11.378-22.756 28.444-22.756 45.511s5.689 34.133 17.067 45.511 28.444 17.067 45.511 17.067 34.133-5.689 45.511-17.067 17.067-28.444 17.067-45.511-5.689-34.133-17.067-45.511c-5.689-11.378-22.756-17.067-39.822-17.067z m0 739.556c-62.578 0-125.156-11.378-182.044-34.133s-108.089-56.889-147.911-102.4c-45.511-45.511-73.956-91.022-102.4-147.911-22.756-56.889-34.133-119.467-34.133-182.044s11.378-125.156 34.133-182.044 56.889-108.089 102.4-147.911c45.511-45.511 91.022-73.956 147.911-102.4 56.889-22.756 119.467-34.133 182.044-34.133S637.212 62.58 694.1 85.335s108.089 56.889 147.911 102.4c45.511 45.511 73.956 91.022 102.4 147.911 22.756 56.889 34.133 119.467 34.133 182.044s-11.378 125.156-34.133 182.044-56.889 108.089-102.4 147.911C796.5 893.156 750.989 921.601 694.1 950.045c-56.889 22.756-119.467 34.133-182.044 34.133z" p-id="2892" fill="#bfbfbf">
																			</path>
																		</svg>
																		<div class="description-content">
																			${v.description}
																		</div>
																	</div>
																</div>`;
						} else {
							html += `<div class="Sealapp-Subscription-Option_Rectangle-top">${v.name}</div>`;
						}
						html += `<div class="Sealapp-Subscription-Option_Rectangle_bottom">${
							priceformat + vv.price
						} ${discount}</div>
																		<input type="radio" value="${v.id}" data-price="${
							vv.price
						}" name="sub-plan-selector-group" class="sub-plan-selector-group-item" style="display:none">
																</div>`;
					}
				});
			});
		}
		return html;
	}

	// 构建radio模板的内容
	function radioCreateHtml(plan) {
		let html = "";

		if (plan.price_data && plan.price_data.length > 0) {
			// 在循环外先构建父级元素
			html = `<div class="Sealapp-Subscription-Option_Other-Time Sealapp-Subscription-Option_Unfurl">
					<label for="PolarisRadioButton${
						plan.id
					}" class="Sealapp-Subscription-Option_Unfurl_Label" >
							<span class="Sealapp-Subscription-Option_label-radio">
									<input id="PolarisRadioButton${
										plan.id
									}" type="radio" class="Sealapp-Subscription-Option_label-radio-Input" value="${
				plan.id
			}" name="sub-plan-selector-group">
							</span>
							<span>${plan.name}</span>
							<span class="Sealapp-Subscription-Option_price">${
								priceformat + plan.price_data[0].price
							}</span>
					</label>
					<div class="Sealapp-Subscription-Option-Child_Unfurl">`;

			// 根据sellingPlan的数量去构建子元素
			plan.selling_plans.forEach(v => {
				let discount_type = v.price_adjustments[0].value_type;
				let discount_value = v.price_adjustments[0].value;
				let discount = "";
				// 判断要显示的折扣格式
				switch (discount_type) {
					case "percentage":
						if (discount_value > 0) {
							discount =
								"(" +
								discount_value +
								"% " +
								translationData.app_off_price +
								")";
						} else {
							discount = "";
						}
						break;
					case "fixed_amount":
						if (discount_value > 0) {
							discount =
								"(" +
								priceformat +
								discount_value / 100 +
								" " +
								translationData.app_off_price +
								")";
						} else {
							discount = "";
						}
						break;
					case "none":
						discount = "(" + translationData.app_full_price + ")";
						break;
				}

				plan.price_data.forEach(vv => {
					if (vv.id == v.id) {
						if (v.description == null) {
							v.description = "";
						}
						html += `<label for="PolarisRadioButton${
							v.id
						}" class="Sealapp-Subscription-Option_Unfurl_Label Sealapp_Unfurl_Label_Child ">
											<div class="plan-info">
												<span class="Sealapp-Subscription-Option_label-radio">
														<input id="PolarisRadioButton${
															v.id
														}" type="radio" class="Sealapp-Subscription-Option_label-radio-Input" value="${
							v.id
						}" data-price="${vv.price}" name="sub-plan-selector-group-item">
												</span>
												<span>${v.name} ${discount}</span>
												<span class="Sealapp-Subscription-Option_price">${priceformat + vv.price}</span>
											</div>
										<div class="radio-description">
											${v.description}
										</div>
									</label>`;
					}
				});
			});
			html += `</div></div></div>`;
		}
		return html;
	}

	// 构建dropDown模板的内容
	function dropDownCreateHtml(plan) {
		let html = "";

		if (plan.price_data && plan.price_data.length > 0) {
			// 在循环外先构建父级元素
			html = `<div class="Sealapp-Subscription-Option_Other-Time Sealapp-Subscription-Option_DownList">
					<label for="PolarisRadioButton${
						plan.id
					}" class="Sealapp-Subscription-Option_DownList_Label" >
							<span class="Sealapp-Subscription-Option_label-radio">
									<input id="PolarisRadioButton${
										plan.id
									}" type="radio" class="Sealapp-Subscription-Option_label-radio-Input" value="${
				plan.id
			}" name="sub-plan-selector-group">
							</span>
							<span>${plan.name}</span>
							<span class="Sealapp-Subscription-Option_price">${
								priceformat + plan.price_data[0].price
							}</span>
					</label>
					<div class="Sealapp-Subscription-Option-Child_DownList">
							
							<div class="Subscription-Option_DownList-Childs-Group " tabindex="-1">
									<div class="Subscription-Option_DownList-Childs-One">
											<span class="dropDown-price">Every 1 day ($10 off)</span> 
											<svg class="Subscription-Option_DownList-Childs-icon" viewBox="0 0 1024 1024" version="1.1" xmlns="http://www.w3.org/2000/svg" p-id="1847" width="12" height="12"><path d="M1024 255.996 511.971 767.909 0 255.996 1024 255.996z" p-id="1848"></path></svg>
									</div>
									<div class = "dropDownList-container">`;

			// 根据sellingPlan的数量去构建子元素
			plan.selling_plans.forEach(v => {
				let discount_type = v.price_adjustments[0].value_type;
				let discount_value = v.price_adjustments[0].value;
				let discount = "";
				// 判断要显示的折扣格式
				switch (discount_type) {
					case "percentage":
						if (discount_value > 0) {
							discount =
								"(" +
								discount_value +
								"% " +
								translationData.app_off_price +
								")";
						} else {
							discount = "";
						}
						break;
					case "fixed_amount":
						if (discount_value > 0) {
							discount =
								"(" +
								priceformat +
								discount_value / 100 +
								" " +
								translationData.app_off_price +
								")";
						} else {
							discount = "";
						}
						break;
					case "none":
						discount = "(" + translationData.app_full_price + ")";
						break;
				}
				plan.price_data.forEach(vv => {
					if (vv.id == v.id) {
						if (v.description == null) {
							v.description = "";
						}
						html += `
													<div class="Subscription-Option_DownList-Childs">
													<div class="plan-name">${v.name} ${discount}</div>
													<input id="PolarisRadioButton${v.id}" type="radio" class="Sealapp-Subscription-Option_label-radio-Input" value="${v.id}" data-price="${vv.price}" name="sub-plan-selector-group-item" style="display:none">
														<div class="dropDown-description">${v.description}</div>
													</div>
													`;
					}
				});
			});
			html += `</div></div></div><div class="plan-description">plan...........................description</div>
										</div>
										</div>`;
		}
		return html;
	}

	// 监听变体变化
	function VariantListener() {
		if (window.location.href.indexOf("variant=") != -1) {
			if (url_variant_id != window.location.href.split("variant=")[1]) {
				url_variant_id = window.location.href.split("variant=")[1];
				selected_variant_id = url_variant_id;
				getVarData();
			}
		}
		setTimeout(() => {
			VariantListener();
		}, 50);
	}

	// cube模板添加点击事件
	function cubeEvent() {
		const el = document.querySelectorAll(
			".Sealapp-Subscription-Option_Rectangle"
		);

		// 给所有的元素添加点击事件
		for (let index = 0; index < el.length; index++) {
			const element = el[index];
			element.addEventListener("click", cubeSelect);
		}
	}

	function cubeSelect(evt) {
		const el = document.querySelectorAll(
			".Sealapp-Subscription-Option_Rectangle"
		);
		let frequency_plan_id = 0;
		// 先清除所有的样式
		for (let i = 0; i < el.length; i++) {
			const element = el[i];
			element.style.backgroundColor = "#fff";
			element.style.border = "1px solid #babfc3";
		}

		// 再根据dom去渲染点击后的样式
		const dom = this;

		dom.style.backgroundColor = "#f2f7fe";
		dom.style.border = "1px solid #90b2e4";

		// 获取点击的元素中（计划）的planid及价格
		// 一次性购买的类不是'sub-plan-selector-group-item'所以会为空，直接给sellingPlan赋空值就行
		const frequency_plan_Arr = dom.querySelector(
			".sub-plan-selector-group-item"
		);
		frequency_plan_id = frequency_plan_Arr.value
			? frequency_plan_Arr.value
			: "";
		frequency_plan_price = frequency_plan_Arr.getAttribute("data-price");

		// 赋予sellingPlan选中计划值
		if (document.querySelector(".selling_plan") != null) {
			document.querySelector(".selling_plan").value = frequency_plan_id;
		}
		changePrice(frequency_plan_price, frequency_plan_id);
	}

	// radio模板添加选中事件
	function radioSelect() {
		const ipt = document.querySelectorAll(
			".Sealapp-Subscription-Option_Unfurl"
		);

		// 给所有的元素添加点击事件
		for (let i = 0; i < ipt.length; i++) {
			const element = ipt[i];
			element.addEventListener("change", checkRadioGroupPlanShow);
		}
	}

	// radio模板更改选中事件
	function checkRadioGroupPlanShow(evt) {
		let frequency_plan_id = 0;
		let frequency_plan_price = selected_variant.price / 100;
		// 获取每个plan选项
		const otherDom = document.querySelectorAll(
			".Sealapp-Subscription-Option_Unfurl"
		);
		// 获取plan的每个frequency选项
		const otherDomChild = document.querySelectorAll(
			".Sealapp-Subscription-Option-Child_Unfurl"
		);
		// 获取所有描述
		const allDesEls = document.querySelectorAll(".radio-description");
		// 把它们的选中样式全部清除
		for (let i = 0; i < otherDom.length; i++) {
			const element = otherDom[i];
			element.style.backgroundColor = "#fafbfb";
			element.style.border = "0px";
		}
		for (let k = 0; k < otherDomChild.length; k++) {
			const element = otherDomChild[k];
			element.style.display = "none";
		}
		for (let k = 0; k < allDesEls.length; k++) {
			const element = allDesEls[k];
			element.style.display = "none";
		}

		const dom = this;
		const selectLable = evt.target;
		// 如果点击的是订阅plan就获取frequency元素
		const child = dom.querySelector(
			".Sealapp-Subscription-Option-Child_Unfurl"
		);
		// 判断点击的是否是订阅plan，并获得plan下的第一个frequency选项
		const inputChild = dom.querySelector(
			"input[name=sub-plan-selector-group-item]"
		);

		// 给点击的plan添加上样式（包括一次性购买）
		dom.style.backgroundColor = "#f2f7fe";
		dom.style.border = "1px solid #90b2e4";
		// 如果是订阅plan就展开
		if (child) {
			child.style.display = "block";
		}
		// 点击的元素是plan且是订阅plan就给第一个frequency添加选中样式
		if (
			inputChild &&
			selectLable.getAttribute("name") == "sub-plan-selector-group"
		) {
			var fathertag = inputChild.parentNode.parentNode.parentNode; //3级父节点
			if (
				fathertag.className ==
				"Sealapp-Subscription-Option_Unfurl_Label Sealapp_Unfurl_Label_Child "
			) {
				const desEl = fathertag.querySelector(".radio-description");
				desEl.style.display = "block";
			}
			inputChild.checked = true;
		}

		// 点击的不是plan元素（一次性购买），则修改sellingPlan的值为空
		if (
			dom.querySelector("input[id=PolarisRadioButton1]") &&
			document.querySelector(".selling_plan") != null
		) {
			document.querySelector(".selling_plan").value = "";
		} else {
			// 否则改为对应的订阅plan
			// 获取具体计划列表
			const frequency_plan_Arr = dom.querySelectorAll(
				"input[name=sub-plan-selector-group-item]"
			);
			frequency_plan_Arr.forEach(v => {
				if (v.checked) {
					var vfathertag = v.parentNode.parentNode.parentNode;
					desEl = vfathertag.querySelector(".radio-description");
					desEl.style.display = "block";
					frequency_plan_id = v.value;
					frequency_plan_price = v.getAttribute("data-price");
				}
			});
			// 修改价格
			dom.querySelector(".Sealapp-Subscription-Option_price").innerText =
				priceformat + frequency_plan_price;
			// 赋予选中计划值
			if (document.querySelector(".selling_plan") != null) {
				document.querySelector(".selling_plan").value = frequency_plan_id;
			}
			changePrice(frequency_plan_price, frequency_plan_id);
		}
	}

	// 定义监听事件
	function dropDownSelect() {
		// 给单选按钮组添加change事件
		const ipt = document.querySelectorAll(
			".Sealapp-Subscription-Option_DownList"
		);
		for (let i = 0; i < ipt.length; i++) {
			const element = ipt[i];

			element.addEventListener("change", checkGroupPlanShow);
		}
		// 给下拉列表块添加点击事件
		const dowLists = document.querySelectorAll(
			".Subscription-Option_DownList-Childs-Group"
		);
		for (let k = 0; k < dowLists.length; k++) {
			const element = dowLists[k];
			element.onblur = function () {
				const dropDownList = element.querySelector(".dropDownList-container");

				dropDownList.style.display = "none";
			};
			element.addEventListener("click", clickChildsPlanShow);
		}
	}

	// 更改选中事件
	function checkGroupPlanShow(evt) {
		let frequency_plan_id = 0;
		let frequency_plan_price = selected_variant.price / 100;
		const dom = this;
		// 获取需要排除掉的元素
		// 单选按钮 对应每一大的选项
		const otherDom = document.querySelectorAll(
			".Sealapp-Subscription-Option_DownList"
		);
		// 下拉列表
		const otherDomChild = document.querySelectorAll(
			".Sealapp-Subscription-Option-Child_DownList"
		);
		// 下拉列表中的子元素
		// const listChilds = document.querySelectorAll('.Subscription-Option_DownList-Childs')
		const listChilds = document.querySelectorAll(".dropDownList-container");
		//所有描述
		const allDesEls = document.querySelectorAll(".plan-description");
		// 把单选按钮的背景改成灰色 ,为不选中状态
		for (let i = 0; i < otherDom.length; i++) {
			const element = otherDom[i];
			element.style.backgroundColor = "#fafbfb";
		}
		// 把下拉列表 隐藏掉
		for (let k = 0; k < otherDomChild.length; k++) {
			const element = otherDomChild[k];
			element.style.display = "none";
		}
		// 把下拉列表中的子元素隐藏掉,防止下次打开时是展开状态
		for (let i = 0; i < listChilds.length; i++) {
			const element = listChilds[i];
			element.style.display = "none";
		}
		// 把描述隐藏掉,防止下次打开时是展开状态
		for (let i = 0; i < allDesEls.length; i++) {
			const element = allDesEls[i];
			element.style.display = "none";
		}
		// 把点击的块设置成浅蓝色
		dom.style.backgroundColor = "#f2f7fe";

		// 点击的不是plan元素（一次性购买），则修改sellingPlan的值为空
		if (
			dom.querySelector("input[id=PolarisRadioButton1]") &&
			document.querySelector(".selling_plan") != null
		) {
			document.querySelector(".selling_plan").value = "";
		} else {
			// 尝试把子列表展开
			const child = dom.querySelector(
				".Sealapp-Subscription-Option-Child_DownList"
			);

			child.style.display = "block";

			// 点击的是订阅plan修改显示价格
			if (evt.target.getAttribute("name") == "sub-plan-selector-group") {
				const domlistChilds = dom.querySelector(".plan-name");
				// const mainParentNode = getParentElement(dom, 1);
				const planDes = dom.querySelector(".dropDown-description");
				const showDescription = dom.querySelector(".plan-description");
				showDescription.innerText = planDes.innerText;
				showDescription.style.display = "block";
				child.querySelector(".dropDown-price").innerText =
					domlistChilds.innerText;
				// 获取具体计划列表
				const parentNode = getParentElement(domlistChilds, 1);
				const frequency_plan = parentNode.querySelector(
					"input[name=sub-plan-selector-group-item]"
				);
				if (frequency_plan) {
					frequency_plan_id = frequency_plan.value;
					frequency_plan_price = frequency_plan.getAttribute("data-price");
				}
				// 赋予选中计划值
				if (document.querySelector(".selling_plan") != null) {
					document.querySelector(".selling_plan").value = frequency_plan_id;
				}
				changePrice(frequency_plan_price, frequency_plan_id);
			}
		}
	}

	// 下拉列表块的点击事件
	function clickChildsPlanShow(evt) {
		let frequency_plan_id = 0;
		let frequency_plan_price = selected_variant.price / 100;
		const dom = this;

		const child = dom.querySelector(".Subscription-Option_DownList-Childs-One");
		// 获得下拉列表
		// const openChilds = dom.querySelectorAll('.Subscription-Option_DownList-Childs')
		const openChilds = dom.querySelector(".dropDownList-container");
		// 获得下拉块子节点的第一个元素 (第一个元素可以代表所有子元素)
		// const styles = window.getComputedStyle(openChilds[0])
		// 如果下拉块中子节点的样式是none,则修改成 block ,否则 改成none

		if (openChilds.style.display === "none") {
			openChilds.style.display = "block";
		} else {
			openChilds.style.display = "none";
		}

		if (dom.className.trim() === "Subscription-Option_DownList-Childs-Group") {
			// child.style.borderWidth = '0 0 1px 0';
			// 修改下拉框内显示的内容
			const planName = evt.target.querySelector(".plan-name");
			const parentNode = getParentElement(evt.target, 1);
			const planDes = parentNode.querySelector(".dropDown-description");
			const mainParentNode = getParentElement(dom, 2);
			const showDescription = mainParentNode.querySelector(".plan-description");
			showDescription.innerText = planDes.innerText;
			showDescription.style.display = "block";

			child.querySelector(".dropDown-price").innerText = evt.target.innerText;
			// 获取具体计划列表

			//点的是列表选项才改变显示价格
			if (evt.target.className.trim() === "plan-name") {
				const frequency_plan = parentNode.querySelector(
					"input[name=sub-plan-selector-group-item]"
				);
				if (frequency_plan) {
					frequency_plan_id = frequency_plan.value;
					frequency_plan_price = frequency_plan.getAttribute("data-price");
				}
				// 修改对应订阅plan显示的价格
				const parentDom = dom.parentElement.parentElement;
				parentDom.querySelector(
					".Sealapp-Subscription-Option_price"
				).innerText = priceformat + frequency_plan_price;
				changePrice(frequency_plan_price, frequency_plan_id);
			}

			// 赋予选中计划值
			if (document.querySelector(".selling_plan") != null) {
				document.querySelector(".selling_plan").value = frequency_plan_id;
			}
		}
	}

	function selectDescription() {
		if (plan == null) {
			return;
		}
		let selling_plans = [];
		plan.forEach(v => {
			if (v.app_id != "auto-subscription") {
				return;
			}

			v.selling_plans.forEach(s => {
				selling_plans.push(s.id);
			});
		});
		selling_plans = JSON.stringify(selling_plans);
		var request = new XMLHttpRequest();
		request.open(
			"post",
			baseUrl + "api/v1/plan/Description?selling_plans_Id=" + selling_plans
		);
		request.send();
		request.onreadystatechange = function () {
			if (request.readyState == 4) {
				if (request.status == 200) {
					description = JSON.parse(request.responseText);
					description = description.data;
					getVarData();
				}
			}
		};
	}

	function returnFloat(value) {
		const decimals = value.toString().split(".");
		if (decimals.length == 1) {
			value = value.toString() + ".00";
			return value;
		}
		if (decimals.length > 1 && decimals[1].length < 2) {
			value = value.toString() + "0";
			return value;
		}
		return value;
	}

	function getParentElement(el, classes) {
		if (classes > 0) {
			return getParentElement(el.parentNode, classes - 1);
		}
		return el;
	}

	function changePrice(planPrice, planId) {
		// 改变价格
		const compare_price =
			selected_variant.selling_plan_allocations.find(
				plan => plan.selling_plan_id == planId
			).compare_at_price / 100;
		if (document.querySelector(".price-item--regular") != null) {
			if (selected_variant.price / 100 != planPrice) {
				const discount = priceformat + (compare_price - planPrice);
				// 填充折扣样式
				const price_html =
					"<span class='sub-discount-price'>" +
					priceformat +
					planPrice +
					"</span><span class='sub-original-price' style='text-decoration: line-through;'>" +
					priceformat +
					compare_price +
					"</span><span class='sub-discount-description'>SAVE " +
					discount +
					"</span>";
				document.querySelector(".price-item--regular").innerHTML = price_html;
			} else {
				document.querySelector(".price-item--regular").innerHTML =
					priceformat + planPrice;
			}
		}
	}

	// 挂载样式
	function importStyles() {
		// cube模板样式
		const cubeStyle = `<style>
			.Sealapp-Subscription-Option{
					margin: 0 -0.4rem 0.8rem -0.4rem;
					font-size: 14px;
					font-weight: 500;
					display: flex;
					flex-wrap: wrap;
			}
			.Sealapp-Subscription-Option_Rectangle{
					width: 46%;
					margin: 0.4rem;
					display: flex;
					justify-content: center;
					align-items: center;
					flex-wrap: wrap;
					flex-direction: column;
					border: 1px solid #babfc3;
					border-radius: 4px;
					cursor: pointer;
					padding: 8px;
					text-align: center;
					word-break: break-all;
			}
			.Sealapp-Subscription-Option_Rectangle:hover{
					background-color: #f2f7fe !important;
					border: 1px solid #90b2e4 !important;
			}
			
			.Sealapp-Subscription-Option_Rectangle-top,
			.Sealapp-Subscription-Option_Rectangle_bottom{
					margin:  0.3rem auto;
			}
			.Sealapp-Subscription-Option_Rectangle_bottom{
					color: #2c6ecb;
			}
			.plan-name{
				 display:flex;
				 align-items: center;
				 position: relative;
			}
			.help{
				/* position: relative; */
				margin-left: 0.8rem;
				cursor: pointer;
				max-height:20px;
			}
			.description-content{
				top: 20px;
				position: absolute;
				background-color: #ffffff;
				border-radius: 4px;
				width: 250px;
				color:#000000;
				padding: 4px 8px;
				display: none;
				transform: translate(10%, 0%);
				z-index: 99999;
				box-shadow: 0px 0px 2px 0px #5c5f62;
			}
			
			.help:hover .description-content{
				display: block;
			}
			.sub-discount-price{
				margin-right: 10px;
				text-decoration: none;
				color: #da4f49;
			}
			
			.sub-discount-description{
				right: 0px;
				top: 25px;
				position: absolute;
				background-color: #ffffff;
				border-radius: 4px;
				width: ${screenWidth}px;
				max-width: 250px;
				color:#000000;
				padding: 4px 8px;
				display: none;
				transform: translate(10%, 0%);
				z-index: 99999;
				box-shadow: 0px 0px 2px 0px #5c5f62;
			}
		</style>`;

		// radio模板样式
		const radioStyle = `<style>
			.Sealapp-Subscription-Option{
					margin: 0 -0.4rem;
					font-size: 14px;
					font-weight: 500;
					display: flex;
					flex-wrap: wrap;
			}
			.Sealapp-Subscription_Unfurl{
					margin: 0.4rem 0;
			}
			.Sealapp-Subscription-Option_Unfurl{
					width: 100%;
					border-radius: 6px;
					padding: 0.4rem 0.6rem;
					margin: 0.4rem 0;
					background-color: #fafbfb;
			}
			.Sealapp-Subscription-Option_Unfurl_Label{
					width: 100%;
					display: flex;
			}
			.Sealapp-Subscription-Option-Child_Unfurl{
					margin-left: 1.6rem;
					display: none;
			}
			.Sealapp_Unfurl_Label_Child{
					margin-top: 0.4rem;
					display:flex;
					flex-direction: column;
			}
			.Sealapp-Subscription-Option_label-radio-Input{
					margin-right: 0.6rem;
			}
			.Sealapp-Subscription-Option_label-radio{
					color: aqua;
			}
			.Sealapp-Subscription-Option_price{
					display: block;
					margin-left: auto;
			}
			
			.Sealapp-Subscription input{
					accent-color: #2c6ecb;
			}
			.plan-info{
					display:flex;
			}
			.radio-description{
				margin-left: 24px;
				font-size: 10px;
				display:none;
			}
			.sub-discount-price{
				margin-right: 10px;
				text-decoration: none;
				color: #da4f49;
				}
			
			.sub-discount-description{
				margin-left: 10px;
				padding: 2px 6px;
				border: 1px solid #da4f49;
				border-radius: 3px;
				font-size: 10px;
				display: inline;
				position: relative;
				top: -3px;
				letter-spacing: 1px;
				color: #da4f49;
						}
			</style>`;

		// dropDown模板样式
		const dropDownStyle = `<style>
			.Sealapp-Subscription-Option{
					margin: 0 -0.4rem;
					font-size: 14px;
					font-weight: 500;
					display: flex;
					flex-wrap: wrap;
			}
			.Sealapp-Subscription_DownList{
					margin: 0.4rem 0;
			}
			.Sealapp-Subscription-Option_DownList{
					width: 100%;
					border-radius: 6px;
					padding: 0.4rem 0.6rem;
					margin: 0.4rem 0;
					background-color: #fafbfb;
			}
			.Sealapp-Subscription-Option_DownList_Label{
					display: flex;
			}
			.Sealapp-Subscription-Option-Child_DownList{
					margin:0.8rem 0rem 0.4rem 1.6rem;
					display: none;
					border-radius: 6px;
					background-color:#fff;
			}
			.Subscription-Option_DownList-Childs-One{
					position: relative;
					z-index:100;
					display: flex;
					align-items: center;
					border-radius: 6px;
					background-color:#fff;
					margin-top: 0.2rem;
					box-shadow:0 0 5px rgb(23 24 24 / 5%), 0 1px 2px rgb(0 0 0 / 15%);
			}
			.Subscription-Option_DownList-Childs-One{
					padding:0.4rem 0.8rem;
					user-select:none;
			}
			.Subscription-Option_DownList-Childs:hover{
					background: #f1f2f3;
			}
			
			.Subscription-Option_DownList-Childs-icon{
					display: block;
					margin-left: auto;
					pointer-events: none;
			}
			.Sealapp-Subscription-Option_label-radio-Input{
					margin-right: 0.6rem;
			}
			.Sealapp-Subscription-Option_label-radio{
					color: aqua;
			}
			.Sealapp-Subscription-Option_price{
					display: block;
					margin-left: auto;
			}
			
			.Sealapp-Subscription input{
					accent-color: #2c6ecb;
			}
			.Subscription-Option_DownList-Childs-Group{
					position: relative;
			}
			.dropDownList-container{  
					position: absolute;
					background-color: #fff;
					width: 100%;
					/* top: 35px; */
					box-shadow: 0px 3px 6px -3px rgba(23, 24, 24, 0.08), 0px 8px 20px -4px rgba(23, 24, 24, 0.12);
					border-bottom-left-radius: 8px;
					border-bottom-right-radius: 8px;
					z-index: 99;
					overflow: hidden;
			}
			.dropDown-description{
				padding:0.4rem 0.8rem;
				margin-left: 24px;
				font-size: 10px;
				display:none;
			}
			.plan-name{
				padding:0.4rem 0.8rem;
			}
			.plan-description{
				margin: 0.8rem 0rem 0.4rem 1.6rem;
				display: none;
				font-size: 12px;
			}
			.sub-discount-price{
				margin-right: 10px;
				text-decoration: none;
				color: #da4f49;
				}
			
			.sub-discount-description{
				margin-left: 10px;
				padding: 2px 6px;
				border: 1px solid #da4f49;
				border-radius: 3px;
				font-size: 10px;
				display: inline;
				position: relative;
				top: -3px;
				letter-spacing: 1px;
				color: #da4f49;
						}
			</style>`;

		switch (template) {
			case 1:
				document.head.insertAdjacentHTML("beforeend", cubeStyle);
				break;
			case 2:
				document.head.insertAdjacentHTML("beforeend", radioStyle);
				break;
			case 3:
				document.head.insertAdjacentHTML("beforeend", dropDownStyle);
				break;
		}
		if (customStyle) {
			document.head.insertAdjacentHTML(
				"beforeend",
				`<style>${customStyle}</style>`
			);
		}
	}
})();
