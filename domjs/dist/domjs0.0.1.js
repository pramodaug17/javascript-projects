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


var isfunction = function ( obj ) {

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

var iswindowObj = function ( obj ) {
        return obj != null && obj === obj.window;
    };

var isLikeArray = function ( obj ) {

        // Support: real iOS 8.2 only (not reproducible in simulator)
        // `in` check used to prevent JIT error (gh-2145)
        // hasOwn isn't used here due to false negatives
        // regarding Nodelist length in IE
        var length = !!obj && "length" in obj && obj.length,
            type = toType( obj );

        if ( isfunction( obj ) || iswindowObj( obj ) ) {
            return false;
        }

        return type === "array" || length === 0 ||
            typeof length === "number" && length > 0 && ( length - 1 ) in obj;
    };

var
        version = "0.0.1",

        // Define a local copy of jQuery
        domjs = function( selector, context ) {

            // The jQuery object is actually just the init constructor 'enhanced'
            // Need init if jQuery is called (just allow error to be thrown if not included)
            return new jQuery.fn.init( selector, context );
        }

    domjs.extend = domjs.fn.extend = function() {
        var options, name, src, copy, copyIsArray, clone,
            target = arguments[0] || {},
            i = 1,
            length = arguments.length,
            deep = false;

        // If first argument is boolean then user want deep copy
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

        // Extend domjs itself if only one argument is passed
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
        },
        each: function( obj, callback ) {
            var length, i = 0;

            if ( isLikeArray( obj ) ) {
                length = obj.length;
                for ( ; i < length; i++ ) {
                    if ( callback.call( obj[ i ], i, obj[ i ] ) === false ) {
                        break;
                    }
                }
            } else {
                for ( i in obj ) {
                    // check is hasOwn needs to check
                    if ( callback.call( obj[ i ], i, obj[ i ] ) === false ) {
                        break;
                    }
                }
            }

            return obj;
        }
    });

    // Return the modified object


    var

        // Map over domjs in case of overwrite
        _domjs = window.domjs,

        // Map over the d$ in case of overwrite
        _d$ = window.d$;

    domjs.noConflict = function( deep ) {
        if ( window.d$ === domjs ) {
            window.d$ = _d$;
        }

        if ( deep && window.domjs === domjs ) {
            window.domjs = _domjs;
        }

        return domjs;
    };

    if ( !noGlobal ) {
        window.domjs = window.d$ = domjs;
    }




    return domjs;
} );
