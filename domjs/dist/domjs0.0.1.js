( function( global, factory ) {

    "use strict";

    if ( typeof module === "object" && typeof module.exports === "object" ) {

        // For CommonJS and CommonJS-like environments where a proper `window`
        // is present, execute the factory and get domjs.
        // For environments that do not have a `window` with a `document`
        // (such as Node.js), expose a factory as module.exports.
        // This accentuates the need for the creation of a real `window`.
        // e.g. var domjs = require("domjs")(window);
        // See ticket #14549 for more info.
        module.exports = global.document ?
            factory( global, true ) :
            function( w ) {
                if ( !w.document ) {
                    throw new Error( "domjs requires a window with a document" );
                }
                return factory( w );
            };
    } else {
        factory( global );
    }

// Pass this if window is not defined yet
} )( typeof window !== "undefined" ? window : this, function( window, noGlobal ) {

    "use strict";


var arr = [];


var rselector=/(?:\s*<([\w\W]{3})>|#([\w-\W]+[\w\W]$))/,
    init = domjs.fn.init = function(selector){
        var match, elem;
        // for d$(""), d$(null), d$(), d$(false)
        if(!selector)
            return this;

        if(typeof selector === "string") {
            // for d$("<div>"), d$("#id")
            match = rselector.exec(selector);

            // html tags
            if (match && match[1]) {
                // Do nothing as of now;
            } else {    // find by id
                elem = document.getElementById(match[2]);
                if (elem) {
                    this[0] = elem;
                    this.length = 1;
                }
                return this;
            }
        // d$(DOMElement)
        }else if(selector.nodeType) {
            this[0] = selector;
            this.length = 1;

            return this;
        }

        return this;
    };

init.prototype = domjs.fn;


var isfunction = function isfunction( obj ) {

        // Support: Chrome <=57, Firefox <=52
        // In some browsers, typeof returns "function" for HTML <object> elements
        // (i.e., `typeof document.createElement( "object" ) === "function"`).
        // We don't want to classify *any* DOM node as a function.
        return typeof obj === "function" && typeof obj.nodeType !== "number";
    };


var getPrototypeOf = Object.getPrototypeOf;

var classType = {};

var hasOwnProp = classType.hasOwnProperty;

var fn2string = hasOwnProp.toString;

var objFnString = fn2string.call( Object );

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


    return domjs;
} );
