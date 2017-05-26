'use strict';

var extend         = require('../util/externals').extend;

var GRAMMAR_CHANNEL_NAME = /^\/[a-zA-Z0-9\-\_\!\~\(\)\$\@]+(\/[a-zA-Z0-9\-\_\!\~\(\)\$\@]+)*$/;
var GRAMMAR_CHANNEL_PATTERN = /^(\/[a-zA-Z0-9\-\_\!\~\(\)\$\@]+)*\/\*{1,2}$/;

function Channel(name) {
  this.id = this.name = name;
  this._subscriptions = [];
}

Channel.prototype = {
  add: function(subscription) {
    this._subscriptions.push(subscription);
  },

  remove: function(subscription) {
    this._subscriptions = this._subscriptions.filter(function(s) {
      return s !== subscription;
    });
  },

  receive: function(message) {
    var subscriptions = this._subscriptions;

    for (var i = 0; i < subscriptions.length; i++) {
      subscriptions[i]._receive(message);
    }
  },

  subscribeSuccess: function(response) {
    var subscriptions = this._subscriptions;

    for (var i = 0; i < subscriptions.length; i++) {
      subscriptions[i]._subscribeSuccess(response);
    }
  },

  isUnused: function() {
    return !this._subscriptions.length;
  }
};

/* Statics */
extend(Channel, {
  HANDSHAKE:    '/meta/handshake',
  CONNECT:      '/meta/connect',
  SUBSCRIBE:    '/meta/subscribe',
  UNSUBSCRIBE:  '/meta/unsubscribe',
  DISCONNECT:   '/meta/disconnect',

  META:         'meta',
  SERVICE:      'service',

  isValid: function(name) {
    return GRAMMAR_CHANNEL_NAME.test(name) ||
           GRAMMAR_CHANNEL_PATTERN.test(name);
  },

  parse: function(name) {
    if (!this.isValid(name)) return null;
    return name.split('/').slice(1);
  },

  unparse: function(segments) {
    return '/' + segments.join('/');
  },

  expand: function(name) {
    var segments = this.parse(name),
        channels = ['/**', name];

    var copy = segments.slice();
    copy[copy.length - 1] = '*';
    channels.push(this.unparse(copy));

    for (var i = 1, n = segments.length; i < n; i++) {
      copy = segments.slice(0, i);
      copy.push('**');
      channels.push(this.unparse(copy));
    }

    return channels;
  }


});

module.exports = Channel;
