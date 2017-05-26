'use strict';

var debug    = require('debug')('halley:transport');

var registeredTransports = [];

function Transport(dispatcher, endpoint, advice) {
  this._dispatcher = dispatcher;
  this._advice     = advice;
  this.endpoint    = endpoint;
}

Transport.prototype = {
  close: function() {
  },

  /* Abstract encode: function(messages) { } */
  /* Abstract request: function(messages) { } */

  /* Returns a promise of a request */
  sendMessage: function(message) {
    return this.request([message]);
  },

  _receive: function(replies) {
    if (!replies) return;
    replies = [].concat(replies);

    debug('Received via %s: %j', this.connectionType, replies);

    for (var i = 0, n = replies.length; i < n; i++) {
      this._dispatcher.handleResponse(replies[i]);
    }
  },

  _error: function(error) {
    this._dispatcher.handleError(this, error);
  }

};

/* Statics */
Transport.getRegisteredTransports = function() {
  return registeredTransports;
};

Transport.register = function(type, klass) {
  registeredTransports.push([type, klass]);
  klass.prototype.connectionType = type;
};

Transport.getConnectionTypes = function() {
  return registeredTransports.map(function(t) { return t[0]; });
};

module.exports = Transport;
