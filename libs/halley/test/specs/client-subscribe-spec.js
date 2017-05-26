'use strict';

var assert = require('assert');
var Promise = require('bluebird');
var errors = require('../../lib/util/errors');

function defer() {
  var d = {};

  d.promise = new Promise(function(resolve, reject) {
    d.resolve = resolve;
    d.reject = reject;
  });

  return d;
}

module.exports = function() {
  describe('client-subscribe', function() {

    it('should subscribe to a channel and receive messages', function() {
      var onMessage = defer();
      var onSubscribe = defer();

      var subscription = this.client.subscribe('/datetime', function() {
        onMessage.resolve();
      }, null, function() {
        onSubscribe.resolve();
      });

      return Promise.all([subscription, onMessage.promise, onSubscribe.promise]);
    });

    it('should unsubscribe a subscription correctly', function() {
      var count = 0;
      var onSubscribeCount = 0;
      var d = defer();

      var subscribe = this.client.subscribe('/datetime', function() {
        count++;
        if (count === 2) {
          d.resolve();
        }
      }, null, function() {
        onSubscribeCount++;
      });

      return Promise.join(subscribe, d.promise, function(subscription) {
          return subscription.unsubscribe();
        })
        .bind(this)
        .then(function() {
          assert.strictEqual(onSubscribeCount, 1);
          assert.deepEqual(this.client.listChannels(), []);
        });
    });

    it('should handle subscriptions that are cancelled before establishment, single', function() {
      var onSubscribeCount = 0;

      var subscribe = this.client.subscribe('/datetime', function() {
          assert.ok(false);
        }, null, function() {

        });

      return this.client.connect()
        .bind(this)
        .then(function() {
          // The subscribe will be inflight right now
          assert(subscribe.isPending());
          return subscribe.unsubscribe();
        })
        .then(function() {
          assert.strictEqual(onSubscribeCount, 0);
          assert.deepEqual(this.client.listChannels(), []);
        });
    });

    it('should handle subscriptions that are cancelled before establishment, double', function() {
      var onSubscribe = 0;

      var subscribe1 = this.client.subscribe('/datetime', function() {
          assert.ok(false);
        }, null, function() {
          onSubscribe++;
        });

      var d = defer();

      var subscribe2 = this.client.subscribe('/datetime', d.resolve, null, function() {
        onSubscribe++;
      });

      return this.client.connect()
        .bind(this)
        .then(function() {

          // The subscribe will be inflight right now
          assert(subscribe1.isPending());
          return subscribe1.unsubscribe();
        })
        .then(function() {
          return subscribe2;
        })
        .then(function() {
          assert.strictEqual(onSubscribe, 1);
          assert.deepEqual(this.client.listChannels(), ['/datetime']);
          return d.promise;
        });
    });

    it('should handle subscriptions that are cancelled before establishment, then resubscribed', function() {
      var subscription = this.client.subscribe('/datetime', function() { });

      var promise = this.client.connect()
        .bind(this)
        .then(function() {
          return subscription.unsubscribe();
        })
        .then(function() {
          var d = defer();
          return Promise.all([this.client.subscribe('/datetime', d.resolve), d.promise]);
        })
        .then(function() {
          assert.deepEqual(this.client.listChannels(), ['/datetime']);
        });

      // Cancel immediately
      subscription.unsubscribe();

      return promise;
    });

    it('should handle subscription failure correctly', function() {
      return this.client.subscribe('/banned', function() {
          assert(false);
        })
        .then(function() { assert(false); }, function() { });
    });

    it('should handle subscribe then followed by catch', function() {
      return this.client.subscribe('/banned', function() {
          assert(false);
        })
        .then(function() {
          assert(false);
        })
        .catch(function(err) {
          assert(err instanceof errors.BayeuxError);
          assert.strictEqual(err.message, 'Invalid subscription');
        });
    });

    it('should handle subscribe with catch', function() {
      var count = 0;
      return this.client.subscribe('/banned', function() {
          assert(false);
        })
        .catch(function(err) {
          assert(err instanceof errors.BayeuxError);
          assert.strictEqual(err.message, 'Invalid subscription');
          count++;
        })
        .then(function() {
          assert.strictEqual(count, 1);
        });
    });

    it('should deal with subscriptions that fail with unknown client', function() {
      return this.client.connect()
        .bind(this)
        .then(function() {
          return this.serverControl.deleteSocket(this.client.getClientId())
            .delay(100); // Give the server time to disconnect
        })
        .then(function() {
          var d = defer();

          var subscribe = this.client.subscribe('/datetime', d.resolve);
          return Promise.all([subscribe, d.promise]);
        });

    });

    it('cancelling one subscription during handshake should not affect another', function() {
      var subscribe1 = this.client.subscribe('/datetime', function() { });
      var subscribe2 = this.client.subscribe('/datetime', function() { });

      return Promise.delay(1)
        .bind(this)
        .then(function() {
          assert(subscribe1.isPending());
          return [subscribe1.unsubscribe(), subscribe2];
        })
        .spread(function(unsubscribe, subscription2) {
          assert.deepEqual(this.client.listChannels(), ['/datetime']);
          return subscription2.unsubscribe();
        })
        .then(function() {
          assert.deepEqual(this.client.listChannels(), []);
        });
    });

    it('unsubscribing from a channel after a disconnect should not reconnect the client', function() {
      return this.client.subscribe('/datetime', function() { })
        .bind(this)
        .then(function(subscription) {
          return this.client.disconnect()
            .bind(this)
            .then(function() {
              assert(this.client.stateIs('UNCONNECTED'));
              return subscription.unsubscribe();
            })
            .then(function() {
              assert(this.client.stateIs('UNCONNECTED'));
            });
        });
    });

    describe('extended tests #slow', function() {

      it('should handle multiple subscribe/unsubscribes', function() {
        var i = 0;
        var client = this.client;
        return (function next() {
            if (++i > 15) return;

            var subscribe = client.subscribe('/datetime', function() { });

            return (i % 2 === 0 ? subscribe : Promise.delay(1))
              .then(function() {
                return subscribe.unsubscribe();
              })
              .then(function() {
                assert.deepEqual(client.listChannels(), []);
              })
              .then(next);
          })()
          .then(function() {
            assert.deepEqual(client.listChannels(), []);
          });
      });
    });

  });

};
