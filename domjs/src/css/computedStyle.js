define([

], function(){
    "use strict";
    function computedStyle(elem) {
        var view = elem.ownerDocument.defaultView;
        if( !view || !view.opener) {
            view = window;
        }
        return view.getComputedStyle(elem);
    }
    return computedStyle;
});