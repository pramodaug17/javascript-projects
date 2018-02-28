define([
    "./computedStyle"
], function (computedStyle) {
    "use strict";
    return function (elem, prop, option) {
        return elem.style[prop] !== "" && option === undefined?
            elem.style[prop]:
            computedStyle(elem).getPropertyValue(prop);
    }
});