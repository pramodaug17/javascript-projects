define([
    "./isFn",
    "./iswindowObj",
    "../core/intoType"
], function(isFn, iswindowObj, intoType){
    return function ( obj ) {

        // Support: real iOS 8.2 only (not reproducible in simulator)
        // `in` check used to prevent JIT error (gh-2145)
        // hasOwn isn't used here due to false negatives
        // regarding Nodelist length in IE
        var len = !!obj && "length" in obj && obj.length,
            type = intoType( obj );

        if ( isFn( obj ) || iswindowObj( obj ) ) {
            return false;
        }

        return type === "array" || len === 0 ||
            typeof len === "number" && len > 0 && ( len - 1 ) in obj;
    };
});