'use strict';

require('../lib/util/externals').use({
  Events: require('backbone-events-standalone'),
  extend: require('lodash/object/extend')
});

var Promise = require('bluebird');
Promise.config({
  warnings: true,
  longStackTraces: true,
  cancellation: true
});

var BayeuxWithProxyServer = require('./helpers/bayeux-with-proxy-server');

describe('node-test-suite', function() {

  before(function(done) {
    var self = this;
    this.server = new BayeuxWithProxyServer('localhost');

    this.serverControl = this.server;

    this.server.start(function(err, urls) {
      if (err) return done(err);
      self.urls = urls;
      done();
    });
  });

  after(function(done) {
    this.server.stop(done);
  });

  describe('integration tests', function() {
    this.timeout(20000);

    before(function() {
      /* Give server time to startup */
      this.timeout(20000);
      return this.serverControl.restoreAll();
    });

    beforeEach(function() {
      this.urlDirect = this.urls.bayeux;
      this.urlProxied = this.urls.proxied;
      this.urlInvalid = 'https://127.0.0.2:65534/bayeux';

      this.clientOptions = {
        retry: 500,
        timeout: 500
      };
    });

    afterEach(function() {
      return this.serverControl.restoreAll();
    });

    require('./node-websocket-test');
    require('./client-long-polling-test');
    require('./client-websockets-test');
    require('./client-all-transports-test');
    require('./client-shutdown-test');
  });


  describe('unit tests', function() {
    require('./errors-test');
    require('./promise-util-test');
    require('./channel-set-test');
    require('./extensions-test');
    require('./transport-pool-test');
    require('./statemachine-mixin-test');
  });


});
