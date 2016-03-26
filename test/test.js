var assert = require("assert");
var jsdom = require("jsdom").jsdom;
document = jsdom("<html/>");

var scoper = require("../scoper.js");

describe("Regex", function() {
  describe("Basic rules", function () {
    it("should prepend selector with #scoper-1", function() {
      var rule = "h1 {\n" +
                 "  font-size: 4em;\n" +
                 "}";
      var expected = "#scoper-1 " + rule;
      var actual = scoper.scoper(rule, "#scoper-1");

      assert.equal(expected, actual);
    });
  });

  describe("Quoted values", function () {
    it("should prepend selector with #scoper-1", function() {
      var rule = "h1 {\n" +
                 "  font-family: \"Helvetica Neue\", Helvetica, Arial, sans-serif;\n" +
                 "}";
      var expected = "#scoper-1 " + rule;
      var actual = scoper.scoper(rule, "#scoper-1");

      var rule2 = "h1 {\n" +
                 "  font-family: \'Helvetica Neue\', Helvetica, Arial, sans-serif;\n" +
                 "}";
      var expected2 = "#scoper-1 " + rule;
      var actual2 = scoper.scoper(rule, "#scoper-1");

      assert.equal(expected, actual);
      assert.equal(expected2, actual2);
    });
  });

  describe("Media queries", function () {
    it("should prepend selector but not @media with #scoper-1", function() {
      var rule = "@media (max-width: 600px) {\n" +
                 "  h1 {\n" +
                 "    font-family: \"Helvetica Neue\", Helvetica, Arial, sans-serif;\n" +
                 "  }" +
                 "}";
      var expected = "@media (max-width: 600px) {\n" +
                 "  #scoper-1 h1 {\n" +
                 "    font-family: \"Helvetica Neue\", Helvetica, Arial, sans-serif;\n" +
                 "  }" +
                 "}";
      var actual = scoper.scoper(rule, "#scoper-1");

      assert.equal(expected, actual);
    });
  });

  describe("CSS animations", function () {
    it("should not prepend @keyframes with #scoper-1", function() {
      var rule = "@keyframes animation {\n" +
               "  from {\n" +
               "    background-color: red;\n" +
               "  }" +
               "  to {\n" +
               "    background-color: yellow;\n" +
               "  }" +
               "}";
      var expected = rule;
      var actual = scoper.scoper(rule, "#scoper-1");

      assert.equal(expected, actual);
    });
  });

  describe("Font faces", function () {
    it("should not prepend @font-face with #scoper-1", function() {
      var rule = "@font-face {\n" +
               "  font-family: 'MyWebFont';\n" +
               "  src: url('myfont.woff2') format('woff2');\n" +
               "       url('myfont.woff') format('woff');\n" +
               "}";
      var expected = rule;
      var actual = scoper.scoper(rule, "#scoper-1");

      assert.equal(expected, actual);
    });
  });

  describe("Scope pseudoclasses", function () {
    it("should replace :scope with #scoper-1 > child", function() {
      var rule = ":scope {\n" +
                 "  border: 1px solid blue;\n" +
                 "}";
      var expected = "#scoper-1 > * {\n" +
                 "  border: 1px solid blue;\n" +
                 "}";
      var actual = scoper.scoper(rule, "#scoper-1");

      var rule2 = "div:scope {\n" +
                 "  border: 1px solid blue;\n" +
                 "}";
      var expected2 = "#scoper-1 > div {\n" +
                 "  border: 1px solid blue;\n" +
                 "}";
      var actual2 = scoper.scoper(rule2, "#scoper-1");

      assert.equal(expected, actual);
      assert.equal(expected2, actual2);
    });
  });

});
