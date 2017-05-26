'use strict';

var sinon = require('sinon');

module.exports = function() {
  describe('websocket-server-restart', function() {

    it('should terminate if the server disconnects', function() {
      var self = this;
      var mock = sinon.mock(this.dispatcher);
      mock.expects("handleError").once();

      return this.websocket.connect()
        .bind(this)
        .then(function() {
          return self.serverControl.restart();
        })
        .delay(10)
        .then(function() {
          mock.verify();
        });
    });

  });
};
