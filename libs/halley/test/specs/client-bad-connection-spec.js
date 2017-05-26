'use strict';

var assert = require('assert');
var Promise = require('bluebird');

function defer() {
  var d = {};

  d.promise = new Promise(function(resolve, reject) {
    d.resolve = resolve;
    d.reject = reject;
  });

  return d;
}
var OUTAGE_TIME = 5000;

module.exports = function() {
  describe('client-bad-connection', function() {

    it('should deal with dropped packets', function() {
      var count = 0;
      var postOutageCount = 0;
      var outageTime;
      var outageGraceTime;
      var self = this;

      var d = defer();
      this.client.subscribe('/datetime', function() {
        count++;

        if (count === 1) {
          return self.serverControl.networkOutage(OUTAGE_TIME)
          .then(function() {
            outageTime = Date.now();
            outageGraceTime = Date.now() + 1000;
          })
          .catch(function(err) {
            d.reject(err);
          });
        }

        if (!outageTime) return;
        if (outageGraceTime >= Date.now()) return;

        postOutageCount++;

        if (postOutageCount >= 3) {
          assert(Date.now() - outageTime >= (OUTAGE_TIME * 0.8));
          d.resolve();
        }
      })
      .then(function() {
        return d.promise;
      });
    });

    it('should emit connection events', function() {
      var client = this.client;

      var d1 = defer();
      var d2 = defer();
      var d3 = defer();

      client.once('connection:up', function() {
        d1.resolve();
      });

      return client.connect()
        .bind(this)
        .then(function() {
          // Awaiting initial connection:up
          return d1.promise;
        })
        .then(function() {
          client.once('connection:down', function() {
            d2.resolve();
          });

          return client.subscribe('/datetime', function() {});
        })
        .then(function() {
          client.once('connection:up', function() {
            d3.resolve();
          });

          return this.serverControl.restart();
        })
        .then(function() {
          // connection:down fired
          return d2.promise;
        })
        .then(function() {
          // connection:up fired
          return d3.promise;
        });
    });

    it('should emit connection events without messages', function() {
      var client = this.client;

      var d1 = defer();
      client.on('connection:down', function() {
        d1.resolve();
      });

      var d2 = defer();
      return client.connect()
        .bind(this)
        .delay(400) // Give the connection time to send a connect
        .then(function() {
          client.on('connection:up', function() {
            d2.resolve();
          });
          return this.serverControl.restart();
        })
        .then(function() {
          // connection:down fired
          return d1.promise;
        })
        .then(function() {
          // connection:up fired
          return d2.promise;
        });
    });

  });

};
