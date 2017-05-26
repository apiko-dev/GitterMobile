'use strict';

var inherits      = require('inherits');
var extend        = require('../../util/externals').extend;
var BaseWebSocket = require('../base-websocket');

function BrowserWebSocket(dispatcher, endpoint, advice) {
  BrowserWebSocket.super_.call(this, dispatcher, endpoint, advice);
}
inherits(BrowserWebSocket, BaseWebSocket);

extend(BrowserWebSocket.prototype, {
  _createWebsocket: function(url) {
    if (window.MozWebSocket) {
      return new window.MozWebSocket(url);
    }

    if (window.WebSocket) {
      return new window.WebSocket(url);
    }
  },
});


/* Statics */
BrowserWebSocket.create = BaseWebSocket.create;
BrowserWebSocket.isUsable = function(/*endpoint*/) {
  return window.MozWebSocket || window.WebSocket;
};

module.exports = BrowserWebSocket;
