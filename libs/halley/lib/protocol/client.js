'use strict';

var Extensions        = require('./extensions');
var BayeuxError       = require('../util/errors').BayeuxError;
var TransportError    = require('../util/errors').TransportError;
var Channel           = require('./channel');
var ChannelSet        = require('./channel-set');
var Dispatcher        = require('./dispatcher');
var Promise           = require('bluebird');
var debug             = require('debug')('halley:client');
var StateMachineMixin = require('../mixins/statemachine-mixin');
var extend            = require('../util/externals').extend;
var Events            = require('../util/externals').Events;
var globalEvents      = require('../util/global-events');
var Advice            = require('./advice');
var Subscription      = require('./subscription');
var SubscribeThenable = require('./subscribe-thenable');


var MANDATORY_CONNECTION_TYPES = ['long-polling'];
var DEFAULT_ENDPOINT = '/bayeux';

/**
 * TODO: make the states/transitions look more like the official client states
 * http://docs.cometd.org/reference/bayeux_operation.html#d0e9971
 */
var FSM = {
  name: 'client',
  initial: 'UNCONNECTED',
  globalTransitions: {
    disable: 'DISABLED',
    disconnect: 'UNCONNECTED'
  },
  transitions: {
    // The client is not yet connected
    UNCONNECTED: {
      connect: 'HANDSHAKING',
      reset: 'HANDSHAKING'
    },
    // The client is undergoing the handshake process
    HANDSHAKING: {
      handshakeSuccess: 'CONNECTED',
      rehandshake: 'HANDSHAKE_WAIT', // TODO:remove
      error: 'HANDSHAKE_WAIT'
    },
    // Handshake failed, try again after interval
    HANDSHAKE_WAIT: {
      timeout: 'HANDSHAKING'
    },
    // The client is connected
    CONNECTED: {
      disconnect: 'DISCONNECTING',
      rehandshake: 'HANDSHAKE_WAIT',
      reset: 'RESETTING'
    },
    // The client is undergoing reset
    // RESETTING is handled by the same handler as disconnect, so must
    // support the same transitions (with different states)
    RESETTING: {
      disconnectSuccess: 'HANDSHAKING',
      reset: 'HANDSHAKING',
      connect: 'HANDSHAKING',
      error: 'HANDSHAKING'
    },
    // The client is disconnecting
    DISCONNECTING: {
      disconnectSuccess: 'UNCONNECTED',
      reset: 'HANDSHAKING',
      connect: 'HANDSHAKING',
      error: 'UNCONNECTED'
    },
    // The client has been disabled an will not reconnect
    // after being sent { advice: none }
    DISABLED: {

    }
  }
};

function validateBayeuxResponse(response) {
  if (!response) {
    throw new TransportError('No response received');
  }

  if (!response.successful) {
    throw new BayeuxError(response.error);
  }

  return response;
}

/**
 * The Halley Client
 */
function Client(endpoint, options) {
  debug('New client created for %s', endpoint);
  if (!options) options = {};

  var advice = this._advice = new Advice(options);

  debug('Initial advice: %j', this._advice);

  this._extensions = new Extensions();
  this._endpoint = endpoint || DEFAULT_ENDPOINT;
  this._channels = new ChannelSet(this._onSubscribe.bind(this), this._onUnsubscribe.bind(this));
  this._dispatcher = options.dispatcher || new Dispatcher(this._endpoint, advice, options);
  this._initialConnectionTypes = options.connectionTypes || MANDATORY_CONNECTION_TYPES;
  this._messageId = 0;
  this._connected = false;

  /**
   * How many times have we failed handshaking
   */
  this.initStateMachine(FSM);

  this.listenTo(this._dispatcher, 'message', this._receiveMessage);

  this.listenTo(advice, 'advice:handshake', function() {
    return this.transitionState('rehandshake', { optional: true, dedup: true });
  });

  this.listenTo(advice, 'advice:none', function() {
    return this.resetTransition('disable', new Error('Client disabled'));
  });

  this.listenTo(this._dispatcher, 'transport:up transport:down', function() {
    this._updateConnectionState();
  });

}

Client.prototype = {
  addExtension: function(extension) {
    this._extensions.add(extension);
  },

  removeExtension: function(extension) {
    this._extensions.remove(extension);
  },

  handshake: function() {
    debug('handshake');
    return this.transitionState('connect', { optional: true });
  },

  /**
   * Wait for the client to connect
   */
  connect: Promise.method(function() {
    if (this.stateIs('DISABLED')) throw new Error('Client disabled');
    if (this.stateIs('CONNECTED')) return;

    return this.transitionState('connect', { optional: true });
  }),

  disconnect: Promise.method(function() {
    if (this.stateIs('DISABLED')) return;
    if (this.stateIs('UNCONNECTED')) return;

    return this.resetTransition('disconnect', new Error('Client disconnected'), { dedup: true });
  }),

  /**
   * Returns a thenable of a subscription
   */
  subscribe: function(channelName, onMessage, context, onSubscribe) {
    var subscription = new Subscription(this._channels, channelName, onMessage, context, onSubscribe);
    var subscribePromise = this._channels.subscribe(channelName, subscription);
    return new SubscribeThenable(subscribePromise);
  },

  /**
   * Publish a message
   * @return {Promise} A promise of the response
   */
  publish: function(channel, data, options) {
    debug('publish: channel=%s, data=%j', channel, data);

    return this.connect()
      .bind(this)
      .then(function() {
        return this._sendMessage({
          channel: channel,
          data: data
        }, options);
      })
      .then(validateBayeuxResponse);
  },

  /**
   * Resets the client and resubscribes to existing channels
   * This can be used when the client is in an inconsistent state
   */
  reset: function() {
    debug('reset');
    return this.transitionState('reset', { optional: true });
  },

  /**
   * Returns the clientId or null
   */
  getClientId: function() {
    return this._dispatcher.clientId;
  },

  listChannels: function() {
    return this._channels.getKeys();
  },

  _onSubscribe: function(channel) {
    return this.connect()
      .bind(this)
      .then(function() {
        return this._sendMessage({
          channel: Channel.SUBSCRIBE,
          subscription: channel
        });
      })
      .then(validateBayeuxResponse);
  },

  _onUnsubscribe: function(channel) {
    return this.connect()
      .bind(this)
      .then(function() {
        return this._sendMessage({
          channel: Channel.UNSUBSCRIBE,
          subscription: channel
        });
      })
      .then(validateBayeuxResponse);
  },

  _updateConnectionState: function() {
    // The client is connected when the state
    // of the client is CONNECTED and the
    // transport is up
    var isConnected = this.stateIs('CONNECTED') && this._dispatcher.isTransportUp();
    if (this._connected === isConnected) return;
    this._connected = isConnected;

    debug('Connection state changed to %s', isConnected ? 'up' : 'down');

    this.trigger(isConnected ? 'connection:up' : 'connection:down');
  },

  onStateChange: function() {
    this._updateConnectionState();
  },

  /**
   * The client must issue a handshake with the server
   */
  _onEnterHANDSHAKING: function() {
    this._dispatcher.clientId = null;

    return this._dispatcher.selectTransport(this._initialConnectionTypes)
      .bind(this)
      .then(function() {
        return this._sendMessage({
            channel: Channel.HANDSHAKE
          }, {
            attempts: 1 // Note: only try once
          });
      })
      .then(function(response) {
        validateBayeuxResponse(response);

        this._dispatcher.clientId = response.clientId;
        var supportedConnectionTypes = this._supportedTypes = response.supportedConnectionTypes;

        debug('Handshake successful: %s', this._dispatcher.clientId);

        return this._dispatcher.selectTransport(supportedConnectionTypes, true);
      })
      .return('handshakeSuccess');

  },

  /**
   * Handshake has failed. Waits `interval` ms then
   * attempts another handshake
   */
  _onEnterHANDSHAKE_WAIT: function() {
    this._advice.handshakeFailed();

    var delay = this._advice.getHandshakeInterval();

    debug('Waiting %sms before rehandshaking', delay);
    return Promise.delay(delay)
      .return('timeout');
  },

  /**
   * The client has connected. It needs to send out regular connect
   * messages.
   */
  _onEnterCONNECTED: function() {
    this.trigger('connected');

    // Fire a disconnect when the user navigates away
    this.listenTo(globalEvents, 'beforeunload', this.disconnect);

    /* Handshake success, reset count */
    this._advice.handshakeSuccess();

    this._sendConnect();

    this._resubscribeAll() // Not chained
      .catch(function(err) {
        debug('resubscribe all failed on connect: %s', err);
      })
      .done();

    return Promise.resolve();
  },

  /**
   * Stop sending connect messages
   */
  _onLeaveCONNECTED: function() {
    if (this._connect) {
      debug('Cancelling pending connect request');
      this._connect.cancel();
      this._connect = null;
    }

    // Fire a disconnect when the user navigates away
    this.stopListening(globalEvents);
  },

  /**
   * The client will attempt a disconnect and will
   * transition back to the HANDSHAKING state
   */
  _onEnterRESETTING: function() {
    debug('Resetting %s', this._dispatcher.clientId);
    return this._onEnterDISCONNECTING();
  },

  /**
   * The client is disconnecting, or resetting.
   */
  _onEnterDISCONNECTING: function() {
    debug('Disconnecting %s', this._dispatcher.clientId);

    return this._sendMessage({
        channel: Channel.DISCONNECT
      }, {
        attempts: 1,
        timeout: this._advice.getDisconnectTimeout()
      })
      .bind(this)
      .then(validateBayeuxResponse)
      .return('disconnectSuccess')
      .finally(function() {
        this._dispatcher.close();

        this.trigger('disconnect');
      });
  },

  /**
   * The client is no longer connected.
   */
  _onEnterUNCONNECTED: function() {
    this._dispatcher.clientId = null;
    this._dispatcher.close();
    debug('Clearing channel listeners for %s', this._dispatcher.clientId);
    this._channels.reset();
  },

  /**
   * The server has told the client to go away and
   * don't come back
   */
  _onEnterDISABLED: function() {
    this._onEnterUNCONNECTED();
    this.trigger('disabled');
  },

  /**
   * Use to resubscribe all previously subscribed channels
   * after re-handshaking
   */
  _resubscribeAll: Promise.method(function() {
    var channels = this._channels;
    var channelNames = channels.getKeys();

    return Promise.map(channelNames, function(channelName) {
        debug('Client attempting to resubscribe to %s', channelName);
        var channel = channels.get(channelName);

        return this._sendMessage({
            channel: Channel.SUBSCRIBE,
            subscription: channelName
          })
          .then(validateBayeuxResponse)
          .tap(function(response) {
            channel.subscribeSuccess(response);
          });

      }.bind(this));

  }),

  /**
   * Send a request message to the server, to which a reply should
   * be received.
   *
   * @return Promise of response
   */
  _sendMessage: function(message, options) {
    message.id = this._generateMessageId();

    return this._extensions.pipe('outgoing', message)
      .bind(this)
      .then(function(message) {
        if (!message) return;

        return this._dispatcher.sendMessage(message, options)
          .bind(this)
          .then(function(response) {
            return this._extensions.pipe('incoming', response);
          });
      });

  },

  /**
   * Event handler for when a message has been received through a channel
   * as opposed to as the result of a request.
   */
  _receiveMessage: function(message) {
    this._extensions.pipe('incoming', message)
      .bind(this)
      .then(function(message) {
        if (!message) return;

        if (!message || !message.channel || message.data === undefined) return;
        this._channels.distributeMessage(message);
        return null;
      })
      .done();
  },

  /**
   * Generate a unique messageid
   */
  _generateMessageId: function() {
    this._messageId += 1;
    if (this._messageId >= Math.pow(2, 32)) this._messageId = 0;
    return this._messageId.toString(36);
  },

  /**
   * Periodically fire a connect message with `interval` ms between sends
   * Ensures that multiple connect messages are not fired simultaneously.
   *
   * From the docs:
   * The client MUST maintain only a single outstanding connect message.
   * If the server does not have a current outstanding connect and a connect
   * is not received within a configured timeout, then the server
   * SHOULD act as if a disconnect message has been received.
   */
  _sendConnect: function() {
    if (this._connect) {
      debug('Cancelling pending connect request');
      this._connect.cancel();
      this._connect = null;
    }

    this._connect = this._sendMessage({
        channel: Channel.CONNECT
      }, {
        timeout: this._advice.getConnectResponseTimeout()
      })
      .bind(this)
      .then(validateBayeuxResponse)
      .catch(function(err) {
        debug('Connect failed: %s', err);
      })
      .finally(function() {
        this._connect = null;

        // If we're no longer connected so don't re-issue the
        // connect again
        if (!this.stateIs('CONNECTED')) {
          return null;
        }

        var interval = this._advice.interval;

        debug('Will connect after interval: %sms', interval);
        this._connect = Promise.delay(interval)
          .bind(this)
          .then(function() {
            this._connect = null;

            // No longer connected after the interval, don't re-issue
            if (!this.stateIs('CONNECTED')) {
              return;
            }

            /* Do not chain this */
            this._sendConnect();

            // Return an empty promise to stop
            // bluebird from raising warnings
            return Promise.resolve();
          });

        // Return an empty promise to stop
        // bluebird from raising warnings
        return Promise.resolve();
      });
  }

};

/* Mixins */
extend(Client.prototype, Events);
extend(Client.prototype, StateMachineMixin);

module.exports = Client;
