'use strict';

var Promise = require('bluebird');

function SubscribeThenable(subscribePromise) {
  this._promise = subscribePromise;
}

SubscribeThenable.prototype = {
  then: function(resolve, reject) {
    return this._promise.then(resolve, reject);
  },

  catch: function(reject) {
    return this._promise.catch(reject);
  },

  bind: function(context) {
    return this._promise.bind(context);
  },

  unsubscribe: Promise.method(function() {
    if (this.isRejected()) return;

    return this._promise.then(function(subscription) {
      return subscription.unsubscribe();
    });
  }),

  // Useful for testing
  isPending: function() {
    return this._promise.isPending();
  },

  isFulfilled: function() {
    return this._promise.isFulfilled();
  },

  isRejected: function() {
    return this._promise.isRejected();
  }
};

module.exports = SubscribeThenable;
