'use strict';

module.exports = function() {
  require('./client-server-restart-spec')();
  require('./client-bad-connection-spec')();
};
