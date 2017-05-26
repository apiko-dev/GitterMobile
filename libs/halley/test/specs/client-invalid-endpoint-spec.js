'use strict';

var assert = require('assert');
var Promise = require('bluebird');

module.exports = function() {
  describe('client-invalid-endpoint', function() {

    it('should not connect', function() {
      var client = this.client;
      var connectionCameUp = false;
      client.on('connection:down', function() {
        connectionCameUp = true;
      });

      return Promise.any([client.connect(), Promise.delay(5000)])
        .then(function() {
          assert(!connectionCameUp);
          return client.disconnect();
        });
    });

  });

};
