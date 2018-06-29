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


		};

	})();

	FOODGEOGRAPHY.header.init();
	FOODGEOGRAPHY.maps.googleMap();
	FOODGEOGRAPHY.mobileMenu.init();

	ymaps.ready(function() {
		FOODGEOGRAPHY.maps.yandexMap.init();
	});
})(jQuery);
