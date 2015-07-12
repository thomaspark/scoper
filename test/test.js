var assert = require("assert");
var jsdom = require("jsdom").jsdom;
document = jsdom("<html/>");

var scoper = require("../scoper.js");

describe("Regex", function() {
  describe("Simple rules", function () {
    it("should prepend rule with #scoper-1", function() {
      var rule = "h1 {font-size: 4em;}";
      var expected = "\n#scoper-1 " + rule;
      var actual = scoper.scoper("#scoper-1", rule);

      assert.equal(expected, actual);
    });
  });

  describe("Quoted values", function () {
    it("should prepend rule with #scoper-1", function() {
      var rule = "h1 {\n\tfont-family: \"Helvetica Neue\", Helvetica, Arial, sans-serif;\n}";
      var expected = "\n#scoper-1 " + rule;
      var actual = scoper.scoper("#scoper-1", rule);

      var rule2 = "h1 {\n\tfont-family: \'Helvetica Neue\', Helvetica, Arial, sans-serif;\n}";
      var expected2 = "\n#scoper-1 " + rule;
      var actual2 = scoper.scoper("#scoper-1", rule);

      assert.equal(expected, actual);
      assert.equal(expected2, actual2);
    });
  });

});
