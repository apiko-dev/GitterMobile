'use strict';

var Channel      = require('./channel');
var Promise      = require('bluebird');
var Synchronized = require('../util/promise-util').Synchronized;
var debug        = require('debug')('halley:channel-set');

function ChannelSet(onSubscribe, onUnsubscribe) {
  this._onSubscribe = onSubscribe;
  this._onUnsubscribe = onUnsubscribe;
  this._channels = {};
  this._syncronized = new Synchronized();
}

ChannelSet.prototype = {
  get: function(name) {
    return this._channels[name];
  },

  getKeys: function() {
    return Object.keys(this._channels);
  },

  /**
   * Returns a promise of a subscription
   */
  subscribe: function(channelName, subscription) {
    // All subscribes and unsubscribes are synchonized by
    // the channel name to prevent inconsistent state
    return this._sync(channelName, function() {
      return this._syncSubscribe(channelName, subscription);
    });
  },

  unsubscribe: function(channelName, subscription) {
    // All subscribes and unsubscribes are synchonized by
    // the channel name to prevent inconsistent state
    return this._sync(channelName, function() {
      return this._syncUnsubscribe(channelName, subscription);
    });
  },

  reset: function() {
    this._channels = {};
    this._syncronized = new Synchronized();
  },

  _sync: function(channelName, fn) {
    return this._syncronized.sync(channelName, fn.bind(this));
  },

  _syncSubscribe: Promise.method(function(name, subscription) {
    debug('subscribe: channel=%s', name);

    var existingChannel = this._channels[name];

    // If the client is resubscribing to an existing channel
    // there is no need to re-issue to message to the server
    if (existingChannel) {
      debug('subscribe: existing: channel=%s', name);

      existingChannel.add(subscription);
      return subscription;
    }

    return this._onSubscribe(name)
      .bind(this)
      .then(function(response) {
        debug('subscribe: success: channel=%s', name);

        var channel = this._channels[name] = new Channel(name);
        channel.add(subscription);

        subscription._subscribeSuccess(response);

        return subscription;
      });
  }),

  _syncUnsubscribe: Promise.method(function(name, subscription) {
    debug('unsubscribe: channel=%s', name);
    var channel = this._channels[name];
    if (!channel) return;

    channel.remove(subscription);

    // Do not perform the `unsubscribe` if the channel is still being used
    // by other subscriptions
    if (!channel.isUnused()) return;

    delete this._channels[name];

    return this._onUnsubscribe(name);
  }),

  distributeMessage: function(message) {
    var channels = Channel.expand(message.channel);

    for (var i = 0, n = channels.length; i < n; i++) {
      var channel = this._channels[channels[i]];
      if (channel) {
        channel.receive(message.data);
      }
    }
  }

};

module.exports = ChannelSet;
