'use strict';

var WebSocket = require('../lib/transport/browser/browser-websocket');
var uri = require('../lib/util/uri');
var Advice = require('../lib/protocol/advice');

describe('browser websocket transport', function() {
  beforeEach(function() {
    this.dispatcher = {
      handleResponse: function() {
      },
      handleError: function() {
      }
    };

    this.advice = new Advice({
      interval: 0,
      timeout: 1000,
      retry: 1
    });

  });

  describe('direct', function() {

    beforeEach(function() {
      this.websocket = new WebSocket(this.dispatcher, uri.parse(this.urlDirect), this.advice);
    });

    afterEach(function() {
      this.websocket.close();
    });

    require('./specs/websocket-spec')();
  });

  describe('proxied', function() {

    beforeEach(function() {
      this.websocket = new WebSocket(this.dispatcher, uri.parse(this.urlProxied), this.advice);
    });

    afterEach(function() {
      this.websocket.close();
    });

    require('./specs/websocket-server-restart-spec')();
    require('./specs/websocket-bad-connection-spec')();
  });

});
