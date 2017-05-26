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

/* Register the transports. Order is important */
Transport.register('websocket'       , require('./lib/transport/browser/browser-websocket'));
Transport.register('long-polling'    , require('./lib/transport/browser/xhr'));

module.exports = require('./lib/main');
