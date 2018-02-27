define([
    "../var/isFn"
], function(isFn){
    "use strict";
    function processFn(elems, key, value, callback){
        var len = elems,
            retVal,
            i = 0,
            isValueFn = false;

        if(intoType(key) === "object")
        {
            for( i in key) {
                processFn(elems, i, key[i], callback)
            }
        }

        if(value !== undefined) {
            isValueFn = isFn(value);
        }
        if(callback) {
            for(i = 0; i < len; i++ ) {
                retVal = callback(elems[i], key, isValueFn ?
                    value.call(elems[i],i):
                    value);
            }
        }
        return retVal;
    }
    return processFn;
});