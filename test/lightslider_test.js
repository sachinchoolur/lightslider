(function($) {
    test("chainable", function() {
        ok($("#qunit-fixture").lightSlider().addClass("chainable"), "can be chained");
        equal($("#qunit-fixture").hasClass("chainable"), true, "class was added correctly from chaining");
    });
}(jQuery));