"use strict";

describe("Counter tests", function () {
    // inject the HTML fixture for the tests
    beforeEach(function() {
        var fixture = '<div id="fixture" style="border-bottom:1px;"><input id="x" type="text">' +
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
        var div = d$("#fixture");
        // Assert
        expect(div).toBeDefined();
    });

    it("should return css property value", function () {
        var divwidth = domjs("#fixture").css("width");

        // Assert
        expect(divwidth).toEqual("1254px");
    });

    it("should return css property value", function () {
        var divwidth = domjs("#fixture").css("position");

        // Assert
        expect(divwidth).toEqual("1254px");
    });

    it("should set css property value", function () {
        var divwidth = domjs("#fixture").css("width=100px");
        console.info(divwidth);

        // Assert
        expect(divwidth.css("width")).toEqual("100px");
    });

    it("should increment css property value", function () {
        var divwidth = domjs("#fixture").css("width+=100px");
        console.info(divwidth);

        // Assert
        expect(divwidth.css("width")).toEqual("1354px");
    });

});