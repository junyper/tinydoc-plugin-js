var assert = require('assert');
var TestUtils = require('../../TestUtils');
var parseInline = TestUtils.parseInline;

describe('CJS::Parser - @module support', function() {
  it('works with anything tagged as @module', function() {
    var docs = parseInline(function() {
      // /** @module */
      // var DragonHunter = {};
      //
      // DragonHunter.capture = function() {
      // };
    });

    assert.equal(docs.length, 1);
    assert.ok(docs[0].isModule, 'it marks the doc as module');
  });

  it('should use the overridden module Id as the module name', function() {
    var docs = parseInline(function() {
      // /**
      //  * @module Something
      //  */
      // var Cache = {};
    });

    assert.equal(docs.length, 1);
    assert.equal(docs[0].name, 'Something');
  });

  it('should work with imported modules using ES6 destructuring', function() {
    var docs = parseInline(function() {
      // /**
      //  * @namespace Core
      //  * @module
      //  */
      //  var { Something } = require('Something');
      //
      // /**
      //  * Do something.
      //  */
      // Something.someFunc = function() {
      // };
    });

    assert.equal(docs.length, 2);
    assert.equal(docs[0].name, 'Something');
    assert.equal(docs[0].namespace, 'Core');
    assert.equal(docs[0].ctx.type, 'object');

    assert.equal(docs[1].name, 'someFunc');
    assert.equal(docs[1].receiver, 'Core.Something');
    assert.equal(docs[1].ctx.type, 'function');
  });

  describe('@module with an inline namespace', function() {
    it('should use the overridden module Id as the module name', function() {
      var docs = parseInline(function() {
        // /**
        //  * @module Core.Something
        //  */
        // var Cache = {};
      });

      assert.equal(docs.length, 1);
      assert.equal(docs[0].namespace, 'Core');
      assert.equal(docs[0].name, 'Something');
      assert.equal(docs[0].id, 'Core.Something');
    });

    it('should work with a nested namespace', function() {
      var docs = parseInline(function() {
        // /**
        //  * @module Core.Data.Something
        //  */
        // var Cache = {};
      });

      assert.equal(docs.length, 1);
      assert.equal(docs[0].namespace, 'Core.Data');
      assert.equal(docs[0].name, 'Something');
      assert.equal(docs[0].id, 'Core.Data.Something');
    });
  });
});