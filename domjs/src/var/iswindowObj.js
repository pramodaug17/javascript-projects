define( function(){
    "use strict";
    return function ( obj ) {
        return obj != null && obj === obj.window;
    };
});