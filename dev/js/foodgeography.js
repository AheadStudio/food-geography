(function($) {
	var FOODGEOGRAPHY = (function() {

		var $sel = {};
		$sel.window = $(window);
		$sel.html = $("html");
		$sel.body = $("body", $sel.html);

		return {

			common: {
				go: function(topPos, speed, callback) {
					var curTopPos = $sel.window.scrollTop(),
						diffTopPos = Math.abs(topPos - curTopPos);
					$sel.body.add($sel.html).animate({
						"scrollTop": topPos
					}, speed, function() {
						if(callback) {
							callback();
						}
					});
				}
			},


			goEl: function() {
				var self = this;
					$goEl = $("[data-goto]");

				$goEl.on("click", function(event) {
					var $nameEl = $sel.body.find($(this).data("goto")),
						marginTop = $(this).data("gotoMargintop");

					if ($nameEl.length === 0) {
						alert("Возможно вы не правильно указали элемент");
						return;
					} else {
						var posEl = $nameEl.offset().top;
						FOODGEOGRAPHY.common.go(posEl-marginTop, 1000);
					}
					event.preventDefault();
				});

			},


			mobileMenu: {
				button: null,
				menu: null,

				init: function() {
					var self = this;

					self.button = $(".header-burger");
					self.menu = $(".mobile-menu");

					self.button.on("click", function() {
						var btn = $(this);

						if (!btn.hasClass("active")) {
							btn.addClass("active");
							self.show(self.menu);
						} else {
							btn.removeClass("active");
							self.hide(self.menu);
						}
					});
				},

				show: function(menu) {
					var self = this;

					menu.addClass("active-block");

					setTimeout(function() {

						menu.addClass("active-show");

						$sel.body.addClass("open-menu");

					}, 300);
				},

				hide: function(menu) {
					var self = this;

					menu.removeClass("active-show");

					setTimeout(function() {

						$sel.body.removeClass("open-menu");

					}, 300);

					setTimeout(function() {

						menu.removeClass("active-block");

					}, 600);
				},

			},


			header: {

				init: function() {
					var self = this;

					self.scroll.init();
					self.inputSearch();
					self.regionMenu();
				},


				scroll: {

					init: function() {
						$sel.window.on("scroll", function() {
							var hh = $(".page-header").outerHeight(),
								sTop = $sel.window.scrollTop();
							if(sTop > hh+50) {
								$sel.body.addClass("fixed-header");
								setTimeout(function() {
									$sel.body.addClass("fixed-header--show");
								}, 100);
							} else {
								$sel.body.removeClass("fixed-header--show");
								$sel.body.removeClass("fixed-header");
							}

						});

					}

				},

				regionMenu: function() {
					$sel.window.on("load", function() {
						var self = this,
							move = true,
							$container = $(".region-detail-fixed");

						if ($sel.window.width() > "750") {
							if ($container.length > 0) {
								var $nameDirectory = $container.find(".region-detail-name"),
									nameDirectoryTop = $nameDirectory.offset().top,
									nameDirectoryLeft = $nameDirectory.offset().left,
									blockOffsetTop = $container.offset().top;


								$sel.window.on("scroll", function() {
									var	offsetTop = $sel.window.scrollTop();

									if (offsetTop >= blockOffsetTop-60) {
										if (!$sel.body.hasClass("region-fixed")) {
											var $firstItem = $container.find(".region-detail-sections-item:first"),
												firstItemX = $firstItem.offset().left,
												firstItemY = $firstItem.offset().top;
										}

										$sel.body.addClass("region-fixed");
										$nameDirectory.css("transform", "translate(" + Number(firstItemX-nameDirectoryLeft-70) + "px, 3px)");

										setTimeout(function() {
											if ($sel.body.hasClass("region-fixed")) {
												$sel.body.addClass("region-fixed--show");
											}
										}, 300);

									} else {

										$sel.body.removeClass("region-fixed--show");
										$sel.body.removeClass("region-fixed");
										$nameDirectory.css("transform", "translate(0,0)");
									}

								});
							}
						}

					})

				},

				inputSearch: function() {
					var self = this,
						$input = $(".form-row--search:not(.notshow)");

					$input.on("click", function() {
						var el = $(this);

						$sel.body.find($input).removeClass("active");
						if (!el.hasClass("active")) {
							el.addClass("active");
						}
					});

					$input.on("input", function() {
						var el = $(this),
							valEl = el.find("input").val();

						if (valEl != "") {
							el.addClass("active active--show");
						} else {
							el.removeClass("active active--show");
						}

					});

					$(document).mouseup(function (event) {
						if ($input.has(event.target).length === 0 && !$input.hasClass("active--show")){
							$input.removeClass("active");
						}
					});

				}

			},


			maps: {
				googleMap: {

					init: function() {
						var self =  this;

						self.startGoogle();
					},

					startGoogle: function() {
						var self = this;

						$("#mapGoogle", $sel.body).each(function() {
							var $map = $(this),
								lng = parseFloat($map.data("lng"), 10) || 0,
								lat = parseFloat($map.data("lat"), 10) || 0,
								zoom = parseInt($map.data("zoom"));

							var options = {
								center: new google.maps.LatLng(lat, lng),
								zoom: zoom,
								mapTypeControl: false,
								panControl: false,
								zoomControl: true,
								zoomControlOptions: {
									style: google.maps.ZoomControlStyle.LARGE,
									position: google.maps.ControlPosition.TOP_RIGHT
								},
								scaleControl: true,
								streetViewControl: true,
								streetViewControlOptions: {
									position: google.maps.ControlPosition.TOP_RIGHT
								},
								mapTypeId: google.maps.MapTypeId.ROADMAP,
								styles: [
									{"featureType": "landscape", "stylers": [
										{"saturation": -100},
										{"lightness": 0},
										{"visibility": "on"}
									]},
									{"featureType": "poi", "stylers": [
										{"saturation": -300},
										{"lightness": -10},
										{"visibility": "simplified"}
									]},
									{"featureType": "road.highway", "stylers": [
										{"saturation": -100},
										{"visibility": "simplified"}
									]},
									{"featureType": "road.arterial", "stylers": [
										{"saturation": -100},
										{"lightness": 0},
										{"visibility": "on"}
									]},
									{"featureType": "road.local", "stylers": [
										{"saturation": -100},
										{"lightness": 0},
										{"visibility": "on"}
									]},
									{"featureType": "transit", "stylers": [
										{"saturation": -100},
										{"visibility": "simplified"}
									]},
									{"featureType": "administrative.province", "stylers": [
										{"visibility": "off"}
									]},
									{"featureType": "water", "elementType": "labels", "stylers": [
										{"visibility": "on"},
										{"lightness": -25},
										{"saturation": -100}
									]},
									{"featureType": "water", "elementType": "geometry", "stylers": [
										{"hue": "#ffff00"},
										{"lightness": -25},
										{"saturation": -97}
									]}
								]
							};

							var iconMap= {
								url: $map.data("icon"),
								size: new google.maps.Size(45, 65),
							};

							var map = new google.maps.Map($map[0], options);

							var marker = new google.maps.Marker({
								position: new google.maps.LatLng(lat, lng),
								map: map,
								icon: $map.data("icon")
							});

							var infoRegion = $map.data("info");

							var infoBubbleContent =
								'<div class="region-tooltip">' +
    								'<a href="'+infoRegion.link+'" class="region-tooltip-container" style="background-image: url('+infoRegion.icon+')"></a>' +
							        '<a href="'+infoRegion.link+'" class="link region-tooltip-name">' + infoRegion.name + '</a>' +
									'<div class="region-tooltip-section">' +
										'<a href="'+infoRegion.link+'" class="link region-tooltip-section-item">О регионе</a>' +
										'<a href="'+infoRegion.link+'" class="link region-tooltip-section-item">История</a>' +
										'<a href="'+infoRegion.link+'" class="link region-tooltip-section-item">Достопримечательности</a>' +
										'<a href="'+infoRegion.link+'" class="link region-tooltip-section-item">Культура и обычаи</a>' +
										'<a href="'+infoRegion.link+'" class="link region-tooltip-section-item">Кухня</a>' +
										'<a href="'+infoRegion.link+'" class="link region-tooltip-section-item">Продукты</a>' +
									'</a>'+
								'</div>';

							infoBubble = new InfoBubble({
								maxWidth: "300px",
								width: "100%",
								maxHeight: "100%",
								shadowStyle: 0,
								content: infoBubbleContent,
								map: map,
								padding: "25px 75px",
								backgroundColor: "#fff",
								borderRadius: 0,
								borderWidth: 1,
								borderColor: '#a9a9a9',
								disableAutoPan: true,
								hideCloseButton: true,
								arrowPosition: 30,
								arrowSize: 0,
								backgroundClassName: "region-tooltip-class",
							});


							google.maps.event.addListener(marker, 'click', function() {
								if (!infoBubble.isOpen()) {
									infoBubble.open(map, marker);
								}
							});


							google.maps.event.addListener(map, 'click', function() {
								infoBubble.close();
							});

						});

					},


					fromLatLngToPoint: function(latLng, map) {
						var topRight = map.getProjection().fromLatLngToPoint(map.getBounds().getNorthEast());
						var bottomLeft = map.getProjection().fromLatLngToPoint(map.getBounds().getSouthWest());
						var scale = Math.pow(2, map.getZoom());
						var worldPoint = map.getProjection().fromLatLngToPoint(latLng);
						return new google.maps.Point((worldPoint.x - bottomLeft.x) * scale, (worldPoint.y - topRight.y) * scale);
					}

				},

				yandexMap: {
					$map: false,
					map: false,
					points: false,
					init: function() {
						var self = this;
						self.$map = $("#mapYandex", $sel.body);

						if(!self.$map.length) {
							return false;
						}

						self.map = new ymaps.Map(self.$map[0], {
							center: self.$map.data("center"),
							zoom: self.$map.data("zoom")
						});
						self.map.behaviors.disable("scrollZoom");
						self.map.controls.remove("trafficControl").remove("scaleLine").remove("typeSelector").remove("searchControl");
						self.points = eval(self.$map.data("points"));

						var point = self.points[0],
							placemark,
							pointPosition = point.position.split(","),
							iconSize,
							iconW = point.iconW,
							iconH = point.iconH;


						if (iconW || iconH) {
							iconSize = [iconW, iconH];
						} else {
							iconSize = "";
						}

						placemark = new ymaps.Placemark(
							[parseFloat(pointPosition[0]), parseFloat(pointPosition[1])], {
								balloonContent: point.description,
							}, {
								iconImageHref: point.icon,
								iconImageSize: iconSize,
							}
						);

						self.map.geoObjects.add(placemark);
					}
				},

			},


			toggleTabs: {

				showEl: [],

				init: function() {
					var self = this,
						$tabItem = $("[data-tab]");

					$tabItem.each(function functionName() {
						var el = $(this);
						if (!el.hasClass("active")) {
							var hideTab = $("[data-item *='"+ el.data("tab") +"']");

							el.removeClass("active-tab");
							hideTab.addClass("hide-block");
							hideTab.addClass("hide");

						} else {
							el.addClass("active-tab");
						}
					});
					$tabItem.on("click", function(e) {
						var item = $(this),
							dataItem = item.data("tab"),
							$allTabs = $("[data-tab *='" + dataItem.split("_")[0] + "']"),
							$allItem = $("[data-item *= '" + dataItem.split("_")[0] + "']"),
							$showItem;

						if (dataItem.indexOf("reset") !== -1) {
							self.hideAll($allItem);
							item.removeClass("active-tab");
							item.removeClass("active");
							event.preventDefault();
						}

						$allTabs.removeClass("active");
						$allTabs.removeClass("active-tab");

						setTimeout(function() {
							item.addClass("active");
							item.addClass("active-tab");
						}, 50);

						$showItem = $("[data-item='" + dataItem + "']");

						self.show($showItem, $allItem);

					});

				},

				show: function(el, elements) {
					var self = this;

					elements.addClass("hide");
					setTimeout(function() {
						elements.addClass("hide-block");
						el.removeClass("hide-block");

						setTimeout(function() {
							el.removeClass("hide");
						},50);

					},300);

				},

				hideAll: function(elements) {
					var self = this;

					elements.addClass("hide");
					elements.addClass("hide-block");

				}

			},


			ajaxLoader: function() {
				$sel.body.on("click", ".load-more", function(event) {
					var $linkAddress = $(this),
						href = $linkAddress.attr("href"),
						selector = $linkAddress.data("itemsselector"),
						$container = $($linkAddress.data("container"));

					$linkAddress.addClass("loading");

					(function(href, $container, $link, selector) {
						$.ajax({
							url: href,
							success: function(data) {
								var $data = $('<div />').append(data),
									$items = $data.find(selector),
									$preloader = $data.find(".load");

								$items.addClass("load-events-item");
								$container.append($items);
								$link.parent().remove();

								if($preloader && $preloader.length) {
									$container.parent().append($preloader);
								}

								setTimeout(function() {
									var timer = 50,
										$getElements = $container.find(".load-events-item");

									$getElements.each(function() {
										var el = $(this);
										setTimeout(function() {
											el.removeClass("load-events-item");
										}, timer);
										timer += 100;
									});

									$linkAddress.removeClass("loading");
								}, 100);

								setTimeout(function() {
									FOODGEOGRAPHY.reload();
								},200)
							}
						})
					})(href, $container, $linkAddress, selector);
					event.preventDefault();
				})
			},


			sliders: {
				init: function() {
					var self = this;

					self.owlSlider();
				},

				owlSlider: function() {
					var self = this,
						$owlSliderOne = $(".slider--one"),
						$owlSliderFull = $(".slider--full");

					$owlSliderFull.owlCarousel({
						margin: 50,
						loop: true,
						autoWidth: false,
						nav: true,
						smartSpeed: 600,
						dots: false,
						lazyLoad: true,
						lazyLoadEager: 1,
						autoplayHoverPause: true,
						slideTransition: "cubic-bezier(0.250, 0.460, 0.450, 0.940)",
						navText: [
							'<svg data-name="Слой 1" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 164 160"><path class="arrow" d="M78 120l3.52-3.53-34-33.92 73.92-.12v-5l-73.92.11 33.92-34L77.91 40 41.49 76.53 38 80.07l3.53 3.52L62 104z" fill="#4a4a4a"/><path d="M82 156A76 76 0 1 0 6 80a76 76 0 0 0 76 76z" fill="none" stroke="#4a4a4a"/></svg>',
							'<svg data-name="Слой 1" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 164 160"><path class="arrow" d="M81.44 40l-3.52 3.53 34 34H38v5h73.92l-34 34 3.52 3.47 36.48-36.47 3.52-3.53-3.52-3.53L97.48 56z" fill="#4a4a4a"/><path d="M82 156A76 76 0 1 0 6 80a76 76 0 0 0 76 76z" fill="none" stroke="#4a4a4a"/></svg>'
						],
						responsive : {
							0: {
								items: 1,
								autoWidth: false,
							},
							780: {
								items: 2,
							},
							1200: {
								items: 2,
							},
							1600: {
								items: 2,
							}
						}
					});

					$owlSliderOne.owlCarousel({
						//loop: true,
						margin: 20,
						nav: true,
						smartSpeed: 1500,
						dots: false,
						lazyLoad: true,
						lazyLoadEager: 1,
						autoplayHoverPause: true,
						slideTransition: "cubic-bezier(0.250, 0.460, 0.450, 0.940)",
						items: 1,
						navText: [
							'<svg data-name="Слой 1" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 120 80"><path d="M40.61 80.82l3.52-3.52-33.89-33.89h109.62v-5H10.24L44.13 4.54 40.61 1 4.23 37.4.71 40.92l3.52 3.52z" fill="#211300"/></svg>',
							'<svg data-name="Слой 1" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 119.15 79.8"><path d="M79.29-.02l-3.56 3.54 33.88 33.89H0v5h109.61L75.73 76.28l3.56 3.52 36.38-36.38 3.52-3.52-3.52-3.52z" fill="#211300"/></svg>'
						],
						onInitialized: function (el) {
							var currentSlide = el.item.index + 1,
								allSlide = el.item.count,
								$parent = $(el.currentTarget).closest(".slider-container"),
								$currentItem = $parent.find(".slider-nav-counter-current");
								$allItem = $parent.find(".slider-nav-counter-all");

							$currentItem.text(currentSlide);
							$allItem.text(allSlide);
						}
					});
					$owlSliderOne.on("changed.owl.carousel", function(el){
						var currentSlide = el.item.index + 1,
							$parent = $(el.currentTarget).closest(".slider-container"),
							$currentItem = $parent.find(".slider-nav-counter-current");
							$allItem = $parent.find(".slider-nav-counter-all");

						$currentItem.text(currentSlide);
					});

				}

			},


			bodyPreloader: {

				preloaderContainer : null,

				init: function() {
					var self= this;

					self.preloaderContainer = $(".body-preloader");

					self.showHidePreloader();
				},


				showHidePreloader: function() {
					var self = this;

					$sel.body.addClass("show-logo");
					self.preloaderContainer.addClass("active");
					$sel.body.addClass("open-menu");

					FOODGEOGRAPHY.animationLoadingPage.animateSvgLogo();

					$sel.window.on("load", function() {

						setTimeout(function() {
							self.preloaderContainer.addClass("hide");
						}, 2000);

						setTimeout(function() {
							$sel.body.removeClass("show-logo");
							$sel.body.addClass("hide-logo");
							$sel.body.removeClass("open-menu");
						}, 2600);

						setTimeout(function() {
							self.preloaderContainer.remove();
						}, 3200);
					})
				}

			},


			filter: {

				$filterItem: null,

				$containerItem: null,

				init: function() {
					var self = this;

					self.$filterItem = $("[data-filter]");
					self.start();
				},


				start: function() {
					var self = this;


					self.$filterItem.on("click", function(event) {
						var el = $(this),
							$allEl = $("[data-filter]"),
							dataItem = el.data("filter"),
							href = el.data("filterUrl"),
							$container = $(el.data("filterContainer")),
							$allItem = $("[data-filter-item]"),
							$showItem;

						event.preventDefault();

						(function(el, href, $container, $allItem, $allEl) {

							$.ajax({
								url: href,
								success: function(data) {
									var $data = $('<div />').append(data),
										$items;

									if (dataItem == "all") {
										$items = $data.find("[data-filter-item]");
									} else {
										$items = $data.find("[data-filter-item="+dataItem+"]");
									}

									// add hide class on new elements
									$items.addClass("hide");
									$items.addClass("hide-block");

									// add class old all elements
									$allItem.addClass("hide");

									// remove class all click elements
									$allEl.removeClass("active");

									// add class click element
									el.addClass("active");

									setTimeout(function() {
										$allItem.addClass("hide-block");

										$container.empty();

										$container.append($items);

										$items.removeClass("hide-block");

										setTimeout(function() {
											$items.removeClass("hide");
										}, 200);

									},300);

								}
							})

						})(el, href, $container, $allItem, $allEl);

					})

				},


			},


			toggleElements: {

				init: function() {
					var self = this;

					self.toggleBlock();
					self.toggleText();
				},

				toggleText: function() {
					var self = this,
						$toggle = $(".toggle-text");

					$toggle.each(function() {
						(function(el) {

							el.on("click", function(e) {
								var $toggleEl = $(this),
									toggleName = $toggleEl.data("toggleLink"),
									toggleLinkTextNew = $toggleEl.attr("data-toggle-text"),
									toggleLinkTextOld = $toggleEl.text(),
									$points = $sel.body.find("[data-toggle-text-points='"+toggleName+"']")
									$container = $sel.body.find("[data-toggle-text='"+toggleName+"']");

								if ($toggleEl.hasClass("active")) {
									$toggleEl.attr("data-toggle-text", toggleLinkTextOld);
									$toggleEl.text(toggleLinkTextNew);

									$container.removeClass("active-animation");

									if ($points) {
										$points.css("display", "inline");
									}

									setTimeout(function() {
										$toggleEl.removeClass("active");
										$container.removeClass("active");
									}, 300);

								} else {
									$toggleEl.addClass("active");
									$container.addClass("active");

									$toggleEl.attr("data-toggle-text", toggleLinkTextOld);
									$toggleEl.text(toggleLinkTextNew);

									if ($points) {
										$points.css("display", "none");
									}

									setTimeout(function() {
										$container.addClass("active-animation");
									}, 300);

								}

								e.preventDefault();
							});

						})($(this));
					})

				},

				toggleBlock: function() {
					var self = this,
						$toggle = $(".toggle");

					$toggle.each(function() {
						(function(el) {
							el.on("click", function(e) {
								var $toggleEl = $(this),
									toggleId = $toggleEl.attr("id"),
									$allContainer = $sel.body.find("[data-toggle]"),
									$container = $sel.body.find("[data-toggle='"+toggleId+"']");

								if (!$toggleEl.hasClass("active")) {
									$toggle.removeClass("active");

									$allContainer.removeClass("active");
									$allContainer.removeClass("active-animation");

									$toggleEl.addClass("active");
									$container.addClass("active");

									setTimeout(function() {
										$container.addClass("active-animation");
									}, 300);
								} else {
									FOODGEOGRAPHY.common.go($container.offset().top-100, 1000);
								}

								e.preventDefault();
							})
						})($(this));
					})
				},

			},


			forms:{
				init: function() {
					var self = this;

					self.validate.init($(".form"));
				},

				validate: {

					init: function($form) {
						var self = this;

						$form.each(function() {
							(function($form) {
								var $formFields = $form.find("[data-error]"),
									formParams = {
										rules: {
										},
										messages: {
										}
									};

								$.validator.addMethod("mobileRU", function(phone_number, element) {
									phone_number = phone_number.replace(/\(|\)|\s+|-/g, "");
									return this.optional(element) || phone_number.length > 5 && phone_number.match(/^((8|\+7)[\- ]?)?(\(?\d{3}\)?[\- ]?)?[\d\- ]{6,10}$/);
								}, "Error");

								$formFields.each(function() {
									var $field = $(this),
										fieldPattern = $field.data("pattern"),
										fieldError = $field.data("error");
									if(fieldError) {
										formParams.messages[$field.attr("name")] = $field.data("error");
									} else {
										formParams.messages[$field.attr("name")] = "Ошибка заполнения";
									}
									if(fieldPattern) {
										formParams.rules[$field.attr("name")] = {};
										formParams.rules[$field.attr("name")][fieldPattern] = true;
									}
								});

								if($form.data("success")) {
								}
								$form.validate(formParams);

							})($(this))
						});

					},

				},

			},


			popup: {

				init: function() {
					var self = this;
					self.fancyBox();
				},
				fancyBox: function() {
					var $popupItems = $('[data-fancybox="certificate"]');

					$popupItems.fancybox({
						arrows : true,
						keyboard : true,
						buttons : [
							'close'
						],
						defaultType : 'image',
						hideScrollbar: false,
						animationEffect: "zoom-in-out",
					});

				}
			},


			animationLoadingPage: {

				loadItems: {},

				init: function() {
					var self = this,
						$domLoadItems = $sel.body.find("[data-load]");

					self.loadItems = $domLoadItems;
					self.loadPage();
				},

				loadPage: function() {
					var self = this,
						timer = 3000;

					$sel.window.on("load", function() {

						self.loadItems.each(function() {
							var el = $(this);

							el.addClass("element-loading");
							el.addClass(el.data("loadEffect"));

							setTimeout(function functionName() {
								el.addClass("active-load");
							}, timer);

							setTimeout(function functionName() {
								el.removeClass("element-loading");
								el.removeClass(el.data("loadEffect"));
								el.removeClass("active-load");
							}, timer + 1000);

							timer += 100;
						});

					});

				},

				animateSvgLogo: function() {
					var $elSvg = $("#logo-preloader");

					if ($elSvg.length > 0) {
						new Vivus("logo-preloader", {duration: 200}, function() {});
					}

				},

			},



		};


	})();

	FOODGEOGRAPHY.bodyPreloader.init();

	FOODGEOGRAPHY.goEl();
	FOODGEOGRAPHY.header.init();

	FOODGEOGRAPHY.maps.googleMap.init();

	FOODGEOGRAPHY.forms.init();

	FOODGEOGRAPHY.mobileMenu.init();

	FOODGEOGRAPHY.toggleTabs.init();
	FOODGEOGRAPHY.filter.init();

	FOODGEOGRAPHY.sliders.init();

	FOODGEOGRAPHY.popup.init();

	FOODGEOGRAPHY.animationLoadingPage.init();

	FOODGEOGRAPHY.ajaxLoader();

	FOODGEOGRAPHY.toggleElements.init();

	ymaps.ready(function() {
		FOODGEOGRAPHY.maps.yandexMap.init();
	});

	FOODGEOGRAPHY.reload = function() {
		FOODGEOGRAPHY.filter.init();

		FOODGEOGRAPHY.toggleTabs.init();
	}

})(jQuery);
