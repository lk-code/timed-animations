jQuery.fn.timedAnimations = function (options) {

    var defaults = {
        timingOffset: 5000
    };

    var settings = $.extend({}, defaults, options);

    var instancedElements = [];

    var methods = {
        init: function (element) {
            var me = this;

            methods.registerEvents(element);

            instancedElements.push(element);
        },

        registerEvents: function (element) {
            var me = this;

            $.each($(element), function (index, element) {
                // $(window).on("scroll", $.proxy(me.onWindowScroll, me));
            });
        },

        registerGlobalEvents: function () {
            var me = this;

            $(window).on("scroll", $.proxy(me.onWindowScroll, me));
        },

        isElementInViewport: function (element) {
            var me = this;

            console.log('isElementInViewport');

            var elementTop = $(element).offset().top;
            var elementBottom = elementTop + $(element).outerHeight();

            var viewportTop = $(window).scrollTop();
            var viewportBottom = viewportTop + $(window).height();

            var isElementInViewport = (elementBottom > viewportTop && elementTop < viewportBottom);

            return isElementInViewport;
        },

        onWindowScroll: function (element) {
            var me = this;

            $.each(instancedElements, function (index, element) {
                if ($(element).data('ta-started') != 'true'
                    && methods.isElementInViewport(element)) {

                    $(element).data('ta-started', 'true');

                    methods.startAnimation(element);
                }
            });
        },

        startAnimation: function (element) {
            var me = this;
        },
    };

    return this.each(function () {
        methods.init($(this));
        methods.registerGlobalEvents();
    });
};