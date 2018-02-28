define([
    "../core/intoType"
], function(rcssvalue, getCssProp){
    "use strict";
    function applyCss(elem, prop, valuepattern) {
        var currVal,
            initial,
            scale = 0,
            initialInUnit,
            currentValue = function() {
                return parseFloat(getCssProp(elem, prop, ""));
            },
            unit = valuepattern[3];

        currVal = getCssProp(elem, prop);
        initial = rcssvalue.exec(currVal)[3];

        // convert unit is both unit is different
        if ( initial !== unit ) {
            currVal = parseFloat(currVal) / 2;
            unit = unit || initial;

            // Iteratively approximate from a nonzero starting point
            initialInUnit = +currVal || 1;

            while ( (scale * scale) !== 1 ) {
                domjs.style( elem, prop, initialInUnit + unit );
                scale = currentValue() / currVal || 0.5 ;
                initialInUnit = initialInUnit / scale;

            }

            initialInUnit = initialInUnit * 2;
            domjs.style( elem, prop, initialInUnit + unit );
            currVal = initialInUnit;
        }

        if (-1 !== valuepattern[1].indexOf('+')) {

            elem.style[prop] = (parseFloat(currVal) +
                parseFloat(valuepattern[2])) + unit;
        } else if (-1 !== valuepattern[1].indexOf('-')) {
            elem.style[prop] = (parseFloat(currVal) -
                parseFloat(valuepattern[2])) + unit;
        } else {
            elem.style[prop] = valuepattern[2];
        }
    }
    return applyCss;
});