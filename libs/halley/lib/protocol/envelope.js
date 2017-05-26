'use strict';

var Promise = require('bluebird');

/**
 * An envelope represents a single request and response
 * with one or more send requests.
 *
 * - Sends cannot overlap.
 * - When a send is rejected, the dispatcher will queue up
 *   another send. However the response will only be
 *   accepted or rejected once
 */
function Envelope() {
  this.transport = null;
  this._sendPromise = null;
  this._sendResolve = null;
  this._sendReject = null;
}

Envelope.prototype = {

  startSend: function(transport) {
    this.transport = transport;
    this._sendPromise = new Promise(function(resolve, reject) {
      this._sendResolve = resolve;
      this._sendReject = reject;
    }.bind(this));

  },

  stopSend: function() {
    this.transport = null;
    this._sendPromise = null;
    this._sendResolve = null;
    this._sendReject = null;
  },

  resolve: function(value) {
    if (this._sendResolve) {
      this._sendResolve(value);
    }
  },

  reject: function(reason) {
    if (this._sendReject) {
      this._sendReject(reason);
    }
  },

  awaitResponse: function() {
    return this._sendPromise;
  }
};

module.exports = Envelope;
