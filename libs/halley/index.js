'use strict';

var Promise = require('bluebird');
Promise.config({
  cancellation: true
});

require('./lib/util/externals').use({
  Events: require('backbone-events-standalone'),
  extend: require('lodash/object/extend')
});

var Transport = require('./lib/transport/transport');

Transport.register('websocket'   , require('./lib/transport/node/node-websocket'));
Transport.register('long-polling', require('./lib/transport/node/node-http'));

module.exports = require('./lib/main');
