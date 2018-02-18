define([
    "./core/init",
    "./var/arr",
    "./var/isfunction",
    "./var/getPrototypeOf",
    "./var/hasOwnProp",
    "./var/fn2string",
    "./var/objFnString"
], function(init, arr, isfunction, getPrototypeOf, hasOwnProp, fn2string,
            objFnString){

domjs.extend = domjs.fn.extend = function() {
    var options, name, src, copy, copyIsArray, clone,
        target = arguments[0] || {},
        i = 1,
        length = arguments.length,
        deep = false;

    // Handle a deep copy situation
    if (typeof target === "boolean") {
        deep = target;

        // Skip the boolean and the target
        target = arguments[i] || {};
        i++;
    }

    // Handle case when target is a string or something (possible in deep copy)
    if (typeof target !== "object" && !isfunction(target)) {
        target = {};
    }

    // Extend jQuery itself if only one argument is passed
    if (i === length) {
        target = this;
        i--;
    }

    for (; i < length; i++) {

        // Only deal with non-null/undefined values
        if ((options = arguments[i]) != null) {

            // Extend the base object
            for (name in options) {
                src = target[name];
                copy = options[name];

                // Prevent never-ending loop
                if (target === copy) {
                    continue;
                }

                // Recurse if we're merging plain objects or arrays
                if (deep && copy && (domjs.isPlainObject(copy) ||
                        (copyIsArray = Array.isArray(copy)))) {

                    if (copyIsArray) {
                        copyIsArray = false;
                        clone = src && Array.isArray(src) ? src : [];

                    } else {
                        clone = src && domjs.isPlainObject(src) ? src : {};
                    }

                    // Never move original objects, clone them
                    target[name] = domjs.extend(deep, clone, copy);

                    // Don't bring in undefined values
                } else if (copy !== undefined) {
                    target[name] = copy;
                }
            }
        }
    }
};

domjs.extend({
    isPlainObject: function( obj ) {
        var proto, Cstor;

        // toString to catch host objects
        if ( !obj || toString.call( obj ) !== "[object Object]" ) {
            return false;
        }

        proto = getPrototypeOf( obj );

        // Objects with no prototype (e.g., `Object.create( null )`) are plain
        if ( !proto ) {
            return true;
        }

        // Objects with prototype are plain iff they were constructed by a
        // global Object function
        Cstor = hasOwnProp.call( proto, "constructor" ) && proto.constructor;
        return typeof Cstor === "function" && fn2string.call( Cstor ) === objFnString;
    }
});

    // Return the modified object
    return target;
});