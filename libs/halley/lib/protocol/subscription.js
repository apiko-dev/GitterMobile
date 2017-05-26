'use strict';

var Promise = require('bluebird');

function Subscription(channels, channel, onMessage, context, onSubscribe) {
  this._channels    = channels;
  this._channel     = channel;
  this._onMessage   = onMessage;
  this._context     = context;
  this._onSubscribe = onSubscribe;
}

Subscription.prototype = {

  _receive: function(message) {
    if (this._onMessage) {
      this._onMessage.call(this._context, message);
    }
  },

  _subscribeSuccess: function(response) {
    if (this._onSubscribe) {
      this._onSubscribe.call(this._context, response);
    }
  },

  unsubscribe: Promise.method(function() {
    return this._channels.unsubscribe(this._channel, this);
  })

};

module.exports = Subscription;
