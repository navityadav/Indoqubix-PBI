function callBxSlider() {
    return $('[data-call="bxslider"]').each(function() {
        var e = $(this).attr("data-bxid");
        e ? bxSliders[e] = $(this).bxSlider() : $(this).bxSlider()
    }), "BxSlider initialised"
}

function callJUI() {
	
    return $('[data-call="jui-datepicker"]').each(function() {
        var e = $(this).attr("data-options");
        if (e) {
            var t = jsonify(e);
            $(this).datepicker(t)
        } else $(this).datepicker()
    }), $('[data-call="jui-slider"]').each(function() {
        var e = $(this).attr("data-options"),
            t = $(this).attr("data-target");
        if (e) {
            var i = jsonify(e);
            null == i.range && (i.range = "min"), t && (i.slide = function(e, i) {
                $(t).val(i.value)
            }), $(this).slider(i)
        }
    }), "jqueryUI initialised"
}

function toJsonFormat(e) {
    return e = e.replace(/([a-zA-Z0-9]+?):/g, '"$1":'), e = e.replace(/:(?!true|false)([a-zA-Z]+)/g, ':"$1"'), e = e.replace(/'/g, '"')
}

function jsonify(e) {
    return e = toJsonFormat(e), jQuery.parseJSON(e)
}

function escapeHtml(e) {
    return String(e).replace(/[&<>"'\/]/g, function(e) {
        return htmlMap[e]
    })
}

function changeView(e) {
    switch (e) {
        case "grid":
            $(".product-grid").removeClass("listview"), $(".product-grid > div").removeClass("reset-col");
            break;
        case "list":
            $(".product-grid").addClass("listview"), $(".product-grid > div").addClass("reset-col")
    }
}! function(e) {
    var t = {},
        n = {
            mode: "horizontal",
            slideSelector: "",
            infiniteLoop: !0,
            hideControlOnEnd: !1,
            speed: 500,
            easing: null,
            slideMargin: 0,
            startSlide: 0,
            randomStart: !1,
            captions: !1,
            ticker: !1,
            tickerHover: !1,
            adaptiveHeight: !1,
            adaptiveHeightSpeed: 500,
            video: !1,
            useCSS: !0,
            preloadImages: "visible",
            responsive: !0,
            slideZIndex: 50,
            wrapperClass: "bx-wrapper",
            touchEnabled: !0,
            swipeThreshold: 50,
            oneToOneTouch: !0,
            preventDefaultSwipeX: !0,
            preventDefaultSwipeY: !1,
            pager: !0,
            pagerType: "full",
            pagerShortSeparator: " / ",
            pagerSelector: null,
            buildPager: null,
            pagerCustom: null,
            controls: !0,
            nextText: "",
            prevText: "",
            nextSelector: null,
            prevSelector: null,
            autoControls: !1,
            startText: "",
            stopText: "",
            autoControlsCombine: !1,
            autoControlsSelector: null,
            auto: !1,
            pause: 4e3,
            autoStart: !0,
            autoDirection: "next",
            autoHover: !1,
            autoDelay: 0,
            autoSlideForOnePage: !1,
            minSlides: 1,
            maxSlides: 1,
            moveSlides: 0,
            slideWidth: 0,
            onSliderLoad: function() {},
            onSlideBefore: function() {},
            onSlideAfter: function() {},
            onSlideNext: function() {},
            onSlidePrev: function() {},
            onSliderResize: function() {},
            autoReload: !0
        };
    e.fn.bxSlider = function(s) {
        function a(t) {
            e(t).find(".bx-layer").each(function() {
                var t = e(this).attr("data-anim");
                e(this).removeClass("animated " + t)
            })
        }

        function o(t) {
            var i = [];
            return e(t).find(".bx-layer").each(function(t) {
                var n = parseInt(e(this).attr("data-dur")),
                    s = parseInt(e(this).attr("data-delay"));
                i[t] = n + s;
                var a = e(this).attr("data-anim");
                e(this).css({
                    "animation-duration": n + "ms",
                    "animation-delay": s + "ms",
                    "animation-fill-mode": "both"
                }).addClass("animated " + a)
            }), i[0] ? Math.max.apply(Math, i) : null
        }
        if (0 == this.length) return this;
        if (this.length > 1) return this.each(function() {
            e(this).bxSlider(s)
        }), this;
        var r = {},
            l = this;
        t.el = this;
        var d = e(window).width(),
            c = e(window).height(),
            h = function() {
                function t(e, t, i) {
                    var n = (e - i * (t - 1)) / t;
                    return Math.floor(n)
                }

                function i(e) {
                    for (var t in e) r.settings[t] = e[t]
                }

                function a() {
                    r.settings.slides && (r.settings.maxSlides = r.settings.slides, r.settings.minSlides = r.settings.slides, r.settings.slideWidth = t(d, r.settings.slides, r.settings.slideMargin))
                }

                function o(e) {
                    e = e.replace(/([a-zA-Z]+?):/g, '"$1":'), e = e.replace(/'/g, '"');
                    var t = jQuery.parseJSON(e);
                    return t
                }
                r.settings = e.extend({}, n, s), a();
                var c = e(window).width();
                d = c;
                var h = e(l).attr("data-options");
                if (h) {
                    var u = h.charAt(h.length - 1),
                        g = h.charAt(0);
                    "{" != g && "}" != u && (h = "{" + h + "}");
                    var f = o(h);
                    for (var m in f) r.settings[m] = f[m];
                    a()
                }
                var v = e(l).attr("data-breaks");
                if (v && (r.settings.breaks = o(v)), r.settings.breaks) {
                    r.settings.breaks.sort(function(e, t) {
                        return e.screen - t.screen
                    });
                    for (var _ = 0; _ < r.settings.breaks.length; ++_) {
                        var b, y = r.settings.breaks[_],
                            w = {},
                            k = y.screen;
                        _ < r.settings.breaks.length - 1 ? (w = r.settings.breaks[_ + 1], b = w.screen, c >= k && b > c && i(y)) : c >= k && i(y)
                    }
                    a()
                }
                if (r.settings.fullscreen) {
                    {
                        var x = e(window).width();
                        e(window).height()
                    }
                    r.settings.maxSlides = 1, r.settings.minSlides = 1, r.settings.slideWidth = x
                }
                r.settings.slideWidth = parseInt(r.settings.slideWidth), r.children = l.children(r.settings.slideSelector), r.children.length < r.settings.minSlides && (r.settings.minSlides = r.children.length), r.children.length < r.settings.maxSlides && (r.settings.maxSlides = r.children.length), r.settings.randomStart && (r.settings.startSlide = Math.floor(Math.random() * r.children.length)), r.active = {
                    index: r.settings.startSlide
                }, r.carousel = r.settings.minSlides > 1 || r.settings.maxSlides > 1, r.carousel && (r.settings.preloadImages = "all"), r.minThreshold = r.settings.minSlides * r.settings.slideWidth + (r.settings.minSlides - 1) * r.settings.slideMargin, r.maxThreshold = r.settings.maxSlides * r.settings.slideWidth + (r.settings.maxSlides - 1) * r.settings.slideMargin, r.working = !1, r.controls = {}, r.interval = null, r.animProp = "vertical" == r.settings.mode ? "top" : "left", r.usingCSS = r.settings.useCSS && "fade" != r.settings.mode && function() {
                    var e = document.createElement("div"),
                        t = ["WebkitPerspective", "MozPerspective", "OPerspective", "msPerspective"];
                    for (var i in t)
                        if (void 0 !== e.style[t[i]]) return r.cssPrefix = t[i].replace("Perspective", "").toLowerCase(), r.animProp = "-" + r.cssPrefix + "-transform", !0;
                    return !1
                }(), "vertical" == r.settings.mode && (r.settings.maxSlides = r.settings.minSlides), l.data("origStyle", l.attr("style")), l.children(r.settings.slideSelector).each(function() {
                    e(this).data("origStyle", e(this).attr("style"))
                }), p()
            },
            p = function() {
                var t, i = l.width();
                t = 400 >= i ? "size-xs" : i > 400 && 767 >= i ? "size-sm" : i > 767 && 1023 >= i ? "size-md" : "size-lg", l.wrap('<div class="' + r.settings.wrapperClass + " " + t + '"><div class="bx-viewport"></div></div>'), r.viewport = l.parent(), r.loader = e('<div class="bx-loading" />'), r.viewport.prepend(r.loader), l.css({
                    width: "horizontal" == r.settings.mode ? 100 * r.children.length + 215 + "%" : "auto",
                    position: "relative"
                }), r.usingCSS && r.settings.easing ? l.css("-" + r.cssPrefix + "-transition-timing-function", r.settings.easing) : r.settings.easing || (r.settings.easing = "swing");
                _();
                r.viewport.css({
                    width: "100%",
                    overflow: "hidden",
                    position: "relative"
                }), r.viewport.parent().css({
                    maxWidth: m()
                }), r.settings.pager || r.viewport.parent().css({
                    margin: "0 auto 0px"
                }), r.children.css({
                    "float": "horizontal" == r.settings.mode ? "left" : "none",
                    listStyle: "none",
                    position: "relative"
                }), r.children.css("width", v()), "horizontal" == r.settings.mode && r.settings.slideMargin > 0 && r.children.css("marginRight", r.settings.slideMargin), "vertical" == r.settings.mode && r.settings.slideMargin > 0 && r.children.css("marginBottom", r.settings.slideMargin), "fade" == r.settings.mode && (r.children.css({
                    position: "absolute",
                    zIndex: 0,
                    display: "none"
                }), r.children.eq(r.settings.startSlide).css({
                    zIndex: r.settings.slideZIndex,
                    display: "block"
                })), r.controls.el = e('<div class="bx-controls" />'), r.settings.captions && C(), r.active.last = r.settings.startSlide == b() - 1, r.settings.video && l.fitVids();
                var n = r.children.eq(r.settings.startSlide);
                "all" == r.settings.preloadImages && (n = r.children), r.settings.ticker ? r.settings.pager = !1 : (r.settings.pager && D(), r.settings.controls && M(), r.settings.auto && r.settings.autoControls && S(), (r.settings.controls || r.settings.autoControls || r.settings.pager) && r.viewport.after(r.controls.el)), u(n, g)
            },
            u = function(t, i) {
                var n = t.find("img, iframe").length;
                if (0 == n) return void i();
                var s = 0;
                t.find("img, iframe").each(function() {
                    e(this).one("load", function() {
                        ++s == n && i()
                    }).each(function() {
                        this.complete && e(this).load()
                    })
                })
            },
            g = function() {
                if (r.settings.infiniteLoop && "fade" != r.settings.mode && !r.settings.ticker) {
                    var t = "vertical" == r.settings.mode ? r.settings.minSlides : r.settings.maxSlides,
                        i = r.children.slice(0, t).clone().addClass("bx-clone"),
                        n = r.children.slice(-t).clone().addClass("bx-clone");
                    l.append(i).prepend(n)
                }
                r.settings.removeClass && l.removeClass(r.settings.removeClass), r.loader.remove(), w(), "vertical" == r.settings.mode && (r.settings.adaptiveHeight = !0), r.viewport.height(f()), l.redrawSlider(), r.settings.onSliderLoad(r.active.index), r.initialized = !0;
                var s = r.children.eq(r.active.index);
                s.addClass("active");
                var d = o(s);
                d && setTimeout(function() {
                    a(s)
                }, d), r.settings.responsive && e(window).bind("resize", B), r.settings.auto && r.settings.autoStart && (b() > 1 || r.settings.autoSlideForOnePage) && $(), r.settings.ticker && j(), r.settings.pager && A(r.settings.startSlide), r.settings.controls && O(), r.settings.touchEnabled && !r.settings.ticker && H()
            },
            f = function() {
                var t = 0,
                    n = e();
                if ("vertical" == r.settings.mode || r.settings.adaptiveHeight)
                    if (r.carousel) {
                        var s = 1 == r.settings.moveSlides ? r.active.index : r.active.index * y();
                        for (n = r.children.eq(s), i = 1; i <= r.settings.maxSlides - 1; i++) n = n.add(s + i >= r.children.length ? r.children.eq(i - 1) : r.children.eq(s + i))
                    } else n = r.children.eq(r.active.index);
                else n = r.children;
                return "vertical" == r.settings.mode ? (n.each(function() {
                    t += e(this).outerHeight()
                }), r.settings.slideMargin > 0 && (t += r.settings.slideMargin * (r.settings.minSlides - 1))) : t = Math.max.apply(Math, n.map(function() {
                    return e(this).outerHeight(!1)
                }).get()), "border-box" == r.viewport.css("box-sizing") ? t += parseFloat(r.viewport.css("padding-top")) + parseFloat(r.viewport.css("padding-bottom")) + parseFloat(r.viewport.css("border-top-width")) + parseFloat(r.viewport.css("border-bottom-width")) : "padding-box" == r.viewport.css("box-sizing") && (t += parseFloat(r.viewport.css("padding-top")) + parseFloat(r.viewport.css("padding-bottom"))), t
            },
            m = function() {
                var e = "100%";
                return r.settings.slideWidth > 0 && (e = "horizontal" == r.settings.mode ? r.settings.maxSlides * r.settings.slideWidth + (r.settings.maxSlides - 1) * r.settings.slideMargin : r.settings.slideWidth), e
            },
            v = function() {
                var e = r.settings.slideWidth,
                    t = r.viewport.width();
                return 0 == r.settings.slideWidth || r.settings.slideWidth > t && !r.carousel || "vertical" == r.settings.mode ? e = t : r.settings.maxSlides > 1 && "horizontal" == r.settings.mode && (t > r.maxThreshold || t < r.minThreshold && (e = (t - r.settings.slideMargin * (r.settings.minSlides - 1)) / r.settings.minSlides)), e
            },
            _ = function() {
                var e = 1;
                if ("horizontal" == r.settings.mode && r.settings.slideWidth > 0)
                    if (r.viewport.width() < r.minThreshold) e = r.settings.minSlides;
                    else if (r.viewport.width() > r.maxThreshold) e = r.settings.maxSlides;
                else {
                    var t = r.children.first().width() + r.settings.slideMargin;
                    e = Math.floor((r.viewport.width() + r.settings.slideMargin) / t)
                } else "vertical" == r.settings.mode && (e = r.settings.minSlides);
                return e
            },
            b = function() {
                var e = 0;
                if (r.settings.moveSlides > 0)
                    if (r.settings.infiniteLoop) e = Math.ceil(r.children.length / y());
                    else
                        for (var t = 0, i = 0; t < r.children.length;) ++e, t = i + _(), i += r.settings.moveSlides <= _() ? r.settings.moveSlides : _();
                else e = Math.ceil(r.children.length / _());
                return e
            },
            y = function() {
                return r.settings.moveSlides > 0 && r.settings.moveSlides <= _() ? r.settings.moveSlides : _()
            },
            w = function() {
                if (r.children.length > r.settings.maxSlides && r.active.last && !r.settings.infiniteLoop) {
                    if ("horizontal" == r.settings.mode) {
                        var e = r.children.last(),
                            t = e.position();
                        k(-(t.left - (r.viewport.width() - e.outerWidth())), "reset", 0)
                    } else if ("vertical" == r.settings.mode) {
                        var i = r.children.length - r.settings.minSlides,
                            t = r.children.eq(i).position();
                        k(-t.top, "reset", 0)
                    }
                } else {
                    var t = r.children.eq(r.active.index * y()).position();
                    r.active.index == b() - 1 && (r.active.last = !0), void 0 != t && ("horizontal" == r.settings.mode ? k(-t.left, "reset", 0) : "vertical" == r.settings.mode && k(-t.top, "reset", 0))
                }
            },
            k = function(e, t, i, n) {
                if (r.usingCSS) {
                    var s = "vertical" == r.settings.mode ? "translate3d(0, " + e + "px, 0)" : "translate3d(" + e + "px, 0, 0)";
                    l.css("-" + r.cssPrefix + "-transition-duration", i / 1e3 + "s"), "slide" == t ? (l.css(r.animProp, s), l.bind("transitionend webkitTransitionEnd oTransitionEnd MSTransitionEnd", function() {
                        l.unbind("transitionend webkitTransitionEnd oTransitionEnd MSTransitionEnd"), z()
                    })) : "reset" == t ? l.css(r.animProp, s) : "ticker" == t && (l.css("-" + r.cssPrefix + "-transition-timing-function", "linear"), l.css(r.animProp, s), l.bind("transitionend webkitTransitionEnd oTransitionEnd MSTransitionEnd", function() {
                        l.unbind("transitionend webkitTransitionEnd oTransitionEnd MSTransitionEnd"), k(n.resetValue, "reset", 0), F()
                    }))
                } else {
                    var a = {};
                    a[r.animProp] = e, "slide" == t ? l.animate(a, i, r.settings.easing, function() {
                        z()
                    }) : "reset" == t ? l.css(r.animProp, e) : "ticker" == t && l.animate(a, speed, "linear", function() {
                        k(n.resetValue, "reset", 0), F()
                    })
                }
            },
            x = function() {
                for (var t = "", i = b(), n = 0; i > n; n++) {
                    var s = "";
                    r.settings.buildPager && e.isFunction(r.settings.buildPager) ? (s = r.settings.buildPager(n), r.pagerEl.addClass("bx-custom-pager")) : (s = n + 1, r.pagerEl.addClass("bx-default-pager")), t += '<div class="bx-pager-item"><a href="" data-slide-index="' + n + '" class="bx-pager-link">' + s + "</a></div>"
                }
                r.pagerEl.html(t)
            },
            D = function() {
                r.settings.pagerCustom ? r.pagerEl = e(r.settings.pagerCustom) : (r.pagerEl = e('<div class="bx-pager" />'), r.settings.pagerSelector ? e(r.settings.pagerSelector).html(r.pagerEl) : r.controls.el.addClass("bx-has-pager").append(r.pagerEl), x()), r.pagerEl.on("click", "a", E)
            },
            M = function() {
                r.controls.next = e('<a class="bx-next" href="">' + r.settings.nextText + "</a>"), r.controls.prev = e('<a class="bx-prev" href="">' + r.settings.prevText + "</a>"), r.controls.next.bind("click", N), r.controls.prev.bind("click", I), r.settings.nextSelector && e(r.settings.nextSelector).append(r.controls.next), r.settings.prevSelector && e(r.settings.prevSelector).append(r.controls.prev), r.settings.nextSelector || r.settings.prevSelector || (r.controls.directionEl = e('<div class="bx-controls-direction" />'), r.controls.directionEl.append(r.controls.prev).append(r.controls.next), r.controls.el.addClass("bx-has-controls-direction").append(r.controls.directionEl))
            },
            S = function() {
                r.controls.start = e('<div class="bx-controls-auto-item"><a class="bx-start" href="">' + r.settings.startText + "</a></div>"), r.controls.stop = e('<div class="bx-controls-auto-item"><a class="bx-stop" href="">' + r.settings.stopText + "</a></div>"), r.controls.autoEl = e('<div class="bx-controls-auto" />'), r.controls.autoEl.on("click", ".bx-start", T), r.controls.autoEl.on("click", ".bx-stop", P), r.settings.autoControlsCombine ? r.controls.autoEl.append(r.controls.start) : r.controls.autoEl.append(r.controls.start).append(r.controls.stop), r.settings.autoControlsSelector ? e(r.settings.autoControlsSelector).html(r.controls.autoEl) : r.controls.el.addClass("bx-has-controls-auto").append(r.controls.autoEl), W(r.settings.autoStart ? "stop" : "start")
            },
            C = function() {
                r.children.each(function() {
                    var t = e(this).find("img:first").attr("title");
                    void 0 != t && ("" + t).length && e(this).append('<div class="bx-caption"><span>' + t + "</span></div>")
                })
            },
            N = function(e) {
                r.settings.auto && l.stopAuto(), l.goToNextSlide(), e.preventDefault()
            },
            I = function(e) {
                r.settings.auto && l.stopAuto(), l.goToPrevSlide(), e.preventDefault()
            },
            T = function(e) {
                l.startAuto(), e.preventDefault()
            },
            P = function(e) {
                l.stopAuto(), e.preventDefault()
            },
            E = function(t) {
                r.settings.auto && l.stopAuto();
                var i = e(t.currentTarget);
                if (void 0 !== i.attr("data-slide-index")) {
                    var n = parseInt(i.attr("data-slide-index"));
                    n != r.active.index && l.goToSlide(n), t.preventDefault()
                }
            },
            A = function(t) {
                var i = r.children.length;
                return "short" == r.settings.pagerType ? (r.settings.maxSlides > 1 && (i = Math.ceil(r.children.length / r.settings.maxSlides)), void r.pagerEl.html(t + 1 + r.settings.pagerShortSeparator + i)) : (r.pagerEl.find("a").removeClass("active"), void r.pagerEl.each(function(i, n) {
                    e(n).find("a").eq(t).addClass("active")
                }))
            },
            z = function() {
                if (r.settings.infiniteLoop) {
                    var e = "";
                    0 == r.active.index ? e = r.children.eq(0).position() : r.active.index == b() - 1 && r.carousel ? e = r.children.eq((b() - 1) * y()).position() : r.active.index == r.children.length - 1 && (e = r.children.eq(r.children.length - 1).position()), e && ("horizontal" == r.settings.mode ? k(-e.left, "reset", 0) : "vertical" == r.settings.mode && k(-e.top, "reset", 0))
                }
                var t = r.children.eq(r.active.index);
                r.children.removeClass("active"), t.addClass("active");
                var i = o(t);
                i && setTimeout(function() {
                    a(t)
                }, i), r.working = !1, r.settings.onSlideAfter(r.children.eq(r.active.index), r.oldIndex, r.active.index)
            },
            W = function(e) {
                r.settings.autoControlsCombine ? r.controls.autoEl.html(r.controls[e]) : (r.controls.autoEl.find("a").removeClass("active"), r.controls.autoEl.find("a:not(.bx-" + e + ")").addClass("active"))
            },
            O = function() {
                1 == b() ? (r.controls.prev.addClass("disabled"), r.controls.next.addClass("disabled")) : !r.settings.infiniteLoop && r.settings.hideControlOnEnd && (0 == r.active.index ? (r.controls.prev.addClass("disabled"), r.controls.next.removeClass("disabled")) : r.active.index == b() - 1 ? (r.controls.next.addClass("disabled"), r.controls.prev.removeClass("disabled")) : (r.controls.prev.removeClass("disabled"), r.controls.next.removeClass("disabled")))
            },
            $ = function() {
                if (r.settings.autoDelay > 0) {
                    setTimeout(l.startAuto, r.settings.autoDelay)
                } else l.startAuto();
                r.settings.autoHover && l.hover(function() {
                    r.interval && (l.stopAuto(!0), r.autoPaused = !0)
                }, function() {
                    r.autoPaused && (l.startAuto(!0), r.autoPaused = null)
                })
            },
            j = function() {
                var t = 0;
                if ("next" == r.settings.autoDirection) l.append(r.children.clone().addClass("bx-clone"));
                else {
                    l.prepend(r.children.clone().addClass("bx-clone"));
                    var i = r.children.first().position();
                    t = "horizontal" == r.settings.mode ? -i.left : -i.top
                }
                k(t, "reset", 0), r.settings.pager = !1, r.settings.controls = !1, r.settings.autoControls = !1, r.settings.tickerHover && !r.usingCSS && r.viewport.hover(function() {
                    l.stop()
                }, function() {
                    var t = 0;
                    r.children.each(function() {
                        t += "horizontal" == r.settings.mode ? e(this).outerWidth(!0) : e(this).outerHeight(!0)
                    });
                    var i = r.settings.speed / t,
                        n = "horizontal" == r.settings.mode ? "left" : "top",
                        s = i * (t - Math.abs(parseInt(l.css(n))));
                    F(s)
                }), F()
            },
            F = function(e) {
                speed = e ? e : r.settings.speed;
                var t = {
                        left: 0,
                        top: 0
                    },
                    i = {
                        left: 0,
                        top: 0
                    };
                "next" == r.settings.autoDirection ? t = l.find(".bx-clone").first().position() : i = r.children.first().position();
                var n = "horizontal" == r.settings.mode ? -t.left : -t.top,
                    s = "horizontal" == r.settings.mode ? -i.left : -i.top,
                    a = {
                        resetValue: s
                    };
                k(n, "ticker", speed, a)
            },
            H = function() {
                r.touch = {
                    start: {
                        x: 0,
                        y: 0
                    },
                    end: {
                        x: 0,
                        y: 0
                    }
                }, r.viewport.bind("touchstart", L)
            },
            L = function(e) {
                if (r.working) e.preventDefault();
                else {
                    r.touch.originalPos = l.position();
                    var t = e.originalEvent;
                    r.touch.start.x = t.changedTouches[0].pageX, r.touch.start.y = t.changedTouches[0].pageY, r.viewport.bind("touchmove", Y), r.viewport.bind("touchend", R)
                }
            },
            Y = function(e) {
                var t = e.originalEvent,
                    i = Math.abs(t.changedTouches[0].pageX - r.touch.start.x),
                    n = Math.abs(t.changedTouches[0].pageY - r.touch.start.y);
                if (3 * i > n && r.settings.preventDefaultSwipeX ? e.preventDefault() : 3 * n > i && r.settings.preventDefaultSwipeY && e.preventDefault(), "fade" != r.settings.mode && r.settings.oneToOneTouch) {
                    var s = 0;
                    if ("horizontal" == r.settings.mode) {
                        var a = t.changedTouches[0].pageX - r.touch.start.x;
                        s = r.touch.originalPos.left + a
                    } else {
                        var a = t.changedTouches[0].pageY - r.touch.start.y;
                        s = r.touch.originalPos.top + a
                    }
                    k(s, "reset", 0)
                }
            },
            R = function(e) {
                r.viewport.unbind("touchmove", Y);
                var t = e.originalEvent,
                    i = 0;
                if (r.touch.end.x = t.changedTouches[0].pageX, r.touch.end.y = t.changedTouches[0].pageY, "fade" == r.settings.mode) {
                    var n = Math.abs(r.touch.start.x - r.touch.end.x);
                    n >= r.settings.swipeThreshold && (r.touch.start.x > r.touch.end.x ? l.goToNextSlide() : l.goToPrevSlide(), l.stopAuto())
                } else {
                    var n = 0;
                    "horizontal" == r.settings.mode ? (n = r.touch.end.x - r.touch.start.x, i = r.touch.originalPos.left) : (n = r.touch.end.y - r.touch.start.y, i = r.touch.originalPos.top), !r.settings.infiniteLoop && (0 == r.active.index && n > 0 || r.active.last && 0 > n) ? k(i, "reset", 200) : Math.abs(n) >= r.settings.swipeThreshold ? (0 > n ? l.goToNextSlide() : l.goToPrevSlide(), l.stopAuto()) : k(i, "reset", 200)
                }
                r.viewport.unbind("touchend", R)
            },
            B = function() {
                if (r.initialized) {
                    var t = e(window).width(),
                        i = e(window).height();
                    (d != t || c != i) && (d = t, c = i, l.redrawSlider(), r.settings.onSliderResize.call(l, r.active.index))
                }
            };
        return l.goToSlide = function(t, i) {
            if (!r.working && r.active.index != t)
                if (r.working = !0, r.oldIndex = r.active.index, r.active.index = 0 > t ? b() - 1 : t >= b() ? 0 : t, r.settings.onSlideBefore(r.children.eq(r.active.index), r.oldIndex, r.active.index), "next" == i ? r.settings.onSlideNext(r.children.eq(r.active.index), r.oldIndex, r.active.index) : "prev" == i && r.settings.onSlidePrev(r.children.eq(r.active.index), r.oldIndex, r.active.index), r.active.last = r.active.index >= b() - 1, r.settings.pager && A(r.active.index), r.settings.controls && O(), "fade" == r.settings.mode) r.settings.adaptiveHeight && r.viewport.height() != f() && r.viewport.animate({
                    height: f()
                }, r.settings.adaptiveHeightSpeed), r.children.filter(":visible").fadeOut(r.settings.speed).css({
                    zIndex: 0
                }), r.children.eq(r.active.index).css("zIndex", r.settings.slideZIndex + 1).fadeIn(r.settings.speed, function() {
                    e(this).css("zIndex", r.settings.slideZIndex), z()
                });
                else {
                    r.settings.adaptiveHeight && r.viewport.height() != f() && r.viewport.animate({
                        height: f()
                    }, r.settings.adaptiveHeightSpeed);
                    var n = 0,
                        s = {
                            left: 0,
                            top: 0
                        };
                    if (!r.settings.infiniteLoop && r.carousel && r.active.last)
                        if ("horizontal" == r.settings.mode) {
                            var a = r.children.eq(r.children.length - 1);
                            s = a.position(), n = r.viewport.width() - a.outerWidth()
                        } else {
                            var o = r.children.length - r.settings.minSlides;
                            s = r.children.eq(o).position()
                        }
                    else if (r.carousel && r.active.last && "prev" == i) {
                        var d = 1 == r.settings.moveSlides ? r.settings.maxSlides - y() : (b() - 1) * y() - (r.children.length - r.settings.maxSlides),
                            a = l.children(".bx-clone").eq(d);
                        s = a.position()
                    } else if ("next" == i && 0 == r.active.index) s = l.find("> .bx-clone").eq(r.settings.maxSlides).position(), r.active.last = !1;
                    else if (t >= 0) {
                        var c = t * y();
                        s = r.children.eq(c).position()
                    }
                    if ("undefined" != typeof s) {
                        var h = "horizontal" == r.settings.mode ? -(s.left - n) : -s.top;
                        k(h, "slide", r.settings.speed)
                    }
                }
        }, l.goToNextSlide = function() {
            if (r.settings.infiniteLoop || !r.active.last) {
                var e = parseInt(r.active.index) + 1;
                l.goToSlide(e, "next")
            }
        }, l.goToPrevSlide = function() {
            if (r.settings.infiniteLoop || 0 != r.active.index) {
                var e = parseInt(r.active.index) - 1;
                l.goToSlide(e, "prev")
            }
        }, l.startAuto = function(e) {
            r.interval || (r.interval = setInterval(function() {
                "next" == r.settings.autoDirection ? l.goToNextSlide() : l.goToPrevSlide()
            }, r.settings.pause), r.settings.autoControls && 1 != e && W("stop"))
        }, l.stopAuto = function(e) {
            r.interval && (clearInterval(r.interval), r.interval = null, r.settings.autoControls && 1 != e && W("start"))
        }, l.getCurrentSlide = function() {
            return r.active.index
        }, l.getCurrentSlideElement = function() {
            return r.children.eq(r.active.index)
        }, l.getSlideCount = function() {
            return r.children.length
        }, l.redrawSlider = function() {
            r.children.add(l.find(".bx-clone")).width(v()), r.viewport.css("height", f()), r.settings.ticker || w(), r.active.last && (r.active.index = b() - 1), r.active.index >= b() && (r.active.last = !0), r.settings.pager && !r.settings.pagerCustom && (x(), A(r.active.index))
        }, l.destroySlider = function() {
            r.initialized && (r.initialized = !1, e(".bx-clone", this).remove(), r.children.each(function() {
                void 0 != e(this).data("origStyle") ? e(this).attr("style", e(this).data("origStyle")) : e(this).removeAttr("style")
            }), void 0 != e(this).data("origStyle") ? this.attr("style", e(this).data("origStyle")) : e(this).removeAttr("style"), e(this).unwrap().unwrap(), r.controls.el && r.controls.el.remove(), r.controls.next && r.controls.next.remove(), r.controls.prev && r.controls.prev.remove(), r.settings.pagerCustom || r.pagerEl && r.settings.controls && r.pagerEl.remove(), e(".bx-caption", this).remove(), r.controls.autoEl && r.controls.autoEl.remove(), clearInterval(r.interval), r.settings.responsive && e(window).unbind("resize", B))
        }, l.reloadSlider = function(e) {
            void 0 != e && (s = e), l.destroySlider(), h()
        }, e(window).resize(function() {
            r.settings.autoReload && l.reloadSlider()
        }), h(), this
    }
}(jQuery);
var bxSliders = {};
callBxSlider(),
    function(e) {
        "function" == typeof define && define.amd ? define(["jquery"], e) : e(jQuery)
    }(function(e) {
        function t(t, n) {
            var s, a, o, r = t.nodeName.toLowerCase();
            return "area" === r ? (s = t.parentNode, a = s.name, t.href && a && "map" === s.nodeName.toLowerCase() ? (o = e("img[usemap='#" + a + "']")[0], !!o && i(o)) : !1) : (/input|select|textarea|button|object/.test(r) ? !t.disabled : "a" === r ? t.href || n : n) && i(t)
        }

        function i(t) {
            return e.expr.filters.visible(t) && !e(t).parents().addBack().filter(function() {
                return "hidden" === e.css(this, "visibility")
            }).length
        }

        function n(e) {
            for (var t, i; e.length && e[0] !== document;) {
                if (t = e.css("position"), ("absolute" === t || "relative" === t || "fixed" === t) && (i = parseInt(e.css("zIndex"), 10), !isNaN(i) && 0 !== i)) return i;
                e = e.parent()
            }
            return 0
        }

        function s() {
            this._curInst = null, this._keyEvent = !1, this._disabledInputs = [], this._datepickerShowing = !1, this._inDialog = !1, this._mainDivId = "ui-datepicker-div", this._inlineClass = "ui-datepicker-inline", this._appendClass = "ui-datepicker-append", this._triggerClass = "ui-datepicker-trigger", this._dialogClass = "ui-datepicker-dialog", this._disableClass = "ui-datepicker-disabled", this._unselectableClass = "ui-datepicker-unselectable", this._currentClass = "ui-datepicker-current-day", this._dayOverClass = "ui-datepicker-days-cell-over", this.regional = [], this.regional[""] = {
                closeText: "Done",
                prevText: "Prev",
                nextText: "Next",
                currentText: "Today",
                monthNames: ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"],
                monthNamesShort: ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"],
                dayNames: ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"],
                dayNamesShort: ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"],
                dayNamesMin: ["Su", "Mo", "Tu", "We", "Th", "Fr", "Sa"],
                weekHeader: "Wk",
                dateFormat: "mm/dd/yy",
                firstDay: 0,
                isRTL: !1,
                showMonthAfterYear: !1,
                yearSuffix: ""
            }, this._defaults = {
                showOn: "focus",
                showAnim: "fadeIn",
                showOptions: {},
                defaultDate: null,
                appendText: "",
                buttonText: "...",
                buttonImage: "",
                buttonImageOnly: !1,
                hideIfNoPrevNext: !1,
                navigationAsDateFormat: !1,
                gotoCurrent: !1,
                changeMonth: !1,
                changeYear: !1,
                yearRange: "c-10:c+10",
                showOtherMonths: !1,
                selectOtherMonths: !1,
                showWeek: !1,
                calculateWeek: this.iso8601Week,
                shortYearCutoff: "+10",
                minDate: null,
                maxDate: null,
                duration: "fast",
                beforeShowDay: null,
                beforeShow: null,
                onSelect: null,
                onChangeMonthYear: null,
                onClose: null,
                numberOfMonths: 1,
                showCurrentAtPos: 0,
                stepMonths: 1,
                stepBigMonths: 12,
                altField: "",
                altFormat: "",
                constrainInput: !0,
                showButtonPanel: !1,
                autoSize: !1,
                disabled: !1
            }, e.extend(this._defaults, this.regional[""]), this.regional.en = e.extend(!0, {}, this.regional[""]), this.regional["en-US"] = e.extend(!0, {}, this.regional.en), this.dpDiv = a(e("<div id='" + this._mainDivId + "' class='ui-datepicker ui-widget ui-widget-content ui-helper-clearfix ui-corner-all'></div>"))
        }

        function a(t) {
            var i = "button, .ui-datepicker-prev, .ui-datepicker-next, .ui-datepicker-calendar td a";
            return t.delegate(i, "mouseout", function() {
                e(this).removeClass("ui-state-hover"), -1 !== this.className.indexOf("ui-datepicker-prev") && e(this).removeClass("ui-datepicker-prev-hover"), -1 !== this.className.indexOf("ui-datepicker-next") && e(this).removeClass("ui-datepicker-next-hover")
            }).delegate(i, "mouseover", o)
        }

        function o() {
            e.datepicker._isDisabledDatepicker(h.inline ? h.dpDiv.parent()[0] : h.input[0]) || (e(this).parents(".ui-datepicker-calendar").find("a").removeClass("ui-state-hover"), e(this).addClass("ui-state-hover"), -1 !== this.className.indexOf("ui-datepicker-prev") && e(this).addClass("ui-datepicker-prev-hover"), -1 !== this.className.indexOf("ui-datepicker-next") && e(this).addClass("ui-datepicker-next-hover"))
        }

        function r(t, i) {
            e.extend(t, i);
            for (var n in i) null == i[n] && (t[n] = i[n]);
            return t
        }
        e.ui = e.ui || {}, e.extend(e.ui, {
            version: "1.11.2",
            keyCode: {
                BACKSPACE: 8,
                COMMA: 188,
                DELETE: 46,
                DOWN: 40,
                END: 35,
                ENTER: 13,
                ESCAPE: 27,
                HOME: 36,
                LEFT: 37,
                PAGE_DOWN: 34,
                PAGE_UP: 33,
                PERIOD: 190,
                RIGHT: 39,
                SPACE: 32,
                TAB: 9,
                UP: 38
            }
        }), e.fn.extend({
            scrollParent: function(t) {
                var i = this.css("position"),
                    n = "absolute" === i,
                    s = t ? /(auto|scroll|hidden)/ : /(auto|scroll)/,
                    a = this.parents().filter(function() {
                        var t = e(this);
                        return n && "static" === t.css("position") ? !1 : s.test(t.css("overflow") + t.css("overflow-y") + t.css("overflow-x"))
                    }).eq(0);
                return "fixed" !== i && a.length ? a : e(this[0].ownerDocument || document)
            },
            uniqueId: function() {
                var e = 0;
                return function() {
                    return this.each(function() {
                        this.id || (this.id = "ui-id-" + ++e)
                    })
                }
            }(),
            removeUniqueId: function() {
                return this.each(function() {
                    /^ui-id-\d+$/.test(this.id) && e(this).removeAttr("id")
                })
            }
        }), e.extend(e.expr[":"], {
            data: e.expr.createPseudo ? e.expr.createPseudo(function(t) {
                return function(i) {
                    return !!e.data(i, t)
                }
            }) : function(t, i, n) {
                return !!e.data(t, n[3])
            },
            focusable: function(i) {
                return t(i, !isNaN(e.attr(i, "tabindex")))
            },
            tabbable: function(i) {
                var n = e.attr(i, "tabindex"),
                    s = isNaN(n);
                return (s || n >= 0) && t(i, !s)
            }
        }), e("<a>").outerWidth(1).jquery || e.each(["Width", "Height"], function(t, i) {
            function n(t, i, n, a) {
                return e.each(s, function() {
                    i -= parseFloat(e.css(t, "padding" + this)) || 0, n && (i -= parseFloat(e.css(t, "border" + this + "Width")) || 0), a && (i -= parseFloat(e.css(t, "margin" + this)) || 0)
                }), i
            }
            var s = "Width" === i ? ["Left", "Right"] : ["Top", "Bottom"],
                a = i.toLowerCase(),
                o = {
                    innerWidth: e.fn.innerWidth,
                    innerHeight: e.fn.innerHeight,
                    outerWidth: e.fn.outerWidth,
                    outerHeight: e.fn.outerHeight
                };
            e.fn["inner" + i] = function(t) {
                return void 0 === t ? o["inner" + i].call(this) : this.each(function() {
                    e(this).css(a, n(this, t) + "px")
                })
            }, e.fn["outer" + i] = function(t, s) {
                return "number" != typeof t ? o["outer" + i].call(this, t) : this.each(function() {
                    e(this).css(a, n(this, t, !0, s) + "px")
                })
            }
        }), e.fn.addBack || (e.fn.addBack = function(e) {
            return this.add(null == e ? this.prevObject : this.prevObject.filter(e))
        }), e("<a>").data("a-b", "a").removeData("a-b").data("a-b") && (e.fn.removeData = function(t) {
            return function(i) {
                return arguments.length ? t.call(this, e.camelCase(i)) : t.call(this)
            }
        }(e.fn.removeData)), e.ui.ie = !!/msie [\w.]+/.exec(navigator.userAgent.toLowerCase()), e.fn.extend({
            focus: function(t) {
                return function(i, n) {
                    return "number" == typeof i ? this.each(function() {
                        var t = this;
                        setTimeout(function() {
                            e(t).focus(), n && n.call(t)
                        }, i)
                    }) : t.apply(this, arguments)
                }
            }(e.fn.focus),
            disableSelection: function() {
                var e = "onselectstart" in document.createElement("div") ? "selectstart" : "mousedown";
                return function() {
                    return this.bind(e + ".ui-disableSelection", function(e) {
                        e.preventDefault()
                    })
                }
            }(),
            enableSelection: function() {
                return this.unbind(".ui-disableSelection")
            },
            zIndex: function(t) {
                if (void 0 !== t) return this.css("zIndex", t);
                if (this.length)
                    for (var i, n, s = e(this[0]); s.length && s[0] !== document;) {
                        if (i = s.css("position"), ("absolute" === i || "relative" === i || "fixed" === i) && (n = parseInt(s.css("zIndex"), 10), !isNaN(n) && 0 !== n)) return n;
                        s = s.parent()
                    }
                return 0
            }
        }), e.ui.plugin = {
            add: function(t, i, n) {
                var s, a = e.ui[t].prototype;
                for (s in n) a.plugins[s] = a.plugins[s] || [], a.plugins[s].push([i, n[s]])
            },
            call: function(e, t, i, n) {
                var s, a = e.plugins[t];
                if (a && (n || e.element[0].parentNode && 11 !== e.element[0].parentNode.nodeType))
                    for (s = 0; a.length > s; s++) e.options[a[s][0]] && a[s][1].apply(e.element, i)
            }
        };
        var l = 0,
            d = Array.prototype.slice;
        e.cleanData = function(t) {
            return function(i) {
                var n, s, a;
                for (a = 0; null != (s = i[a]); a++) try {
                    n = e._data(s, "events"), n && n.remove && e(s).triggerHandler("remove")
                } catch (o) {}
                t(i)
            }
        }(e.cleanData), e.widget = function(t, i, n) {
            var s, a, o, r, l = {},
                d = t.split(".")[0];
            return t = t.split(".")[1], s = d + "-" + t, n || (n = i, i = e.Widget), e.expr[":"][s.toLowerCase()] = function(t) {
                return !!e.data(t, s)
            }, e[d] = e[d] || {}, a = e[d][t], o = e[d][t] = function(e, t) {
                return this._createWidget ? void(arguments.length && this._createWidget(e, t)) : new o(e, t)
            }, e.extend(o, a, {
                version: n.version,
                _proto: e.extend({}, n),
                _childConstructors: []
            }), r = new i, r.options = e.widget.extend({}, r.options), e.each(n, function(t, n) {
                return e.isFunction(n) ? void(l[t] = function() {
                    var e = function() {
                            return i.prototype[t].apply(this, arguments)
                        },
                        s = function(e) {
                            return i.prototype[t].apply(this, e)
                        };
                    return function() {
                        var t, i = this._super,
                            a = this._superApply;
                        return this._super = e, this._superApply = s, t = n.apply(this, arguments), this._super = i, this._superApply = a, t
                    }
                }()) : void(l[t] = n)
            }), o.prototype = e.widget.extend(r, {
                widgetEventPrefix: a ? r.widgetEventPrefix || t : t
            }, l, {
                constructor: o,
                namespace: d,
                widgetName: t,
                widgetFullName: s
            }), a ? (e.each(a._childConstructors, function(t, i) {
                var n = i.prototype;
                e.widget(n.namespace + "." + n.widgetName, o, i._proto)
            }), delete a._childConstructors) : i._childConstructors.push(o), e.widget.bridge(t, o), o
        }, e.widget.extend = function(t) {
            for (var i, n, s = d.call(arguments, 1), a = 0, o = s.length; o > a; a++)
                for (i in s[a]) n = s[a][i], s[a].hasOwnProperty(i) && void 0 !== n && (t[i] = e.isPlainObject(n) ? e.isPlainObject(t[i]) ? e.widget.extend({}, t[i], n) : e.widget.extend({}, n) : n);
            return t
        }, e.widget.bridge = function(t, i) {
            var n = i.prototype.widgetFullName || t;
            e.fn[t] = function(s) {
                var a = "string" == typeof s,
                    o = d.call(arguments, 1),
                    r = this;
                return s = !a && o.length ? e.widget.extend.apply(null, [s].concat(o)) : s, this.each(a ? function() {
                    var i, a = e.data(this, n);
                    return "instance" === s ? (r = a, !1) : a ? e.isFunction(a[s]) && "_" !== s.charAt(0) ? (i = a[s].apply(a, o), i !== a && void 0 !== i ? (r = i && i.jquery ? r.pushStack(i.get()) : i, !1) : void 0) : e.error("no such method '" + s + "' for " + t + " widget instance") : e.error("cannot call methods on " + t + " prior to initialization; attempted to call method '" + s + "'")
                } : function() {
                    var t = e.data(this, n);
                    t ? (t.option(s || {}), t._init && t._init()) : e.data(this, n, new i(s, this))
                }), r
            }
        }, e.Widget = function() {}, e.Widget._childConstructors = [], e.Widget.prototype = {
            widgetName: "widget",
            widgetEventPrefix: "",
            defaultElement: "<div>",
            options: {
                disabled: !1,
                create: null
            },
            _createWidget: function(t, i) {
                i = e(i || this.defaultElement || this)[0], this.element = e(i), this.uuid = l++, this.eventNamespace = "." + this.widgetName + this.uuid, this.bindings = e(), this.hoverable = e(), this.focusable = e(), i !== this && (e.data(i, this.widgetFullName, this), this._on(!0, this.element, {
                    remove: function(e) {
                        e.target === i && this.destroy()
                    }
                }), this.document = e(i.style ? i.ownerDocument : i.document || i), this.window = e(this.document[0].defaultView || this.document[0].parentWindow)), this.options = e.widget.extend({}, this.options, this._getCreateOptions(), t), this._create(), this._trigger("create", null, this._getCreateEventData()), this._init()
            },
            _getCreateOptions: e.noop,
            _getCreateEventData: e.noop,
            _create: e.noop,
            _init: e.noop,
            destroy: function() {
                this._destroy(), this.element.unbind(this.eventNamespace).removeData(this.widgetFullName).removeData(e.camelCase(this.widgetFullName)), this.widget().unbind(this.eventNamespace).removeAttr("aria-disabled").removeClass(this.widgetFullName + "-disabled ui-state-disabled"), this.bindings.unbind(this.eventNamespace), this.hoverable.removeClass("ui-state-hover"), this.focusable.removeClass("ui-state-focus")
            },
            _destroy: e.noop,
            widget: function() {
                return this.element
            },
            option: function(t, i) {
                var n, s, a, o = t;
                if (0 === arguments.length) return e.widget.extend({}, this.options);
                if ("string" == typeof t)
                    if (o = {}, n = t.split("."), t = n.shift(), n.length) {
                        for (s = o[t] = e.widget.extend({}, this.options[t]), a = 0; n.length - 1 > a; a++) s[n[a]] = s[n[a]] || {}, s = s[n[a]];
                        if (t = n.pop(), 1 === arguments.length) return void 0 === s[t] ? null : s[t];
                        s[t] = i
                    } else {
                        if (1 === arguments.length) return void 0 === this.options[t] ? null : this.options[t];
                        o[t] = i
                    }
                return this._setOptions(o), this
            },
            _setOptions: function(e) {
                var t;
                for (t in e) this._setOption(t, e[t]);
                return this
            },
            _setOption: function(e, t) {
                return this.options[e] = t, "disabled" === e && (this.widget().toggleClass(this.widgetFullName + "-disabled", !!t), t && (this.hoverable.removeClass("ui-state-hover"), this.focusable.removeClass("ui-state-focus"))), this
            },
            enable: function() {
                return this._setOptions({
                    disabled: !1
                })
            },
            disable: function() {
                return this._setOptions({
                    disabled: !0
                })
            },
            _on: function(t, i, n) {
                var s, a = this;
                "boolean" != typeof t && (n = i, i = t, t = !1), n ? (i = s = e(i), this.bindings = this.bindings.add(i)) : (n = i, i = this.element, s = this.widget()), e.each(n, function(n, o) {
                    function r() {
                        return t || a.options.disabled !== !0 && !e(this).hasClass("ui-state-disabled") ? ("string" == typeof o ? a[o] : o).apply(a, arguments) : void 0
                    }
                    "string" != typeof o && (r.guid = o.guid = o.guid || r.guid || e.guid++);
                    var l = n.match(/^([\w:-]*)\s*(.*)$/),
                        d = l[1] + a.eventNamespace,
                        c = l[2];
                    c ? s.delegate(c, d, r) : i.bind(d, r)
                })
            },
            _off: function(t, i) {
                i = (i || "").split(" ").join(this.eventNamespace + " ") + this.eventNamespace, t.unbind(i).undelegate(i), this.bindings = e(this.bindings.not(t).get()), this.focusable = e(this.focusable.not(t).get()), this.hoverable = e(this.hoverable.not(t).get())
            },
            _delay: function(e, t) {
                function i() {
                    return ("string" == typeof e ? n[e] : e).apply(n, arguments)
                }
                var n = this;
                return setTimeout(i, t || 0)
            },
            _hoverable: function(t) {
                this.hoverable = this.hoverable.add(t), this._on(t, {
                    mouseenter: function(t) {
                        e(t.currentTarget).addClass("ui-state-hover")
                    },
                    mouseleave: function(t) {
                        e(t.currentTarget).removeClass("ui-state-hover")
                    }
                })
            },
            _focusable: function(t) {
                this.focusable = this.focusable.add(t), this._on(t, {
                    focusin: function(t) {
                        e(t.currentTarget).addClass("ui-state-focus")
                    },
                    focusout: function(t) {
                        e(t.currentTarget).removeClass("ui-state-focus")
                    }
                })
            },
            _trigger: function(t, i, n) {
                var s, a, o = this.options[t];
                if (n = n || {}, i = e.Event(i), i.type = (t === this.widgetEventPrefix ? t : this.widgetEventPrefix + t).toLowerCase(), i.target = this.element[0], a = i.originalEvent)
                    for (s in a) s in i || (i[s] = a[s]);
                return this.element.trigger(i, n), !(e.isFunction(o) && o.apply(this.element[0], [i].concat(n)) === !1 || i.isDefaultPrevented())
            }
        }, e.each({
            show: "fadeIn",
            hide: "fadeOut"
        }, function(t, i) {
            e.Widget.prototype["_" + t] = function(n, s, a) {
                "string" == typeof s && (s = {
                    effect: s
                });
                var o, r = s ? s === !0 || "number" == typeof s ? i : s.effect || i : t;
                s = s || {}, "number" == typeof s && (s = {
                    duration: s
                }), o = !e.isEmptyObject(s), s.complete = a, s.delay && n.delay(s.delay), o && e.effects && e.effects.effect[r] ? n[t](s) : r !== t && n[r] ? n[r](s.duration, s.easing, a) : n.queue(function(i) {
                    e(this)[t](), a && a.call(n[0]), i()
                })
            }
        }), e.widget;
        var c = !1;
        e(document).mouseup(function() {
                c = !1
            }), e.widget("ui.mouse", {
                version: "1.11.2",
                options: {
                    cancel: "input,textarea,button,select,option",
                    distance: 1,
                    delay: 0
                },
                _mouseInit: function() {
                    var t = this;
                    this.element.bind("mousedown." + this.widgetName, function(e) {
                        return t._mouseDown(e)
                    }).bind("click." + this.widgetName, function(i) {
                        return !0 === e.data(i.target, t.widgetName + ".preventClickEvent") ? (e.removeData(i.target, t.widgetName + ".preventClickEvent"), i.stopImmediatePropagation(), !1) : void 0
                    }), this.started = !1
                },
                _mouseDestroy: function() {
                    this.element.unbind("." + this.widgetName), this._mouseMoveDelegate && this.document.unbind("mousemove." + this.widgetName, this._mouseMoveDelegate).unbind("mouseup." + this.widgetName, this._mouseUpDelegate)
                },
                _mouseDown: function(t) {
                    if (!c) {
                        this._mouseMoved = !1, this._mouseStarted && this._mouseUp(t), this._mouseDownEvent = t;
                        var i = this,
                            n = 1 === t.which,
                            s = "string" == typeof this.options.cancel && t.target.nodeName ? e(t.target).closest(this.options.cancel).length : !1;
                        return n && !s && this._mouseCapture(t) ? (this.mouseDelayMet = !this.options.delay, this.mouseDelayMet || (this._mouseDelayTimer = setTimeout(function() {
                            i.mouseDelayMet = !0
                        }, this.options.delay)), this._mouseDistanceMet(t) && this._mouseDelayMet(t) && (this._mouseStarted = this._mouseStart(t) !== !1, !this._mouseStarted) ? (t.preventDefault(), !0) : (!0 === e.data(t.target, this.widgetName + ".preventClickEvent") && e.removeData(t.target, this.widgetName + ".preventClickEvent"), this._mouseMoveDelegate = function(e) {
                            return i._mouseMove(e)
                        }, this._mouseUpDelegate = function(e) {
                            return i._mouseUp(e)
                        }, this.document.bind("mousemove." + this.widgetName, this._mouseMoveDelegate).bind("mouseup." + this.widgetName, this._mouseUpDelegate), t.preventDefault(), c = !0, !0)) : !0
                    }
                },
                _mouseMove: function(t) {
                    if (this._mouseMoved) {
                        if (e.ui.ie && (!document.documentMode || 9 > document.documentMode) && !t.button) return this._mouseUp(t);
                        if (!t.which) return this._mouseUp(t)
                    }
                    return (t.which || t.button) && (this._mouseMoved = !0), this._mouseStarted ? (this._mouseDrag(t), t.preventDefault()) : (this._mouseDistanceMet(t) && this._mouseDelayMet(t) && (this._mouseStarted = this._mouseStart(this._mouseDownEvent, t) !== !1, this._mouseStarted ? this._mouseDrag(t) : this._mouseUp(t)), !this._mouseStarted)
                },
                _mouseUp: function(t) {
                    return this.document.unbind("mousemove." + this.widgetName, this._mouseMoveDelegate).unbind("mouseup." + this.widgetName, this._mouseUpDelegate), this._mouseStarted && (this._mouseStarted = !1, t.target === this._mouseDownEvent.target && e.data(t.target, this.widgetName + ".preventClickEvent", !0), this._mouseStop(t)), c = !1, !1
                },
                _mouseDistanceMet: function(e) {
                    return Math.max(Math.abs(this._mouseDownEvent.pageX - e.pageX), Math.abs(this._mouseDownEvent.pageY - e.pageY)) >= this.options.distance
                },
                _mouseDelayMet: function() {
                    return this.mouseDelayMet
                },
                _mouseStart: function() {},
                _mouseDrag: function() {},
                _mouseStop: function() {},
                _mouseCapture: function() {
                    return !0
                }
            }),
            function() {
                function t(e, t, i) {
                    return [parseFloat(e[0]) * (u.test(e[0]) ? t / 100 : 1), parseFloat(e[1]) * (u.test(e[1]) ? i / 100 : 1)]
                }

                function i(t, i) {
                    return parseInt(e.css(t, i), 10) || 0
                }

                function n(t) {
                    var i = t[0];
                    return 9 === i.nodeType ? {
                        width: t.width(),
                        height: t.height(),
                        offset: {
                            top: 0,
                            left: 0
                        }
                    } : e.isWindow(i) ? {
                        width: t.width(),
                        height: t.height(),
                        offset: {
                            top: t.scrollTop(),
                            left: t.scrollLeft()
                        }
                    } : i.preventDefault ? {
                        width: 0,
                        height: 0,
                        offset: {
                            top: i.pageY,
                            left: i.pageX
                        }
                    } : {
                        width: t.outerWidth(),
                        height: t.outerHeight(),
                        offset: t.offset()
                    }
                }
                e.ui = e.ui || {};
                var s, a, o = Math.max,
                    r = Math.abs,
                    l = Math.round,
                    d = /left|center|right/,
                    c = /top|center|bottom/,
                    h = /[\+\-]\d+(\.[\d]+)?%?/,
                    p = /^\w+/,
                    u = /%$/,
                    g = e.fn.position;
                e.position = {
                        scrollbarWidth: function() {
                            if (void 0 !== s) return s;
                            var t, i, n = e("<div style='display:block;position:absolute;width:50px;height:50px;overflow:hidden;'><div style='height:100px;width:auto;'></div></div>"),
                                a = n.children()[0];
                            return e("body").append(n), t = a.offsetWidth, n.css("overflow", "scroll"), i = a.offsetWidth, t === i && (i = n[0].clientWidth), n.remove(), s = t - i
                        },
                        getScrollInfo: function(t) {
                            var i = t.isWindow || t.isDocument ? "" : t.element.css("overflow-x"),
                                n = t.isWindow || t.isDocument ? "" : t.element.css("overflow-y"),
                                s = "scroll" === i || "auto" === i && t.width < t.element[0].scrollWidth,
                                a = "scroll" === n || "auto" === n && t.height < t.element[0].scrollHeight;
                            return {
                                width: a ? e.position.scrollbarWidth() : 0,
                                height: s ? e.position.scrollbarWidth() : 0
                            }
                        },
                        getWithinInfo: function(t) {
                            var i = e(t || window),
                                n = e.isWindow(i[0]),
                                s = !!i[0] && 9 === i[0].nodeType;
                            return {
                                element: i,
                                isWindow: n,
                                isDocument: s,
                                offset: i.offset() || {
                                    left: 0,
                                    top: 0
                                },
                                scrollLeft: i.scrollLeft(),
                                scrollTop: i.scrollTop(),
                                width: n || s ? i.width() : i.outerWidth(),
                                height: n || s ? i.height() : i.outerHeight()
                            }
                        }
                    }, e.fn.position = function(s) {
                        if (!s || !s.of) return g.apply(this, arguments);
                        s = e.extend({}, s);
                        var u, f, m, v, _, b, y = e(s.of),
                            w = e.position.getWithinInfo(s.within),
                            k = e.position.getScrollInfo(w),
                            x = (s.collision || "flip").split(" "),
                            D = {};
                        return b = n(y), y[0].preventDefault && (s.at = "left top"), f = b.width, m = b.height, v = b.offset, _ = e.extend({}, v), e.each(["my", "at"], function() {
                            var e, t, i = (s[this] || "").split(" ");
                            1 === i.length && (i = d.test(i[0]) ? i.concat(["center"]) : c.test(i[0]) ? ["center"].concat(i) : ["center", "center"]), i[0] = d.test(i[0]) ? i[0] : "center", i[1] = c.test(i[1]) ? i[1] : "center", e = h.exec(i[0]), t = h.exec(i[1]), D[this] = [e ? e[0] : 0, t ? t[0] : 0], s[this] = [p.exec(i[0])[0], p.exec(i[1])[0]]
                        }), 1 === x.length && (x[1] = x[0]), "right" === s.at[0] ? _.left += f : "center" === s.at[0] && (_.left += f / 2), "bottom" === s.at[1] ? _.top += m : "center" === s.at[1] && (_.top += m / 2), u = t(D.at, f, m), _.left += u[0], _.top += u[1], this.each(function() {
                            var n, d, c = e(this),
                                h = c.outerWidth(),
                                p = c.outerHeight(),
                                g = i(this, "marginLeft"),
                                b = i(this, "marginTop"),
                                M = h + g + i(this, "marginRight") + k.width,
                                S = p + b + i(this, "marginBottom") + k.height,
                                C = e.extend({}, _),
                                N = t(D.my, c.outerWidth(), c.outerHeight());
                            "right" === s.my[0] ? C.left -= h : "center" === s.my[0] && (C.left -= h / 2), "bottom" === s.my[1] ? C.top -= p : "center" === s.my[1] && (C.top -= p / 2), C.left += N[0], C.top += N[1], a || (C.left = l(C.left), C.top = l(C.top)), n = {
                                marginLeft: g,
                                marginTop: b
                            }, e.each(["left", "top"], function(t, i) {
                                e.ui.position[x[t]] && e.ui.position[x[t]][i](C, {
                                    targetWidth: f,
                                    targetHeight: m,
                                    elemWidth: h,
                                    elemHeight: p,
                                    collisionPosition: n,
                                    collisionWidth: M,
                                    collisionHeight: S,
                                    offset: [u[0] + N[0], u[1] + N[1]],
                                    my: s.my,
                                    at: s.at,
                                    within: w,
                                    elem: c
                                })
                            }), s.using && (d = function(e) {
                                var t = v.left - C.left,
                                    i = t + f - h,
                                    n = v.top - C.top,
                                    a = n + m - p,
                                    l = {
                                        target: {
                                            element: y,
                                            left: v.left,
                                            top: v.top,
                                            width: f,
                                            height: m
                                        },
                                        element: {
                                            element: c,
                                            left: C.left,
                                            top: C.top,
                                            width: h,
                                            height: p
                                        },
                                        horizontal: 0 > i ? "left" : t > 0 ? "right" : "center",
                                        vertical: 0 > a ? "top" : n > 0 ? "bottom" : "middle"
                                    };
                                h > f && f > r(t + i) && (l.horizontal = "center"), p > m && m > r(n + a) && (l.vertical = "middle"), l.important = o(r(t), r(i)) > o(r(n), r(a)) ? "horizontal" : "vertical", s.using.call(this, e, l)
                            }), c.offset(e.extend(C, {
                                using: d
                            }))
                        })
                    }, e.ui.position = {
                        fit: {
                            left: function(e, t) {
                                var i, n = t.within,
                                    s = n.isWindow ? n.scrollLeft : n.offset.left,
                                    a = n.width,
                                    r = e.left - t.collisionPosition.marginLeft,
                                    l = s - r,
                                    d = r + t.collisionWidth - a - s;
                                t.collisionWidth > a ? l > 0 && 0 >= d ? (i = e.left + l + t.collisionWidth - a - s, e.left += l - i) : e.left = d > 0 && 0 >= l ? s : l > d ? s + a - t.collisionWidth : s : l > 0 ? e.left += l : d > 0 ? e.left -= d : e.left = o(e.left - r, e.left)
                            },
                            top: function(e, t) {
                                var i, n = t.within,
                                    s = n.isWindow ? n.scrollTop : n.offset.top,
                                    a = t.within.height,
                                    r = e.top - t.collisionPosition.marginTop,
                                    l = s - r,
                                    d = r + t.collisionHeight - a - s;
                                t.collisionHeight > a ? l > 0 && 0 >= d ? (i = e.top + l + t.collisionHeight - a - s, e.top += l - i) : e.top = d > 0 && 0 >= l ? s : l > d ? s + a - t.collisionHeight : s : l > 0 ? e.top += l : d > 0 ? e.top -= d : e.top = o(e.top - r, e.top)
                            }
                        },
                        flip: {
                            left: function(e, t) {
                                var i, n, s = t.within,
                                    a = s.offset.left + s.scrollLeft,
                                    o = s.width,
                                    l = s.isWindow ? s.scrollLeft : s.offset.left,
                                    d = e.left - t.collisionPosition.marginLeft,
                                    c = d - l,
                                    h = d + t.collisionWidth - o - l,
                                    p = "left" === t.my[0] ? -t.elemWidth : "right" === t.my[0] ? t.elemWidth : 0,
                                    u = "left" === t.at[0] ? t.targetWidth : "right" === t.at[0] ? -t.targetWidth : 0,
                                    g = -2 * t.offset[0];
                                0 > c ? (i = e.left + p + u + g + t.collisionWidth - o - a, (0 > i || r(c) > i) && (e.left += p + u + g)) : h > 0 && (n = e.left - t.collisionPosition.marginLeft + p + u + g - l, (n > 0 || h > r(n)) && (e.left += p + u + g))
                            },
                            top: function(e, t) {
                                var i, n, s = t.within,
                                    a = s.offset.top + s.scrollTop,
                                    o = s.height,
                                    l = s.isWindow ? s.scrollTop : s.offset.top,
                                    d = e.top - t.collisionPosition.marginTop,
                                    c = d - l,
                                    h = d + t.collisionHeight - o - l,
                                    p = "top" === t.my[1],
                                    u = p ? -t.elemHeight : "bottom" === t.my[1] ? t.elemHeight : 0,
                                    g = "top" === t.at[1] ? t.targetHeight : "bottom" === t.at[1] ? -t.targetHeight : 0,
                                    f = -2 * t.offset[1];
                                0 > c ? (n = e.top + u + g + f + t.collisionHeight - o - a, e.top + u + g + f > c && (0 > n || r(c) > n) && (e.top += u + g + f)) : h > 0 && (i = e.top - t.collisionPosition.marginTop + u + g + f - l, e.top + u + g + f > h && (i > 0 || h > r(i)) && (e.top += u + g + f))
                            }
                        },
                        flipfit: {
                            left: function() {
                                e.ui.position.flip.left.apply(this, arguments), e.ui.position.fit.left.apply(this, arguments)
                            },
                            top: function() {
                                e.ui.position.flip.top.apply(this, arguments), e.ui.position.fit.top.apply(this, arguments)
                            }
                        }
                    },
                    function() {
                        var t, i, n, s, o, r = document.getElementsByTagName("body")[0],
                            l = document.createElement("div");
                        t = document.createElement(r ? "div" : "body"), n = {
                            visibility: "hidden",
                            width: 0,
                            height: 0,
                            border: 0,
                            margin: 0,
                            background: "none"
                        }, r && e.extend(n, {
                            position: "absolute",
                            left: "-1000px",
                            top: "-1000px"
                        });
                        for (o in n) t.style[o] = n[o];
                        t.appendChild(l), i = r || document.documentElement, i.insertBefore(t, i.firstChild), l.style.cssText = "position: absolute; left: 10.7432222px;", s = e(l).offset().left, a = s > 10 && 11 > s, t.innerHTML = "", i.removeChild(t)
                    }()
            }(), e.ui.position, e.extend(e.ui, {
                datepicker: {
                    version: "1.11.2"
                }
            });
        var h;
        e.extend(s.prototype, {
            markerClassName: "hasDatepicker",
            maxRows: 4,
            _widgetDatepicker: function() {
                return this.dpDiv
            },
            setDefaults: function(e) {
                return r(this._defaults, e || {}), this
            },
            _attachDatepicker: function(t, i) {
                var n, s, a;
                n = t.nodeName.toLowerCase(), s = "div" === n || "span" === n, t.id || (this.uuid += 1, t.id = "dp" + this.uuid), a = this._newInst(e(t), s), a.settings = e.extend({}, i || {}), "input" === n ? this._connectDatepicker(t, a) : s && this._inlineDatepicker(t, a)
            },
            _newInst: function(t, i) {
                var n = t[0].id.replace(/([^A-Za-z0-9_\-])/g, "\\\\$1");
                return {
                    id: n,
                    input: t,
                    selectedDay: 0,
                    selectedMonth: 0,
                    selectedYear: 0,
                    drawMonth: 0,
                    drawYear: 0,
                    inline: i,
                    dpDiv: i ? a(e("<div class='" + this._inlineClass + " ui-datepicker ui-widget ui-widget-content ui-helper-clearfix ui-corner-all'></div>")) : this.dpDiv
                }
            },
            _connectDatepicker: function(t, i) {
                var n = e(t);
                i.append = e([]), i.trigger = e([]), n.hasClass(this.markerClassName) || (this._attachments(n, i), n.addClass(this.markerClassName).keydown(this._doKeyDown).keypress(this._doKeyPress).keyup(this._doKeyUp), this._autoSize(i), e.data(t, "datepicker", i), i.settings.disabled && this._disableDatepicker(t))
            },
            _attachments: function(t, i) {
                var n, s, a, o = this._get(i, "appendText"),
                    r = this._get(i, "isRTL");
                i.append && i.append.remove(), o && (i.append = e("<span class='" + this._appendClass + "'>" + o + "</span>"), t[r ? "before" : "after"](i.append)), t.unbind("focus", this._showDatepicker), i.trigger && i.trigger.remove(), n = this._get(i, "showOn"), ("focus" === n || "both" === n) && t.focus(this._showDatepicker), ("button" === n || "both" === n) && (s = this._get(i, "buttonText"), a = this._get(i, "buttonImage"), i.trigger = e(this._get(i, "buttonImageOnly") ? e("<img/>").addClass(this._triggerClass).attr({
                    src: a,
                    alt: s,
                    title: s
                }) : e("<button type='button'></button>").addClass(this._triggerClass).html(a ? e("<img/>").attr({
                    src: a,
                    alt: s,
                    title: s
                }) : s)), t[r ? "before" : "after"](i.trigger), i.trigger.click(function() {
                    return e.datepicker._datepickerShowing && e.datepicker._lastInput === t[0] ? e.datepicker._hideDatepicker() : e.datepicker._datepickerShowing && e.datepicker._lastInput !== t[0] ? (e.datepicker._hideDatepicker(), e.datepicker._showDatepicker(t[0])) : e.datepicker._showDatepicker(t[0]), !1
                }))
            },
            _autoSize: function(e) {
                if (this._get(e, "autoSize") && !e.inline) {
                    var t, i, n, s, a = new Date(2009, 11, 20),
                        o = this._get(e, "dateFormat");
                    o.match(/[DM]/) && (t = function(e) {
                        for (i = 0, n = 0, s = 0; e.length > s; s++) e[s].length > i && (i = e[s].length, n = s);
                        return n
                    }, a.setMonth(t(this._get(e, o.match(/MM/) ? "monthNames" : "monthNamesShort"))), a.setDate(t(this._get(e, o.match(/DD/) ? "dayNames" : "dayNamesShort")) + 20 - a.getDay())), e.input.attr("size", this._formatDate(e, a).length)
                }
            },
            _inlineDatepicker: function(t, i) {
                var n = e(t);
                n.hasClass(this.markerClassName) || (n.addClass(this.markerClassName).append(i.dpDiv), e.data(t, "datepicker", i), this._setDate(i, this._getDefaultDate(i), !0), this._updateDatepicker(i), this._updateAlternate(i), i.settings.disabled && this._disableDatepicker(t), i.dpDiv.css("display", "block"))
            },
            _dialogDatepicker: function(t, i, n, s, a) {
                var o, l, d, c, h, p = this._dialogInst;
                return p || (this.uuid += 1, o = "dp" + this.uuid, this._dialogInput = e("<input type='text' id='" + o + "' style='position: absolute; top: -100px; width: 0px;'/>"), this._dialogInput.keydown(this._doKeyDown), e("body").append(this._dialogInput), p = this._dialogInst = this._newInst(this._dialogInput, !1), p.settings = {}, e.data(this._dialogInput[0], "datepicker", p)), r(p.settings, s || {}), i = i && i.constructor === Date ? this._formatDate(p, i) : i, this._dialogInput.val(i), this._pos = a ? a.length ? a : [a.pageX, a.pageY] : null, this._pos || (l = document.documentElement.clientWidth, d = document.documentElement.clientHeight, c = document.documentElement.scrollLeft || document.body.scrollLeft, h = document.documentElement.scrollTop || document.body.scrollTop, this._pos = [l / 2 - 100 + c, d / 2 - 150 + h]), this._dialogInput.css("left", this._pos[0] + 20 + "px").css("top", this._pos[1] + "px"), p.settings.onSelect = n, this._inDialog = !0, this.dpDiv.addClass(this._dialogClass), this._showDatepicker(this._dialogInput[0]), e.blockUI && e.blockUI(this.dpDiv), e.data(this._dialogInput[0], "datepicker", p), this
            },
            _destroyDatepicker: function(t) {
                var i, n = e(t),
                    s = e.data(t, "datepicker");
                n.hasClass(this.markerClassName) && (i = t.nodeName.toLowerCase(), e.removeData(t, "datepicker"), "input" === i ? (s.append.remove(), s.trigger.remove(), n.removeClass(this.markerClassName).unbind("focus", this._showDatepicker).unbind("keydown", this._doKeyDown).unbind("keypress", this._doKeyPress).unbind("keyup", this._doKeyUp)) : ("div" === i || "span" === i) && n.removeClass(this.markerClassName).empty())
            },
            _enableDatepicker: function(t) {
                var i, n, s = e(t),
                    a = e.data(t, "datepicker");
                s.hasClass(this.markerClassName) && (i = t.nodeName.toLowerCase(), "input" === i ? (t.disabled = !1, a.trigger.filter("button").each(function() {
                    this.disabled = !1
                }).end().filter("img").css({
                    opacity: "1.0",
                    cursor: ""
                })) : ("div" === i || "span" === i) && (n = s.children("." + this._inlineClass), n.children().removeClass("ui-state-disabled"), n.find("select.ui-datepicker-month, select.ui-datepicker-year").prop("disabled", !1)), this._disabledInputs = e.map(this._disabledInputs, function(e) {
                    return e === t ? null : e
                }))
            },
            _disableDatepicker: function(t) {
                var i, n, s = e(t),
                    a = e.data(t, "datepicker");
                s.hasClass(this.markerClassName) && (i = t.nodeName.toLowerCase(), "input" === i ? (t.disabled = !0, a.trigger.filter("button").each(function() {
                    this.disabled = !0
                }).end().filter("img").css({
                    opacity: "0.5",
                    cursor: "default"
                })) : ("div" === i || "span" === i) && (n = s.children("." + this._inlineClass), n.children().addClass("ui-state-disabled"), n.find("select.ui-datepicker-month, select.ui-datepicker-year").prop("disabled", !0)), this._disabledInputs = e.map(this._disabledInputs, function(e) {
                    return e === t ? null : e
                }), this._disabledInputs[this._disabledInputs.length] = t)
            },
            _isDisabledDatepicker: function(e) {
                if (!e) return !1;
                for (var t = 0; this._disabledInputs.length > t; t++)
                    if (this._disabledInputs[t] === e) return !0;
                return !1
            },
            _getInst: function(t) {
                try {
                    return e.data(t, "datepicker")
                } catch (i) {
                    throw "Missing instance data for this datepicker"
                }
            },
            _optionDatepicker: function(t, i, n) {
                var s, a, o, l, d = this._getInst(t);
                return 2 === arguments.length && "string" == typeof i ? "defaults" === i ? e.extend({}, e.datepicker._defaults) : d ? "all" === i ? e.extend({}, d.settings) : this._get(d, i) : null : (s = i || {}, "string" == typeof i && (s = {}, s[i] = n), void(d && (this._curInst === d && this._hideDatepicker(), a = this._getDateDatepicker(t, !0), o = this._getMinMaxDate(d, "min"), l = this._getMinMaxDate(d, "max"), r(d.settings, s), null !== o && void 0 !== s.dateFormat && void 0 === s.minDate && (d.settings.minDate = this._formatDate(d, o)), null !== l && void 0 !== s.dateFormat && void 0 === s.maxDate && (d.settings.maxDate = this._formatDate(d, l)), "disabled" in s && (s.disabled ? this._disableDatepicker(t) : this._enableDatepicker(t)), this._attachments(e(t), d), this._autoSize(d), this._setDate(d, a), this._updateAlternate(d), this._updateDatepicker(d))))
            },
            _changeDatepicker: function(e, t, i) {
                this._optionDatepicker(e, t, i)
            },
            _refreshDatepicker: function(e) {
                var t = this._getInst(e);
                t && this._updateDatepicker(t)
            },
            _setDateDatepicker: function(e, t) {
                var i = this._getInst(e);
                i && (this._setDate(i, t), this._updateDatepicker(i), this._updateAlternate(i))
            },
            _getDateDatepicker: function(e, t) {
                var i = this._getInst(e);
                return i && !i.inline && this._setDateFromField(i, t), i ? this._getDate(i) : null
            },
            _doKeyDown: function(t) {
                var i, n, s, a = e.datepicker._getInst(t.target),
                    o = !0,
                    r = a.dpDiv.is(".ui-datepicker-rtl");
                if (a._keyEvent = !0, e.datepicker._datepickerShowing) switch (t.keyCode) {
                    case 9:
                        e.datepicker._hideDatepicker(), o = !1;
                        break;
                    case 13:
                        return s = e("td." + e.datepicker._dayOverClass + ":not(." + e.datepicker._currentClass + ")", a.dpDiv), s[0] && e.datepicker._selectDay(t.target, a.selectedMonth, a.selectedYear, s[0]), i = e.datepicker._get(a, "onSelect"), i ? (n = e.datepicker._formatDate(a), i.apply(a.input ? a.input[0] : null, [n, a])) : e.datepicker._hideDatepicker(), !1;
                    case 27:
                        e.datepicker._hideDatepicker();
                        break;
                    case 33:
                        e.datepicker._adjustDate(t.target, t.ctrlKey ? -e.datepicker._get(a, "stepBigMonths") : -e.datepicker._get(a, "stepMonths"), "M");
                        break;
                    case 34:
                        e.datepicker._adjustDate(t.target, t.ctrlKey ? +e.datepicker._get(a, "stepBigMonths") : +e.datepicker._get(a, "stepMonths"), "M");
                        break;
                    case 35:
                        (t.ctrlKey || t.metaKey) && e.datepicker._clearDate(t.target), o = t.ctrlKey || t.metaKey;
                        break;
                    case 36:
                        (t.ctrlKey || t.metaKey) && e.datepicker._gotoToday(t.target), o = t.ctrlKey || t.metaKey;
                        break;
                    case 37:
                        (t.ctrlKey || t.metaKey) && e.datepicker._adjustDate(t.target, r ? 1 : -1, "D"), o = t.ctrlKey || t.metaKey, t.originalEvent.altKey && e.datepicker._adjustDate(t.target, t.ctrlKey ? -e.datepicker._get(a, "stepBigMonths") : -e.datepicker._get(a, "stepMonths"), "M");
                        break;
                    case 38:
                        (t.ctrlKey || t.metaKey) && e.datepicker._adjustDate(t.target, -7, "D"), o = t.ctrlKey || t.metaKey;
                        break;
                    case 39:
                        (t.ctrlKey || t.metaKey) && e.datepicker._adjustDate(t.target, r ? -1 : 1, "D"), o = t.ctrlKey || t.metaKey, t.originalEvent.altKey && e.datepicker._adjustDate(t.target, t.ctrlKey ? +e.datepicker._get(a, "stepBigMonths") : +e.datepicker._get(a, "stepMonths"), "M");
                        break;
                    case 40:
                        (t.ctrlKey || t.metaKey) && e.datepicker._adjustDate(t.target, 7, "D"), o = t.ctrlKey || t.metaKey;
                        break;
                    default:
                        o = !1
                } else 36 === t.keyCode && t.ctrlKey ? e.datepicker._showDatepicker(this) : o = !1;
                o && (t.preventDefault(), t.stopPropagation())
            },
            _doKeyPress: function(t) {
                var i, n, s = e.datepicker._getInst(t.target);
                return e.datepicker._get(s, "constrainInput") ? (i = e.datepicker._possibleChars(e.datepicker._get(s, "dateFormat")), n = String.fromCharCode(null == t.charCode ? t.keyCode : t.charCode), t.ctrlKey || t.metaKey || " " > n || !i || i.indexOf(n) > -1) : void 0
            },
            _doKeyUp: function(t) {
                var i, n = e.datepicker._getInst(t.target);
                if (n.input.val() !== n.lastVal) try {
                    i = e.datepicker.parseDate(e.datepicker._get(n, "dateFormat"), n.input ? n.input.val() : null, e.datepicker._getFormatConfig(n)), i && (e.datepicker._setDateFromField(n), e.datepicker._updateAlternate(n), e.datepicker._updateDatepicker(n))
                } catch (s) {}
                return !0
            },
            _showDatepicker: function(t) {
                if (t = t.target || t, "input" !== t.nodeName.toLowerCase() && (t = e("input", t.parentNode)[0]), !e.datepicker._isDisabledDatepicker(t) && e.datepicker._lastInput !== t) {
                    var i, s, a, o, l, d, c;
                    i = e.datepicker._getInst(t), e.datepicker._curInst && e.datepicker._curInst !== i && (e.datepicker._curInst.dpDiv.stop(!0, !0), i && e.datepicker._datepickerShowing && e.datepicker._hideDatepicker(e.datepicker._curInst.input[0])), s = e.datepicker._get(i, "beforeShow"), a = s ? s.apply(t, [t, i]) : {}, a !== !1 && (r(i.settings, a), i.lastVal = null, e.datepicker._lastInput = t, e.datepicker._setDateFromField(i), e.datepicker._inDialog && (t.value = ""), e.datepicker._pos || (e.datepicker._pos = e.datepicker._findPos(t), e.datepicker._pos[1] += t.offsetHeight), o = !1, e(t).parents().each(function() {
                        return o |= "fixed" === e(this).css("position"), !o
                    }), l = {
                        left: e.datepicker._pos[0],
                        top: e.datepicker._pos[1]
                    }, e.datepicker._pos = null, i.dpDiv.empty(), i.dpDiv.css({
                        position: "absolute",
                        display: "block",
                        top: "-1000px"
                    }), e.datepicker._updateDatepicker(i), l = e.datepicker._checkOffset(i, l, o), i.dpDiv.css({
                        position: e.datepicker._inDialog && e.blockUI ? "static" : o ? "fixed" : "absolute",
                        display: "none",
                        left: l.left + "px",
                        top: l.top + "px"
                    }), i.inline || (d = e.datepicker._get(i, "showAnim"), c = e.datepicker._get(i, "duration"), i.dpDiv.css("z-index", n(e(t)) + 1), e.datepicker._datepickerShowing = !0, e.effects && e.effects.effect[d] ? i.dpDiv.show(d, e.datepicker._get(i, "showOptions"), c) : i.dpDiv[d || "show"](d ? c : null), e.datepicker._shouldFocusInput(i) && i.input.focus(), e.datepicker._curInst = i))
                }
            },
            _updateDatepicker: function(t) {
                this.maxRows = 4, h = t, t.dpDiv.empty().append(this._generateHTML(t)), this._attachHandlers(t);
                var i, n = this._getNumberOfMonths(t),
                    s = n[1],
                    a = 17,
                    r = t.dpDiv.find("." + this._dayOverClass + " a");
                r.length > 0 && o.apply(r.get(0)), t.dpDiv.removeClass("ui-datepicker-multi-2 ui-datepicker-multi-3 ui-datepicker-multi-4").width(""), s > 1 && t.dpDiv.addClass("ui-datepicker-multi-" + s).css("width", a * s + "em"), t.dpDiv[(1 !== n[0] || 1 !== n[1] ? "add" : "remove") + "Class"]("ui-datepicker-multi"), t.dpDiv[(this._get(t, "isRTL") ? "add" : "remove") + "Class"]("ui-datepicker-rtl"), t === e.datepicker._curInst && e.datepicker._datepickerShowing && e.datepicker._shouldFocusInput(t) && t.input.focus(), t.yearshtml && (i = t.yearshtml, setTimeout(function() {
                    i === t.yearshtml && t.yearshtml && t.dpDiv.find("select.ui-datepicker-year:first").replaceWith(t.yearshtml), i = t.yearshtml = null
                }, 0))
            },
            _shouldFocusInput: function(e) {
                return e.input && e.input.is(":visible") && !e.input.is(":disabled") && !e.input.is(":focus")
            },
            _checkOffset: function(t, i, n) {
                var s = t.dpDiv.outerWidth(),
                    a = t.dpDiv.outerHeight(),
                    o = t.input ? t.input.outerWidth() : 0,
                    r = t.input ? t.input.outerHeight() : 0,
                    l = document.documentElement.clientWidth + (n ? 0 : e(document).scrollLeft()),
                    d = document.documentElement.clientHeight + (n ? 0 : e(document).scrollTop());
                return i.left -= this._get(t, "isRTL") ? s - o : 0, i.left -= n && i.left === t.input.offset().left ? e(document).scrollLeft() : 0, i.top -= n && i.top === t.input.offset().top + r ? e(document).scrollTop() : 0, i.left -= Math.min(i.left, i.left + s > l && l > s ? Math.abs(i.left + s - l) : 0), i.top -= Math.min(i.top, i.top + a > d && d > a ? Math.abs(a + r) : 0), i
            },
            _findPos: function(t) {
                for (var i, n = this._getInst(t), s = this._get(n, "isRTL"); t && ("hidden" === t.type || 1 !== t.nodeType || e.expr.filters.hidden(t));) t = t[s ? "previousSibling" : "nextSibling"];
                return i = e(t).offset(), [i.left, i.top]
            },
            _hideDatepicker: function(t) {
                var i, n, s, a, o = this._curInst;
                !o || t && o !== e.data(t, "datepicker") || this._datepickerShowing && (i = this._get(o, "showAnim"), n = this._get(o, "duration"), s = function() {
                    e.datepicker._tidyDialog(o)
                }, e.effects && (e.effects.effect[i] || e.effects[i]) ? o.dpDiv.hide(i, e.datepicker._get(o, "showOptions"), n, s) : o.dpDiv["slideDown" === i ? "slideUp" : "fadeIn" === i ? "fadeOut" : "hide"](i ? n : null, s), i || s(), this._datepickerShowing = !1, a = this._get(o, "onClose"), a && a.apply(o.input ? o.input[0] : null, [o.input ? o.input.val() : "", o]), this._lastInput = null, this._inDialog && (this._dialogInput.css({
                    position: "absolute",
                    left: "0",
                    top: "-100px"
                }), e.blockUI && (e.unblockUI(), e("body").append(this.dpDiv))), this._inDialog = !1)
            },
            _tidyDialog: function(e) {
                e.dpDiv.removeClass(this._dialogClass).unbind(".ui-datepicker-calendar")
            },
            _checkExternalClick: function(t) {
                if (e.datepicker._curInst) {
                    var i = e(t.target),
                        n = e.datepicker._getInst(i[0]);
                    (i[0].id !== e.datepicker._mainDivId && 0 === i.parents("#" + e.datepicker._mainDivId).length && !i.hasClass(e.datepicker.markerClassName) && !i.closest("." + e.datepicker._triggerClass).length && e.datepicker._datepickerShowing && (!e.datepicker._inDialog || !e.blockUI) || i.hasClass(e.datepicker.markerClassName) && e.datepicker._curInst !== n) && e.datepicker._hideDatepicker()
                }
            },
            _adjustDate: function(t, i, n) {
                var s = e(t),
                    a = this._getInst(s[0]);
                this._isDisabledDatepicker(s[0]) || (this._adjustInstDate(a, i + ("M" === n ? this._get(a, "showCurrentAtPos") : 0), n), this._updateDatepicker(a))
            },
            _gotoToday: function(t) {
                var i, n = e(t),
                    s = this._getInst(n[0]);
                this._get(s, "gotoCurrent") && s.currentDay ? (s.selectedDay = s.currentDay, s.drawMonth = s.selectedMonth = s.currentMonth, s.drawYear = s.selectedYear = s.currentYear) : (i = new Date, s.selectedDay = i.getDate(), s.drawMonth = s.selectedMonth = i.getMonth(), s.drawYear = s.selectedYear = i.getFullYear()), this._notifyChange(s), this._adjustDate(n)
            },
            _selectMonthYear: function(t, i, n) {
                var s = e(t),
                    a = this._getInst(s[0]);
                a["selected" + ("M" === n ? "Month" : "Year")] = a["draw" + ("M" === n ? "Month" : "Year")] = parseInt(i.options[i.selectedIndex].value, 10), this._notifyChange(a), this._adjustDate(s)
            },
            _selectDay: function(t, i, n, s) {
                var a, o = e(t);
                e(s).hasClass(this._unselectableClass) || this._isDisabledDatepicker(o[0]) || (a = this._getInst(o[0]), a.selectedDay = a.currentDay = e("a", s).html(), a.selectedMonth = a.currentMonth = i, a.selectedYear = a.currentYear = n, this._selectDate(t, this._formatDate(a, a.currentDay, a.currentMonth, a.currentYear)))
            },
            _clearDate: function(t) {
                var i = e(t);
                this._selectDate(i, "")
            },
            _selectDate: function(t, i) {
                var n, s = e(t),
                    a = this._getInst(s[0]);
                i = null != i ? i : this._formatDate(a), a.input && a.input.val(i), this._updateAlternate(a), n = this._get(a, "onSelect"), n ? n.apply(a.input ? a.input[0] : null, [i, a]) : a.input && a.input.trigger("change"), a.inline ? this._updateDatepicker(a) : (this._hideDatepicker(), this._lastInput = a.input[0], "object" != typeof a.input[0] && a.input.focus(), this._lastInput = null)
            },
            _updateAlternate: function(t) {
                var i, n, s, a = this._get(t, "altField");
                a && (i = this._get(t, "altFormat") || this._get(t, "dateFormat"), n = this._getDate(t), s = this.formatDate(i, n, this._getFormatConfig(t)), e(a).each(function() {
                    e(this).val(s)
                }))
            },
            noWeekends: function(e) {
                var t = e.getDay();
                return [t > 0 && 6 > t, ""]
            },
            iso8601Week: function(e) {
                var t, i = new Date(e.getTime());
                return i.setDate(i.getDate() + 4 - (i.getDay() || 7)), t = i.getTime(), i.setMonth(0), i.setDate(1), Math.floor(Math.round((t - i) / 864e5) / 7) + 1
            },
            parseDate: function(t, i, n) {
                if (null == t || null == i) throw "Invalid arguments";
                if (i = "object" == typeof i ? "" + i : i + "", "" === i) return null;
                var s, a, o, r, l = 0,
                    d = (n ? n.shortYearCutoff : null) || this._defaults.shortYearCutoff,
                    c = "string" != typeof d ? d : (new Date).getFullYear() % 100 + parseInt(d, 10),
                    h = (n ? n.dayNamesShort : null) || this._defaults.dayNamesShort,
                    p = (n ? n.dayNames : null) || this._defaults.dayNames,
                    u = (n ? n.monthNamesShort : null) || this._defaults.monthNamesShort,
                    g = (n ? n.monthNames : null) || this._defaults.monthNames,
                    f = -1,
                    m = -1,
                    v = -1,
                    _ = -1,
                    b = !1,
                    y = function(e) {
                        var i = t.length > s + 1 && t.charAt(s + 1) === e;
                        return i && s++, i
                    },
                    w = function(e) {
                        var t = y(e),
                            n = "@" === e ? 14 : "!" === e ? 20 : "y" === e && t ? 4 : "o" === e ? 3 : 2,
                            s = "y" === e ? n : 1,
                            a = RegExp("^\\d{" + s + "," + n + "}"),
                            o = i.substring(l).match(a);
                        if (!o) throw "Missing number at position " + l;
                        return l += o[0].length, parseInt(o[0], 10)
                    },
                    k = function(t, n, s) {
                        var a = -1,
                            o = e.map(y(t) ? s : n, function(e, t) {
                                return [
                                    [t, e]
                                ]
                            }).sort(function(e, t) {
                                return -(e[1].length - t[1].length)
                            });
                        if (e.each(o, function(e, t) {
                                var n = t[1];
                                return i.substr(l, n.length).toLowerCase() === n.toLowerCase() ? (a = t[0], l += n.length, !1) : void 0
                            }), -1 !== a) return a + 1;
                        throw "Unknown name at position " + l
                    },
                    x = function() {
                        if (i.charAt(l) !== t.charAt(s)) throw "Unexpected literal at position " + l;
                        l++
                    };
                for (s = 0; t.length > s; s++)
                    if (b) "'" !== t.charAt(s) || y("'") ? x() : b = !1;
                    else switch (t.charAt(s)) {
                        case "d":
                            v = w("d");
                            break;
                        case "D":
                            k("D", h, p);
                            break;
                        case "o":
                            _ = w("o");
                            break;
                        case "m":
                            m = w("m");
                            break;
                        case "M":
                            m = k("M", u, g);
                            break;
                        case "y":
                            f = w("y");
                            break;
                        case "@":
                            r = new Date(w("@")), f = r.getFullYear(), m = r.getMonth() + 1, v = r.getDate();
                            break;
                        case "!":
                            r = new Date((w("!") - this._ticksTo1970) / 1e4), f = r.getFullYear(), m = r.getMonth() + 1, v = r.getDate();
                            break;
                        case "'":
                            y("'") ? x() : b = !0;
                            break;
                        default:
                            x()
                    }
                    if (i.length > l && (o = i.substr(l), !/^\s+/.test(o))) throw "Extra/unparsed characters found in date: " + o;
                if (-1 === f ? f = (new Date).getFullYear() : 100 > f && (f += (new Date).getFullYear() - (new Date).getFullYear() % 100 + (c >= f ? 0 : -100)), _ > -1)
                    for (m = 1, v = _; a = this._getDaysInMonth(f, m - 1), !(a >= v);) m++, v -= a;
                if (r = this._daylightSavingAdjust(new Date(f, m - 1, v)), r.getFullYear() !== f || r.getMonth() + 1 !== m || r.getDate() !== v) throw "Invalid date";
                return r
            },
            ATOM: "yy-mm-dd",
            COOKIE: "D, dd M yy",
            ISO_8601: "yy-mm-dd",
            RFC_822: "D, d M y",
            RFC_850: "DD, dd-M-y",
            RFC_1036: "D, d M y",
            RFC_1123: "D, d M yy",
            RFC_2822: "D, d M yy",
            RSS: "D, d M y",
            TICKS: "!",
            TIMESTAMP: "@",
            W3C: "yy-mm-dd",
            _ticksTo1970: 864e9 * (718685 + Math.floor(492.5) - Math.floor(19.7) + Math.floor(4.925)),
            formatDate: function(e, t, i) {
                if (!t) return "";
                var n, s = (i ? i.dayNamesShort : null) || this._defaults.dayNamesShort,
                    a = (i ? i.dayNames : null) || this._defaults.dayNames,
                    o = (i ? i.monthNamesShort : null) || this._defaults.monthNamesShort,
                    r = (i ? i.monthNames : null) || this._defaults.monthNames,
                    l = function(t) {
                        var i = e.length > n + 1 && e.charAt(n + 1) === t;
                        return i && n++, i
                    },
                    d = function(e, t, i) {
                        var n = "" + t;
                        if (l(e))
                            for (; i > n.length;) n = "0" + n;
                        return n
                    },
                    c = function(e, t, i, n) {
                        return l(e) ? n[t] : i[t]
                    },
                    h = "",
                    p = !1;
                if (t)
                    for (n = 0; e.length > n; n++)
                        if (p) "'" !== e.charAt(n) || l("'") ? h += e.charAt(n) : p = !1;
                        else switch (e.charAt(n)) {
                            case "d":
                                h += d("d", t.getDate(), 2);
                                break;
                            case "D":
                                h += c("D", t.getDay(), s, a);
                                break;
                            case "o":
                                h += d("o", Math.round((new Date(t.getFullYear(), t.getMonth(), t.getDate()).getTime() - new Date(t.getFullYear(), 0, 0).getTime()) / 864e5), 3);
                                break;
                            case "m":
                                h += d("m", t.getMonth() + 1, 2);
                                break;
                            case "M":
                                h += c("M", t.getMonth(), o, r);
                                break;
                            case "y":
                                h += l("y") ? t.getFullYear() : (10 > t.getYear() % 100 ? "0" : "") + t.getYear() % 100;
                                break;
                            case "@":
                                h += t.getTime();
                                break;
                            case "!":
                                h += 1e4 * t.getTime() + this._ticksTo1970;
                                break;
                            case "'":
                                l("'") ? h += "'" : p = !0;
                                break;
                            default:
                                h += e.charAt(n)
                        }
                        return h
            },
            _possibleChars: function(e) {
                var t, i = "",
                    n = !1,
                    s = function(i) {
                        var n = e.length > t + 1 && e.charAt(t + 1) === i;
                        return n && t++, n
                    };
                for (t = 0; e.length > t; t++)
                    if (n) "'" !== e.charAt(t) || s("'") ? i += e.charAt(t) : n = !1;
                    else switch (e.charAt(t)) {
                        case "d":
                        case "m":
                        case "y":
                        case "@":
                            i += "0123456789";
                            break;
                        case "D":
                        case "M":
                            return null;
                        case "'":
                            s("'") ? i += "'" : n = !0;
                            break;
                        default:
                            i += e.charAt(t)
                    }
                    return i
            },
            _get: function(e, t) {
                return void 0 !== e.settings[t] ? e.settings[t] : this._defaults[t]
            },
            _setDateFromField: function(e, t) {
                if (e.input.val() !== e.lastVal) {
                    var i = this._get(e, "dateFormat"),
                        n = e.lastVal = e.input ? e.input.val() : null,
                        s = this._getDefaultDate(e),
                        a = s,
                        o = this._getFormatConfig(e);
                    try {
                        a = this.parseDate(i, n, o) || s
                    } catch (r) {
                        n = t ? "" : n
                    }
                    e.selectedDay = a.getDate(), e.drawMonth = e.selectedMonth = a.getMonth(), e.drawYear = e.selectedYear = a.getFullYear(), e.currentDay = n ? a.getDate() : 0, e.currentMonth = n ? a.getMonth() : 0, e.currentYear = n ? a.getFullYear() : 0, this._adjustInstDate(e)
                }
            },
            _getDefaultDate: function(e) {
                return this._restrictMinMax(e, this._determineDate(e, this._get(e, "defaultDate"), new Date))
            },
            _determineDate: function(t, i, n) {
                var s = function(e) {
                        var t = new Date;
                        return t.setDate(t.getDate() + e), t
                    },
                    a = function(i) {
                        try {
                            return e.datepicker.parseDate(e.datepicker._get(t, "dateFormat"), i, e.datepicker._getFormatConfig(t))
                        } catch (n) {}
                        for (var s = (i.toLowerCase().match(/^c/) ? e.datepicker._getDate(t) : null) || new Date, a = s.getFullYear(), o = s.getMonth(), r = s.getDate(), l = /([+\-]?[0-9]+)\s*(d|D|w|W|m|M|y|Y)?/g, d = l.exec(i); d;) {
                            switch (d[2] || "d") {
                                case "d":
                                case "D":
                                    r += parseInt(d[1], 10);
                                    break;
                                case "w":
                                case "W":
                                    r += 7 * parseInt(d[1], 10);
                                    break;
                                case "m":
                                case "M":
                                    o += parseInt(d[1], 10), r = Math.min(r, e.datepicker._getDaysInMonth(a, o));
                                    break;
                                case "y":
                                case "Y":
                                    a += parseInt(d[1], 10), r = Math.min(r, e.datepicker._getDaysInMonth(a, o))
                            }
                            d = l.exec(i)
                        }
                        return new Date(a, o, r)
                    },
                    o = null == i || "" === i ? n : "string" == typeof i ? a(i) : "number" == typeof i ? isNaN(i) ? n : s(i) : new Date(i.getTime());
                return o = o && "Invalid Date" == "" + o ? n : o, o && (o.setHours(0), o.setMinutes(0), o.setSeconds(0), o.setMilliseconds(0)), this._daylightSavingAdjust(o)
            },
            _daylightSavingAdjust: function(e) {
                return e ? (e.setHours(e.getHours() > 12 ? e.getHours() + 2 : 0), e) : null
            },
            _setDate: function(e, t, i) {
                var n = !t,
                    s = e.selectedMonth,
                    a = e.selectedYear,
                    o = this._restrictMinMax(e, this._determineDate(e, t, new Date));
                e.selectedDay = e.currentDay = o.getDate(), e.drawMonth = e.selectedMonth = e.currentMonth = o.getMonth(), e.drawYear = e.selectedYear = e.currentYear = o.getFullYear(), s === e.selectedMonth && a === e.selectedYear || i || this._notifyChange(e), this._adjustInstDate(e), e.input && e.input.val(n ? "" : this._formatDate(e))
            },
            _getDate: function(e) {
                var t = !e.currentYear || e.input && "" === e.input.val() ? null : this._daylightSavingAdjust(new Date(e.currentYear, e.currentMonth, e.currentDay));
                return t
            },
            _attachHandlers: function(t) {
                var i = this._get(t, "stepMonths"),
                    n = "#" + t.id.replace(/\\\\/g, "\\");
                t.dpDiv.find("[data-handler]").map(function() {
                    var t = {
                        prev: function() {
                            e.datepicker._adjustDate(n, -i, "M")
                        },
                        next: function() {
                            e.datepicker._adjustDate(n, +i, "M")
                        },
                        hide: function() {
                            e.datepicker._hideDatepicker()
                        },
                        today: function() {
                            e.datepicker._gotoToday(n)
                        },
                        selectDay: function() {
                            return e.datepicker._selectDay(n, +this.getAttribute("data-month"), +this.getAttribute("data-year"), this), !1
                        },
                        selectMonth: function() {
                            return e.datepicker._selectMonthYear(n, this, "M"), !1
                        },
                        selectYear: function() {
                            return e.datepicker._selectMonthYear(n, this, "Y"), !1
                        }
                    };
                    e(this).bind(this.getAttribute("data-event"), t[this.getAttribute("data-handler")])
                })
            },
            _generateHTML: function(e) {
                var t, i, n, s, a, o, r, l, d, c, h, p, u, g, f, m, v, _, b, y, w, k, x, D, M, S, C, N, I, T, P, E, A, z, W, O, $, j, F, H = new Date,
                    L = this._daylightSavingAdjust(new Date(H.getFullYear(), H.getMonth(), H.getDate())),
                    Y = this._get(e, "isRTL"),
                    R = this._get(e, "showButtonPanel"),
                    B = this._get(e, "hideIfNoPrevNext"),
                    q = this._get(e, "navigationAsDateFormat"),
                    K = this._getNumberOfMonths(e),
                    U = this._get(e, "showCurrentAtPos"),
                    V = this._get(e, "stepMonths"),
                    Z = 1 !== K[0] || 1 !== K[1],
                    G = this._daylightSavingAdjust(e.currentDay ? new Date(e.currentYear, e.currentMonth, e.currentDay) : new Date(9999, 9, 9)),
                    Q = this._getMinMaxDate(e, "min"),
                    X = this._getMinMaxDate(e, "max"),
                    J = e.drawMonth - U,
                    et = e.drawYear;
                if (0 > J && (J += 12, et--), X)
                    for (t = this._daylightSavingAdjust(new Date(X.getFullYear(), X.getMonth() - K[0] * K[1] + 1, X.getDate())), t = Q && Q > t ? Q : t; this._daylightSavingAdjust(new Date(et, J, 1)) > t;) J--, 0 > J && (J = 11, et--);
                for (e.drawMonth = J, e.drawYear = et, i = this._get(e, "prevText"), i = q ? this.formatDate(i, this._daylightSavingAdjust(new Date(et, J - V, 1)), this._getFormatConfig(e)) : i, n = this._canAdjustMonth(e, -1, et, J) ? "<a class='ui-datepicker-prev ui-corner-all' data-handler='prev' data-event='click' title='" + i + "'><span class='ui-icon ui-icon-circle-triangle-" + (Y ? "e" : "w") + "'>" + i + "</span></a>" : B ? "" : "<a class='ui-datepicker-prev ui-corner-all ui-state-disabled' title='" + i + "'><span class='ui-icon ui-icon-circle-triangle-" + (Y ? "e" : "w") + "'>" + i + "</span></a>", s = this._get(e, "nextText"), s = q ? this.formatDate(s, this._daylightSavingAdjust(new Date(et, J + V, 1)), this._getFormatConfig(e)) : s, a = this._canAdjustMonth(e, 1, et, J) ? "<a class='ui-datepicker-next ui-corner-all' data-handler='next' data-event='click' title='" + s + "'><span class='ui-icon ui-icon-circle-triangle-" + (Y ? "w" : "e") + "'>" + s + "</span></a>" : B ? "" : "<a class='ui-datepicker-next ui-corner-all ui-state-disabled' title='" + s + "'><span class='ui-icon ui-icon-circle-triangle-" + (Y ? "w" : "e") + "'>" + s + "</span></a>", o = this._get(e, "currentText"), r = this._get(e, "gotoCurrent") && e.currentDay ? G : L, o = q ? this.formatDate(o, r, this._getFormatConfig(e)) : o, l = e.inline ? "" : "<button type='button' class='ui-datepicker-close ui-state-default ui-priority-primary ui-corner-all' data-handler='hide' data-event='click'>" + this._get(e, "closeText") + "</button>", d = R ? "<div class='ui-datepicker-buttonpane ui-widget-content'>" + (Y ? l : "") + (this._isInRange(e, r) ? "<button type='button' class='ui-datepicker-current ui-state-default ui-priority-secondary ui-corner-all' data-handler='today' data-event='click'>" + o + "</button>" : "") + (Y ? "" : l) + "</div>" : "", c = parseInt(this._get(e, "firstDay"), 10), c = isNaN(c) ? 0 : c, h = this._get(e, "showWeek"), p = this._get(e, "dayNames"), u = this._get(e, "dayNamesMin"), g = this._get(e, "monthNames"), f = this._get(e, "monthNamesShort"), m = this._get(e, "beforeShowDay"), v = this._get(e, "showOtherMonths"), _ = this._get(e, "selectOtherMonths"), b = this._getDefaultDate(e), y = "", k = 0; K[0] > k; k++) {
                    for (x = "", this.maxRows = 4, D = 0; K[1] > D; D++) {
                        if (M = this._daylightSavingAdjust(new Date(et, J, e.selectedDay)), S = " ui-corner-all", C = "", Z) {
                            if (C += "<div class='ui-datepicker-group", K[1] > 1) switch (D) {
                                case 0:
                                    C += " ui-datepicker-group-first", S = " ui-corner-" + (Y ? "right" : "left");
                                    break;
                                case K[1] - 1:
                                    C += " ui-datepicker-group-last", S = " ui-corner-" + (Y ? "left" : "right");
                                    break;
                                default:
                                    C += " ui-datepicker-group-middle", S = ""
                            }
                            C += "'>"
                        }
                        for (C += "<div class='ui-datepicker-header ui-widget-header ui-helper-clearfix" + S + "'>" + (/all|left/.test(S) && 0 === k ? Y ? a : n : "") + (/all|right/.test(S) && 0 === k ? Y ? n : a : "") + this._generateMonthYearHeader(e, J, et, Q, X, k > 0 || D > 0, g, f) + "</div><table class='ui-datepicker-calendar'><thead><tr>", N = h ? "<th class='ui-datepicker-week-col'>" + this._get(e, "weekHeader") + "</th>" : "", w = 0; 7 > w; w++) I = (w + c) % 7, N += "<th scope='col'" + ((w + c + 6) % 7 >= 5 ? " class='ui-datepicker-week-end'" : "") + "><span title='" + p[I] + "'>" + u[I] + "</span></th>";
                        for (C += N + "</tr></thead><tbody>", T = this._getDaysInMonth(et, J), et === e.selectedYear && J === e.selectedMonth && (e.selectedDay = Math.min(e.selectedDay, T)), P = (this._getFirstDayOfMonth(et, J) - c + 7) % 7, E = Math.ceil((P + T) / 7), A = Z && this.maxRows > E ? this.maxRows : E, this.maxRows = A, z = this._daylightSavingAdjust(new Date(et, J, 1 - P)), W = 0; A > W; W++) {
                            for (C += "<tr>", O = h ? "<td class='ui-datepicker-week-col'>" + this._get(e, "calculateWeek")(z) + "</td>" : "", w = 0; 7 > w; w++) $ = m ? m.apply(e.input ? e.input[0] : null, [z]) : [!0, ""], j = z.getMonth() !== J, F = j && !_ || !$[0] || Q && Q > z || X && z > X, O += "<td class='" + ((w + c + 6) % 7 >= 5 ? " ui-datepicker-week-end" : "") + (j ? " ui-datepicker-other-month" : "") + (z.getTime() === M.getTime() && J === e.selectedMonth && e._keyEvent || b.getTime() === z.getTime() && b.getTime() === M.getTime() ? " " + this._dayOverClass : "") + (F ? " " + this._unselectableClass + " ui-state-disabled" : "") + (j && !v ? "" : " " + $[1] + (z.getTime() === G.getTime() ? " " + this._currentClass : "") + (z.getTime() === L.getTime() ? " ui-datepicker-today" : "")) + "'" + (j && !v || !$[2] ? "" : " title='" + $[2].replace(/'/g, "&#39;") + "'") + (F ? "" : " data-handler='selectDay' data-event='click' data-month='" + z.getMonth() + "' data-year='" + z.getFullYear() + "'") + ">" + (j && !v ? "&#xa0;" : F ? "<span class='ui-state-default'>" + z.getDate() + "</span>" : "<a class='ui-state-default" + (z.getTime() === L.getTime() ? " ui-state-highlight" : "") + (z.getTime() === G.getTime() ? " ui-state-active" : "") + (j ? " ui-priority-secondary" : "") + "' href='#'>" + z.getDate() + "</a>") + "</td>", z.setDate(z.getDate() + 1), z = this._daylightSavingAdjust(z);
                            C += O + "</tr>"
                        }
                        J++, J > 11 && (J = 0, et++), C += "</tbody></table>" + (Z ? "</div>" + (K[0] > 0 && D === K[1] - 1 ? "<div class='ui-datepicker-row-break'></div>" : "") : ""), x += C
                    }
                    y += x
                }
                return y += d, e._keyEvent = !1, y
            },
            _generateMonthYearHeader: function(e, t, i, n, s, a, o, r) {
                var l, d, c, h, p, u, g, f, m = this._get(e, "changeMonth"),
                    v = this._get(e, "changeYear"),
                    _ = this._get(e, "showMonthAfterYear"),
                    b = "<div class='ui-datepicker-title'>",
                    y = "";
                if (a || !m) y += "<span class='ui-datepicker-month'>" + o[t] + "</span>";
                else {
                    for (l = n && n.getFullYear() === i, d = s && s.getFullYear() === i, y += "<select class='ui-datepicker-month' data-handler='selectMonth' data-event='change'>", c = 0; 12 > c; c++)(!l || c >= n.getMonth()) && (!d || s.getMonth() >= c) && (y += "<option value='" + c + "'" + (c === t ? " selected='selected'" : "") + ">" + r[c] + "</option>");
                    y += "</select>"
                }
                if (_ || (b += y + (!a && m && v ? "" : "&#xa0;")), !e.yearshtml)
                    if (e.yearshtml = "", a || !v) b += "<span class='ui-datepicker-year'>" + i + "</span>";
                    else {
                        for (h = this._get(e, "yearRange").split(":"), p = (new Date).getFullYear(), u = function(e) {
                                var t = e.match(/c[+\-].*/) ? i + parseInt(e.substring(1), 10) : e.match(/[+\-].*/) ? p + parseInt(e, 10) : parseInt(e, 10);
                                return isNaN(t) ? p : t
                            }, g = u(h[0]), f = Math.max(g, u(h[1] || "")), g = n ? Math.max(g, n.getFullYear()) : g, f = s ? Math.min(f, s.getFullYear()) : f, e.yearshtml += "<select class='ui-datepicker-year' data-handler='selectYear' data-event='change'>"; f >= g; g++) e.yearshtml += "<option value='" + g + "'" + (g === i ? " selected='selected'" : "") + ">" + g + "</option>";
                        e.yearshtml += "</select>", b += e.yearshtml, e.yearshtml = null
                    }
                return b += this._get(e, "yearSuffix"), _ && (b += (!a && m && v ? "" : "&#xa0;") + y), b += "</div>"
            },
            _adjustInstDate: function(e, t, i) {
                var n = e.drawYear + ("Y" === i ? t : 0),
                    s = e.drawMonth + ("M" === i ? t : 0),
                    a = Math.min(e.selectedDay, this._getDaysInMonth(n, s)) + ("D" === i ? t : 0),
                    o = this._restrictMinMax(e, this._daylightSavingAdjust(new Date(n, s, a)));
                e.selectedDay = o.getDate(), e.drawMonth = e.selectedMonth = o.getMonth(), e.drawYear = e.selectedYear = o.getFullYear(), ("M" === i || "Y" === i) && this._notifyChange(e)
            },
            _restrictMinMax: function(e, t) {
                var i = this._getMinMaxDate(e, "min"),
                    n = this._getMinMaxDate(e, "max"),
                    s = i && i > t ? i : t;
                return n && s > n ? n : s
            },
            _notifyChange: function(e) {
                var t = this._get(e, "onChangeMonthYear");
                t && t.apply(e.input ? e.input[0] : null, [e.selectedYear, e.selectedMonth + 1, e])
            },
            _getNumberOfMonths: function(e) {
                var t = this._get(e, "numberOfMonths");
                return null == t ? [1, 1] : "number" == typeof t ? [1, t] : t
            },
            _getMinMaxDate: function(e, t) {
                return this._determineDate(e, this._get(e, t + "Date"), null)
            },
            _getDaysInMonth: function(e, t) {
                return 32 - this._daylightSavingAdjust(new Date(e, t, 32)).getDate()
            },
            _getFirstDayOfMonth: function(e, t) {
                return new Date(e, t, 1).getDay()
            },
            _canAdjustMonth: function(e, t, i, n) {
                var s = this._getNumberOfMonths(e),
                    a = this._daylightSavingAdjust(new Date(i, n + (0 > t ? t : s[0] * s[1]), 1));
                return 0 > t && a.setDate(this._getDaysInMonth(a.getFullYear(), a.getMonth())), this._isInRange(e, a)
            },
            _isInRange: function(e, t) {
                var i, n, s = this._getMinMaxDate(e, "min"),
                    a = this._getMinMaxDate(e, "max"),
                    o = null,
                    r = null,
                    l = this._get(e, "yearRange");
                return l && (i = l.split(":"), n = (new Date).getFullYear(), o = parseInt(i[0], 10), r = parseInt(i[1], 10), i[0].match(/[+\-].*/) && (o += n), i[1].match(/[+\-].*/) && (r += n)), (!s || t.getTime() >= s.getTime()) && (!a || t.getTime() <= a.getTime()) && (!o || t.getFullYear() >= o) && (!r || r >= t.getFullYear())
            },
            _getFormatConfig: function(e) {
                var t = this._get(e, "shortYearCutoff");
                return t = "string" != typeof t ? t : (new Date).getFullYear() % 100 + parseInt(t, 10), {
                    shortYearCutoff: t,
                    dayNamesShort: this._get(e, "dayNamesShort"),
                    dayNames: this._get(e, "dayNames"),
                    monthNamesShort: this._get(e, "monthNamesShort"),
                    monthNames: this._get(e, "monthNames")
                }
            },
            _formatDate: function(e, t, i, n) {
                t || (e.currentDay = e.selectedDay, e.currentMonth = e.selectedMonth, e.currentYear = e.selectedYear);
                var s = t ? "object" == typeof t ? t : this._daylightSavingAdjust(new Date(n, i, t)) : this._daylightSavingAdjust(new Date(e.currentYear, e.currentMonth, e.currentDay));
                return this.formatDate(this._get(e, "dateFormat"), s, this._getFormatConfig(e))
            }
        }), e.fn.datepicker = function(t) {
            if (!this.length) return this;
            e.datepicker.initialized || (e(document).mousedown(e.datepicker._checkExternalClick), e.datepicker.initialized = !0), 0 === e("#" + e.datepicker._mainDivId).length && e("body").append(e.datepicker.dpDiv);
            var i = Array.prototype.slice.call(arguments, 1);
            return "string" != typeof t || "isDisabled" !== t && "getDate" !== t && "widget" !== t ? "option" === t && 2 === arguments.length && "string" == typeof arguments[1] ? e.datepicker["_" + t + "Datepicker"].apply(e.datepicker, [this[0]].concat(i)) : this.each(function() {
                "string" == typeof t ? e.datepicker["_" + t + "Datepicker"].apply(e.datepicker, [this].concat(i)) : e.datepicker._attachDatepicker(this, t)
            }) : e.datepicker["_" + t + "Datepicker"].apply(e.datepicker, [this[0]].concat(i))
        }, e.datepicker = new s, e.datepicker.initialized = !1, e.datepicker.uuid = (new Date).getTime(), e.datepicker.version = "1.11.2", e.datepicker, e.widget("ui.slider", e.ui.mouse, {
            version: "1.11.2",
            widgetEventPrefix: "slide",
            options: {
                animate: !1,
                distance: 0,
                max: 100,
                min: 0,
                orientation: "horizontal",
                range: !1,
                step: 1,
                value: 0,
                values: null,
                change: null,
                slide: null,
                start: null,
                stop: null
            },
            numPages: 5,
            _create: function() {
                this._keySliding = !1, this._mouseSliding = !1, this._animateOff = !0, this._handleIndex = null, this._detectOrientation(), this._mouseInit(), this._calculateNewMax(), this.element.addClass("ui-slider ui-slider-" + this.orientation + " ui-widget ui-widget-content ui-corner-all"), this._refresh(), this._setOption("disabled", this.options.disabled), this._animateOff = !1
            },
            _refresh: function() {
                this._createRange(), this._createHandles(), this._setupEvents(), this._refreshValue()
            },
            _createHandles: function() {
                var t, i, n = this.options,
                    s = this.element.find(".ui-slider-handle").addClass("ui-state-default ui-corner-all"),
                    a = "<span class='ui-slider-handle ui-state-default ui-corner-all' tabindex='0'></span>",
                    o = [];
                for (i = n.values && n.values.length || 1, s.length > i && (s.slice(i).remove(), s = s.slice(0, i)), t = s.length; i > t; t++) o.push(a);
                this.handles = s.add(e(o.join("")).appendTo(this.element)), this.handle = this.handles.eq(0), this.handles.each(function(t) {
                    e(this).data("ui-slider-handle-index", t)
                })
            },
            _createRange: function() {
                var t = this.options,
                    i = "";
                t.range ? (t.range === !0 && (t.values ? t.values.length && 2 !== t.values.length ? t.values = [t.values[0], t.values[0]] : e.isArray(t.values) && (t.values = t.values.slice(0)) : t.values = [this._valueMin(), this._valueMin()]), this.range && this.range.length ? this.range.removeClass("ui-slider-range-min ui-slider-range-max").css({
                    left: "",
                    bottom: ""
                }) : (this.range = e("<div></div>").appendTo(this.element), i = "ui-slider-range ui-widget-header ui-corner-all"), this.range.addClass(i + ("min" === t.range || "max" === t.range ? " ui-slider-range-" + t.range : ""))) : (this.range && this.range.remove(), this.range = null)
            },
            _setupEvents: function() {
                this._off(this.handles), this._on(this.handles, this._handleEvents), this._hoverable(this.handles), this._focusable(this.handles)
            },
            _destroy: function() {
                this.handles.remove(), this.range && this.range.remove(), this.element.removeClass("ui-slider ui-slider-horizontal ui-slider-vertical ui-widget ui-widget-content ui-corner-all"), this._mouseDestroy()
            },
            _mouseCapture: function(t) {
                var i, n, s, a, o, r, l, d, c = this,
                    h = this.options;
                return h.disabled ? !1 : (this.elementSize = {
                    width: this.element.outerWidth(),
                    height: this.element.outerHeight()
                }, this.elementOffset = this.element.offset(), i = {
                    x: t.pageX,
                    y: t.pageY
                }, n = this._normValueFromMouse(i), s = this._valueMax() - this._valueMin() + 1, this.handles.each(function(t) {
                    var i = Math.abs(n - c.values(t));
                    (s > i || s === i && (t === c._lastChangedValue || c.values(t) === h.min)) && (s = i, a = e(this), o = t)
                }), r = this._start(t, o), r === !1 ? !1 : (this._mouseSliding = !0, this._handleIndex = o, a.addClass("ui-state-active").focus(), l = a.offset(), d = !e(t.target).parents().addBack().is(".ui-slider-handle"), this._clickOffset = d ? {
                    left: 0,
                    top: 0
                } : {
                    left: t.pageX - l.left - a.width() / 2,
                    top: t.pageY - l.top - a.height() / 2 - (parseInt(a.css("borderTopWidth"), 10) || 0) - (parseInt(a.css("borderBottomWidth"), 10) || 0) + (parseInt(a.css("marginTop"), 10) || 0)
                }, this.handles.hasClass("ui-state-hover") || this._slide(t, o, n), this._animateOff = !0, !0))
            },
            _mouseStart: function() {
                return !0
            },
            _mouseDrag: function(e) {
                var t = {
                        x: e.pageX,
                        y: e.pageY
                    },
                    i = this._normValueFromMouse(t);
                return this._slide(e, this._handleIndex, i), !1
            },
            _mouseStop: function(e) {
                return this.handles.removeClass("ui-state-active"), this._mouseSliding = !1, this._stop(e, this._handleIndex), this._change(e, this._handleIndex), this._handleIndex = null, this._clickOffset = null, this._animateOff = !1, !1
            },
            _detectOrientation: function() {
                this.orientation = "vertical" === this.options.orientation ? "vertical" : "horizontal"
            },
            _normValueFromMouse: function(e) {
                var t, i, n, s, a;
                return "horizontal" === this.orientation ? (t = this.elementSize.width, i = e.x - this.elementOffset.left - (this._clickOffset ? this._clickOffset.left : 0)) : (t = this.elementSize.height, i = e.y - this.elementOffset.top - (this._clickOffset ? this._clickOffset.top : 0)), n = i / t, n > 1 && (n = 1), 0 > n && (n = 0), "vertical" === this.orientation && (n = 1 - n), s = this._valueMax() - this._valueMin(), a = this._valueMin() + n * s, this._trimAlignValue(a)
            },
            _start: function(e, t) {
                var i = {
                    handle: this.handles[t],
                    value: this.value()
                };
                return this.options.values && this.options.values.length && (i.value = this.values(t), i.values = this.values()), this._trigger("start", e, i)
            },
            _slide: function(e, t, i) {
                var n, s, a;
                this.options.values && this.options.values.length ? (n = this.values(t ? 0 : 1), 2 === this.options.values.length && this.options.range === !0 && (0 === t && i > n || 1 === t && n > i) && (i = n), i !== this.values(t) && (s = this.values(), s[t] = i, a = this._trigger("slide", e, {
                    handle: this.handles[t],
                    value: i,
                    values: s
                }), n = this.values(t ? 0 : 1), a !== !1 && this.values(t, i))) : i !== this.value() && (a = this._trigger("slide", e, {
                    handle: this.handles[t],
                    value: i
                }), a !== !1 && this.value(i))
            },
            _stop: function(e, t) {
                var i = {
                    handle: this.handles[t],
                    value: this.value()
                };
                this.options.values && this.options.values.length && (i.value = this.values(t), i.values = this.values()), this._trigger("stop", e, i)
            },
            _change: function(e, t) {
                if (!this._keySliding && !this._mouseSliding) {
                    var i = {
                        handle: this.handles[t],
                        value: this.value()
                    };
                    this.options.values && this.options.values.length && (i.value = this.values(t), i.values = this.values()), this._lastChangedValue = t, this._trigger("change", e, i)
                }
            },
            value: function(e) {
                return arguments.length ? (this.options.value = this._trimAlignValue(e), this._refreshValue(), void this._change(null, 0)) : this._value()
            },
            values: function(t, i) {
                var n, s, a;
                if (arguments.length > 1) return this.options.values[t] = this._trimAlignValue(i), this._refreshValue(), void this._change(null, t);
                if (!arguments.length) return this._values();
                if (!e.isArray(arguments[0])) return this.options.values && this.options.values.length ? this._values(t) : this.value();
                for (n = this.options.values, s = arguments[0], a = 0; n.length > a; a += 1) n[a] = this._trimAlignValue(s[a]), this._change(null, a);
                this._refreshValue()
            },
            _setOption: function(t, i) {
                var n, s = 0;
                switch ("range" === t && this.options.range === !0 && ("min" === i ? (this.options.value = this._values(0), this.options.values = null) : "max" === i && (this.options.value = this._values(this.options.values.length - 1), this.options.values = null)), e.isArray(this.options.values) && (s = this.options.values.length), "disabled" === t && this.element.toggleClass("ui-state-disabled", !!i), this._super(t, i), t) {
                    case "orientation":
                        this._detectOrientation(), this.element.removeClass("ui-slider-horizontal ui-slider-vertical").addClass("ui-slider-" + this.orientation), this._refreshValue(), this.handles.css("horizontal" === i ? "bottom" : "left", "");
                        break;
                    case "value":
                        this._animateOff = !0, this._refreshValue(), this._change(null, 0), this._animateOff = !1;
                        break;
                    case "values":
                        for (this._animateOff = !0, this._refreshValue(), n = 0; s > n; n += 1) this._change(null, n);
                        this._animateOff = !1;
                        break;
                    case "step":
                    case "min":
                    case "max":
                        this._animateOff = !0, this._calculateNewMax(), this._refreshValue(), this._animateOff = !1;
                        break;
                    case "range":
                        this._animateOff = !0, this._refresh(), this._animateOff = !1
                }
            },
            _value: function() {
                var e = this.options.value;
                return e = this._trimAlignValue(e)
            },
            _values: function(e) {
                var t, i, n;
                if (arguments.length) return t = this.options.values[e], t = this._trimAlignValue(t);
                if (this.options.values && this.options.values.length) {
                    for (i = this.options.values.slice(), n = 0; i.length > n; n += 1) i[n] = this._trimAlignValue(i[n]);
                    return i
                }
                return []
            },
            _trimAlignValue: function(e) {
                if (this._valueMin() >= e) return this._valueMin();
                if (e >= this._valueMax()) return this._valueMax();
                var t = this.options.step > 0 ? this.options.step : 1,
                    i = (e - this._valueMin()) % t,
                    n = e - i;
                return 2 * Math.abs(i) >= t && (n += i > 0 ? t : -t), parseFloat(n.toFixed(5))
            },
            _calculateNewMax: function() {
                var e = (this.options.max - this._valueMin()) % this.options.step;
                this.max = this.options.max - e
            },
            _valueMin: function() {
                return this.options.min
            },
            _valueMax: function() {
                return this.max
            },
            _refreshValue: function() {
                var t, i, n, s, a, o = this.options.range,
                    r = this.options,
                    l = this,
                    d = this._animateOff ? !1 : r.animate,
                    c = {};
                this.options.values && this.options.values.length ? this.handles.each(function(n) {
                    i = 100 * ((l.values(n) - l._valueMin()) / (l._valueMax() - l._valueMin())), c["horizontal" === l.orientation ? "left" : "bottom"] = i + "%", e(this).stop(1, 1)[d ? "animate" : "css"](c, r.animate), l.options.range === !0 && ("horizontal" === l.orientation ? (0 === n && l.range.stop(1, 1)[d ? "animate" : "css"]({
                        left: i + "%"
                    }, r.animate), 1 === n && l.range[d ? "animate" : "css"]({
                        width: i - t + "%"
                    }, {
                        queue: !1,
                        duration: r.animate
                    })) : (0 === n && l.range.stop(1, 1)[d ? "animate" : "css"]({
                        bottom: i + "%"
                    }, r.animate), 1 === n && l.range[d ? "animate" : "css"]({
                        height: i - t + "%"
                    }, {
                        queue: !1,
                        duration: r.animate
                    }))), t = i
                }) : (n = this.value(), s = this._valueMin(), a = this._valueMax(), i = a !== s ? 100 * ((n - s) / (a - s)) : 0, c["horizontal" === this.orientation ? "left" : "bottom"] = i + "%", this.handle.stop(1, 1)[d ? "animate" : "css"](c, r.animate), "min" === o && "horizontal" === this.orientation && this.range.stop(1, 1)[d ? "animate" : "css"]({
                    width: i + "%"
                }, r.animate), "max" === o && "horizontal" === this.orientation && this.range[d ? "animate" : "css"]({
                    width: 100 - i + "%"
                }, {
                    queue: !1,
                    duration: r.animate
                }), "min" === o && "vertical" === this.orientation && this.range.stop(1, 1)[d ? "animate" : "css"]({
                    height: i + "%"
                }, r.animate), "max" === o && "vertical" === this.orientation && this.range[d ? "animate" : "css"]({
                    height: 100 - i + "%"
                }, {
                    queue: !1,
                    duration: r.animate
                }))
            },
            _handleEvents: {
                keydown: function(t) {
                    var i, n, s, a, o = e(t.target).data("ui-slider-handle-index");
                    switch (t.keyCode) {
                        case e.ui.keyCode.HOME:
                        case e.ui.keyCode.END:
                        case e.ui.keyCode.PAGE_UP:
                        case e.ui.keyCode.PAGE_DOWN:
                        case e.ui.keyCode.UP:
                        case e.ui.keyCode.RIGHT:
                        case e.ui.keyCode.DOWN:
                        case e.ui.keyCode.LEFT:
                            if (t.preventDefault(), !this._keySliding && (this._keySliding = !0, e(t.target).addClass("ui-state-active"), i = this._start(t, o), i === !1)) return
                    }
                    switch (a = this.options.step, n = s = this.options.values && this.options.values.length ? this.values(o) : this.value(), t.keyCode) {
                        case e.ui.keyCode.HOME:
                            s = this._valueMin();
                            break;
                        case e.ui.keyCode.END:
                            s = this._valueMax();
                            break;
                        case e.ui.keyCode.PAGE_UP:
                            s = this._trimAlignValue(n + (this._valueMax() - this._valueMin()) / this.numPages);
                            break;
                        case e.ui.keyCode.PAGE_DOWN:
                            s = this._trimAlignValue(n - (this._valueMax() - this._valueMin()) / this.numPages);
                            break;
                        case e.ui.keyCode.UP:
                        case e.ui.keyCode.RIGHT:
                            if (n === this._valueMax()) return;
                            s = this._trimAlignValue(n + a);
                            break;
                        case e.ui.keyCode.DOWN:
                        case e.ui.keyCode.LEFT:
                            if (n === this._valueMin()) return;
                            s = this._trimAlignValue(n - a)
                    }
                    this._slide(t, o, s)
                },
                keyup: function(t) {
                    var i = e(t.target).data("ui-slider-handle-index");
                    this._keySliding && (this._keySliding = !1, this._stop(t, i), this._change(t, i), e(t.target).removeClass("ui-state-active"))
                }
            }
        })
    }), callJUI(), ! function(e) {
        "undefined" != typeof exports ? e(exports) : (window.hljs = e({}), "function" == typeof define && define.amd && define([], function() {
            return window.hljs
        }))
    }(function(e) {
        function t(e) {
            return e.replace(/&/gm, "&amp;").replace(/</gm, "&lt;").replace(/>/gm, "&gt;")
        }

        function i(e) {
            return e.nodeName.toLowerCase()
        }

        function n(e, t) {
            var i = e && e.exec(t);
            return i && 0 == i.index
        }

        function s(e) {
            var t = (e.className + " " + (e.parentNode ? e.parentNode.className : "")).split(/\s+/);
            return t = t.map(function(e) {
                return e.replace(/^lang(uage)?-/, "")
            }), t.filter(function(e) {
                return b(e) || /no(-?)highlight/.test(e)
            })[0]
        }

        function a(e, t) {
            var i = {};
            for (var n in e) i[n] = e[n];
            if (t)
                for (var n in t) i[n] = t[n];
            return i
        }

        function o(e) {
            var t = [];
            return function n(e, s) {
                for (var a = e.firstChild; a; a = a.nextSibling) 3 == a.nodeType ? s += a.nodeValue.length : 1 == a.nodeType && (t.push({
                    event: "start",
                    offset: s,
                    node: a
                }), s = n(a, s), i(a).match(/br|hr|img|input/) || t.push({
                    event: "stop",
                    offset: s,
                    node: a
                }));
                return s
            }(e, 0), t
        }

        function r(e, n, s) {
            function a() {
                return e.length && n.length ? e[0].offset != n[0].offset ? e[0].offset < n[0].offset ? e : n : "start" == n[0].event ? e : n : e.length ? e : n
            }

            function o(e) {
                function n(e) {
                    return " " + e.nodeName + '="' + t(e.value) + '"'
                }
                c += "<" + i(e) + Array.prototype.map.call(e.attributes, n).join("") + ">"
            }

            function r(e) {
                c += "</" + i(e) + ">"
            }

            function l(e) {
                ("start" == e.event ? o : r)(e.node)
            }
            for (var d = 0, c = "", h = []; e.length || n.length;) {
                var p = a();
                if (c += t(s.substr(d, p[0].offset - d)), d = p[0].offset, p == e) {
                    h.reverse().forEach(r);
                    do l(p.splice(0, 1)[0]), p = a(); while (p == e && p.length && p[0].offset == d);
                    h.reverse().forEach(o)
                } else "start" == p[0].event ? h.push(p[0].node) : h.pop(), l(p.splice(0, 1)[0])
            }
            return c + t(s.substr(d))
        }

        function l(e) {
            function t(e) {
                return e && e.source || e
            }

            function i(i, n) {
                return RegExp(t(i), "m" + (e.cI ? "i" : "") + (n ? "g" : ""))
            }

            function n(s, o) {
                if (!s.compiled) {
                    if (s.compiled = !0, s.k = s.k || s.bK, s.k) {
                        var r = {},
                            l = function(t, i) {
                                e.cI && (i = i.toLowerCase()), i.split(" ").forEach(function(e) {
                                    var i = e.split("|");
                                    r[i[0]] = [t, i[1] ? Number(i[1]) : 1]
                                })
                            };
                        "string" == typeof s.k ? l("keyword", s.k) : Object.keys(s.k).forEach(function(e) {
                            l(e, s.k[e])
                        }), s.k = r
                    }
                    s.lR = i(s.l || /\b[A-Za-z0-9_]+\b/, !0), o && (s.bK && (s.b = "\\b(" + s.bK.split(" ").join("|") + ")\\b"), s.b || (s.b = /\B|\b/), s.bR = i(s.b), s.e || s.eW || (s.e = /\B|\b/), s.e && (s.eR = i(s.e)), s.tE = t(s.e) || "", s.eW && o.tE && (s.tE += (s.e ? "|" : "") + o.tE)), s.i && (s.iR = i(s.i)), void 0 === s.r && (s.r = 1), s.c || (s.c = []);
                    var d = [];
                    s.c.forEach(function(e) {
                        e.v ? e.v.forEach(function(t) {
                            d.push(a(e, t))
                        }) : d.push("self" == e ? s : e)
                    }), s.c = d, s.c.forEach(function(e) {
                        n(e, s)
                    }), s.starts && n(s.starts, o);
                    var c = s.c.map(function(e) {
                        return e.bK ? "\\.?(" + e.b + ")\\.?" : e.b
                    }).concat([s.tE, s.i]).map(t).filter(Boolean);
                    s.t = c.length ? i(c.join("|"), !0) : {
                        exec: function() {
                            return null
                        }
                    }
                }
            }
            n(e)
        }

        function d(e, i, s, a) {
            function o(e, t) {
                for (var i = 0; i < t.c.length; i++)
                    if (n(t.c[i].bR, e)) return t.c[i]
            }

            function r(e, t) {
                return n(e.eR, t) ? e : e.eW ? r(e.parent, t) : void 0
            }

            function h(e, t) {
                return !s && n(t.iR, e)
            }

            function p(e, t) {
                var i = k.cI ? t[0].toLowerCase() : t[0];
                return e.k.hasOwnProperty(i) && e.k[i]
            }

            function u(e, t, i, n) {
                var s = n ? "" : y.classPrefix,
                    a = '<span class="' + s,
                    o = i ? "" : "</span>";
                return a += e + '">', a + t + o
            }

            function g() {
                if (!x.k) return t(C);
                var e = "",
                    i = 0;
                x.lR.lastIndex = 0;
                for (var n = x.lR.exec(C); n;) {
                    e += t(C.substr(i, n.index - i));
                    var s = p(x, n);
                    s ? (N += s[1], e += u(s[0], t(n[0]))) : e += t(n[0]), i = x.lR.lastIndex, n = x.lR.exec(C)
                }
                return e + t(C.substr(i))
            }

            function f() {
                if (x.sL && !w[x.sL]) return t(C);
                var e = x.sL ? d(x.sL, C, !0, D[x.sL]) : c(C);
                return x.r > 0 && (N += e.r), "continuous" == x.subLanguageMode && (D[x.sL] = e.top), u(e.language, e.value, !1, !0)
            }

            function m() {
                return void 0 !== x.sL ? f() : g()
            }

            function v(e, i) {
                var n = e.cN ? u(e.cN, "", !0) : "";
                e.rB ? (M += n, C = "") : e.eB ? (M += t(i) + n, C = "") : (M += n, C = i), x = Object.create(e, {
                    parent: {
                        value: x
                    }
                })
            }

            function _(e, i) {
                if (C += e, void 0 === i) return M += m(), 0;
                var n = o(i, x);
                if (n) return M += m(), v(n, i), n.rB ? 0 : i.length;
                var s = r(x, i);
                if (s) {
                    var a = x;
                    a.rE || a.eE || (C += i), M += m();
                    do x.cN && (M += "</span>"), N += x.r, x = x.parent; while (x != s.parent);
                    return a.eE && (M += t(i)), C = "", s.starts && v(s.starts, ""), a.rE ? 0 : i.length
                }
                if (h(i, x)) throw new Error('Illegal lexeme "' + i + '" for mode "' + (x.cN || "<unnamed>") + '"');
                return C += i, i.length || 1
            }
            var k = b(e);
            if (!k) throw new Error('Unknown language: "' + e + '"');
            l(k);
            for (var x = a || k, D = {}, M = "", S = x; S != k; S = S.parent) S.cN && (M = u(S.cN, "", !0) + M);
            var C = "",
                N = 0;
            try {
                for (var I, T, P = 0; x.t.lastIndex = P, I = x.t.exec(i), I;) T = _(i.substr(P, I.index - P), I[0]), P = I.index + T;
                _(i.substr(P));
                for (var S = x; S.parent; S = S.parent) S.cN && (M += "</span>");
                return {
                    r: N,
                    value: M,
                    language: e,
                    top: x
                }
            } catch (E) {
                if (-1 != E.message.indexOf("Illegal")) return {
                    r: 0,
                    value: t(i)
                };
                throw E
            }
        }

        function c(e, i) {
            i = i || y.languages || Object.keys(w);
            var n = {
                    r: 0,
                    value: t(e)
                },
                s = n;
            return i.forEach(function(t) {
                if (b(t)) {
                    var i = d(t, e, !1);
                    i.language = t, i.r > s.r && (s = i), i.r > n.r && (s = n, n = i)
                }
            }), s.language && (n.second_best = s), n
        }

        function h(e) {
            return y.tabReplace && (e = e.replace(/^((<[^>]+>|\t)+)/gm, function(e, t) {
                return t.replace(/\t/g, y.tabReplace)
            })), y.useBR && (e = e.replace(/\n/g, "<br>")), e
        }

        function p(e, t, i) {
            var n = t ? k[t] : i,
                s = [e.trim()];
            return e.match(/(\s|^)hljs(\s|$)/) || s.push("hljs"), n && s.push(n), s.join(" ").trim()
        }

        function u(e) {
            var t = s(e);
            if (!/no(-?)highlight/.test(t)) {
                var i;
                y.useBR ? (i = document.createElementNS("http://www.w3.org/1999/xhtml", "div"), i.innerHTML = e.innerHTML.replace(/\n/g, "").replace(/<br[ \/]*>/g, "\n")) : i = e;
                var n = i.textContent,
                    a = t ? d(t, n, !0) : c(n),
                    l = o(i);
                if (l.length) {
                    var u = document.createElementNS("http://www.w3.org/1999/xhtml", "div");
                    u.innerHTML = a.value, a.value = r(l, o(u), n)
                }
                a.value = h(a.value), e.innerHTML = a.value, e.className = p(e.className, t, a.language), e.result = {
                    language: a.language,
                    re: a.r
                }, a.second_best && (e.second_best = {
                    language: a.second_best.language,
                    re: a.second_best.r
                })
            }
        }

        function g(e) {
            y = a(y, e)
        }

        function f() {
            if (!f.called) {
                f.called = !0;
                var e = document.querySelectorAll("pre code");
                Array.prototype.forEach.call(e, u)
            }
        }

        function m() {
            addEventListener("DOMContentLoaded", f, !1), addEventListener("load", f, !1)
        }

        function v(t, i) {
            var n = w[t] = i(e);
            n.aliases && n.aliases.forEach(function(e) {
                k[e] = t
            })
        }

        function _() {
            return Object.keys(w)
        }

        function b(e) {
            return w[e] || w[k[e]]
        }
        var y = {
                classPrefix: "hljs-",
                tabReplace: null,
                useBR: !1,
                languages: void 0
            },
            w = {},
            k = {};
        return e.highlight = d, e.highlightAuto = c, e.fixMarkup = h, e.highlightBlock = u, e.configure = g, e.initHighlighting = f, e.initHighlightingOnLoad = m, e.registerLanguage = v, e.listLanguages = _, e.getLanguage = b, e.inherit = a, e.IR = "[a-zA-Z][a-zA-Z0-9_]*", e.UIR = "[a-zA-Z_][a-zA-Z0-9_]*", e.NR = "\\b\\d+(\\.\\d+)?", e.CNR = "(\\b0[xX][a-fA-F0-9]+|(\\b\\d+(\\.\\d*)?|\\.\\d+)([eE][-+]?\\d+)?)", e.BNR = "\\b(0b[01]+)", e.RSR = "!|!=|!==|%|%=|&|&&|&=|\\*|\\*=|\\+|\\+=|,|-|-=|/=|/|:|;|<<|<<=|<=|<|===|==|=|>>>=|>>=|>=|>>>|>>|>|\\?|\\[|\\{|\\(|\\^|\\^=|\\||\\|=|\\|\\||~", e.BE = {
            b: "\\\\[\\s\\S]",
            r: 0
        }, e.ASM = {
            cN: "string",
            b: "'",
            e: "'",
            i: "\\n",
            c: [e.BE]
        }, e.QSM = {
            cN: "string",
            b: '"',
            e: '"',
            i: "\\n",
            c: [e.BE]
        }, e.PWM = {
            b: /\b(a|an|the|are|I|I'm|isn't|don't|doesn't|won't|but|just|should|pretty|simply|enough|gonna|going|wtf|so|such)\b/
        }, e.CLCM = {
            cN: "comment",
            b: "//",
            e: "$",
            c: [e.PWM]
        }, e.CBCM = {
            cN: "comment",
            b: "/\\*",
            e: "\\*/",
            c: [e.PWM]
        }, e.HCM = {
            cN: "comment",
            b: "#",
            e: "$",
            c: [e.PWM]
        }, e.NM = {
            cN: "number",
            b: e.NR,
            r: 0
        }, e.CNM = {
            cN: "number",
            b: e.CNR,
            r: 0
        }, e.BNM = {
            cN: "number",
            b: e.BNR,
            r: 0
        }, e.CSSNM = {
            cN: "number",
            b: e.NR + "(%|em|ex|ch|rem|vw|vh|vmin|vmax|cm|mm|in|pt|pc|px|deg|grad|rad|turn|s|ms|Hz|kHz|dpi|dpcm|dppx)?",
            r: 0
        }, e.RM = {
            cN: "regexp",
            b: /\//,
            e: /\/[gimuy]*/,
            i: /\n/,
            c: [e.BE, {
                b: /\[/,
                e: /\]/,
                r: 0,
                c: [e.BE]
            }]
        }, e.TM = {
            cN: "title",
            b: e.IR,
            r: 0
        }, e.UTM = {
            cN: "title",
            b: e.UIR,
            r: 0
        }, e
    }), hljs.registerLanguage("xml", function() {
        var e = "[A-Za-z0-9\\._:-]+",
            t = {
                b: /<\?(php)?(?!\w)/,
                e: /\?>/,
                sL: "php",
                subLanguageMode: "continuous"
            },
            i = {
                eW: !0,
                i: /</,
                r: 0,
                c: [t, {
                    cN: "attribute",
                    b: e,
                    r: 0
                }, {
                    b: "=",
                    r: 0,
                    c: [{
                        cN: "value",
                        c: [t],
                        v: [{
                            b: /"/,
                            e: /"/
                        }, {
                            b: /'/,
                            e: /'/
                        }, {
                            b: /[^\s\/>]+/
                        }]
                    }]
                }]
            };
        return {
            aliases: ["html", "xhtml", "rss", "atom", "xsl", "plist"],
            cI: !0,
            c: [{
                cN: "doctype",
                b: "<!DOCTYPE",
                e: ">",
                r: 10,
                c: [{
                    b: "\\[",
                    e: "\\]"
                }]
            }, {
                cN: "comment",
                b: "<!--",
                e: "-->",
                r: 10
            }, {
                cN: "cdata",
                b: "<\\!\\[CDATA\\[",
                e: "\\]\\]>",
                r: 10
            }, {
                cN: "tag",
                b: "<style(?=\\s|>|$)",
                e: ">",
                k: {
                    title: "style"
                },
                c: [i],
                starts: {
                    e: "</style>",
                    rE: !0,
                    sL: "css"
                }
            }, {
                cN: "tag",
                b: "<script(?=\\s|>|$)",
                e: ">",
                k: {
                    title: "script"
                },
                c: [i],
                starts: {
                    e: "</script>",
                    rE: !0,
                    sL: "javascript"
                }
            }, t, {
                cN: "pi",
                b: /<\?\w+/,
                e: /\?>/,
                r: 10
            }, {
                cN: "tag",
                b: "</?",
                e: "/?>",
                c: [{
                    cN: "title",
                    b: /[^ \/><\n\t]+/,
                    r: 0
                }, i]
            }]
        }
    }), hljs.registerLanguage("javascript", function(e) {
        return {
            aliases: ["js"],
            k: {
                keyword: "in if for while finally var new function do return void else break catch instanceof with throw case default try this switch continue typeof delete let yield const class",
                literal: "true false null undefined NaN Infinity",
                built_in: "eval isFinite isNaN parseFloat parseInt decodeURI decodeURIComponent encodeURI encodeURIComponent escape unescape Object Function Boolean Error EvalError InternalError RangeError ReferenceError StopIteration SyntaxError TypeError URIError Number Math Date String RegExp Array Float32Array Float64Array Int16Array Int32Array Int8Array Uint16Array Uint32Array Uint8Array Uint8ClampedArray ArrayBuffer DataView JSON Intl arguments require module console window document"
            },
            c: [{
                cN: "pi",
                r: 10,
                v: [{
                    b: /^\s*('|")use strict('|")/
                }, {
                    b: /^\s*('|")use asm('|")/
                }]
            }, e.ASM, e.QSM, e.CLCM, e.CBCM, e.CNM, {
                b: "(" + e.RSR + "|\\b(case|return|throw)\\b)\\s*",
                k: "return throw case",
                c: [e.CLCM, e.CBCM, e.RM, {
                    b: /</,
                    e: />;/,
                    r: 0,
                    sL: "xml"
                }],
                r: 0
            }, {
                cN: "function",
                bK: "function",
                e: /\{/,
                eE: !0,
                c: [e.inherit(e.TM, {
                    b: /[A-Za-z$_][0-9A-Za-z$_]*/
                }), {
                    cN: "params",
                    b: /\(/,
                    e: /\)/,
                    c: [e.CLCM, e.CBCM],
                    i: /["'\(]/
                }],
                i: /\[|%/
            }, {
                b: /\$[(.]/
            }, {
                b: "\\." + e.IR,
                r: 0
            }]
        }
    }), hljs.registerLanguage("scss", function(e) {
        var t = "[a-zA-Z-][a-zA-Z0-9_-]*",
            i = {
                cN: "variable",
                b: "(\\$" + t + ")\\b"
            },
            n = {
                cN: "function",
                b: t + "\\(",
                rB: !0,
                eE: !0,
                e: "\\("
            },
            s = {
                cN: "hexcolor",
                b: "#[0-9A-Fa-f]+"
            };
        return {
            cN: "attribute",
            b: "[A-Z\\_\\.\\-]+",
            e: ":",
            eE: !0,
            i: "[^\\s]",
            starts: {
                cN: "value",
                eW: !0,
                eE: !0,
                c: [n, s, e.CSSNM, e.QSM, e.ASM, e.CBCM, {
                    cN: "important",
                    b: "!important"
                }]
            }
        }, {
            cI: !0,
            i: "[=/|']",
            c: [e.CLCM, e.CBCM, n, {
                cN: "id",
                b: "\\#[A-Za-z0-9_-]+",
                r: 0
            }, {
                cN: "class",
                b: "\\.[A-Za-z0-9_-]+",
                r: 0
            }, {
                cN: "attr_selector",
                b: "\\[",
                e: "\\]",
                i: "$"
            }, {
                cN: "tag",
                b: "\\b(a|abbr|acronym|address|area|article|aside|audio|b|base|big|blockquote|body|br|button|canvas|caption|cite|code|col|colgroup|command|datalist|dd|del|details|dfn|div|dl|dt|em|embed|fieldset|figcaption|figure|footer|form|frame|frameset|(h[1-6])|head|header|hgroup|hr|html|i|iframe|img|input|ins|kbd|keygen|label|legend|li|link|map|mark|meta|meter|nav|noframes|noscript|object|ol|optgroup|option|output|p|param|pre|progress|q|rp|rt|ruby|samp|script|section|select|small|span|strike|strong|style|sub|sup|table|tbody|td|textarea|tfoot|th|thead|time|title|tr|tt|ul|var|video)\\b",
                r: 0
            }, {
                cN: "pseudo",
                b: ":(visited|valid|root|right|required|read-write|read-only|out-range|optional|only-of-type|only-child|nth-of-type|nth-last-of-type|nth-last-child|nth-child|not|link|left|last-of-type|last-child|lang|invalid|indeterminate|in-range|hover|focus|first-of-type|first-line|first-letter|first-child|first|enabled|empty|disabled|default|checked|before|after|active)"
            }, {
                cN: "pseudo",
                b: "::(after|before|choices|first-letter|first-line|repeat-index|repeat-item|selection|value)"
            }, i, {
                cN: "attribute",
                b: "\\b(z-index|word-wrap|word-spacing|word-break|width|widows|white-space|visibility|vertical-align|unicode-bidi|transition-timing-function|transition-property|transition-duration|transition-delay|transition|transform-style|transform-origin|transform|top|text-underline-position|text-transform|text-shadow|text-rendering|text-overflow|text-indent|text-decoration-style|text-decoration-line|text-decoration-color|text-decoration|text-align-last|text-align|tab-size|table-layout|right|resize|quotes|position|pointer-events|perspective-origin|perspective|page-break-inside|page-break-before|page-break-after|padding-top|padding-right|padding-left|padding-bottom|padding|overflow-y|overflow-x|overflow-wrap|overflow|outline-width|outline-style|outline-offset|outline-color|outline|orphans|order|opacity|object-position|object-fit|normal|none|nav-up|nav-right|nav-left|nav-index|nav-down|min-width|min-height|max-width|max-height|mask|marks|margin-top|margin-right|margin-left|margin-bottom|margin|list-style-type|list-style-position|list-style-image|list-style|line-height|letter-spacing|left|justify-content|initial|inherit|ime-mode|image-orientation|image-resolution|image-rendering|icon|hyphens|height|font-weight|font-variant-ligatures|font-variant|font-style|font-stretch|font-size-adjust|font-size|font-language-override|font-kerning|font-feature-settings|font-family|font|float|flex-wrap|flex-shrink|flex-grow|flex-flow|flex-direction|flex-basis|flex|filter|empty-cells|display|direction|cursor|counter-reset|counter-increment|content|column-width|column-span|column-rule-width|column-rule-style|column-rule-color|column-rule|column-gap|column-fill|column-count|columns|color|clip-path|clip|clear|caption-side|break-inside|break-before|break-after|box-sizing|box-shadow|box-decoration-break|bottom|border-width|border-top-width|border-top-style|border-top-right-radius|border-top-left-radius|border-top-color|border-top|border-style|border-spacing|border-right-width|border-right-style|border-right-color|border-right|border-radius|border-left-width|border-left-style|border-left-color|border-left|border-image-width|border-image-source|border-image-slice|border-image-repeat|border-image-outset|border-image|border-color|border-collapse|border-bottom-width|border-bottom-style|border-bottom-right-radius|border-bottom-left-radius|border-bottom-color|border-bottom|border|background-size|background-repeat|background-position|background-origin|background-image|background-color|background-clip|background-attachment|background|backface-visibility|auto|animation-timing-function|animation-play-state|animation-name|animation-iteration-count|animation-fill-mode|animation-duration|animation-direction|animation-delay|animation|align-self|align-items|align-content)\\b",
                i: "[^\\s]"
            }, {
                cN: "value",
                b: "\\b(whitespace|wait|w-resize|visible|vertical-text|vertical-ideographic|uppercase|upper-roman|upper-alpha|underline|transparent|top|thin|thick|text|text-top|text-bottom|tb-rl|table-header-group|table-footer-group|sw-resize|super|strict|static|square|solid|small-caps|separate|se-resize|scroll|s-resize|rtl|row-resize|ridge|right|repeat|repeat-y|repeat-x|relative|progress|pointer|overline|outside|outset|oblique|nowrap|not-allowed|normal|none|nw-resize|no-repeat|no-drop|newspaper|ne-resize|n-resize|move|middle|medium|ltr|lr-tb|lowercase|lower-roman|lower-alpha|loose|list-item|line|line-through|line-edge|lighter|left|keep-all|justify|italic|inter-word|inter-ideograph|inside|inset|inline|inline-block|inherit|inactive|ideograph-space|ideograph-parenthesis|ideograph-numeric|ideograph-alpha|horizontal|hidden|help|hand|groove|fixed|ellipsis|e-resize|double|dotted|distribute|distribute-space|distribute-letter|distribute-all-lines|disc|disabled|default|decimal|dashed|crosshair|collapse|col-resize|circle|char|center|capitalize|break-word|break-all|bottom|both|bolder|bold|block|bidi-override|below|baseline|auto|always|all-scroll|absolute|table|table-cell)\\b"
            }, {
                cN: "value",
                b: ":",
                e: ";",
                c: [n, i, s, e.CSSNM, e.QSM, e.ASM, {
                    cN: "important",
                    b: "!important"
                }]
            }, {
                cN: "at_rule",
                b: "@",
                e: "[{;]",
                k: "mixin include extend for if else each while charset import debug media page content font-face namespace warn",
                c: [n, i, e.QSM, e.ASM, s, e.CSSNM, {
                    cN: "preprocessor",
                    b: "\\s[A-Za-z0-9_.-]+",
                    r: 0
                }]
            }]
        }
    }), hljs.registerLanguage("json", function(e) {
        var t = {
                literal: "true false null"
            },
            i = [e.QSM, e.CNM],
            n = {
                cN: "value",
                e: ",",
                eW: !0,
                eE: !0,
                c: i,
                k: t
            },
            s = {
                b: "{",
                e: "}",
                c: [{
                    cN: "attribute",
                    b: '\\s*"',
                    e: '"\\s*:\\s*',
                    eB: !0,
                    eE: !0,
                    c: [e.BE],
                    i: "\\n",
                    starts: n
                }],
                i: "\\S"
            },
            a = {
                b: "\\[",
                e: "\\]",
                c: [e.inherit(n, {
                    cN: null
                })],
                i: "\\S"
            };
        return i.splice(i.length, 0, s, a), {
            c: i,
            k: t,
            i: "\\S"
        }
    }), hljs.registerLanguage("css", function(e) {
        var t = "[a-zA-Z-][a-zA-Z0-9_-]*",
            i = {
                cN: "function",
                b: t + "\\(",
                rB: !0,
                eE: !0,
                e: "\\("
            };
        return {
            cI: !0,
            i: "[=/|']",
            c: [e.CBCM, {
                cN: "id",
                b: "\\#[A-Za-z0-9_-]+"
            }, {
                cN: "class",
                b: "\\.[A-Za-z0-9_-]+",
                r: 0
            }, {
                cN: "attr_selector",
                b: "\\[",
                e: "\\]",
                i: "$"
            }, {
                cN: "pseudo",
                b: ":(:)?[a-zA-Z0-9\\_\\-\\+\\(\\)\\\"\\']+"
            }, {
                cN: "at_rule",
                b: "@(font-face|page)",
                l: "[a-z-]+",
                k: "font-face page"
            }, {
                cN: "at_rule",
                b: "@",
                e: "[{;]",
                c: [{
                    cN: "keyword",
                    b: /\S+/
                }, {
                    b: /\s/,
                    eW: !0,
                    eE: !0,
                    r: 0,
                    c: [i, e.ASM, e.QSM, e.CSSNM]
                }]
            }, {
                cN: "tag",
                b: t,
                r: 0
            }, {
                cN: "rules",
                b: "{",
                e: "}",
                i: "[^\\s]",
                r: 0,
                c: [e.CBCM, {
                    cN: "rule",
                    b: "[^\\s]",
                    rB: !0,
                    e: ";",
                    eW: !0,
                    c: [{
                        cN: "attribute",
                        b: "[A-Z\\_\\.\\-]+",
                        e: ":",
                        eE: !0,
                        i: "[^\\s]",
                        starts: {
                            cN: "value",
                            eW: !0,
                            eE: !0,
                            c: [i, e.CSSNM, e.QSM, e.ASM, e.CBCM, {
                                cN: "hexcolor",
                                b: "#[0-9A-Fa-f]+"
                            }, {
                                cN: "important",
                                b: "!important"
                            }]
                        }
                    }]
                }]
            }]
        }
    }),
    function(e, t, i) {
        "undefined" != typeof module && module.exports ? module.exports = i() : "function" == typeof define && define.amd ? define(i) : t[e] = i()
    }("jquery-scrollto", this, function() {
        var e, t, i;
        return e = t = window.jQuery || require("jquery"), t.propHooks.scrollTop = t.propHooks.scrollLeft = {
            get: function(e, t) {
                var i = null;
                return ("HTML" === e.tagName || "BODY" === e.tagName) && ("scrollLeft" === t ? i = window.scrollX : "scrollTop" === t && (i = window.scrollY)), null == i && (i = e[t]), i
            }
        }, t.Tween.propHooks.scrollTop = t.Tween.propHooks.scrollLeft = {
            get: function(e) {
                return t.propHooks.scrollTop.get(e.elem, e.prop)
            },
            set: function(e) {
                "HTML" === e.elem.tagName || "BODY" === e.elem.tagName ? (e.options.bodyScrollLeft = e.options.bodyScrollLeft || window.scrollX, e.options.bodyScrollTop = e.options.bodyScrollTop || window.scrollY, "scrollLeft" === e.prop ? e.options.bodyScrollLeft = Math.round(e.now) : "scrollTop" === e.prop && (e.options.bodyScrollTop = Math.round(e.now)), window.scrollTo(e.options.bodyScrollLeft, e.options.bodyScrollTop)) : e.elem.nodeType && e.elem.parentNode && (e.elem[e.prop] = e.now)
            }
        }, i = {
            config: {
                duration: 400,
                easing: "swing",
                callback: void 0,
                durationMode: "each",
                offsetTop: 0,
                offsetLeft: 0
            },
            configure: function(e) {
                return t.extend(i.config, e || {}), this
            },
            scroll: function(e, n) {
                var s, a, o, r, l, d, c, h, p, u, g, f, m, v, _, b, y, w;
                return s = e.pop(), a = s.$container, o = s.$target, d = a.prop("tagName"), r = t("<span/>").css({
                    position: "absolute",
                    top: "0px",
                    left: "0px"
                }), l = a.css("position"), a.css({
                    position: "relative"
                }), r.appendTo(a), g = r.offset().top, f = o.offset().top, m = f - g - parseInt(n.offsetTop, 10), v = r.offset().left, _ = o.offset().left, b = _ - v - parseInt(n.offsetLeft, 10), c = a.prop("scrollTop"), h = a.prop("scrollLeft"), r.remove(), a.css({
                    position: l
                }), y = {}, w = function() {
                    return 0 === e.length ? "function" == typeof n.callback && n.callback() : i.scroll(e, n), !0
                }, n.onlyIfOutside && (p = c + a.height(), u = h + a.width(), m > c && p > m && (m = c), b > h && u > b && (b = h)), m !== c && (y.scrollTop = m), b !== h && (y.scrollLeft = b), a.prop("scrollHeight") === a.width() && delete y.scrollTop, a.prop("scrollWidth") === a.width() && delete y.scrollLeft, null != y.scrollTop || null != y.scrollLeft ? a.animate(y, {
                    duration: n.duration,
                    easing: n.easing,
                    complete: w
                }) : w(), !0
            },
            fn: function(e) {
                var n, s, a, o;
                n = [];
                var r = t(this);
                if (0 === r.length) return this;
                for (s = t.extend({}, i.config, e), a = r.parent(), o = a.get(0); 1 === a.length && o !== document.body && o !== document;) {
                    var l, d;
                    l = "visible" !== a.css("overflow-y") && o.scrollHeight !== o.clientHeight, d = "visible" !== a.css("overflow-x") && o.scrollWidth !== o.clientWidth, (l || d) && (n.push({
                        $container: a,
                        $target: r
                    }), r = a), a = a.parent(), o = a.get(0)
                }
                return n.push({
                    $container: t("html"),
                    $target: r
                }), "all" === s.durationMode && (s.duration /= n.length), i.scroll(n, s), this
            }
        }, t.ScrollTo = t.ScrollTo || i, t.fn.ScrollTo = t.fn.ScrollTo || i.fn, i
    }),
    function(e) {
        function t() {
            var e = location.href;
            return hashtag = -1 !== e.indexOf("#prettyPhoto") ? decodeURI(e.substring(e.indexOf("#prettyPhoto") + 1, e.length)) : !1
        }

        function i() {
            "undefined" != typeof theRel && (location.hash = theRel + "/" + rel_index + "/")
        }

        function n() {
            -1 !== location.href.indexOf("#prettyPhoto") && (location.hash = "prettyPhoto")
        }

        function s(e, t) {
            e = e.replace(/[\[]/, "\\[").replace(/[\]]/, "\\]");
            var i = "[\\?&]" + e + "=([^&#]*)",
                n = new RegExp(i),
                s = n.exec(t);
            return null == s ? "" : s[1]
        }
        e.prettyPhoto = {
            version: "3.1.5"
        }, e.fn.prettyPhoto = function(a) {
            function o() {
                e(".pp_loaderIcon").hide(), projectedTop = scroll_pos.scrollTop + (S / 2 - v.containerHeight / 2), 0 > projectedTop && (projectedTop = 0), $ppt.fadeTo(settings.animation_speed, 1), $pp_pic_holder.find(".pp_content").animate({
                    height: v.contentHeight,
                    width: v.contentWidth
                }, settings.animation_speed), $pp_pic_holder.animate({
                    top: projectedTop,
                    left: C / 2 - v.containerWidth / 2 < 0 ? 0 : C / 2 - v.containerWidth / 2,
                    width: v.containerWidth
                }, settings.animation_speed, function() {
                    $pp_pic_holder.find(".pp_hoverContainer,#fullResImage").height(v.height).width(v.width), $pp_pic_holder.find(".pp_fade").fadeIn(settings.animation_speed), isSet && "image" == h(pp_images[set_position]) ? $pp_pic_holder.find(".pp_hoverContainer").show() : $pp_pic_holder.find(".pp_hoverContainer").hide(), settings.allow_expand && (v.resized ? e("a.pp_expand,a.pp_contract").show() : e("a.pp_expand").hide()), !settings.autoplay_slideshow || x || _ || e.prettyPhoto.startSlideshow(), settings.changepicturecallback(), _ = !0
                }), f(), a.ajaxcallback()
            }

            function r(t) {
                $pp_pic_holder.find("#pp_full_res object,#pp_full_res embed").css("visibility", "hidden"), $pp_pic_holder.find(".pp_fade").fadeOut(settings.animation_speed, function() {
                    e(".pp_loaderIcon").show(), t()
                })
            }

            function l(t) {
                t > 1 ? e(".pp_nav").show() : e(".pp_nav").hide()
            }

            function d(e, t) {
                if (resized = !1, c(e, t), imageWidth = e, imageHeight = t, (k > C || w > S) && doresize && settings.allow_resize && !M) {
                    for (resized = !0, fitting = !1; !fitting;) k > C ? (imageWidth = C - 200, imageHeight = t / e * imageWidth) : w > S ? (imageHeight = S - 200, imageWidth = e / t * imageHeight) : fitting = !0, w = imageHeight, k = imageWidth;
                    (k > C || w > S) && d(k, w), c(imageWidth, imageHeight)
                }
                return {
                    width: Math.floor(imageWidth),
                    height: Math.floor(imageHeight),
                    containerHeight: Math.floor(w),
                    containerWidth: Math.floor(k) + 2 * settings.horizontal_padding,
                    contentHeight: Math.floor(b),
                    contentWidth: Math.floor(y),
                    resized: resized
                }
            }

            function c(t, i) {
                t = parseFloat(t), i = parseFloat(i), $pp_details = $pp_pic_holder.find(".pp_details"), $pp_details.width(t), detailsHeight = parseFloat($pp_details.css("marginTop")) + parseFloat($pp_details.css("marginBottom")), $pp_details = $pp_details.clone().addClass(settings.theme).width(t).appendTo(e("body")).css({
                    position: "absolute",
                    top: -1e4
                }), detailsHeight += $pp_details.height(), detailsHeight = 34 >= detailsHeight ? 36 : detailsHeight, $pp_details.remove(), $pp_title = $pp_pic_holder.find(".ppt"), $pp_title.width(t), titleHeight = parseFloat($pp_title.css("marginTop")) + parseFloat($pp_title.css("marginBottom")), $pp_title = $pp_title.clone().appendTo(e("body")).css({
                    position: "absolute",
                    top: -1e4
                }), titleHeight += $pp_title.height(), $pp_title.remove(), b = i + detailsHeight, y = t, w = b + titleHeight + $pp_pic_holder.find(".pp_top").height() + $pp_pic_holder.find(".pp_bottom").height(), k = t
            }

            function h(e) {
                return e.match(/youtube\.com\/watch/i) || e.match(/youtu\.be/i) ? "youtube" : e.match(/vimeo\.com/i) ? "vimeo" : e.match(/\b.mov\b/i) ? "quicktime" : e.match(/\b.swf\b/i) ? "flash" : e.match(/\biframe=true\b/i) ? "iframe" : e.match(/\bajax=true\b/i) ? "ajax" : e.match(/\bcustom=true\b/i) ? "custom" : "#" == e.substr(0, 1) ? "inline" : "image"
            }

            function p() {
                if (doresize && "undefined" != typeof $pp_pic_holder) {
                    if (scroll_pos = u(), contentHeight = $pp_pic_holder.height(), contentwidth = $pp_pic_holder.width(), projectedTop = S / 2 + scroll_pos.scrollTop - contentHeight / 2, 0 > projectedTop && (projectedTop = 0), contentHeight > S) return;
                    $pp_pic_holder.css({
                        top: projectedTop,
                        left: C / 2 + scroll_pos.scrollLeft - contentwidth / 2
                    })
                }
            }

            function u() {
                return self.pageYOffset ? {
                    scrollTop: self.pageYOffset,
                    scrollLeft: self.pageXOffset
                } : document.documentElement && document.documentElement.scrollTop ? {
                    scrollTop: document.documentElement.scrollTop,
                    scrollLeft: document.documentElement.scrollLeft
                } : document.body ? {
                    scrollTop: document.body.scrollTop,
                    scrollLeft: document.body.scrollLeft
                } : void 0
            }

            function g() {
                S = e(window).height(), C = e(window).width(), "undefined" != typeof $pp_overlay && $pp_overlay.height(e(document).height()).width(C)
            }

            function f() {
                isSet && settings.overlay_gallery && "image" == h(pp_images[set_position]) ? (itemWidth = 57, navWidth = "facebook" == settings.theme || "pp_default" == settings.theme ? 50 : 30, itemsPerPage = Math.floor((v.containerWidth - 100 - navWidth) / itemWidth), itemsPerPage = itemsPerPage < pp_images.length ? itemsPerPage : pp_images.length, totalPage = Math.ceil(pp_images.length / itemsPerPage) - 1, 0 == totalPage ? (navWidth = 0, $pp_gallery.find(".pp_arrow_next,.pp_arrow_previous").hide()) : $pp_gallery.find(".pp_arrow_next,.pp_arrow_previous").show(), galleryWidth = itemsPerPage * itemWidth, fullGalleryWidth = pp_images.length * itemWidth, $pp_gallery.css("margin-left", -(galleryWidth / 2 + navWidth / 2)).find("div:first").width(galleryWidth + 5).find("ul").width(fullGalleryWidth).find("li.selected").removeClass("selected"), goToPage = Math.floor(set_position / itemsPerPage) < totalPage ? Math.floor(set_position / itemsPerPage) : totalPage, e.prettyPhoto.changeGalleryPage(goToPage), $pp_gallery_li.filter(":eq(" + set_position + ")").addClass("selected")) : $pp_pic_holder.find(".pp_content").unbind("mouseenter mouseleave")
            }

            function m() {
                if (settings.social_tools && (facebook_like_link = settings.social_tools.replace("{location_href}", encodeURIComponent(location.href))), settings.markup = settings.markup.replace("{pp_social}", ""), e("body").append(settings.markup), $pp_pic_holder = e(".pp_pic_holder"), $ppt = e(".ppt"), $pp_overlay = e("div.pp_overlay"), isSet && settings.overlay_gallery) {
                    currentGalleryPage = 0, toInject = "";
                    for (var t = 0; t < pp_images.length; t++) pp_images[t].match(/\b(jpg|jpeg|png|gif)\b/gi) ? (classname = "", img_src = pp_images[t]) : (classname = "default", img_src = ""), toInject += "<li class='" + classname + "'><a href='#'><img src='" + img_src + "' width='50' alt='' /></a></li>";
                    toInject = settings.gallery_markup.replace(/{gallery}/g, toInject), $pp_pic_holder.find("#pp_full_res").after(toInject), $pp_gallery = e(".pp_pic_holder .pp_gallery"), $pp_gallery_li = $pp_gallery.find("li"), $pp_gallery.find(".pp_arrow_next").click(function() {
                        return e.prettyPhoto.changeGalleryPage("next"), e.prettyPhoto.stopSlideshow(), !1
                    }), $pp_gallery.find(".pp_arrow_previous").click(function() {
                        return e.prettyPhoto.changeGalleryPage("previous"), e.prettyPhoto.stopSlideshow(), !1
                    }), $pp_pic_holder.find(".pp_content").hover(function() {
                        $pp_pic_holder.find(".pp_gallery:not(.disabled)").fadeIn()
                    }, function() {
                        $pp_pic_holder.find(".pp_gallery:not(.disabled)").fadeOut()
                    }), itemWidth = 57, $pp_gallery_li.each(function(t) {
                        e(this).find("a").click(function() {
                            return e.prettyPhoto.changePage(t), e.prettyPhoto.stopSlideshow(), !1
                        })
                    })
                }
                settings.slideshow && ($pp_pic_holder.find(".pp_nav").prepend('<a href="#" class="pp_play">Play</a>'), $pp_pic_holder.find(".pp_nav .pp_play").click(function() {
                    return e.prettyPhoto.startSlideshow(), !1
                })), $pp_pic_holder.attr("class", "pp_pic_holder " + settings.theme), $pp_overlay.css({
                    opacity: 0,
                    height: e(document).height(),
                    width: e(window).width()
                }).bind("click", function() {
                    settings.modal || e.prettyPhoto.close()
                }), e("a.pp_close").bind("click", function() {
                    return e.prettyPhoto.close(), !1
                }), settings.allow_expand && e("a.pp_expand").bind("click", function() {
                    return e(this).hasClass("pp_expand") ? (e(this).removeClass("pp_expand").addClass("pp_contract"), doresize = !1) : (e(this).removeClass("pp_contract").addClass("pp_expand"), doresize = !0), r(function() {
                        e.prettyPhoto.open()
                    }), !1
                }), $pp_pic_holder.find(".pp_previous, .pp_nav .pp_arrow_previous").bind("click", function() {
                    return e.prettyPhoto.changePage("previous"), e.prettyPhoto.stopSlideshow(), !1
                }), $pp_pic_holder.find(".pp_next, .pp_nav .pp_arrow_next").bind("click", function() {
                    return e.prettyPhoto.changePage("next"), e.prettyPhoto.stopSlideshow(), !1
                }), p()
            }
            a = jQuery.extend({
                hook: "rel",
                animation_speed: "fast",
                ajaxcallback: function() {},
                slideshow: 5e3,
                autoplay_slideshow: !1,
                opacity: .8,
                show_title: !0,
                allow_resize: !0,
                allow_expand: !0,
                default_width: 500,
                default_height: 344,
                counter_separator_label: "/",
                theme: "pp_default",
                horizontal_padding: 20,
                hideflash: !1,
                wmode: "opaque",
                autoplay: !0,
                modal: !1,
                deeplinking: !0,
                overlay_gallery: !0,
                overlay_gallery_max: 30,
                keyboard_shortcuts: !0,
                changepicturecallback: function() {},
                callback: function() {},
                ie6_fallback: !0,
                markup: '<div class="pp_pic_holder"> 						<div class="ppt"> </div> 						<div class="pp_top"> 							<div class="pp_left"></div> 							<div class="pp_middle"></div> 							<div class="pp_right"></div> 						</div> 						<div class="pp_content_container"> 							<div class="pp_left"> 							<div class="pp_right"> 								<div class="pp_content"> 									<div class="pp_loaderIcon"></div> 									<div class="pp_fade"> 										<a href="#" class="pp_expand" title="Expand the image">Expand</a> 										<div class="pp_hoverContainer"> 											<a class="pp_next" href="#">next</a> 											<a class="pp_previous" href="#">previous</a> 										</div> 										<div id="pp_full_res"></div> 										<div class="pp_details"> 											<div class="pp_nav"> 												<a href="#" class="pp_arrow_previous">Previous</a> 												<p class="currentTextHolder">0/0</p> 												<a href="#" class="pp_arrow_next">Next</a> 											</div> 											<p class="pp_description"></p> 											<div class="pp_social">{pp_social}</div> 											<a class="pp_close" href="#">Close</a> 										</div> 									</div> 								</div> 							</div> 							</div> 						</div> 						<div class="pp_bottom"> 							<div class="pp_left"></div> 							<div class="pp_middle"></div> 							<div class="pp_right"></div> 						</div> 					</div> 					<div class="pp_overlay"></div>',
                gallery_markup: '<div class="pp_gallery"> 								<a href="#" class="pp_arrow_previous">Previous</a> 								<div> 									<ul> 										{gallery} 									</ul> 								</div> 								<a href="#" class="pp_arrow_next">Next</a> 							</div>',
                image_markup: '<img id="fullResImage" src="{path}" />',
                flash_markup: '<object classid="clsid:D27CDB6E-AE6D-11cf-96B8-444553540000" width="{width}" height="{height}"><param name="wmode" value="{wmode}" /><param name="allowfullscreen" value="true" /><param name="allowscriptaccess" value="always" /><param name="movie" value="{path}" /><embed src="{path}" type="application/x-shockwave-flash" allowfullscreen="true" allowscriptaccess="always" width="{width}" height="{height}" wmode="{wmode}"></embed></object>',
                quicktime_markup: '<object classid="clsid:02BF25D5-8C17-4B23-BC80-D3488ABDDC6B" codebase="http://www.apple.com/qtactivex/qtplugin.cab" height="{height}" width="{width}"><param name="src" value="{path}"><param name="autoplay" value="{autoplay}"><param name="type" value="video/quicktime"><embed src="{path}" height="{height}" width="{width}" autoplay="{autoplay}" type="video/quicktime" pluginspage="http://www.apple.com/quicktime/download/"></embed></object>',
                iframe_markup: '<iframe src ="{path}" width="{width}" height="{height}" frameborder="no"></iframe>',
                inline_markup: '<div class="pp_inline">{content}</div>',
                custom_markup: "",
                social_tools: '<div class="twitter"><a href="http://twitter.com/share" class="twitter-share-button" data-count="none">Tweet</a><script type="text/javascript" src="http://platform.twitter.com/widgets.js"></script></div><div class="facebook"><iframe src="//www.facebook.com/plugins/like.php?locale=en_US&href={location_href}&layout=button_count&show_faces=true&width=500&action=like&font&colorscheme=light&height=23" scrolling="no" frameborder="0" style="border:none; overflow:hidden; width:500px; height:23px;" allowTransparency="true"></iframe></div>'
            }, a);
            var v, _, b, y, w, k, x, D = this,
                M = !1,
                S = e(window).height(),
                C = e(window).width();
            return doresize = !0, scroll_pos = u(), e(window).unbind("resize.prettyphoto").bind("resize.prettyphoto", function() {
                p(), g()
            }), a.keyboard_shortcuts && e(document).unbind("keydown.prettyphoto").bind("keydown.prettyphoto", function(t) {
                if ("undefined" != typeof $pp_pic_holder && $pp_pic_holder.is(":visible")) switch (t.keyCode) {
                    case 37:
                        e.prettyPhoto.changePage("previous"), t.preventDefault();
                        break;
                    case 39:
                        e.prettyPhoto.changePage("next"), t.preventDefault();
                        break;
                    case 27:
                        settings.modal || e.prettyPhoto.close(), t.preventDefault()
                }
            }), e.prettyPhoto.initialize = function() {
                return settings = a, "pp_default" == settings.theme && (settings.horizontal_padding = 16), theRel = e(this).attr(settings.hook), galleryRegExp = /\[(?:.*)\]/, isSet = galleryRegExp.exec(theRel) ? !0 : !1, pp_images = isSet ? jQuery.map(D, function(t) {
                    return -1 != e(t).attr(settings.hook).indexOf(theRel) ? e(t).attr("href") : void 0
                }) : e.makeArray(e(this).attr("href")), pp_titles = isSet ? jQuery.map(D, function(t) {
                    return -1 != e(t).attr(settings.hook).indexOf(theRel) ? e(t).find("img").attr("alt") ? e(t).find("img").attr("alt") : "" : void 0
                }) : e.makeArray(e(this).find("img").attr("alt")), pp_descriptions = isSet ? jQuery.map(D, function(t) {
                    return -1 != e(t).attr(settings.hook).indexOf(theRel) ? e(t).attr("title") ? e(t).attr("title") : "" : void 0
                }) : e.makeArray(e(this).attr("title")), pp_images.length > settings.overlay_gallery_max && (settings.overlay_gallery = !1), set_position = jQuery.inArray(e(this).attr("href"), pp_images), rel_index = isSet ? set_position : e("a[" + settings.hook + "^='" + theRel + "']").index(e(this)), m(this), settings.allow_resize && e(window).bind("scroll.prettyphoto", function() {
                    p()
                }), e.prettyPhoto.open(), !1
            }, e.prettyPhoto.open = function(t) {
                return "undefined" == typeof settings && (settings = a, pp_images = e.makeArray(arguments[0]), pp_titles = e.makeArray(arguments[1] ? arguments[1] : ""), pp_descriptions = e.makeArray(arguments[2] ? arguments[2] : ""), isSet = pp_images.length > 1 ? !0 : !1, set_position = arguments[3] ? arguments[3] : 0, m(t.target)), settings.hideflash && e("object,embed,iframe[src*=youtube],iframe[src*=vimeo]").css("visibility", "hidden"), l(e(pp_images).size()), e(".pp_loaderIcon").show(), settings.deeplinking && i(), settings.social_tools && (facebook_like_link = settings.social_tools.replace("{location_href}", encodeURIComponent(location.href)), $pp_pic_holder.find(".pp_social").html(facebook_like_link)), $ppt.is(":hidden") && $ppt.css("opacity", 0).show(), $pp_overlay.show().fadeTo(settings.animation_speed, settings.opacity), $pp_pic_holder.find(".currentTextHolder").text(set_position + 1 + settings.counter_separator_label + e(pp_images).size()), "undefined" != typeof pp_descriptions[set_position] && "" != pp_descriptions[set_position] ? $pp_pic_holder.find(".pp_description").show().html(unescape(pp_descriptions[set_position])) : $pp_pic_holder.find(".pp_description").hide(), movie_width = parseFloat(s("width", pp_images[set_position])) ? s("width", pp_images[set_position]) : settings.default_width.toString(), movie_height = parseFloat(s("height", pp_images[set_position])) ? s("height", pp_images[set_position]) : settings.default_height.toString(), M = !1, -1 != movie_height.indexOf("%") && (movie_height = parseFloat(e(window).height() * parseFloat(movie_height) / 100 - 150), M = !0), -1 != movie_width.indexOf("%") && (movie_width = parseFloat(e(window).width() * parseFloat(movie_width) / 100 - 150), M = !0), $pp_pic_holder.fadeIn(function() {
                    switch ($ppt.html(settings.show_title && "" != pp_titles[set_position] && "undefined" != typeof pp_titles[set_position] ? unescape(pp_titles[set_position]) : " "), imgPreloader = "", skipInjection = !1, h(pp_images[set_position])) {
                        case "image":
                            imgPreloader = new Image, nextImage = new Image, isSet && set_position < e(pp_images).size() - 1 && (nextImage.src = pp_images[set_position + 1]), prevImage = new Image, isSet && pp_images[set_position - 1] && (prevImage.src = pp_images[set_position - 1]), $pp_pic_holder.find("#pp_full_res")[0].innerHTML = settings.image_markup.replace(/{path}/g, pp_images[set_position]), imgPreloader.onload = function() {
                                v = d(imgPreloader.width, imgPreloader.height), o()
                            }, imgPreloader.onerror = function() {
                                alert("Image cannot be loaded. Make sure the path is correct and image exist."), e.prettyPhoto.close()
                            }, imgPreloader.src = pp_images[set_position];
                            break;
                        case "youtube":
                            v = d(movie_width, movie_height), movie_id = s("v", pp_images[set_position]), "" == movie_id && (movie_id = pp_images[set_position].split("youtu.be/"), movie_id = movie_id[1], movie_id.indexOf("?") > 0 && (movie_id = movie_id.substr(0, movie_id.indexOf("?"))), movie_id.indexOf("&") > 0 && (movie_id = movie_id.substr(0, movie_id.indexOf("&")))), movie = "http://www.youtube.com/embed/" + movie_id, movie += s("rel", pp_images[set_position]) ? "?rel=" + s("rel", pp_images[set_position]) : "?rel=1", settings.autoplay && (movie += "&autoplay=1"), toInject = settings.iframe_markup.replace(/{width}/g, v.width).replace(/{height}/g, v.height).replace(/{wmode}/g, settings.wmode).replace(/{path}/g, movie);
                            break;
                        case "vimeo":
                            v = d(movie_width, movie_height), movie_id = pp_images[set_position];
                            var t = /http(s?):\/\/(www\.)?vimeo.com\/(\d+)/,
                                i = movie_id.match(t);
                            movie = "http://player.vimeo.com/video/" + i[3] + "?title=0&byline=0&portrait=0", settings.autoplay && (movie += "&autoplay=1;"), vimeo_width = v.width + "/embed/?moog_width=" + v.width, toInject = settings.iframe_markup.replace(/{width}/g, vimeo_width).replace(/{height}/g, v.height).replace(/{path}/g, movie);
                            break;
                        case "quicktime":
                            v = d(movie_width, movie_height), v.height += 15, v.contentHeight += 15, v.containerHeight += 15, toInject = settings.quicktime_markup.replace(/{width}/g, v.width).replace(/{height}/g, v.height).replace(/{wmode}/g, settings.wmode).replace(/{path}/g, pp_images[set_position]).replace(/{autoplay}/g, settings.autoplay);
                            break;
                        case "flash":
                            v = d(movie_width, movie_height), flash_vars = pp_images[set_position], flash_vars = flash_vars.substring(pp_images[set_position].indexOf("flashvars") + 10, pp_images[set_position].length), filename = pp_images[set_position], filename = filename.substring(0, filename.indexOf("?")), toInject = settings.flash_markup.replace(/{width}/g, v.width).replace(/{height}/g, v.height).replace(/{wmode}/g, settings.wmode).replace(/{path}/g, filename + "?" + flash_vars);
                            break;
                        case "iframe":
                            v = d(movie_width, movie_height), frame_url = pp_images[set_position], frame_url = frame_url.substr(0, frame_url.indexOf("iframe") - 1), toInject = settings.iframe_markup.replace(/{width}/g, v.width).replace(/{height}/g, v.height).replace(/{path}/g, frame_url);
                            break;
                        case "ajax":
                            doresize = !1, v = d(movie_width, movie_height), doresize = !0, skipInjection = !0, e.get(pp_images[set_position], function(e) {
                                toInject = settings.inline_markup.replace(/{content}/g, e), $pp_pic_holder.find("#pp_full_res")[0].innerHTML = toInject, o()
                            });
                            break;
                        case "custom":
                            v = d(movie_width, movie_height), toInject = settings.custom_markup;
                            break;
                        case "inline":
                            myClone = e(pp_images[set_position]).clone().append('<br clear="all" />').css({
                                width: settings.default_width
                            }).wrapInner('<div id="pp_full_res"><div class="pp_inline"></div></div>').appendTo(e("body")).show(), doresize = !1, v = d(e(myClone).width(), e(myClone).height()), doresize = !0, e(myClone).remove(), toInject = settings.inline_markup.replace(/{content}/g, e(pp_images[set_position]).html())
                    }
                    imgPreloader || skipInjection || ($pp_pic_holder.find("#pp_full_res")[0].innerHTML = toInject, o())
                }), !1
            }, e.prettyPhoto.changePage = function(t) {
                currentGalleryPage = 0, "previous" == t ? (set_position--, 0 > set_position && (set_position = e(pp_images).size() - 1)) : "next" == t ? (set_position++, set_position > e(pp_images).size() - 1 && (set_position = 0)) : set_position = t, rel_index = set_position, doresize || (doresize = !0), settings.allow_expand && e(".pp_contract").removeClass("pp_contract").addClass("pp_expand"), r(function() {
                    e.prettyPhoto.open()
                })
            }, e.prettyPhoto.changeGalleryPage = function(e) {
                "next" == e ? (currentGalleryPage++, currentGalleryPage > totalPage && (currentGalleryPage = 0)) : "previous" == e ? (currentGalleryPage--, 0 > currentGalleryPage && (currentGalleryPage = totalPage)) : currentGalleryPage = e, slide_speed = "next" == e || "previous" == e ? settings.animation_speed : 0, slide_to = currentGalleryPage * itemsPerPage * itemWidth, $pp_gallery.find("ul").animate({
                    left: -slide_to
                }, slide_speed)
            }, e.prettyPhoto.startSlideshow = function() {
                "undefined" == typeof x ? ($pp_pic_holder.find(".pp_play").unbind("click").removeClass("pp_play").addClass("pp_pause").click(function() {
                    return e.prettyPhoto.stopSlideshow(), !1
                }), x = setInterval(e.prettyPhoto.startSlideshow, settings.slideshow)) : e.prettyPhoto.changePage("next")
            }, e.prettyPhoto.stopSlideshow = function() {
                $pp_pic_holder.find(".pp_pause").unbind("click").removeClass("pp_pause").addClass("pp_play").click(function() {
                    return e.prettyPhoto.startSlideshow(), !1
                }), clearInterval(x), x = void 0
            }, e.prettyPhoto.close = function() {
                $pp_overlay.is(":animated") || (e.prettyPhoto.stopSlideshow(), $pp_pic_holder.stop().find("object,embed").css("visibility", "hidden"), e("div.pp_pic_holder,div.ppt,.pp_fade").fadeOut(settings.animation_speed, function() {
                    e(this).remove()
                }), $pp_overlay.fadeOut(settings.animation_speed, function() {
                    settings.hideflash && e("object,embed,iframe[src*=youtube],iframe[src*=vimeo]").css("visibility", "visible"), e(this).remove(), e(window).unbind("scroll.prettyphoto"), n(), settings.callback(), doresize = !0, _ = !1, delete settings
                }))
            }, !pp_alreadyInitialized && t() && (pp_alreadyInitialized = !0, hashIndex = t(), hashRel = hashIndex, hashIndex = hashIndex.substring(hashIndex.indexOf("/") + 1, hashIndex.length - 1), hashRel = hashRel.substring(0, hashRel.indexOf("/")), setTimeout(function() {
                e("a[" + a.hook + "^='" + hashRel + "']:eq(" + hashIndex + ")").trigger("click")
            }, 50)), this.unbind("click.prettyphoto").bind("click.prettyphoto", e.prettyPhoto.initialize)
        }
    }(jQuery);
var pp_alreadyInitialized = !1;
(function() {
    var e, t, i = function(e, t) {
        return function() {
            return e.apply(t, arguments)
        }
    };
    e = function() {
        function e() {}
        return e.prototype.extend = function(e, t) {
            var i, n;
            for (i in e) n = e[i], null != n && (t[i] = n);
            return t
        }, e.prototype.isMobile = function(e) {
            return /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(e)
        }, e
    }(), t = this.WeakMap || (t = function() {
        function e() {
            this.keys = [], this.values = []
        }
        return e.prototype.get = function(e) {
            var t, i, n, s, a;
            for (a = this.keys, t = n = 0, s = a.length; s > n; t = ++n)
                if (i = a[t], i === e) return this.values[t]
        }, e.prototype.set = function(e, t) {
            var i, n, s, a, o;
            for (o = this.keys, i = s = 0, a = o.length; a > s; i = ++s)
                if (n = o[i], n === e) return void(this.values[i] = t);
            return this.keys.push(e), this.values.push(t)
        }, e
    }()), this.WOW = function() {
        function n(e) {
            null == e && (e = {}), this.scrollCallback = i(this.scrollCallback, this), this.scrollHandler = i(this.scrollHandler, this), this.start = i(this.start, this), this.scrolled = !0, this.config = this.util().extend(e, this.defaults), this.animationNameCache = new t
        }
        return n.prototype.defaults = {
            boxClass: "wow",
            animateClass: "animated",
            offset: 0,
            mobile: !0
        }, n.prototype.init = function() {
            var e;
            return this.element = window.document.documentElement, "interactive" === (e = document.readyState) || "complete" === e ? this.start() : document.addEventListener("DOMContentLoaded", this.start)
        }, n.prototype.start = function() {
            var e, t, i, n;
            if (this.boxes = this.element.getElementsByClassName(this.config.boxClass), this.boxes.length) {
                if (this.disabled()) return this.resetStyle();
                for (n = this.boxes, t = 0, i = n.length; i > t; t++) e = n[t], this.applyStyle(e, !0);
                return window.addEventListener("scroll", this.scrollHandler, !1), window.addEventListener("resize", this.scrollHandler, !1), this.interval = setInterval(this.scrollCallback, 50)
            }
        }, n.prototype.stop = function() {
            return window.removeEventListener("scroll", this.scrollHandler, !1), window.removeEventListener("resize", this.scrollHandler, !1), null != this.interval ? clearInterval(this.interval) : void 0
        }, n.prototype.show = function(e) {
            return this.applyStyle(e), e.className = "" + e.className + " " + this.config.animateClass
        }, n.prototype.applyStyle = function(e, t) {
            var i, n, s;
            return n = e.getAttribute("data-wow-duration"), i = e.getAttribute("data-wow-delay"), s = e.getAttribute("data-wow-iteration"), this.animate(function(a) {
                return function() {
                    return a.customStyle(e, t, n, i, s)
                }
            }(this))
        }, n.prototype.animate = function() {
            return "requestAnimationFrame" in window ? function(e) {
                return window.requestAnimationFrame(e)
            } : function(e) {
                return e()
            }
        }(), n.prototype.resetStyle = function() {
            var e, t, i, n, s;
            for (n = this.boxes, s = [], t = 0, i = n.length; i > t; t++) e = n[t], s.push(e.setAttribute("style", "visibility: visible;"));
            return s
        }, n.prototype.customStyle = function(e, t, i, n, s) {
            return t && this.cacheAnimationName(e), e.style.visibility = t ? "hidden" : "visible", i && this.vendorSet(e.style, {
                animationDuration: i
            }), n && this.vendorSet(e.style, {
                animationDelay: n
            }), s && this.vendorSet(e.style, {
                animationIterationCount: s
            }), this.vendorSet(e.style, {
                animationName: t ? "none" : this.cachedAnimationName(e)
            }), e
        }, n.prototype.vendors = ["moz", "webkit"], n.prototype.vendorSet = function(e, t) {
            var i, n, s, a;
            a = [];
            for (i in t) n = t[i], e["" + i] = n, a.push(function() {
                var t, a, o, r;
                for (o = this.vendors, r = [], t = 0, a = o.length; a > t; t++) s = o[t], r.push(e["" + s + i.charAt(0).toUpperCase() + i.substr(1)] = n);
                return r
            }.call(this));
            return a
        }, n.prototype.vendorCSS = function(e, t) {
            var i, n, s, a, o, r;
            for (n = window.getComputedStyle(e), i = n.getPropertyCSSValue(t), r = this.vendors, a = 0, o = r.length; o > a; a++) s = r[a], i = i || n.getPropertyCSSValue("-" + s + "-" + t);
            return i
        }, n.prototype.animationName = function(e) {
            var t;
            try {
                t = this.vendorCSS(e, "animation-name").cssText
            } catch (i) {
                t = window.getComputedStyle(e).getPropertyValue("animation-name")
            }
            return "none" === t ? "" : t
        }, n.prototype.cacheAnimationName = function(e) {
            return this.animationNameCache.set(e, this.animationName(e))
        }, n.prototype.cachedAnimationName = function(e) {
            return this.animationNameCache.get(e)
        }, n.prototype.scrollHandler = function() {
            return this.scrolled = !0
        }, n.prototype.scrollCallback = function() {
            var e;
            return this.scrolled && (this.scrolled = !1, this.boxes = function() {
                var t, i, n, s;
                for (n = this.boxes, s = [], t = 0, i = n.length; i > t; t++) e = n[t], e && (this.isVisible(e) ? this.show(e) : s.push(e));
                return s
            }.call(this), !this.boxes.length) ? this.stop() : void 0
        }, n.prototype.offsetTop = function(e) {
            for (var t; void 0 === e.offsetTop;) e = e.parentNode;
            for (t = e.offsetTop; e = e.offsetParent;) t += e.offsetTop;
            return t
        }, n.prototype.isVisible = function(e) {
            var t, i, n, s, a;
            return i = e.getAttribute("data-wow-offset") || this.config.offset, a = window.pageYOffset, s = a + this.element.clientHeight - i, n = this.offsetTop(e), t = n + e.clientHeight, s >= n && t >= a
        }, n.prototype.util = function() {
            return this._util || (this._util = new e)
        }, n.prototype.disabled = function() {
            return !this.config.mobile && this.util().isMobile(navigator.userAgent)
        }, n
    }()
}).call(this);
var htmlMap = {
    "&": "&amp;",
    "<": "&lt;",
    ">": "&gt;",
    '"': "&quot;",
    "'": "&#39;",
    "/": "&#x2F;"
};
$(window).load(function() {
    $(".page-preloader .anim").fadeOut(), $(".page-preloader").fadeOut(), $("body").delay(350).queue(function() {
        $(this).removeClass("preload")
    })
}), $().ready(function() {
    function e() {
        $(window).width() > 767 && (window.scrollY > i ? n.addClass("top-close") : n.removeClass("top-close"))
		$(window).width() > 767 && (window.scrollY > i ? $('#left-side').addClass('nav-side-fixed') :  $('#left-side').removeClass('nav-side-fixed'))
    }
	
	
	
    var t = $(".nav-top"),
        i = t.height(),
        n = $(".nav-block");
    e(), $(window).scroll(function() {
        e()
    }), $(window).resize(function() {
        $(window).width() < 767
    });
    var s = $(".nav-main").height();
    $(".scroll-to, .navbar-nav a").click(function() {
        var e = $(this).attr("href");
        $(e).ScrollTo({
            offsetTop: s
        })
    }), $("body").scrollspy({
        offset: s
    }), (new WOW).init(), $("a[data-gal^='prettyPhoto']").prettyPhoto({
        hook: "data-gal"
    }), $(".format-code").each(function() {
        var e = escapeHtml($(this).html());
        $(this).html(e)
    }), $(".hl-code").each(function(e, t) {
        hljs.highlightBlock(t)
    }), $(".ul-toggle li").click(function() {
        $(this).toggleClass("active").find("ul").toggle("slow")
    })
}), $().ready(function() {
    
});


$(document).ready(function(){
	if ($.fn.dataTableHelper) {
	      $('.ui-datatable').dataTableHelper ()
	}
	$('#select-vehicle-table tbody tr').click(function() {
		window.location="detail.html?id=1";
	});
	
	if ($.fn.select2) {
			  $('.ui-select').select2({ 
		    	  placeholder: "Select...",theme: 'bootstrap'  
		      });
	};
	
	
	//Refresh page on orientation change
	window.addEventListener('orientationchange', function () {
       window.location.reload();
	});
	
	//
	$('#onlineModButton').on('click', function () {
		var state = $(this).attr("data-state");
		
		if(state == "LIVE"){
			//$(this).text("Offline");
			$("#online-mode-txt").html("Offline");
			$(this).addClass("btn-toggle-offline");
			$(this).removeClass("btn-toggle-online");
			$(this).attr("data-state","");
		}else{
			//$(this).text("Online");
			$("#online-mode-txt").html("Online");
			$(this).removeClass("btn-toggle-offline");
			$(this).addClass("btn-toggle-online");
			$(this).attr("data-state","LIVE");
		}
	});
	
});