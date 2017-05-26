'use strict';

var Halley = require('..');

describe('client-long-polling', function() {

  describe('direct', function() {

    beforeEach(function() {
      this.client = new Halley.Client(this.urlDirect, {
        retry: this.clientOptions.retry,
        timeout: this.clientOptions.timeout,
        connectionTypes: ['long-polling'],
        disabled: ['websocket', 'callback-polling']
      });
    });

    afterEach(function() {
      return this.client.disconnect();
    });

    require('./specs/client-spec')();

  });

  describe('proxied', function() {

    beforeEach(function() {
      this.client = new Halley.Client(this.urlProxied, {
        retry: this.clientOptions.retry,
        timeout: this.clientOptions.timeout,
        connectionTypes: ['long-polling'],
        disabled: ['websocket', 'callback-polling']
      });
    });

    afterEach(function() {
      return this.client.disconnect();
    });

    require('./specs/client-proxied-spec')();

  });

  describe('invalid-endpoint', function() {
    beforeEach(function() {
      this.client = new Halley.Client(this.urlInvalid, {
        retry: this.clientOptions.retry,
        timeout: this.clientOptions.timeout,
        connectionTypes: ['long-polling'],
        disabled: ['websocket', 'callback-polling']
      });
    });

    afterEach(function() {
      return this.client.disconnect();
    });

    require('./specs/client-invalid-endpoint-spec')();
  });
});
