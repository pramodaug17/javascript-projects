define([

], function(){
    "use strict";
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

});