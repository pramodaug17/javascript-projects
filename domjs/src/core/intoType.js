define( [
    "../var/classType",
    "../var/toStringfn"
], function( classType, toStringfn ) {
    "use strict";
    function intoType( obj ) {
        if ( obj == null ) {
            return obj + "";
        }

        return typeof obj === "object" || typeof obj === "function" ?
            classType[ toStringfn.call( obj ) ] || "object" :
            typeof obj;
    }
    return intoType;
} );