'use strict';

var debug         = require('debug')('halley:pool');
var Promise       = require('bluebird');
var cancelBarrier = require('../util/promise-util').cancelBarrier;
var LazySingleton = require('../util/promise-util').LazySingleton;

function TransportPool(dispatcher, endpoint, advice, disabled, registered) {
  this._dispatcher = dispatcher;
  this._endpoint = endpoint;
  this._advice = advice;
  this._transports = {};
  this._disabled = disabled;
  this._registered = registered;
  this._current = new LazySingleton(this._reselect.bind(this));

  this._registeredHash = registered.reduce(function(memo, transport) {
    var type = transport[0];
    var Klass = transport[1];
    memo[type] = Klass;
    return memo;
  }, {});

  this._allowed = null;

  this.setAllowed(null)
    .catch(function(err) {
      debug('Unable to preconnect to any available transports: err=%s', err);
    })
    .done();
}

TransportPool.prototype = {
  /** Returns a promise to transport */
  get: function() {
    var current = this._current.get();
    return cancelBarrier(current);
  },

  current: function() {
    var c = this._current.peek();

    if (c && c.isFulfilled()) {
      return c.value();
    }
  },

  /**
   * Set the allowed transport types that `.get` will return
   */
  setAllowed: function(allowedTypes, cleanup) {
    // Maintain the order from this._allowed
    this._allowed = this._registered
      .map(function(transport) {
        return transport[0];
      })
      .filter(function(type) {
        return !allowedTypes || allowedTypes.indexOf(type) >= 0;
      });

    if (cleanup) {
      // Remove transports that we won't use
      Object.keys(this._transports).forEach(function(type) {
        if (this._allowed.indexOf(type) >= 0) return;

        var transport = this._transports[type];
        delete this._transports[type];

        if (transport.isFulfilled()) {
          transport.value().close();
        } else {
          transport.cancel();
        }

      }, this);
    }

    return this.reevaluate();
  },

  reevaluate: function() {
    this._current.clear();
    var current = this._current.get();
    return cancelBarrier(current);
  },

  _reselect: function() {
    var allowed = this._allowed;
    debug('_reselect: %j', allowed);

    // Load the transport
    var connectionPromises = allowed
      .filter(function(type) {
        var Klass = this._registeredHash[type];

        if (this._disabled && this._disabled.indexOf(type) >= 0) return false;

        return Klass.isUsable(this._endpoint);
      }, this)
      .map(function(type) {
        var Klass = this._registeredHash[type];

        var current = this._transports[type];
        if (current) {
          if(!current.isRejected() && !current.isCancelled()) {
            return current;
          }
          // Should we cancel the current?
        }

        var instance = new Klass(this._dispatcher, this._endpoint, this._advice);

        var promise = instance.connect ?
          instance.connect().return(instance) :
          Promise.resolve(instance);

        this._transports[type] = promise;
        return promise;
      }, this);

    if (!connectionPromises.length) {
      return Promise.reject(new Error('No suitable transports available'));
    }

    // Return the first usable transport
    return Promise.any(connectionPromises)
      .then(function(transport) {
        debug('Selected transport %s', transport.connectionType);
        return transport;
      })
      .catch(Promise.AggregateError, function(err) {
        /* Fail with the first problem */
        throw err[0];
      });
  },

  close: function() {
    debug('_close');

    var transports = this._transports;
    this._transports = {};

    var current = this._current.value;
    if (current) {

      this._current.clear();
      if (current.isPending()) {
        current.cancel();
      }
    }

    Object.keys(transports).forEach(function(type) {
      var transportPromise = transports[type];
      if (transportPromise.isFulfilled()) {
        transportPromise.value().close();
      } else {
        transportPromise.cancel();
      }
    });
  },

  /**
   * Called on transport close
   */
  down: function(transport) {
    var connectionType = transport.connectionType;
    var transportPromise = this._transports[connectionType];
    if (!transportPromise) return;

    if (transportPromise.isFulfilled()) {
      var existingTransport = transportPromise.value();
      if (existingTransport !== transport) return;

      // Don't call transport.close as this
      // will be called from the close
      delete this._transports[connectionType];

      // Next time someone does a `.get` we will attempt to reselect
      this._current.clear();
    }
  }

};

module.exports = TransportPool;
