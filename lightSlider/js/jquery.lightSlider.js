/** ==========================================================

* jquery lightSlider.js v1.0
* http://sachinchoolur.github.io/lightslider/
* Released under the Apache License - http://opensource.org/licenses/Apache-2.0

=========================================================/**/
;
(function ($, undefined) {
    "use strict";
    var defaults = {
        slideWidth: 270,
        slideMargin: 0,
        slideMove: 1,
        minSlide: 1,
        maxSlide: 8,
        mode: "slide",
        useCSS: true,
        speed: 1000, //ms'
        easing: '', //'ex cubic-bezier(0.25, 0, 0.25, 1)',//
        auto: false,
        pause: 3000,
        loop: true,
        controls: true,
        prevHtml: '',
        nextHtml: '',
        keyPress: true,
        pager: true,
        gallery: false,
        thumbWidth: 50,
        thumbMargin: 3,
        currentPagerPosition: 'middle',
        swipeThreshold: 40,
        onBeforeStart: function () {},
        onSliderLoad: function () {},
        onBefroreSlide: function () {},
        onAfterSlide: function () {},
        onBeforeNextSlide: function () {},
        onBeforePrevSlide: function () {}
    };
    $.fn.lightSlider = function (options) {
        var plugin = {};
        var settings = $.extend(true, {}, defaults, options);
        var $el = this;
        plugin.$el = this;
        var $children = $el.children(),
            length = 0,
            w = 0,
            on = false,
            elWidth = 0,
            $slide = '',
            scene = 0,
            pagerWidth = 0,
            slideWidth = 0,
            resize = false,
            slideOn = false,
            interval = '',
            isTouch = ('ontouchstart' in document.documentElement);
        var refresh = new Object();
        plugin = {
            doCss: function () {
                var support = function () {
                    var transition = ['transition', 'MozTransition', 'WebkitTransition', 'OTransition', 'msTransition', 'KhtmlTransition'];
                    var root = document.documentElement;
                    for (var i = 0; i < transition.length; i++) {
                        if (transition[i] in root.style) {
                            return true;
                        }
                    }
                };
                if (settings.useCSS && support()) {
                    return true;
                }
                return false;
            },
            keyPress: function () {
                if (settings.keyPress === true) {
                    $(document).bind('keyup', function (e) {
                        if (e.keyCode === 37) {
                            $el.goToPrevSlide();
                            clearInterval(interval);
                        } else if (e.keyCode === 39) {
                            $el.goToNextSlide();
                            clearInterval(interval);
                        }
                    });
                }
            },
            controls: function () {
                if (settings.controls) {
                    $el.after('<div class="csAction"><a class="csPrev">' + settings.prevHtml + '</a><a class="csNext">' + settings.nextHtml + '</a></div>');
                    var $prev = $slide.find('.csPrev');
                    var $next = $slide.find('.csNext');
                    $prev.bind('click', function () {
                        $el.goToPrevSlide();
                        clearInterval(interval);
                    });
                    $next.bind('click', function () {
                        $el.goToNextSlide();
                        clearInterval(interval);
                    });
                }
            },
            initialStyle: function () {
                $el.addClass('lightSlider').wrap("<div class='csSlideOuter'><div class='csSlideWrapper'></div></div>");
                $slide = $el.parent('.csSlideWrapper');
                settings.onBeforeStart.call(this);
                elWidth = $el.outerWidth();
                var min, max;
                refresh.calSW = function () {
                    min = (elWidth - ((settings.minSlide * settings.slideMargin) - settings.slideMargin)) / settings.minSlide;
                    max = (elWidth - ((settings.maxSlide * settings.slideMargin) - settings.slideMargin)) / settings.maxSlide;
                    if (settings.slideWidth === '') {
                        slideWidth = min;
                    } else if (min < settings.slideWidth) {
                        slideWidth = min;
                    } else if (max > settings.slideWidth) {
                        slideWidth = max;
                    } else {
                        slideWidth = settings.slideWidth;
                    }
                };
                refresh.sSW = function () {
                    length = $children.length;
                    w = length * (slideWidth + settings.slideMargin);
                    if (w % 1) {
                        w = w + 1;
                    }
                    $el.css('width', w + 'px');
                    $children.css('width', slideWidth + 'px');
                    $children.css({
                        'float': 'left',
                        'margin-right': settings.slideMargin + 'px'
                    });
                };
                refresh.calL = function () {
                    $children = $el.children();
                    length = $children.length;
                };
                if (this.doCss()) {
                    $slide.addClass('usingCss');
                }
                refresh.calL();
                $children.first().addClass('active');
                if (settings.mode === "slide") {
                    refresh.calSW();
                    refresh.sSW();
                } else {
                    var height = $children.height();
                    $el.css('height', height);
                    $el.addClass('csFade');
                    if (!this.doCss()) {
                        $children.not(".active").css('display', 'none');
                    }
                }
                $slide.css({
                    'max-width': '100%',
                    'position': 'relative'
                });
            },
            pager: function () {
                var $this = this;
                refresh.createPager = function () {
                    var maxSlide = '';
                    if (settings.mode === 'slide') {
                        maxSlide = parseInt(length / settings.slideMove);
                        var mod = length % settings.slideMove;
                        if (mod) {
                            maxSlide = maxSlide + 1;
                        }
                    } else {
                        maxSlide = length;
                    }
                    var i = 0,
                        pagers = '',
                        v = 0;
                    for (i = 0; i < maxSlide; i++) {
                        if (settings.mode === 'slide') {
                            v = i * ((slideWidth + settings.slideMargin) * settings.slideMove);
                        }
                        var thumb = $children.eq(i * settings.slideMove).attr('data-thumb');
                        if (settings.gallery === true) {
                            pagers += '<li style="float:left;width:' + settings.thumbWidth + 'px;margin-right:' + settings.thumbMargin + 'px"><a href="javascript:void(0)"><img src="' + thumb + '" /></a></li>';
                        } else {
                            pagers += '<li><a href="javascript:void(0)">' + (i + 1) + '</a></li>';
                        }
                        if (settings.mode === 'slide') {
                            if ((v) >= w - elWidth - settings.slideMargin) {
                                i = i + 1;
                                break;
                            }
                        }
                    }
                    var $cSouter = $slide.parent();
                    $cSouter.find('.csPager').html(pagers);
                    if (settings.gallery === true) {
                        pagerWidth = i * (settings.thumbMargin + settings.thumbWidth);
                        $cSouter.find('.csPager').css({
                            'width': pagerWidth + 'px',
                            'transform': 'translate(0px, 0px)',
                            'transition': '1s all'
                        });
                    }
                    var $pager = $cSouter.find('.csPager').find('li');
                    $pager.first().addClass('active');
                    $pager.on('click', function () {
                        scene = $pager.index(this);
                        $el.mode();
                        if (settings.gallery === true) {
                            $this.slideThumb();
                        }
                        clearInterval(interval);
                    });
                };
                if (settings.pager) {
                    var cl = '';
                    if (settings.gallery) {
                        cl = 'cSGallery';
                    } else {
                        cl = 'cSpg';
                    }
                    $slide.after('<ul class="csPager ' + cl + '"></ul>');
                    refresh.createPager();
                }
                settings.onSliderLoad.call(this);
            },
            active: function (ob, t) {
                if (this.doCss() && settings.mode === "fade") {
                    if (!$slide.hasClass('on')) {
                        $slide.addClass('on');
                    }
                }
                var sc = 0;
                if (scene * settings.slideMove < length) {
                    ob.removeClass('active');
                    if (!this.doCss() && settings.mode === "fade" && t === false) {
                        ob.fadeOut(settings.speed);
                    }
                    t === true ? sc = scene : sc = scene * settings.slideMove;
                    if (t === true) {
                        var l = ob.length;
                        var nl = l - 1;
                        if (sc + 1 >= l) {
                            sc = nl;
                        }
                    }
                    if (!this.doCss() && settings.mode === "fade" && t === false) {
                        ob.eq(sc).fadeIn(settings.speed);
                    }
                    ob.eq(sc).addClass('active');
                } else {
                    ob.removeClass('active');
                    ob.eq(ob.length - 1).addClass('active');
                    if (!this.doCss() && settings.mode === "fade" && t === false) {
                        ob.fadeOut(settings.speed);
                        ob.eq(sc).fadeIn(settings.speed);
                    }
                }
            },
            move: function (ob, v) {
                if (this.doCss()) {
                    ob.css('transform', 'translate(-' + v + 'px, 0px)');
                } else {
                    ob.css('position', 'relative').animate({
                        left: -v + 'px'
                    }, settings.speed, settings.easing);
                }
                var $thumb = $slide.parent().find('.csPager').find('li');
                this.active($thumb, true);
            },
            fade: function () {
                this.active($children, false);
                var $thumb = $slide.parent().find('.csPager').find('li');
                this.active($thumb, true);
            },
            slide: function () {
                var $this = this;
                refresh.calSlide = function () {
                    var slideValue = scene * ((slideWidth + settings.slideMargin) * settings.slideMove);
                    $this.active($children, false);
                    if ((slideValue) > w - elWidth - settings.slideMargin) {
                        slideValue = w - elWidth - settings.slideMargin;
                    } else if (slideValue < 0) {
                        slideValue = 0;
                    }
                    $this.move($el, slideValue);
                };
                refresh.calSlide();
                slideOn = true;
            },
            slideThumb: function () {
                var position;
                switch (settings.currentPagerPosition) {
                case 'left':
                    position = 0;
                    break;
                case 'middle':
                    position = (elWidth / 2) - (settings.thumbWidth / 2);
                    break;
                case 'right':
                    position = elWidth - settings.thumbWidth;
                }
                //if(pagerWidth>elWidth){
                    var thumbSlide = scene * ((settings.thumbWidth + settings.thumbMargin)) - (position);
                    if ((thumbSlide + pagerWidth ) > elWidth) {
                        thumbSlide = pagerWidth - elWidth - settings.thumbMargin;
                    } else if (thumbSlide < 0) {
                        thumbSlide = 0;
                    }
                    var $pager = $slide.parent().find('.csPager');
                    this.move($pager, thumbSlide);
                //}
            },
            auto: function () {
                if (settings.auto) {
                    interval = setInterval(function () {
                        $el.goToNextSlide();
                    }, settings.pause);
                }
            },
            enableTouch: function () {
                if (isTouch) {
                    var startCoords = {},
                        endCoords = {};
                    $slide.on('touchstart.lightSlider', function (e) {
                        endCoords = e.originalEvent.targetTouches[0];
                        startCoords.pageX = e.originalEvent.targetTouches[0].pageX;
                        startCoords.pageY = e.originalEvent.targetTouches[0].pageY;
                    });
                    $slide.on('touchmove.lightSlider', function (e) {
                        var orig = e.originalEvent;
                        endCoords = orig.targetTouches[0];
                        var xMovement = Math.abs(endCoords.pageX - startCoords.pageX);
                        var yMovement = Math.abs(endCoords.pageY - startCoords.pageY);
                        if ((xMovement * 3) > yMovement) {
                            e.preventDefault();
                        }
                    });
                    $slide.on('touchend.lightSlider', function () {
                        var distance = endCoords.pageX - startCoords.pageX,
                            swipeThreshold = settings.swipeThreshold;
                        if (distance >= swipeThreshold) {
                            $el.goToPrevSlide();
                            clearInterval(interval);
                        } else if (distance <= -swipeThreshold) {
                            $el.goToNextSlide();
                            clearInterval(interval);
                        }
                    });
                }
            },
            build: function () {
                var $this = this;
                $this.initialStyle();
                $this.auto();
                $this.enableTouch();
                $this.pager();
                $this.controls();
                $this.keyPress();
            }
        };
        plugin.build();
        refresh.init = function () {
            resize = true;
            refresh.calL();
            if (settings.mode === "slide") {
                $el.removeClass('csSlide');
            }
            elWidth = $slide.outerWidth();
            if (settings.mode === "slide") {
                refresh.calSW();
                refresh.sSW();
            }
            setTimeout(function () {
                if (resize === true) {
                    if (settings.mode === "slide") {
                        $el.addClass('csSlide');
                    }
                    resize = false;
                }
            }, 1000);
            if (settings.pager) {
                refresh.createPager();
            }
            if (settings.gallery === true) {
                plugin.slideThumb();
            }
            if (slideOn) {
                refresh.calSlide();
            }
        };
        $el.goToPrevSlide = function () {
            if (scene > 0) {
                settings.onBeforePrevSlide.call(this);
                scene--;
                $el.mode();
                if (settings.gallery === true) {
                    plugin.slideThumb();
                }
            } else {
                if (settings.loop === true) {
                    settings.onBeforePrevSlide.call(this);
                    var l = length;
                    l = l - 1;
                    scene = parseInt(l / settings.slideMove, 10);
                    $el.mode();
                    if (settings.gallery === true) {
                        plugin.slideThumb();
                    }
                }
            }
        };
        $el.goToNextSlide = function () {
            if ((scene * settings.slideMove) < length - settings.slideMove) {
                settings.onBeforeNextSlide.call(this);
                scene++;
                $el.mode();
                if (settings.gallery === true) {
                    plugin.slideThumb();
                }
            } else {
                if (settings.loop === true) {
                    settings.onBeforeNextSlide.call(this);
                    scene = 0;
                    $el.mode();
                    if (settings.gallery === true) {
                        plugin.slideThumb();
                    }
                }
            }
        };
        $el.mode = function () {
            if (on === false) {
                if (settings.mode === "slide") {
                    if (plugin.doCss()) {
                        $el.addClass('csSlide');
                        if (settings.speed !== '') {
                            $slide.css('transition-duration', settings.speed + 'ms');
                        }
                        if (settings.easing !== '') {
                            $slide.css('transition-timing-function', settings.easing);
                        }
                    }
                } else {
                    if (plugin.doCss()) {
                        if (settings.speed !== '') {
                            $el.css('transition-duration', settings.speed + 'ms');
                        }
                        if (settings.easing !== '') {
                            $el.css('transition-timing-function', settings.easing);
                        }
                    }
                }
            }
            settings.onBefroreSlide.call(this);
            if (settings.mode === "slide") {
                plugin.slide();
            } else {
                plugin.fade();
            }
            setTimeout(function () {
                settings.onAfterSlide.call(this);
            }, settings.speed);
            on = true;
        };
        $el.play = function () {
            clearInterval(interval);
            $el.goToNextSlide();
            interval = setInterval(function () {
                $el.goToNextSlide();
            }, settings.pause);
        };
        $el.pause = function(){
            clearInterval(interval);
        };
        $el.refresh = function () {
            refresh.init();
        };
        $el.getCurrentSlideCount = function () {
            return scene + 1;
        };
        $el.goToSlide = function (s) {
            scene = s;
            $el.mode();
        };
        $(window).on('resize', function (e) {
            e.preventDefault();
            refresh.init();
        });
        return this;
    };
}(jQuery));
