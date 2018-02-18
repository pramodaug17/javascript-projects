define( [
    "./core"
], function( domjs, noGlobal ) {

    "use strict";

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

} );