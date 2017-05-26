'use strict';

var Scheduler       = require('./scheduler');
var Transport       = require('../transport/transport');
var Channel         = require('./channel');
var TransportPool   = require('../transport/pool');
var uri             = require('../util/uri');
var extend          = require('../util/externals').extend;
var Events          = require('../util/externals').Events;
var debug           = require('debug')('halley:dispatcher');
var Promise         = require('bluebird');
var Envelope        = require('./envelope');
var TransportError  = require('../util/errors').TransportError;
var danglingFinally = require('../util/promise-util').danglingFinally;

var HANDSHAKE = 'handshake';
var BAYEUX_VERSION = '1.0';

var STATE_UP = 1;
var STATE_DOWN = 2;

/**
 * The dispatcher sits between the client and the transport.
 *
 * It's responsible for tracking sending messages to the transport,
 * tracking in-flight messages
 */
function Dispatcher(endpoint, advice, options) {
  this._advice = advice;
  this._envelopes = {};
  this._scheduler = options.scheduler || Scheduler;
  this._state = 0;
  this._pool = new TransportPool(this, uri.parse(endpoint), advice, options.disabled, Transport.getRegisteredTransports());

}

Dispatcher.prototype = {

  destroy: function() {
    debug('destroy');

    this.close();
  },

  close: function() {
    debug('_close');

    this._cancelPending();

    debug('Dispatcher close requested');
    this._pool.close();
  },

  _cancelPending: function() {
    var envelopes = this._envelopes;
    this._envelopes = {};
    var envelopeKeys = Object.keys(envelopes);

    debug('_cancelPending %s envelopes', envelopeKeys.length);
    envelopeKeys.forEach(function(id) {
      var envelope = envelopes[id];
      envelope.reject(new Error('Dispatcher closed'));
    }, this);
  },

  getConnectionTypes: function() {
    return Transport.getConnectionTypes();
  },

  selectTransport: function(allowedTransportTypes, cleanup) {
    return this._pool.setAllowed(allowedTransportTypes, cleanup);
  },

  /**
   * Returns a promise of the response
   */
  sendMessage: function(message, options) {
    var id = message.id;
    var envelopes = this._envelopes;
    var advice = this._advice;

    var envelope = envelopes[id] = new Envelope(message);

    var timeout;
    if (options && options.timeout) {
      timeout = options.timeout;
    } else {
      timeout = advice.timeout;
    }

    var scheduler = new this._scheduler(message, {
      timeout: timeout,
      interval: advice.retry,
      attempts: options && options.attempts
    });

    var promise = this._attemptSend(envelope, message, scheduler);
    if (options && options.deadline) {
      promise = promise.timeout(options && options.deadline, 'Timeout on deadline');
    }

    return danglingFinally(promise, function() {
      debug('sendMessage finally: message=%j', message);

      if (promise.isFulfilled()) {
        scheduler.succeed();
      } else {
        scheduler.abort();
      }

      delete envelopes[id];
    });
  },

  _attemptSend: function(envelope, message, scheduler) {
    if (!scheduler.isDeliverable()) {
      return Promise.reject(new Error('No longer deliverable'));
    }

    scheduler.send();

    var timeout = scheduler.getTimeout();

    // 1. Obtain transport
    return this._pool.get()
      .bind(this)
      .then(function(transport) {
        debug('attemptSend: %j', message);
        envelope.startSend(transport);

        // 2. Send the message using the given transport
        var enrichedMessage = this._enrich(message, transport);

        return transport.sendMessage(enrichedMessage);
      })
      .then(function() {
        this._triggerUp();

        // 3. Wait for the response from the transport
        return envelope.awaitResponse();
      })
      .timeout(timeout, 'Timeout on message send')
      .finally(function() {
        envelope.stopSend();
      })
      .then(function(response) {
        // 4. Parse the response

        if (response.successful === false && response.advice && response.advice.reconnect === HANDSHAKE) {
          // This is not standard, and may need a bit of reconsideration
          // but if the client sends a message to the server and the server responds with
          // an error and tells the client it needs to rehandshake,
          // reschedule the send after the send after the handshake has occurred.
          throw new TransportError('Message send failed with advice reconnect:handshake, will reschedule send');
        }

        return response;
      })
      .catch(Promise.TimeoutError, TransportError, function(e) {
        debug('Error while attempting to send message: %j: %s', message, e);

        this._triggerDown();
        scheduler.fail();

        if (!scheduler.isDeliverable()) {
          throw e;
        }

        // Either the send timed out or no transport was
        // available. Either way, wait for the interval and try again
        return this._awaitRetry(envelope, message, scheduler);
      });

  },

  /**
   * Adds required fields into the message
   */
  _enrich: function(message, transport) {
    if (message.channel === Channel.CONNECT) {
      message.connectionType = transport.connectionType;
    }

    if (message.channel === Channel.HANDSHAKE) {
      message.version = BAYEUX_VERSION;
      message.supportedConnectionTypes = this.getConnectionTypes();
    } else {
      if (!this.clientId) {
        // Theres probably a nicer way of doing this. If the connection
        // is in the process of being re-established, throw an error
        // for non-handshake messages which will cause them to be rescheduled
        // in future, hopefully once the client is CONNECTED again
        throw new Error('client is not yet established');
      }
      message.clientId = this.clientId;
    }

    return message;
  },

  /**
   * Send has failed. Retry after interval
   */
  _awaitRetry: function(envelope, message, scheduler) {
    // Either no transport is available or a timeout occurred waiting for
    // the transport. Wait a bit, the try again
    return Promise.delay(scheduler.getInterval())
      .bind(this)
      .then(function() {
        return this._attemptSend(envelope, message, scheduler);
      });

  },

  handleResponse: function(reply) {
    if (reply.advice) this._advice.update(reply.advice);
    var id = reply.id;
    var envelope = id && this._envelopes[id];

    if (reply.successful !== undefined && envelope) {
      // This is a response to a message we fired.
      envelope.resolve(reply);
    } else {
      // Distribe this message through channels
      // Don't trigger a message if this is a reply
      // to a request, otherwise it'll pass
      // through the extensions twice
      this.trigger('message', reply);
    }
  },

  _triggerDown: function() {
    if (this._state === STATE_DOWN) return;
    debug('Dispatcher is DOWN');

    this._state = STATE_DOWN;
    this.trigger('transport:down');
  },

  _triggerUp: function() {
    if (this._state === STATE_UP) return;
    debug('Dispatcher is UP');

    this._state = STATE_UP;
    this.trigger('transport:up');

    // If we've disable websockets due to a network
    // outage, try re-enable them now
    this._pool.reevaluate();
  },

  /**
   * Called by transports on connection error
   */
  handleError: function(transport) {
    // This method may be called from outside the eventloop
    // so queue the method to ensure any finally methods
    // on pending promises are called prior to executing
    Promise.resolve()
      .bind(this)
      .then(function() {
        var envelopes = this._envelopes;

        // If the transport goes down, reject any outstanding
        // connect messages. We don't reject non-connect messages
        // as we assume that they've been sent to the server
        // already, and we don't need to resend them. If they had failed
        // to send, the send would have been rejected already.
        // As a failback, the message timeout will eventually
        // result in a rejection anyway.
        Object.keys(envelopes).forEach(function(id) {
          var envelope = envelopes[id];

          var message = envelope.message;
          if (envelope.transport === transport && message && message.channel === Channel.CONNECT) {
            envelope.reject(new Error('Transport failed'));
          }
        });

        // If this transport is the current,
        // report the connection as down
        if (transport === this._pool.current()) {
          this._triggerDown();
        }

        this._pool.down(transport);
      });
  },

  isTransportUp: function() {
    return this._state === STATE_UP;
  }
};

/* Mixins */
extend(Dispatcher.prototype, Events);

module.exports = Dispatcher;
