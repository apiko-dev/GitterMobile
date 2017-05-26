'use strict';

var Batcher        = require('../util/promise-util').Batcher;
var Channel        = require('../protocol/channel');
var debug          = require('debug')('halley:batching-transport');
var inherits       = require('inherits');
var Transport      = require('./transport');
var extend         = require('../util/externals').extend;
var TransportError = require('../util/errors').TransportError;

var MAX_DELAY = 8;

function findConnectMessage(messages) {
  for (var i = 0; i < messages.length; i++) {
    var message = messages[i];
    if (message.channel === Channel.CONNECT) return message;
  }

  return null;
}

function BaseLongPollingTransport(dispatcher, endpoint, advice) {
  BaseLongPollingTransport.super_.call(this, dispatcher, endpoint, advice);
  this._batcher    = new Batcher(this._dequeue.bind(this), MAX_DELAY);
}
inherits(BaseLongPollingTransport, Transport);

extend(BaseLongPollingTransport.prototype, {
  close: function() {
    this._batcher.destroy(new TransportError('Transport closed'));
  },

  /* Returns a promise of a request */
  sendMessage: function(message) {
    var sendImmediate = message.channel === Channel.HANDSHAKE;

    return this._batcher.add(message, sendImmediate);
  },

  _dequeue: function(outbox) {
    debug('Flushing batch of %s messages', outbox.length);

    if (outbox.length > 1) {
      var connectMessage = findConnectMessage(outbox);

      // If we have sent out a request. don't
      // long poll on the response. Instead request
      // an immediate response from the server
      if (connectMessage) {
        connectMessage.advice = { timeout: 0 };
      }
    }

    return this.request(outbox);
  }

});

module.exports = BaseLongPollingTransport;
