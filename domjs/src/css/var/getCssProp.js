define([
    "./computedStyle"
], function (computedStyle) {
    "use strict";
    return function (elem, prop) {
        return elem.style[prop] !== ""?
            elem.style[prop]:
            computedStyle(elem).getPropertyValue(prop);
    }
});