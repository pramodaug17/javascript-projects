define([
    "./core",
    "./core/accessorFn",
    "./css/var/computedStyle",
    "./css/var/getCssProp",
    "./css/var/rcssprop",
    "./css/var/rcssvalue",
    "./css/applyCss"
], function(domjs, accessorFn, computedStyle, getCssProp, rcssprop, rcssvalue,
            applyCss){
    "use strict";
    domjs.extend({
        cssAccessor: {}
    });

    domjs.extend({
        style: function(elem, key, value, option) {
            var styles = computedStyle(elem),
                cssprop = rcssprop.exec(key),
                isNum = false,
                key;

            // Remove input
            cssprop.shift();
            key = cssprop.shift();
            value = value || (cssprop[1] ? cssprop[1]: undefined);

            if(value === undefined) {
                // get css value
                return getCssProp(elem, key, option);
            }

            // set css value
            if(key in styles) {
                // check for += or +
                if (cssprop && cssprop[0]) {
                    value = applyCss(elem, key, cssprop);
                    isNum = true;
                }
            }

            if(isNum) {
                value += (cssprop[2] || "px");
            }

            elem.style[key] = value;
        }
    });

    domjs.fn.extend({
        css: function(prop, value){
            // processFn to get and set values
            return accessorFn(this, prop, value, function(elem, key, value){
                var i = 0,
                    len = 0,
                    retVal,
                    arrVal = [];

                if(Array.isArray(key)) {
                    len = key.length;
                    for(i=0; i < len; i++) {
                        arrVal[key[i]] = domjs.style(elem, key[i], value);
                    }
                    return arrVal;
                } else {
                    retVal = domjs.style(elem, key, value);
                    // console.log("style: " + elem.style.width)
                }
                return retVal;
            });
        }
    });
});