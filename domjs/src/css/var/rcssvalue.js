define([
    // Files to include
    "../../var/rnum"
], function (rnum) {
    "use strict";
    return new RegExp("(?:([+\\-])?=)?(" +
        rnum.source +
        "(p[txc]|e[mx]|[cm]m|v[hw]|(?:vm)?in|%)?)");
});