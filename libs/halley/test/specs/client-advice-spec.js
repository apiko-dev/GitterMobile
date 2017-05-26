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
  describe('client-advice', function() {

    it('should handle advice retry', function() {
      var publishOccurred = false;
      var client = this.client;

      var d = defer();

      return client.subscribe('/datetime', function() {
          if (!publishOccurred) return;
          d.resolve();
        })
        .then(function() {
          return client.publish('/advice-retry', { data: 1 });
        })
        .then(function() {
          publishOccurred = true;
        })
        .then(function() {
          return d.promise;
        })
    });

    /**
     * Tests to ensure that after receiving a handshake advice
     */
    it('should handle advice handshake', function() {
      var client = this.client;
      var originalClientId;
      var rehandshook = false;
      var d = defer();

      return client.subscribe('/datetime', function() {
          if (!rehandshook) return;
          d.resolve();
        })
        .then(function() {
          originalClientId = client.getClientId();

          client.once('connected', function() {
            rehandshook = true;
          });

          return client.publish('/advice-handshake', { data: 1 });
        })
        .then(function() {
          return d.promise;
        })
        .then(function() {
          assert(client.getClientId());
          assert.notEqual(client.getClientId(), originalClientId);
        });
    });

    /**
     * Ensure the client is disabled after advice:none
     */
    it('should handle advice none', function() {
      var client = this.client;
      var d = defer();

      client.once('disabled', function() {
        d.resolve();
      });

      client.publish('/advice-none', { data: 1 });

      return d.promise
        .then(function() {
          assert(client.stateIs('DISABLED'));

          // Don't reconnect
          return client.publish('/advice-none', { data: 1 })
            .then(function() {
              assert.ok(false);
            }, function(err) {
              assert.strictEqual(err.message, 'Client disabled');

              return client.reset();    
            });
        });

    });

  });

};
