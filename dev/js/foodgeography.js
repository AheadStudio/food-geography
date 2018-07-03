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


			goEl: function() {
				var self = this;
					$goEl = $("[data-goto]");

				$goEl.on("click", function(event) {
					var $nameEl = $sel.body.find($(this).data("goto"));

					if ($nameEl.length === 0) {
						alert("Возможно вы не правильно указали элемент");
						return;
					} else {
						var posEl = $nameEl.offset().top;
						SUNSOCHI.common.go(posEl-150, 1000);
					}
					event.preventDefault();
				});

			},


			header: {

				init: function() {
					var self = this;

					self.scroll.init();
					self.inputSearch();
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

					$(document).mouseup(function (event) {
						if ($input.has(event.target).length === 0){
							$input.removeClass("active");
						}
					});
				}

			},


			maps: {
				googleMap: function() {
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
						var api = new google.maps.Map($map[0], options);
						var point = new google.maps.Marker({
							position: new google.maps.LatLng(lat, lng),
							map: api,
							icon: $map.data("icon")
						});

					});
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
									$container.find(".load-events-item").removeClass("load-events-item");
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
						$owlSlider = $('.owl-carousel');

					$owlSlider.owlCarousel({
						margin: 50,
						loop: true,
						autoWidth: true,
						nav: true,
						smartSpeed: 1500,
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
								items: 4,
							},
							1600: {
								items: 5,
							}
						}
					});

				}

			},


			bodyPreloader: {

				preloaderContainer : null,

				init: function() {
					var self= this;

					self.preloaderContainer = $(".body-preloader");

					self.hidePreloader();
				},


				hidePreloader: function() {
					var self = this;
					self.preloaderContainer.addClass("active");

					$sel.window.on("load", function() {

						/*setTimeout(function() {
							self.preloaderContainer.addClass("hide");
						}, 600);

						setTimeout(function() {
							self.preloaderContainer.remove();
						}, 1000);*/
					})
				}

			},



		};

	})();

	FOODGEOGRAPHY.bodyPreloader.init();
	FOODGEOGRAPHY.header.init();
	FOODGEOGRAPHY.maps.googleMap();
	FOODGEOGRAPHY.mobileMenu.init();
	FOODGEOGRAPHY.toggleTabs.init();
	FOODGEOGRAPHY.sliders.init();
	FOODGEOGRAPHY.ajaxLoader();

	ymaps.ready(function() {
		FOODGEOGRAPHY.maps.yandexMap.init();
	});

	FOODGEOGRAPHY.reload = function() {
		FOODGEOGRAPHY.toggleTabs.init();
	}

})(jQuery);
