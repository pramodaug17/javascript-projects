define([
    // Files to include
], function () {
    "use strict";
    function regconcat(reg1, reg2) {
        var count = function(r, str) {
            return str.match(r).length;
        };
        var numberGroups = /([^\\]|^)(?=\((?!\?:))/g; // Home-made regexp to count groups.
        var offset = count(numberGroups, reg1.source);
        var escapedMatch = /[\\](?:(\d+)|.)/g;        // Home-made regexp for escaped literals, greedy on numbers.
        var r2newSource = reg2.source.replace(escapedMatch,
            function(match, number) {
                return number?"\\"+(number-0+offset):match;
            });

        return new RegExp(reg1.source + r2newSource.source,
            (reg1.global || reg2.global ? 'g' : '') +
            (reg1.ignoreCase || reg2.ignoreCase ? 'i' : '') +
            (reg1.multiLine || reg2.multiLine ? 'm' : '')
            )
    }
    return regconcat;
});