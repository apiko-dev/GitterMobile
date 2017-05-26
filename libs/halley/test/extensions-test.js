'use strict';

var Extensions = require('../lib/protocol/extensions');
var assert = require('assert');

describe('extensions', function() {

  it('should call extensions in sequence', function() {
    var count = 0;

    function Ext(x) {
      this.incoming = function(message, callback) {
        assert.strictEqual(count, 0);
        assert.strictEqual(message.count, x - 1);
        count++;

        setTimeout(function() {
          count--;
          message.count = x;
          callback(message);
        }, 2);
      }
    }
    var extensions = new Extensions();

    extensions.add(new Ext(1));
    extensions.add(new Ext(2));
    extensions.add(new Ext(3));
    extensions.add(new Ext(4));
    extensions.add(new Ext(5));
    extensions.add(new Ext(6));

    return extensions.pipe('incoming', { count: 0 })
      .then(function(message) {
        assert.deepEqual(message, { count: 6 });
      });
  });

});
