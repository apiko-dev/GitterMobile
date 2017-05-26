'use strict';

module.exports = {
  Client:         require('./protocol/client'),
  VERSION:        '2.0.0',
  BAYEUX_VERSION: '1.0',
  Promise:        require('bluebird')
};
