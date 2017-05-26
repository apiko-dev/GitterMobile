'use strict';

var TransportPool = require('../lib/transport/pool');
var assert = require('assert');
var Promise = require('bluebird');
var sinon = require('sinon');

describe('transport pool', function() {

  beforeEach(function() {
    this.PollingTransport = function() { };
    this.PollingTransport.prototype = {
      connectionType: 'polling',
      close: function() {

      },
    };

    this.StreamingTransport = function() { };

    this.StreamingTransport.prototype = {
      connect: function() {
        return Promise.delay(10);
      },
      close: function() {
      },
      connectionType: 'streaming'
    };

    this.StreamingFailTransport = function() { };
    this.StreamingFailTransport.prototype = {
      connect: function() {
        return Promise.delay(2)
          .then(function() {
            throw new Error('Connect fail');
          });
      },
      close: function() {
      },
      connectionType: 'streaming-fail'
    };

    this.PollingTransport.isUsable =
      this.StreamingTransport.isUsable =
      this.StreamingFailTransport.isUsable = function() {
        return true;
      };


    this.dispatcher = {
      handleResponse: function() {
      },
      handleError: function() {
      }
    };

    this.advice = {
      reconnect: 'retry',
      interval: 0,
      timeout: 1000,
      retry: 1
    };

    this.endpoint = { href: 'http://localhost/bayeux' };

    this.disabled = [];

    this.registeredTransports = [
      ['streaming-fail', this.StreamingFailTransport],
      ['streaming', this.StreamingTransport],
      ['polling', this.PollingTransport],
    ];

    this.transportPool = new TransportPool(this.dispatcher, this.endpoint, this.advice, this.disabled, this.registeredTransports);
  });

  describe('get', function() {
    it('should return an instance of a transport', function() {
      return this.transportPool.get()
        .bind(this)
        .then(function(transport) {
          assert(transport instanceof this.PollingTransport);
        });
    });

    it('should return an instance of a polling transport', function() {
      this.transportPool.setAllowed(['polling']);
      return this.transportPool.get()
        .bind(this)
        .then(function(transport) {
          assert(transport instanceof this.PollingTransport);
        });
    });

    it('should return an instance of a streaming transport', function() {
      this.transportPool.setAllowed(['streaming']);
      return this.transportPool.get()
        .bind(this)
        .then(function(transport) {
          assert(transport instanceof this.StreamingTransport);
        });
    });

    it('should fail if an async transport is unavailable', function() {
      this.transportPool.setAllowed(['streaming-fail']);
      return this.transportPool.get()
        .bind(this)
        .then(function() {
          assert.ok(false, 'Expected a failure');
        }, function(e) {
          assert.strictEqual(e.message, 'Connect fail');
        });
    });

    it('should return polling transport and then switch to streaming when it comes online', function() {
      this.transportPool.setAllowed(['streaming', 'polling']);
      return this.transportPool.get()
        .bind(this)
        .then(function(transport) {
          assert(transport instanceof this.PollingTransport);
        })
        .delay(10)
        .then(function() {
          return this.transportPool.reevaluate();
        })
        .then(function(transport) {
          assert(transport instanceof this.StreamingTransport);
        });
    });

    it('should return polling transport and then switch to streaming when it comes online, even when some transport fail', function() {
      this.transportPool.setAllowed(['streaming-fail', 'streaming', 'polling']);
      return this.transportPool.get()
        .bind(this)
        .then(function(transport) {
          assert(transport instanceof this.PollingTransport);
        })
        .delay(10)
        .then(function() {
          return this.transportPool.reevaluate();
        })
        .then(function(transport) {
          assert(transport instanceof this.StreamingTransport);
        });
    });

    it('should close transports on close', function() {
      this.transportPool.setAllowed(['streaming-fail', 'streaming', 'polling']);
      return this.transportPool.get()
        .bind(this)
        .then(function(transport) {
          var mock = sinon.mock(transport);
          mock.expects("close").once();

          this.transportPool.close();
          assert.deepEqual(this.transportPool._transports, {});
          mock.verify();
        });
    });

    it('should reselect on down', function() {
      var firstTransport;

      this.transportPool.setAllowed(['streaming', 'streaming-fail']);
      return this.transportPool.get()
        .bind(this)
        .then(function(transport) {
          var mock = sinon.mock(transport);
          mock.expects("close").never();

          firstTransport = transport;
          assert(transport instanceof this.StreamingTransport);
          this.transportPool.down(transport);

          mock.verify();

          return this.transportPool.get();
        })
        .then(function(transport) {
          assert(transport instanceof this.StreamingTransport);
          assert.notStrictEqual(transport, firstTransport);
        });
    });

    it('should reselect on down with async and sync connections', function() {
      this.transportPool.setAllowed(['streaming', 'polling']);
      return this.transportPool.get()
        .bind(this)
        .then(function(transport) {
          assert(transport instanceof this.PollingTransport);
        })
        .delay(10)
        .then(function() {
          return this.transportPool.reevaluate();
        })
        .then(function(transport) {
          assert(transport instanceof this.StreamingTransport);
          this.transportPool.down(transport);
          return this.transportPool.get();
        })
        .then(function(transport) {
          assert(transport instanceof this.PollingTransport);
        })
        .delay(10)
        .then(function() {
          return this.transportPool.reevaluate();
        })
        .then(function() {
          return this.transportPool.get();
        })
        .then(function(transport) {
          assert(transport instanceof this.StreamingTransport);
        });
    });

    it('should handle multiple transports going down', function() {
      var polling;
      this.transportPool.setAllowed(['streaming', 'polling']);
      return this.transportPool.get()
        .bind(this)
        .then(function(transport) {
          assert(transport instanceof this.PollingTransport);
          polling = transport;
        })
        .delay(10)
        .then(function() {
          return this.transportPool.reevaluate();
        })
        .then(function(transport) {
          assert(transport instanceof this.StreamingTransport);
          this.transportPool.down(transport);
          this.transportPool.down(polling);
          return this.transportPool.get();
        })
        .then(function(transport) {
          assert(transport instanceof this.PollingTransport);
          assert.notStrictEqual(transport, polling);
        });
    });

  });
});
