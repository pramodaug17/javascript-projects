define([
    "../core/intoType"
], function(intoType){
    "use strict";
    function applyCss(elem, prop, value) {
        var cssprop = [null, null, null , null],
            style, key, operator, valueprefix;
        if("string"  === intoType(prop)) {
            // "width=100px" "width=+10" "width=-10" "width+=10" "width-=10"
            // "width"
            cssprop = rprop.exec(prop);
            key = cssprop[1];
            operator = cssprop[2];
            value = cssprop[3] === null ? value: cssprop[3];
            valueprefix = cssprop[4];
        } else if("array" === intoType(prop)) {
            // ["width=100px","height+=10","width-=10","width=-10",
            // "width=+10"]
        } else if( "object" === intoType(prop)) {
            // {width : "+10"}, {width: "10px"}
        } else {
            // is not correct format
        }

        style = elem.style;
        //check if style property is predefined of new
        var isCustomProp = (style && (style[prop]));

        if(value !== undefined && value !== null) {
            if(isCustomProp) {
                // calculate value

                // set value
                elem.setProperty(key, value)
            } else {
                var currValue;
                // calculate value
                currValue = 3;
                operator = operator.replace("=", "");
                if(operator === "+"){
                    // increment value by passed value
                } else if(operator === "-") {
                    // decrement value by passed value
                } else{
                    // replace value by passed value
                }

                //set value
                style[key] = value;
            }
        } else {
            // get value and return
        }
    }
    return applyCss;
});