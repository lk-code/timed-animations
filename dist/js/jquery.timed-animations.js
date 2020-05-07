/*!
 * jQuery Timed Animations - https://github.com/lk-code/timed-animations
 * Version - 1.0.0
 * Licensed under the MIT license - http://opensource.org/licenses/MIT
 *
 * Copyright (c) 2020 Lars Krämer
 */

jQuery.fn.timedAnimations = function (options) {

    var defaults = {
        timingOffset: 0, /* animation offset in milliseconds */
        animationName: '', /* the css animation name */
    };

    var settings = $.extend({}, defaults, options);

    var instancedElements = [];

    var methods = {
        init: function (element) {
            var me = this;

            methods.registerEvents(element);

            instancedElements.push(element);
        },

        /**
         * registers all element-based events
         */
        registerEvents: function (element) {
            var me = this;

            $.each($(element), function (index, element) {
                // $(window).on("scroll", $.proxy(me.onWindowScroll, me));
            });
        },

        /**
         * registers all global events for this plugin
         */
        registerGlobalEvents: function () {
            var me = this;

            $(window).on("scroll", $.proxy(me.onWindowScroll));
        },

        /**
         * returns true if the given element is in the current viewport
         * 
         * @param element 
         */
        isElementInViewport: function (element) {
            var me = this;

            var elementTop = $(element).offset().top;
            var elementBottom = elementTop + $(element).outerHeight();

            var viewportTop = $(window).scrollTop();
            var viewportBottom = viewportTop + $(window).height();

            var isElementInViewport = (elementBottom > viewportTop && elementTop < viewportBottom);

            return isElementInViewport;
        },

        /**
         * executed if the event 'scroll' for window is triggered
         */
        onWindowScroll: function () {
            var me = this;

            methods.checkElements();
        },

        /**
         * process every element
         */
        checkElements: function () {
            var me = this;

            $.each(instancedElements, function (index, element) {
                methods.processCssAnimationInElement(element);

                if ($(element).data('ta-started') != 'true'
                    && methods.isElementInViewport(element)) {

                    $(element).data('ta-started', 'true');

                    var animationStartOffset = methods.getStartOffsetOfElement(element);

                    window.setTimeout(function () {
                        methods.startAnimation(element);
                    }, animationStartOffset);
                }
            });
        },

        /**
         * 
         * @param element
         */
        processCssAnimationInElement: function (element) {
            var me = this;

            var cssAnimationName = $(element).css('animation-name');

            if(cssAnimationName && cssAnimationName != 'none') {
                $(element).css('animation-name', 'none')
                $(element).data('ta-animation-name', cssAnimationName);
            }
        },

        /**
         * returns the animation offset in milliseconds for the given element
         * 
         * @param element
         */
        getStartOffsetOfElement: function (element) {
            var me = this;

            var offset = settings.timingOffset;
            var elementOffset = $(element).data('ta-start');

            if (elementOffset >= 0) {
                offset = elementOffset;
            }

            return offset;
        },

        /**
         * returns the animation name (css) for the given element
         * 
         * @param element
         */
        getAnimationNameOfElement: function (element) {
            var me = this;

            var animationName = settings.animationName;
            var elementAnimationName = $(element).data('ta-animation-name');

            if (elementAnimationName && elementAnimationName.length > 0) {
                animationName = elementAnimationName;
            }

            return animationName;
        },

        /**
         * 
         * @param element 
         * @param animationName 
         */
        setAnimationForElement: function (element, animationName) {
            var me = this;

            $(element).css('animation-name', animationName);
        },

        /**
         * starts the animation for the given element
         * 
         * @param element 
         */
        startAnimation: function (element) {
            var me = this;

            var animationName = methods.getAnimationNameOfElement(element);
            if (animationName && animationName.length > 0) {
                methods.setAnimationForElement(element, animationName);
                return;
            }

            methods.processStoryboarding();
        },

        /**
         * 
         * @param element 
         * @param animationName 
         */
        processStoryboarding: function (element) {
            var me = this;
        },
    };

    this.each(function () {
        methods.init($(this));
    });

    methods.registerGlobalEvents();
    methods.checkElements();

    return;
};