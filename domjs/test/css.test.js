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
        var b = window.getComputedStyle(document.body).getPropertyValue("width");
        // Assert
        expect(divwidth).toEqual(b);
    });

    it("should set css property value", function () {
        var w = 100;
        var div = domjs("#fixture");
        div.css("width=" + w +"px");
        // document.getElementById("fixture").style.width = '100px';
        var divwidth = div.css("width");
        // Assert
        expect(divwidth).toEqual(w + "px");
    });

    it("should increment css property value", function () {
        var o = 100;
        var divwidth = domjs("#fixture").css("width+=" + o + "px");
        var b = window.getComputedStyle(document.body).getPropertyValue("width");
        var w = parseFloat(b) + o;

        // Assert
        expect(divwidth.css("width")).toEqual(w + "px");
    });
});