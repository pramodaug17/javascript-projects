define([
    // Files to include
    "./rcssvalue"
], function (rcssvalue) {
    "use strict";
    return new RegExp("(?:([a-zA-Z\\-]+)([+\\-]?=[+\\-]?)?" +
        rcssvalue.source +
        "?)"
    );
});