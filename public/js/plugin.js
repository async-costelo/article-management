// Code reference from: https://stackoverflow.com/questions/9614622/equivalent-of-jquery-hide-to-set-visibility-hidden
(function ($) {
    $.fn.invisible = function () {
        return this.each(function () {
            $(this).css("display", "none");
        });
    };
    $.fn.visible = function () {
        return this.each(function () {
            $(this).css("display", "block");
        });
    };
}(jQuery));