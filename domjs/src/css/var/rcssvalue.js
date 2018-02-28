define([
    // Files to include
], function (rnum) {
    "use strict";
    return new RegExp("([+\\-]=)?" +
        rnum.source +
        "(p[txc]|e[mx]|[cm]m|v[hw]|(?:vm)?in|%)?)");
});