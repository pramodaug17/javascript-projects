"use strict";

describe("Counter tests", function () {
    // inject the HTML fixture for the tests
    beforeEach(function() {
        var fixture = '<div id="fixture"><input id="x" type="text">' +
            '<input id="y" type="text">' +
            '<input id="add" type="button" value="Add Numbers">' +
            'Result: <span id="result" /></div>';

        document.body.insertAdjacentHTML(
            'afterbegin',
            fixture);
    });

    // remove the html fixture from the DOM
    afterEach(function() {
        document.body.removeChild(document.getElementById('fixture'));
    });

    it("checks if function is defined", function () {
        var div = domjs("#fixture");
        // Assert
        expect(div).toBeDefined();
    });

    it("checks if function is defined", function () {
        var div = domjs("#fixture");
        // Assert
        expect(div.css).toBeDefined();
    });
});