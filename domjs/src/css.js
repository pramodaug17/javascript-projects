define([
    "./core/processFn",
    "./css/computedStyle"
], function(processFn, computedStyle){
    var rprop = /(?:([a-zA-Z]+)([+-]*=[+-]*)*(\d+)*(px)?)/;

    domjs.extend({
        style: function(elem, key, value) {
            var retVal,
            styles = computedStyle(elem);

            return retVal;
        }
    });

    domjs.fn.extend({
        css: function(prop, value){
            // processFn to get and set values
            return processFn(this, prop, value, function(elem, key, value){
                var i = 0,
                retVal;

                if(Array.isArray(key)) {
                    for(i=0; i < len; i++) {
                        retVal[key[i]] = domjs.style(elem, key[i], value);
                    }
                } else {
                    retVal = domjs.style(elem, key, value);
                }
                return retVal;
            });
        }
    });
});