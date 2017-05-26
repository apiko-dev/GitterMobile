'use strict';

var Promise = require('bluebird');
var globalEvents = require('../../lib/util/global-events');

module.exports = function() {
  describe('websocket-bad-connection', function() {

    it('should terminate if the server cannot be pinged', function() {
      var serverControl = this.serverControl;

      return this.websocket.connect()
        .bind(this)
        .then(function() {
          var self = this;
          return Promise.all([
            new Promise(function(resolve) {
              self.dispatcher.handleError = function() {
                resolve();
              }
            }),
            serverControl.networkOutage(2000)
          ]);
        });
    });

    /**
     * This test simulates a network event, such as online/offline detection
     * This should make the speed of recovery much faster
     */
    it('should terminate if the server cannot be pinged after a network event', function() {
      var serverControl = this.serverControl;

      return this.websocket.connect()
        .bind(this)
        .then(function() {
          var self = this;
          return Promise.all([
            new Promise(function(resolve) {
              self.dispatcher.handleError = function() {
                resolve();
              }
            }),
            serverControl.networkOutage(2000)
              .then(function() {
                globalEvents.trigger('network');
              })
          ]);
        });
    });

  });
};
