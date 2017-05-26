'use strict';

var BaseLongPollingTransport = require('../base-long-polling-transport');
var http           = require('http');
var https          = require('https');
var inherits       = require('inherits');
var extend         = require('../../util/externals').extend;
var Promise        = require('bluebird');
var TransportError = require('../../util/errors').TransportError;

function NodeHttpTransport(dispatcher, endpoint, advice) {
  NodeHttpTransport.super_.call(this, dispatcher, endpoint, advice);

  var endpointSecure = this.endpoint.protocol === 'https:';
  this._httpClient   = endpointSecure ? https : http;
}
inherits(NodeHttpTransport, BaseLongPollingTransport);

extend(NodeHttpTransport.prototype, {
  encode: function(messages) {
    return JSON.stringify(messages);
  },

  request: function(messages) {

    return new Promise(function(resolve, reject, onCancel) {
      var self    = this;
      var content = new Buffer(this.encode(messages), 'utf8');
      var params  = this._buildParams(content);

      var request = this._httpClient.request(params, function(response) {
        var status = response.statusCode;
        var successful = (status >= 200 && status < 300);
        if (successful) {
          resolve();
        } else {
          var err = new TransportError('HTTP Status ' + status);
          reject(err);
          self._error(err);
          return;
        }

        var body = '';

        response.setEncoding('utf8');
        response.on('data', function(chunk) { body += chunk; });

        response.on('end', function() {
          var replies = null;

          try {
            replies = JSON.parse(body);
          } catch (e) {
            self._error(new TransportError('Server response parse failure'));
            return;
          }

          if (replies && Array.isArray(replies)) {
            self._receive(replies);
          } else {
            self._error(new TransportError('Invalid response from server'));
          }
        });
      });

      request.setSocketKeepAlive(true, this._advice.getPingInterval());
      request.once('error', function(error) {
        var err = new TransportError(error.message);
        reject(err);
        self._error(new TransportError('Invalid response from server'));
      });

      request.end(content);
      onCancel(function() {
        request.abort();
        request.removeAllListeners();
      });

    }.bind(this));
  },

  _buildParams: function(content) {
    var uri    = this.endpoint;

    var params = {
      method:   'POST',
      host:     uri.hostname,
      path:     uri.path,
      headers:  {
        'Content-Length': content.length,
        'Content-Type':   'application/json',
        'Host':           uri.host
      }
    };

    if (uri.port) {
      params.port = uri.port;
    }

    return params;
  }
});

/* Statics */
NodeHttpTransport.isUsable = function(endpoint) {
  return (endpoint.protocol === 'http:' || endpoint.protocol === 'https:') && endpoint.host && endpoint.path;
};

module.exports = NodeHttpTransport;
