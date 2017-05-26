'use strict';

module.exports = function() {
  require('./client-connect-spec')();
  require('./client-subscribe-spec')();
  require('./client-publish-spec')();
  require('./client-reset-spec')();
  require('./client-advice-spec')();
  require('./client-delete-spec')();
  require('./client-bad-websockets-spec')();
};
