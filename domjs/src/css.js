define([
    "./core",
    "./core/accessorFn",
    "./css/var/computedStyle",
    "./css/var/getCssProp",
    "./css/var/rcssprop",
    "./css/var/rcssvalue"
], function(domjs, accessorFn, computedStyle, getCssProp, rcssprop, rcssvalue){
    "use strict";
    domjs.extend({
        cssAccessor: {}
    });

    domjs.extend({
        style: function(elem, key, value) {
            var styles = computedStyle(elem),
                cssprop = rcssprop.exec(key),
                op = [],
                currVal;

            if(value === undefined && cssprop[3] === undefined) {
                // get css value
                return getCssProp(elem, cssprop[1]);
            }
            // set css value
            if(cssprop[1] in styles){
                if(cssprop[2] && (op = (/[+|\-]/).exec(cssprop[2]) && op[1])) {
                    currVal = getCssProp(elem, cssprop[1]);
                    if(op === '+') {
                        var initial = rcssvalue.exec(currVal)[2],
                            unit = cssprop[4];
                        elem.style[cssprop[1]] = parseFloat(currVal) + parseFloat(cssprop[3]);
                    }
                }
            }
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
                }
                return retVal;
            });
        }
    });
});