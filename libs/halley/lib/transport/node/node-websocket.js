'use strict';

var inherits      = require('inherits');
var extend        = require('../../util/externals').extend;
var WebSocket     = require('faye-websocket');
var BaseWebSocket = require('../base-websocket');

function NodeWebSocket(dispatcher, endpoint, advice) {
  NodeWebSocket.super_.call(this, dispatcher, endpoint, advice);
}
inherits(NodeWebSocket, BaseWebSocket);

extend(NodeWebSocket.prototype, {
  _createWebsocket: function(url) {
    return new WebSocket.Client(url, [], { extensions: this._dispatcher.wsExtensions });
  },
});


NodeWebSocket.create = BaseWebSocket.create;
NodeWebSocket.isUsable = function(endpoint) {
  return (endpoint.protocol === 'http:' || endpoint.protocol === 'https:') && endpoint.host && endpoint.path;
};
module.exports = NodeWebSocket;
