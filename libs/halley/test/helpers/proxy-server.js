'use strict';

var net = require('net');
var debug = require('debug')('halley:test:proxy-server');
var util = require('util');
var EventEmitter = require('events').EventEmitter;
var enableDestroy = require('server-destroy');

function ProxyServer(serverPort) {
  EventEmitter.call(this);
  this.setMaxListeners(100);
  this.serverPort = serverPort;
  this.listenPort = 0;
}
util.inherits(ProxyServer, EventEmitter);

ProxyServer.prototype.start = function(callback) {
  var self = this;
  var server = this.server = net.createServer(function(c) { //'connection' listener
    debug('client connected');
    c.on('end', function() {
      debug('client disconnected');
    });

    self.createClient(c);
  });

  enableDestroy(server);

  server.listen(this.listenPort, function() { //'listening' listener
    debug('server bound');

    self.listenPort = server.address().port;
    callback(null, server.address().port);
  });
};

ProxyServer.prototype.stop = function(callback) {
  this.emit('close');
  this.server.destroy(callback);
};

ProxyServer.prototype.createClient = function(incoming) {
  var self = this;
  debug('connection created');

  var backend = net.connect({ port: this.serverPort }, function() {
    debug('backend connection created');

    var onClose = function() {
      self.removeListener('close', onClose);
      incoming.destroy();
      backend.destroy();
    }.bind(this);

    self.on('close', onClose);

    incoming.on('data', function(data) {
      if (self.trafficDisabled) {
        debug('dropping incoming request');
        return;
      }

      backend.write(data);
    });

    backend.on('data', function(data) {
      if (self.trafficDisabled) {
        debug('dropping backend response');
        return;
      }

      incoming.write(data);
    });

    incoming.on('end', function() {
      debug('incoming end');
      // Intentionally leave sockets hanging
    });

    backend.on('end', function() {
      debug('backend end');
      // Intentionally leave sockets hanging
      incoming.destroy();
    });

    incoming.on('error', function() {
      debug('incoming error');
      backend.destroy();
    });

    backend.on('error', function() {
      debug('backend error');
    });

    backend.on('close', function() {
      debug('backend close');
      incoming.destroy();
    });

    incoming.on('close', function() {
      debug('incoming close');
    });

  });
};

ProxyServer.prototype.disableTraffic = function(timeout) {
  debug('Trashing all incoming traffic');
  clearTimeout(this.outageTimer);
  this.outageTimer = setTimeout(this.enableTraffic.bind(this), timeout || 5000);
  this.trafficDisabled = true;
};

ProxyServer.prototype.enableTraffic =  function() {
  clearTimeout(this.outageTimer);
  debug('Re-enabling incoming traffic');
  this.trafficDisabled = false;
};



module.exports = ProxyServer;
