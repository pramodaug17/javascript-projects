define([
    "./core",
    "./core/intoType",
    "./css/applyCss"
], function(domjs, intoType, applyCss){
    var rprop = /(?:([a-zA-Z]+)([+-]*=[+-]*)*(\d+)*(px)?)/;
    domjs.fn.extend({
        css: function(prop, value){
            // TODO: use processFn to get and set values
            return applyCss(this, prop, value);
        }
    });
});