describe("Core part of domJs", function() {
    it("should have function fn defined", function () {
        expect(domjs.fn).toBeDefined();
    });

    it("should have extend function defined", function () {
        expect(domjs.extend).toBeDefined();
    });

    it("should add function x to domjs", function () {
        // arrange
        domjs.extend({
            x: function () {}
        });
        expect(domjs.x).toBeDefined();
    });

    it("should have function isPlainObject defined", function () {
        expect(domjs.isPlainObject).toBeDefined();
    });

    it("should have function each", function () {
        expect(domjs.each).toBeDefined();
    });
});