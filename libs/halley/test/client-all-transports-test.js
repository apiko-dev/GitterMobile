'use strict';

var Halley    = require('..');
var Websocket = require('../lib/transport/base-websocket');
var assert    = require('assert');

describe('client-all-transport', function() {

  describe('direct', function() {

    beforeEach(function() {
      this.openSocketsBefore = Websocket._countSockets();

      this.client = new Halley.Client(this.urlDirect, {
        retry: this.clientOptions.retry,
        timeout: this.clientOptions.timeout
      });
    });

    afterEach(function() {
      return this.client.disconnect()
        .bind(this)
        .then(function() {
          // Ensure that all sockets are closed
          assert.strictEqual(Websocket._countSockets(), this.openSocketsBefore);
        });
    });

    require('./specs/client-spec')();
    require('./specs/client-bad-websockets-spec')();
  });

  describe('proxied', function() {

    beforeEach(function() {
      this.client = new Halley.Client(this.urlProxied, {
        retry: this.clientOptions.retry,
        timeout: this.clientOptions.timeout
      });
    });

    afterEach(function() {
      return this.client.disconnect()
        .then(function() {
          // Ensure that all sockets are closed
          assert.strictEqual(Websocket._countSockets(), 0);
        });
    });

    require('./specs/client-proxied-spec')();

  });

  describe('invalid-endpoint', function() {
    beforeEach(function() {
      this.client = new Halley.Client(this.urlInvalid, {
        retry: this.clientOptions.retry,
        timeout: this.clientOptions.timeout
      });
    });

    afterEach(function() {
      return this.client.disconnect()
        .then(function() {
          // Ensure that all sockets are closed
          assert.strictEqual(Websocket._countSockets(), 0);
        });
    });

    require('./specs/client-invalid-endpoint-spec')();
  });

});
