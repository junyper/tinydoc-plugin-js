var assert = require('assert');
var TestUtils = require('../../TestUtils');
var K = require('../../constants');

var parseInline = TestUtils.parseInline;

describe('CJS::Parser - @method tag', function() {
  it('it accepts a dynamically generated method', function() {
    var docs = parseInline(function() {
      // /** @module */
      //  function Compiler() {
      //
      //    /**
      //     * @method on
      //     *
      //     * @param {String} event
      //     *        The event to bind to.
      //     */
      //    EventEmitter.call(this);
      //  }
    });

    assert.equal(docs.length, 2);
    assert.equal(docs[0].id, 'on');
    assert.equal(docs[0].receiver, 'Compiler');
    assert.equal(docs[0].ctx.type, K.TYPE_FUNCTION);
  });

  it('it accepts multiple dynamically generated methods in the same docstring', function() {
    var docs = parseInline(function() {
      // /** @module */
      //  function Compiler() {
      //
      //    /**
      //     * @method on
      //     *
      //     * @param {String} event
      //     *        The event to bind to.
      //     * @param {Function} callback
      //     */
      //
      //    /**
      //     * @method off
      //     *
      //     * @param {String} event
      //     * @param {Function} callback
      //     */
      //    EventEmitter.call(this);
      //  }
    });

    assert.equal(docs.length, 3);
    assert.deepEqual(docs.map(function(d) { return d.id; }).sort(), [
      'Compiler', 'off', 'on'
    ]);
  });
});