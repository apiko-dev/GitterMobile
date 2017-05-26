'use strict';

var sinon = require('sinon');
var Promise = require('bluebird');
var assert = require('assert');

module.exports = function() {
  describe('websocket-transport', function() {

    it('should connect', function() {
      return this.websocket.connect();
    });

    it('should cancel connect', function() {
      var connect = this.websocket.connect();
      connect.cancel();
      return Promise.delay(100)
        .bind(this)
        .then(function() {
          assert(connect.isCancelled());
          assert(!this.websocket._socket);
          assert.strictEqual(this.websocket._connectPromise, null);
        });
    });

    it('should notify on close', function() {
      var mock = sinon.mock(this.dispatcher);
      mock.expects("handleError").once();

      return this.websocket.connect()
        .bind(this)
        .then(function() {
          this.websocket.close();
          mock.verify();
        });
    });

  });
};
