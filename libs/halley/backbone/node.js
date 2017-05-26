'use strict';

var Promise = require('bluebird');
Promise.config({
  cancellation: true
});

require('../lib/util/externals').use({
  Events: require('backbone').Events,
  extend: require('underscore').extend
});

var Transport = require('../lib/transport/transport');

/* Register the transports. Order is important */
Transport.register('websocket'   , require('../lib/transport/node/node-websocket'));
Transport.register('long-polling', require('../lib/transport/node/node-http'));

module.exports = require('../lib/main');
