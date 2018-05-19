define([
    "../core/intoType"
], function(rcssvalue, getCssProp){
    "use strict";
    function applyCss(elem, prop, valuepattern) {
        var currVal,
            final,
            initial,
            scale = 0,
            initialInUnit,
            currentValue = function() {
                return parseFloat(getCssProp(elem, prop, ""));
            },
            unit = valuepattern[2];

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

        final = parseFloat(currVal) +
            (valuepattern[0] + 1) * parseFloat(valuepattern[1]);

        return final
    }
    return applyCss;
});