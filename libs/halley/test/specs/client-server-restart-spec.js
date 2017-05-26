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
  describe('client-server-restart', function() {
    it('should deal with a server restart', function() {
      var client = this.client;
      var count = 0;
      var postOutageCount = 0;
      var outageTime;
      var clientId;
      var d = defer();
      var serverControl = this.serverControl;

      return client.subscribe('/datetime', function() {
        count++;

        if (count === 3) {
          clientId = client.getClientId();

          return serverControl.restart()
            .then(function() {
              outageTime = Date.now();
            })
            .catch(function(err) {
              d.reject(err);
            });
        }

        if (!outageTime) return;

        postOutageCount++;

        if (postOutageCount >= 3) {
          d.resolve();
        }
      }).then(function() {
        return d.promise;
      })
      .then(function() {
        // A disconnect should not re-initialise the client
        assert.strictEqual(clientId, client.getClientId());
      });
    });

  });
};
