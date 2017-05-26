'use strict';

var assert = require('assert');
var Promise = require('bluebird');

module.exports = function() {
  describe('client-connect', function() {

    it('should not timeout on empty connect messages', function() {
      var client = this.client;
      var connectionWentDown = false;
      client.on('connection:down', function() {
        connectionWentDown = true;
      });

      return client.connect()
        .then(function() {
          return Promise.delay(client._advice.timeout + 1000);
        })
        .then(function() {
          assert(!connectionWentDown);
        });
    });

    describe('should not try reconnect when denied access', function() {
      beforeEach(function() {
        this.extension = {
          outgoing: function(message, callback) {
            if (message.channel === '/meta/handshake') {
              message.ext = { deny: true };
            }
            callback(message);
          }
        };

        this.client.addExtension(this.extension);
      });

      afterEach(function() {
        this.client.removeExtension(this.extension);
      });

      it('should disconnect', function() {
        var client = this.client;

        return client.connect()
          .then(function() {
            assert.ok(false);
          }, function(e) {
            assert.strictEqual(e.message, 'Unauthorised');
          });
      });
    });

  });

};
