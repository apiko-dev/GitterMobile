/* jshint node:true */
'use strict';

var http = require('http');
var faye = require('gitter-faye');
var debug = require('debug')('halley:test:bayeux-server');
var enableDestroy = require('server-destroy');
var extend = require('lodash/object/extend');

function BayeuxServer() {
  this.port = 0;
}

BayeuxServer.prototype = {

  start: function(callback) {
    var server = this.server = http.createServer();
    enableDestroy(server);

    var bayeux = this.bayeux = new faye.NodeAdapter({
      mount: '/bayeux',
      timeout: 5,
      ping: 2,
      engine: {
        interval: 0.3
      }
    });
    bayeux.attach(server);

    this.publishTimer = setInterval(function() {
      bayeux.getClient().publish('/datetime', { date: Date.now() });
      bayeux.getClient().publish('/slow', { date: Date.now() });
    }, 100);

    server.on('upgrade', function(req) {
      if (self.crushWebsocketConnections) {
        // Really mess things up
        req.socket.write('<OHNOES>');
        req.socket.destroy();
      }
    });

    var self = this;

    bayeux.addExtension({
      incoming: function(message, req, callback) {
        var clientId = message.clientId;
        if (!clientId) return callback(message);

        // This is a bit of a hack, but Faye doesn't appear to do it
        // automatically: check that the client actually exists. If it
        // doesn't reject it
        bayeux._server._engine.clientExists(clientId, function(exists) {
          if(!exists) {
            message.error = '401:' + clientId + ':Unknown client';
          }

          return callback(message);
        });
      },

      outgoing: function(message, req, callback) {
        if (message.successful === false && message.error) {
          // If we're sending 401 messages to the client, they don't
          // actually have a connection, so tell them to rehandshake
          if (message.error.indexOf('401:') === 0) {
            message.advice = extend(message.advice || {}, { "reconnect": "handshake", interval: 0 });
          }
        }
        return callback(message);
      }
    });

    bayeux.addExtension({
      incoming: function(message, req, callback) {

        if (message.channel === '/meta/subscribe' && message.subscription === '/slow') {
          return setTimeout(function() {
            callback(message);
          }, 200);
        }

        return callback(message);
      }

    });

    bayeux.addExtension({
      incoming: function(message, req, callback) {

        if (message.channel === '/meta/handshake' && message.ext && message.ext.deny) {
          message.error = '401::Unauthorised';
        }

        return callback(message);
      },

      outgoing: function(message, req, callback) {
        if (message.channel === '/meta/handshake' && message.error === '401::Unauthorised') {
          message.advice = { reconnect: 'none' };
        }

        return callback(message);
      }

    });

    bayeux.addExtension({
      incoming: function(message, req, callback) {
        if (self.crushWebsocketConnections) {
          if (req && req.headers.connection === 'Upgrade') {
            debug('Disconnecting websocket');
            req.socket.destroy();
            return;
          }
        }

        if (message.channel === '/meta/subscribe' && message.subscription === '/banned') {
          message.error = 'Invalid subscription';
        }

        if (message.channel === '/devnull') {
          return;
        }

        if (message.channel === '/meta/handshake') {
          if (message.ext && message.ext.failHandshake) {
            message.error = 'Unable to handshake';
          }
        }

        callback(message);
      },

      outgoing: function(message, req, callback) {
        var advice;
        if (message.channel === '/advice-retry') {
          advice = message.advice = message.advice || {};
          advice.reconnect = 'retry';
          advice.timeout = 2000;
        }

        if (message.channel === '/advice-handshake') {
          advice = message.advice = message.advice || {};
          advice.reconnect = 'handshake';
          advice.interval = 150;
          // advice.timeout = 150;
        }

        if (message.channel === '/advice-none') {
          advice = message.advice = message.advice || {};
          advice.reconnect = 'none';
        }

        return callback(message);
      }
    });

    server.listen(this.port, function(err) {
      if (err) return callback(err);
      self.port = server.address().port;
      callback(null, server.address().port);
    });
  },

  stop: function(callback) {
    clearTimeout(this.publishTimer);
    clearTimeout(this.uncrushTimeout);
    this.server.destroy(callback);
    this.server = null;
  },

  deleteClient: function(clientId, callback) {
    debug('Deleting client', clientId);
    this.bayeux._server._engine.destroyClient(clientId, callback);
  },

  crush: function(timeout) {
    if (this.crushWebsocketConnections) return;
    this.crushWebsocketConnections = true;
    this.uncrushTimeout = setTimeout(this.uncrush.bind(this), timeout || 5000);
  },

  uncrush: function() {
    if (!this.crushWebsocketConnections) return;
    this.crushWebsocketConnections = false;
    clearTimeout(this.uncrushTimeout);
  }
};

module.exports = BayeuxServer;
