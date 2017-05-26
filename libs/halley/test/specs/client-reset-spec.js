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
  describe('client-reset', function() {
    it('a reset should proceed normally', function() {
      var client = this.client;
      var originalClientId;
      var rehandshook = false;
      var count = 0;
      var postResetCount = 0;
      var d = defer();

      return client.subscribe('/datetime', function() {
          count++;
          if (count === 1) {
            originalClientId = client.getClientId();
            assert(originalClientId);
            client.reset();

            client.once('connected', function() {
              rehandshook = true;
            });

            return;
          }

          if (rehandshook) {
            postResetCount++;

            // Wait for two messages to arrive after the reset to avoid
            // the possiblity of a race condition in which a message
            // arrives at the same time as the reset
            if (postResetCount > 3) {
              d.resolve();
            }
          }
        })
        .then(function() {
          return d.promise;
        })
        .then(function() {
          assert(client.getClientId());
          assert(client.getClientId() !== originalClientId);
        });
    });


  });

};
