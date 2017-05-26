'use strict';

var assert = require('assert');
var Promise = require('bluebird');

function defer() {
  var d = {};

  d.promise = new Promise(function(resolve, reject) {
    d.resolve = resolve;
    d.reject = reject;
  });

  return d;
}

module.exports = function() {
  describe('client-delete', function() {
    /**
     * This test ensures that the client is able to recover from a situation
     * where the server unexpectedly deletes the client and the client
     * no longer exists on the server
     */
    it('should recover from an unexpected disconnect', function() {
      var client = this.client;
      var count = 0;
      var deleteOccurred = false;
      var originalClientId;
      var serverControl = this.serverControl;

      var d = defer();
      return client.subscribe('/datetime', function() {
        if (!deleteOccurred) return;
        count++;
        if (count === 3) {
          d.resolve();
        }
      }).then(function() {
        originalClientId = client.getClientId();
        assert(originalClientId);

        return serverControl.deleteSocket(client.getClientId());
      })
      .then(function() {
        deleteOccurred = true;
      })
      .then(function() {
        return d.promise;
      })
      .then(function() {
        assert.notEqual(originalClientId, client.getClientId());
      });
    });


  });
};
