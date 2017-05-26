'use strict';

var Promise = require('bluebird');
var assert = require('assert');

module.exports = function() {

  describe('client-publish', function() {

    it('should handle publishes', function() {
      var client = this.client;

      return client.publish('/channel', { data: 1 });
    });

    it('should fail when a publish does not work', function() {
      return this.client.publish('/devnull', { data: 1 }, { attempts: 1 })
        .then(function() {
          throw new Error('Expected failure');
        }, function() {
          // Swallow the error
        });

    });

    it('should handle a large number of publish messages', function() {
      var count = 0;
      var self = this;
      return (function next() {
        count++;
        if (count >= 10) return;

        return self.client.publish('/channel', { data: count })
          .then(function() {
            return next();
          });
      })();
    });

    it('should handle a parallel publishes', function() {
      var count = 0;
      var self = this;
      return (function next() {
        count++;
        if (count >= 20) return;

        return Promise.all([
            self.client.publish('/channel', { data: count }),
            self.client.publish('/channel', { data: count }),
            self.client.publish('/channel', { data: count }),
          ])
          .then(function() {
            return next();
          });
      })();
    });

    it('should handle the cancellation of one publish without affecting another', function() {
      var p1 = this.client.publish('/channel', { data: 1 })
        .then(function() {
          throw new Error('Expected error');
        });

      var p2 = this.client.publish('/channel', { data: 2 });
      p1.cancel();

      return p2.then(function(v) {
          assert(v.successful);
          assert(p1.isCancelled());
          assert(p2.isFulfilled());
        });

    });


  });

};
