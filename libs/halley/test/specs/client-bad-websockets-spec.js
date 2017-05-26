'use strict';

var Promise = require('bluebird');

function defer() {
  var d = {};

  d.promise = new Promise(function(resolve, reject) {
    d.resolve = resolve;
    d.reject = reject;
  });

  return d;
}

var OUTAGE_TIME = 2000;

module.exports = function() {
  describe('client-bad-websockets', function() {

    it('should deal with bad corporate proxies', function() {
      var count = 0;
      var self = this;

      var d = defer();

      return this.serverControl.stopWebsockets(OUTAGE_TIME)
        .then(function() {
          return self.client.subscribe('/datetime', function() {
            count++;

            if (count === 3) {
              d.resolve();
            }
          });
        })
        .then(function() {
          return d.promise;
        });


    });


  });

};
