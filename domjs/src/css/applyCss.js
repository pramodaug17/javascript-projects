define([
    "../core/intoType"
], function(intoType){
    "use strict";
    function applyCss(prop, value) {
        var cssprop;
        if("string"  === intoType(prop)) {
            // "width=100px" "width=+10" "width=-10" "width+=10" "width-=10"
            // "width"
            cssprop = rprop.exec(prop);
            if(null === cssprop[3] || undefined === value) {
                // get CSS property
            }
        } else if("array" === intoType(prop)) {
            // ["width=100px","height+=10","width-=10","width=-10",
            // "width=+10"]
        } else if( "object" === intoType(prop)) {
            // {width : "+10"}, {width: "10px"}
        } else {
            // is not correct format
        }
    }
    return applyCss;
});