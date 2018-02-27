define([
    "../var/isFn",
    "./intoType"
], function(isFn, intoType){
    "use strict";
    function accessorFn(elems, key, value, callback){
        var len = elems.length,
            chainable = false,
            retVal,
            i = 0,
            isValueFn = false;

        if(intoType(key) === "object")
        {
            chainable = true;
            for( i in key) {
                accessorFn(elems, i, key[i], callback)
            }
        }

        if(value !== undefined) {
            isValueFn = isFn(value);
        }
        if(callback) {
            for(i = 0; i < len; i++) {
                retVal = callback(elems[i], key, isValueFn ?
                    value.call(elems[i], i) :
                    value);
            }
        }
        if(chainable || retVal === undefined)
            return elems;
        return retVal;
    }
    return accessorFn;
});