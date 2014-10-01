/** ==========================================================

* jquery lightSlider.js v1.1.0
* http://sachinchoolur.github.io/lightslider/
* Released under the MIT License - http://opensource.org/licenses/mit-license.html  ---- FREE ----

=========================================================/**/
;
(function($, undefined) {
    "use strict";
    var defaults = {
        item: 3,
        slideMove: 1,
        slideMargin: 10,
        addClass: '',
        mode: "slide",
        useCSS: true,
        cssEasing: 'ease', //'cubic-bezier(0.25, 0, 0.25, 1)',//
        easing: 'linear', //'for jquery animation',//
        speed: 400, //ms'
        auto: false,
        loop: false,
        pause: 2000,
        keyPress: true,
        controls: true,
        prevHtml: '',
        nextHtml: '',
        rtl: false,
        adaptiveHeight: false,
        vertical: false,
        verticalHeight: 500,
        vThumbWidth: 100,
        thumbItem: 10,
        pager: true,
        gallery: false,
        galleryMargin: 5,
        thumbMargin: 5,
        currentPagerPosition: 'middle',
        enableTouch: true,
        enableDrag: true,
        freeMove: false,
        swipeThreshold: 40,
        responsive: [],
        onBeforeStart: function($el) {},
        onSliderLoad: function($el) {},
        onBeforeSlide: function($el,scene) {},
        onAfterSlide: function($el,scene) {},
        onBeforeNextSlide: function($el,scene) {},
        onBeforePrevSlide: function($el,scene) {}
    };
    $.fn.lightSlider = function(options) {
        if (this.length > 1) {
            this.each(function() {
                $(this).lightSlider(options);
            });
            return this;
        }
        var plugin = {};
        var settings = $.extend(true, {}, defaults, options);
        var settingsTemp = {};
        var $el = this;
        plugin.$el = this;
        if (settings.mode === 'fade') {
            settings.vertical = false;
        }
        var $children = $el.children(),
            windowW = $(window).width(),
            breakpoint = null,
            resposiveObj = null,
            length = 0,
            w = 0,
            on = false,
            elSize = 0,
            $slide = '',
            scene = 0,
            slideValue = 0,
            pagerWidth = 0,
            slideWidth = 0,
            thumbWidth = 0,
            resize = false,
            slideOn = false,
            interval = '',
            isTouch = ('ontouchstart' in document.documentElement);
        var refresh = new Object();
        refresh.chbreakpoint = function() {
            windowW = $(window).width();
            if (settings.responsive.length) {
                var item = settings.item;
                if (windowW < settings.responsive[0].breakpoint) {
                    for (var i = 0; i < settings.responsive.length; i++) {
                        if (windowW < settings.responsive[i].breakpoint) {
                            breakpoint = settings.responsive[i].breakpoint;
                            resposiveObj = settings.responsive[i];
                        }
                    }
                }
                if (typeof resposiveObj !== "undefined" && resposiveObj != null) {
                    for (i in resposiveObj.settings) {
                        if (typeof settingsTemp[i] == "undefined" || settingsTemp[i] == null) {
                            settingsTemp[i] = settings[i];
                        }
                        settings[i] = resposiveObj.settings[i];
                    }
                }
                if (!$.isEmptyObject(settingsTemp) && windowW > settings.responsive[0].breakpoint) {
                    for (i in settingsTemp) {
                        settings[i] = settingsTemp[i];
                    }
                }
                if (slideValue > 0 && slideWidth > 0) {
                    if (item !== settings.item) {
                        scene = Math.round(slideValue / ((slideWidth + settings.slideMargin) * settings.slideMove));
                    }
                }
            }
        };
        plugin = {
            doCss: function() {
                var support = function() {
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
            keyPress: function() {
                if (settings.keyPress === true) {
                    $(document).bind('keyup', function(e) {
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
            controls: function() {
                if (settings.controls) {
                    $el.after('<div class="lSAction"><a class="lSPrev">' + settings.prevHtml + '</a><a class="lSNext">' + settings.nextHtml + '</a></div>');
                    var $prev = $slide.find('.lSPrev');
                    var $next = $slide.find('.lSNext');
                    $prev.bind('click', function(e) {
                        e.preventDefault();
                        $el.goToPrevSlide();
                        clearInterval(interval);
                    });
                    $next.bind('click', function(e) {
                        e.preventDefault();
                        $el.goToNextSlide();
                        clearInterval(interval);
                    });
                }
            },
            initialStyle: function() {
                settings.onBeforeStart.call(this, $el);
                refresh.chbreakpoint();
                $el.addClass('lightSlider').wrap("<div class='lSSlideOuter " + settings.addClass + "'><div class='lSSlideWrapper'></div></div>");
                $slide = $el.parent('.lSSlideWrapper');
                if (settings.rtl === true) {
                    $slide.parent().addClass('lSrtl');
                }
                if (settings.vertical === true) {
                    $slide.parent().addClass('vertical');
                    elSize = settings.verticalHeight;
                    $slide.css('height', elSize + 'px');
                } else {
                    elSize = $el.outerWidth();
                }
                refresh.calSW = function() {
                    slideWidth = (elSize - ((settings.item * (settings.slideMargin)) - settings.slideMargin)) / settings.item;
                };
                refresh.sSW = function() {
                    length = $children.length;
                    w = length * (slideWidth + settings.slideMargin);
                    if (w % 1) {
                        w = w + 1;
                    }
                    var property = (settings.vertical === true) ? "height" : "width";
                    var gutter = (settings.vertical === true) ? "margin-bottom" : "margin-right";
                    if (settings.rtl == true && settings.vertical === false) {
                        gutter = "margin-left";
                    }
                    $el.css(property, w + 'px');
                    $children.css(property, slideWidth + 'px');
                    $children.css(gutter, settings.slideMargin + 'px');
                };
                refresh.calL = function() {
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
                    if (settings.adaptiveHeight === true && settings.vertical === false) {
                        $el.css({
                            'height': $children.first().height()
                        });
                        $children.first().find('img').load(function() {
                            $el.css({
                                'height': $children.first().height()
                            });
                        });
                    }

                } else {
                    $el.css({
                        'height': '0px',
                        'padding-bottom': ($children.height() * 100) / elSize + '%'
                    });
                    $children.first().find('img').load(function() {
                        $el.css({
                            'height': '0px',
                            'padding-bottom': ($children.first().height() * 100) / elSize + '%'
                        });
                    });
                    $el.addClass('lSFade');
                    if (!this.doCss()) {
                        $children.not(".active").css('display', 'none');
                    }
                }
            },
            pager: function() {
                var $this = this;
                refresh.createPager = function() {
                    thumbWidth = (elSize - ((settings.thumbItem * (settings.thumbMargin)) - settings.thumbMargin)) / settings.thumbItem;
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
                            if (settings.vertical === true) {
                                var property = 'height';
                                var gutter = 'margin-bottom';
                            } else {
                                var property = 'width';
                                var gutter = 'margin-right';
                            }
                            pagers += '<li style="width:100%;' + property + ':' + thumbWidth + 'px;' + gutter + ':' + settings.thumbMargin + 'px"><a href="javascript:void(0)"><img src="' + thumb + '" /></a></li>';
                        } else {
                            pagers += '<li><a href="javascript:void(0)">' + (i + 1) + '</a></li>';
                        }
                        if (settings.mode === 'slide') {
                            if ((v) >= w - elSize - settings.slideMargin) {
                                i = i + 1;
                                if (i <= 1) {
                                    pagers = null;
                                    $slide.parent().addClass('noPager');
                                } else {
                                    $slide.parent().removeClass('noPager');
                                }
                                break;
                            }
                        }
                    }
                    if (maxSlide <= 1) {
                        pagers = null;
                    }
                    var $cSouter = $slide.parent();
                    $cSouter.find('.lSPager').html(pagers);
                    if (settings.gallery === true) {
                        if (settings.vertical === true) {
                            var property = 'height';
                            $cSouter.find('.lSPager').css('width', settings.vThumbWidth + 'px');
                        } else {
                            var property = 'width';
                        }
                        pagerWidth = (i * (settings.thumbMargin + thumbWidth))+0.5;
                        $cSouter.find('.lSPager').css({
                            property: pagerWidth + 'px',
                            'transition-duration': settings.speed + 'ms'
                        });
                        if (settings.vertical === true) {
                            $slide.parent().css('padding-right', (settings.vThumbWidth + settings.galleryMargin) + 'px');
                            $cSouter.find('.lSPager').css('height', pagerWidth + 'px');
                        } else {
                            $cSouter.find('.lSPager').css('width', pagerWidth + 'px');
                        }
                    }
                    var $pager = $cSouter.find('.lSPager').find('li');
                    $pager.first().addClass('active');
                    $pager.on('click', function() {
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
                        cl = 'lSGallery';
                    } else {
                        cl = 'lSpg';
                    }
                    $slide.after('<ul class="lSPager ' + cl + '"></ul>');
                    if (settings.vertical === false) {
                        $slide.parent().find('.lSPager').css('margin-top', settings.galleryMargin + 'px');
                    } else {
                        $slide.parent().find('.lSPager').css('margin-left', settings.galleryMargin + 'px');
                    }
                    if (settings.vertical === false && settings.gallery === true) {
                        var $pgr = $slide.parent().find('.lSGallery');
                        setTimeout(function() {
                            $pgr.css('height', $pgr.children().height() + 'px');
                            $pgr.children().first().find('img').load(function() {
                                $pgr.css('height', $pgr.children().height() + 'px');
                            });
                        });
                    }
                    refresh.createPager();
                }
                settings.onSliderLoad.call(this, $el);
            },
            active: function(ob, t) {
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
            move: function(ob, v) {
                if (settings.rtl === true) {
                    v = -v;
                }
                if (this.doCss()) {
                    if (settings.vertical === true) {
                        ob.css('transform', 'translate3d(0px, ' + (-v) + 'px, 0px)');
                    } else {
                        ob.css('transform', 'translate3d(' + (-v) + 'px, 0px, 0px)');
                    }
                } else {
                    if (settings.vertical === true) {
                        ob.css('position', 'relative').animate({
                            top: -v + 'px'
                        }, settings.speed, settings.easing);
                    } else {
                        ob.css('position', 'relative').animate({
                            left: -v + 'px'
                        }, settings.speed, settings.easing);
                    }
                }
                var $thumb = $slide.parent().find('.lSPager').find('li');
                this.active($thumb, true);
            },
            fade: function() {
                this.active($children, false);
                var $thumb = $slide.parent().find('.lSPager').find('li');
                this.active($thumb, true);
            },
            slide: function() {
                var $this = this;
                refresh.calSlide = function() {
                    slideValue = scene * ((slideWidth + settings.slideMargin) * settings.slideMove);
                    $this.active($children, false);
                    if ((slideValue) > w - elSize - settings.slideMargin) {
                        slideValue = w - elSize - settings.slideMargin;
                    } else if (slideValue < 0) {
                        slideValue = 0;
                    }
                    $this.move($el, slideValue);
                };
                refresh.calSlide();
                slideOn = true;
            },
            slideThumb: function() {
                var position;
                switch (settings.currentPagerPosition) {
                    case 'left':
                        position = 0;
                        break;
                    case 'middle':
                        position = (elSize / 2) - (thumbWidth / 2);
                        break;
                    case 'right':
                        position = elSize - thumbWidth;
                }
                var thumbSlide = scene * ((thumbWidth + settings.thumbMargin)) - (position);
                if ((thumbSlide + elSize) > pagerWidth) {
                    thumbSlide = pagerWidth - elSize - settings.thumbMargin;
                }
                if (thumbSlide < 0) {
                    thumbSlide = 0;
                }
                var $pager = $slide.parent().find('.lSPager');
                this.move($pager, thumbSlide);
            },
            auto: function() {
                if (settings.auto) {
                    interval = setInterval(function() {
                        $el.goToNextSlide();
                    }, settings.pause);
                }
            },

            touchMove: function(endCoords, startCoords) {
                $slide.css('transition-duration', '0ms');
                if (settings.mode === 'slide') {
                    var distance = endCoords - startCoords;
                    var swipeVal = slideValue - distance;
                    if (settings.freeMove == false) {
                        if ((swipeVal) >= w - elSize - settings.slideMargin) {
                            swipeVal = w - elSize - settings.slideMargin;
                        } else if (swipeVal < 0) {
                            swipeVal = 0;
                        }
                    };
                    this.move($el, swipeVal);
                }
            },

            touchEnd: function(distance) {
                $slide.css('transition-duration', settings.speed + 'ms');
                clearInterval(interval);
                if (settings.mode === 'slide') {
                    slideValue = slideValue - distance;
                    if ((slideValue) > w - elSize - settings.slideMargin) {
                        slideValue = w - elSize - settings.slideMargin;
                    } else if (slideValue < 0) {
                        slideValue = 0;
                    }
                    console.log(slideValue)
                    if (Math.abs(distance) >= settings.swipeThreshold) {
                        scene = Math.round(slideValue / ((slideWidth + settings.slideMargin) * settings.slideMove));
                    }
                    $el.mode();
                } else {
                    if (distance >= settings.swipeThreshold) {
                        $el.goToPrevSlide();
                    } else if (distance <= -settings.swipeThreshold) {
                        $el.goToNextSlide();
                    }
                }
            },



            enableDrag: function() {
                var $this = this;
                if (!isTouch) {
                    var startCoords = 0,
                        endCoords = 0,
                        isDraging = false;
                    $slide.on('mousedown', function(e) {
                        if ($(e.target).attr('class') !== ('lSPrev') && $(e.target).attr('class') !== ('lSNext')) {
                            startCoords = (settings.vertical === true) ? e.pageY : e.pageX;
                            isDraging = true;
                            e.preventDefault();
                        }
                    });
                    $(window).on('mousemove', function(e) {
                        if (isDraging) {
                            endCoords = (settings.vertical === true) ? e.pageY : e.pageX;
                            $this.touchMove(endCoords, startCoords);
                        }
                    });
                    $(window).on('mouseup', function(e) {
                        if (isDraging) {
                            isDraging = false;
                            endCoords = (settings.vertical === true) ? e.pageY : e.pageX;
                            var distance = endCoords - startCoords;
                            if (Math.abs(distance) >= settings.swipeThreshold) {
                                $(e.target).on('click.ls', function(e) {
                                    e.preventDefault();
                                    e.stopImmediatePropagation();
                                    e.stopPropagation();
                                    $(e.target).off('click.ls');
                                });
                            }

                            $this.touchEnd(distance);

                        }
                    });
                }
            },




            enableTouch: function() {
                var $this = this;
                if (isTouch) {
                    var startCoords = {},
                        endCoords = {};
                    $slide.on('touchstart', function(e) {
                        endCoords = e.originalEvent.targetTouches[0];
                        startCoords.pageX = e.originalEvent.targetTouches[0].pageX;
                        startCoords.pageY = e.originalEvent.targetTouches[0].pageY;
                    });
                    $slide.on('touchmove', function(e) {
                        var orig = e.originalEvent;
                        endCoords = orig.targetTouches[0];
                        var xMovement = Math.abs(endCoords.pageX - startCoords.pageX);
                        var yMovement = Math.abs(endCoords.pageY - startCoords.pageY);
                        if (settings.vertical === true) {
                            if ((yMovement * 3) > xMovement) {
                                e.preventDefault();
                            }
                            $this.touchMove(endCoords.pageY, startCoords.pageY);
                        } else {
                            if ((xMovement * 3) > yMovement) {
                                e.preventDefault();
                            }
                            $this.touchMove(endCoords.pageX, startCoords.pageX);
                        }

                    });
                    $slide.on('touchend', function() {
                        if (settings.vertical === true) {
                            var distance = endCoords.pageY - startCoords.pageY;
                        } else {
                            var distance = endCoords.pageX - startCoords.pageX;
                        }
                        $this.touchEnd(distance);
                    });
                }
            },
            build: function() {
                var $this = this;
                $this.initialStyle();
                $this.auto();
                if (this.doCss()) {

                    if (settings.enableTouch == true) {
                        $this.enableTouch();
                    }
                    if (settings.enableDrag == true) {
                        $this.enableDrag();
                    }
                }
                $this.pager();
                $this.controls();
                $this.keyPress();
            }
        };
        plugin.build();
        refresh.init = function() {
            refresh.chbreakpoint();
            resize = true;
            refresh.calL();
            if (settings.mode === "slide") {
                $el.removeClass('lSSlide');
            }
            if (settings.vertical === true) {
                if (settings.item > 1) {
                    elSize = settings.verticalHeight;
                } else {
                    elSize = $children.outerHeight();
                }
                $slide.css('height', elSize + 'px');
            } else {
                elSize = $slide.outerWidth();
            }
            if (settings.mode === "slide") {
                refresh.calSW();
                refresh.sSW();
            }
            setTimeout(function() {
                if (resize === true) {
                    if (settings.mode === "slide") {
                        $el.addClass('lSSlide');
                    }
                    resize = false;
                }
            }, 1000);
            if (settings.pager) {
                refresh.createPager();
            }
            if (settings.adaptiveHeight === true && settings.vertical === false) {
                $el.css('height', $children.eq(scene).height());
            }
            if (settings.gallery === true) {
                plugin.slideThumb();
            }
            if (slideOn) {
                refresh.calSlide();
            }
            if ($children.length <= settings.item) {
                $slide.find('.lSAction').hide();
            } else {
                $slide.find('.lSAction').show();
            }
        };
        $el.goToPrevSlide = function() {
            if (scene > 0) {
                settings.onBeforePrevSlide.call(this, $el, scene);
                scene--;
                $el.mode();
                if (settings.gallery === true) {
                    plugin.slideThumb();
                }
            } else {
                if (settings.loop === true) {
                    settings.onBeforePrevSlide.call(this, $el, scene);
                    if (settings.mode === 'slide') {
                        var v = 0;
                        for (var i = 0; i < length; i++) {
                            v = i * ((slideWidth + settings.slideMargin) * settings.slideMove);
                            if ((v) >= w - elSize - settings.slideMargin) {
                                break;
                            }
                        }
                        scene = i;
                    } else {
                        var l = length;
                        l = l - 1;
                        scene = parseInt(l / settings.slideMove, 10);
                    }
                    $el.mode();
                    if (settings.gallery === true) {
                        plugin.slideThumb();
                    }
                }
            }
        };
        $el.goToNextSlide = function() {
            var nextI = true;
            if (settings.mode === 'slide') {
                var _slideValue = scene * ((slideWidth + settings.slideMargin) * settings.slideMove);
                var nextI = _slideValue < w - elSize - settings.slideMargin;
            }
            if (((scene * settings.slideMove) < length - settings.slideMove) && nextI) {
                settings.onBeforeNextSlide.call(this, $el, scene);
                scene++;
                $el.mode();
                if (settings.gallery === true) {
                    plugin.slideThumb();
                }
            } else {
                if (settings.loop === true) {
                    settings.onBeforeNextSlide.call(this, $el, scene);
                    scene = 0;
                    $el.mode();
                    if (settings.gallery === true) {
                        plugin.slideThumb();
                    }
                }
            }
        };
        $el.mode = function() {
            if (settings.adaptiveHeight === true && settings.vertical === false) {
                $el.css('height', $children.eq(scene).height());
            }
            if (on === false) {
                if (settings.mode === "slide") {
                    if (plugin.doCss()) {
                        $el.addClass('lSSlide');
                        if (settings.speed !== '') {
                            $slide.css('transition-duration', settings.speed + 'ms');
                        }
                        if (settings.cssEasing !== '') {
                            $slide.css('transition-timing-function', settings.cssEasing);
                        }
                    }
                } else {
                    if (plugin.doCss()) {
                        if (settings.speed !== '') {
                            $el.css('transition-duration', settings.speed + 'ms');
                        }
                        if (settings.cssEasing !== '') {
                            $el.css('transition-timing-function', settings.cssEasing);
                        }
                    }
                }
            }
            settings.onBeforeSlide.call(this, $el, scene);
            if (settings.mode === "slide") {
                plugin.slide();
            } else {
                plugin.fade();
            }
            setTimeout(function() {
                settings.onAfterSlide.call(this, $el, scene);
            }, settings.speed);
            on = true;
        };
        $el.play = function() {
            clearInterval(interval);
            $el.goToNextSlide();
            interval = setInterval(function() {
                $el.goToNextSlide();
            }, settings.pause);
        };
        $el.pause = function() {
            clearInterval(interval);
        };
        $el.refresh = function() {
            refresh.init();
        };
        $el.getCurrentSlideCount = function() {
            return scene + 1;
        };
        $el.goToSlide = function(s) {
            scene = s;
            $el.mode();
        };
        $(window).on('resize orientationchange', function(e) {
            setTimeout(function() {
                e.preventDefault();
                refresh.init();
            }, 200);
        });
        return this;
    };
}(jQuery));