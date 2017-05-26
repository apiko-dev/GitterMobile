'use strict';

var promiseUtil = require('../lib/util/promise-util');
var assert = require('assert');
var Promise = require('bluebird');

describe('promise-util', function() {
  describe('Synchronized', function() {

    beforeEach(function() {
      this.sync = new promiseUtil.Synchronized();
    });

    it('should synchronize access with a single item', function() {
      return this.sync.sync('1', function() {
          return 'a';
        })
        .bind(this)
        .then(function(result) {
          assert.deepEqual(this.sync._keys, {});
          assert.strictEqual(result, 'a');
        });
    });

    it('should propogate rejections', function() {
      return this.sync.sync('1', function() {
          throw new Error('Crash');
        })
        .bind(this)
        .then(function() {
          assert.ok('Expected failure');
        }, function(err) {
          assert.strictEqual(err.message, 'Crash');
        });
    });

    it('should propogate on queued items', function() {
      this.sync.sync('1', function() { return Promise.delay(1).return('a'); });
      return this.sync.sync('1', function() {
          return Promise.reject(new Error('Queued error'));
        })
        .bind(this)
        .then(function() {
          assert.ok(false, 'Expected exception');
        }, function(err) {
          assert.strictEqual(err.message, 'Queued error');
        })
        .then(function() {
          assert.deepEqual(this.sync._keys, {});
        });
    });

    it('should synchronize access with multiple items', function() {
      var count = 0;
      return Promise.all([
          this.sync.sync('1', function() { assert.strictEqual(count++, 0); return Promise.delay(2).return('a'); }),
          this.sync.sync('1', function() { assert.strictEqual(count++, 1); return 'b'; })
        ])
        .bind(this)
        .then(function(result) {
          assert.strictEqual(count, 2);
          assert.deepEqual(this.sync._keys, {});
          assert.deepEqual(result, ['a', 'b']);
        });
    });

    it('upstream rejections should be isolated', function() {
      var count = 0;

      this.sync.sync('1', function() {
        return Promise.reject(new Error('Random'));
      }).catch(function(err) {
        assert(err.message, 'Random');
        count++;
      });

      return this.sync.sync('1', function() { return 'b'; })
        .bind(this)
        .then(function(result) {
          assert.strictEqual(count, 1);

          assert.deepEqual(this.sync._keys, {});
          assert.deepEqual(result, 'b');
        });
    });

    it('cancellation should work', function() {
      var count = 0;

      var p = this.sync.sync('1', function() {
        return new Promise(function(resolve, reject, onCancel) {
           Promise.delay(1).then(resolve);

           onCancel(function() {
             count++;
           });
        });
      });

      p.cancel();

      return Promise.delay(2)
        .then(function() {
          assert.strictEqual(count, 1);
        });
    });


    it('upstream cancellations should be isolated', function() {
      var p1 = this.sync.sync('1', function() { return Promise.delay(3).return('a'); });
      var p2 = this.sync.sync('1', function() { return 'b'; });
      return Promise.delay(1)
        .bind(this)
        .then(function() {
          p1.cancel();
          return p2;
        })
        .then(function(result) {
          assert.deepEqual(result, 'b');
          assert.deepEqual(this.sync._keys, {});
        });
    });

  });

  describe('cancelBarrier', function() {

    it('should propogate resolve', function() {
      return promiseUtil.cancelBarrier(Promise.resolve('a'))
        .then(function(result) {
          assert.strictEqual(result, 'a');
        });
    });

    it('should propogate reject', function() {
      var e = new Error();
      return promiseUtil.cancelBarrier(Promise.reject(e))
        .then(function() {
          assert.ok(false);
        }, function(err) {
          assert.strictEqual(err, e);
        });
    });

    it('should prevent cancellations from propogating past the barrier', function() {
      var count = 0;
      var resolve;
      var p1 = new Promise(function(res, rej, onCancel) {
        resolve = res;
        onCancel(function() {
          count++;
        });
      });

      var p2 = promiseUtil.cancelBarrier(p1)
        .then(function(x) {
          return x;
        });

      p2.cancel();
      resolve('a');
      return p1
        .then(function(result) {
          assert.strictEqual(result, 'a');
        });
    });

  });

  describe('after', function() {

    it('should execute after resolve', function() {
      return promiseUtil.after(Promise.resolve('a'));
    });

    it('should execute after reject', function() {
      var e = new Error();
      var p = Promise.delay(1).throw(e);
      p.catch(function() {
        // Dangling catch to prevent bluebird warnings
      });

      return promiseUtil.after(p);
    });

    it('should propogate when the source promise is cancelled', function() {
      var count = 0;
      var resolve;
      var p1 = new Promise(function(res, rej, onCancel) {
        resolve = res;
        onCancel(function() {
          count++;
        });
      });

      var p2 = promiseUtil.after(p1)
        .then(function() {
          assert.strictEqual(count, 1);
        });

      p1.cancel();

      return p2;
    });


    it('should execute in sequence', function() {
      var count = 0;
      var p1 = Promise.resolve('a');
      var p2 = promiseUtil.after(p1).then(function() { assert.strictEqual(count, 0); count++; });
      var p3 = promiseUtil.after(p2).then(function() { assert.strictEqual(count, 1); count++;  });
      var p4 = promiseUtil.after(p3).then(function() { assert.strictEqual(count, 2); count++; });
      return p4.then(function() {
        assert.strictEqual(count, 3);
      });
    });
  });

  describe('LazySingleton', function() {

    beforeEach(function() {
      this.count = 0;
      this.lazySingleton = new promiseUtil.LazySingleton(function() {
        this.count++;
        return this.singletonValue;
      }.bind(this));

    });

    it('should return a value', function() {
      this.singletonValue = Promise.resolve('a');
      return this.lazySingleton.get()
        .bind(this)
        .then(function(a) {
          assert.strictEqual(this.count, 1);
          assert.strictEqual(a, 'a');
        });
    });

    it('should cache the results', function() {
      this.singletonValue = Promise.resolve('a');
      return this.lazySingleton.get()
        .bind(this)
        .then(function(a) {
          assert.strictEqual(this.count, 1);
          assert.strictEqual(a, 'a');
          return this.lazySingleton.get();
        })
        .then(function(a) {
          assert.strictEqual(this.count, 1);
          assert.strictEqual(a, 'a');
        });
    });

    it('should not make multiple calls', function() {
      this.singletonValue = Promise.delay(1).return('a');
      return Promise.all([
          this.lazySingleton.get(),
          this.lazySingleton.get()
        ])
        .bind(this)
        .then(function(a) {
          assert.strictEqual(this.count, 1);
          assert.deepEqual(a, ['a', 'a']);
        });
    });

    it('should handle cancellations', function() {
      this.singletonValue = Promise.delay(10).return('a');

      return Promise.delay(0)
        .bind(this)
        .then(function() {
          assert(this.singletonValue.isPending());
          this.singletonValue.cancel();
          return promiseUtil.after(this.lazySingleton.get());
        })
        .then(function() {
          assert.strictEqual(this.count, 1);

          this.singletonValue = Promise.delay(1).return('a');
          return this.lazySingleton.get();
        })
        .then(function(a) {
          assert.strictEqual(this.count, 2);
          assert.strictEqual(a, 'a');
        });

    });

  });

  describe('Throttle', function() {
    beforeEach(function() {
      this.count = 0;
      this.throwError = false;
      this.throttle = new promiseUtil.Throttle(function() {
        this.count++;
        if (this.throwError) throw new Error('Fail');
      }.bind(this), 10);

      this.slowThrottle = new promiseUtil.Throttle(function() {
        this.count++;
      }.bind(this), 1000000);
    });

    it('should throttle calls', function() {
      return Promise.all([
          this.throttle.fire(),
          this.throttle.fire(),
          this.throttle.fire()
        ])
        .bind(this)
        .then(function() {
          assert.strictEqual(this.count, 1);
        });
    });

    it('should respect fireImmediate', function() {
      return Promise.all([
          this.throttle.fire(),
          this.throttle.fire(true),
          Promise.delay(10).bind(this).then(function()  {
            return this.throttle.fire();
          })
        ])
        .bind(this)
        .then(function() {
          assert.strictEqual(this.count, 2);
        });
    });

    it('should not wait if fireImmediate is called on the first call', function() {
      return this.slowThrottle.fire(true)
        .bind(this)
        .then(function() {
          assert.strictEqual(this.count, 1);
        });
    });

    it('should reject on destroy', function() {
      var p = this.slowThrottle.fire();
      var e = new Error();
      this.slowThrottle.destroy(e);
      return p.then(function() {
          assert.ok(false);
        }, function(err) {
          assert.strictEqual(err, e);
        });
    });

    it('should handle cancellations', function() {
      var p = this.throttle.fire();
      return Promise.delay(1)
        .bind(this)
        .then(function() {

          assert(p.isCancellable());
          p.cancel();
          return Promise.delay(15);
        })
        .then(function() {
          assert.strictEqual(this.count, 0);
        });
    });

    it('should isolate cancels from one another', function() {
      var p = this.throttle.fire();
      var p2 = this.throttle.fire();

      return Promise.delay(1)
        .bind(this)
        .then(function() {
          assert(p.isCancellable());
          p.cancel();
          return p2;
        })
        .then(function() {
          assert.strictEqual(this.count, 1);
        });
    });

    it('should cancel the trigger when all fires are cancelled', function() {
      var p = this.throttle.fire();
      var p2 = this.throttle.fire();

      return Promise.delay(1)
        .bind(this)
        .then(function() {
          assert(p.isCancellable());
          assert(p2.isCancellable());
          p.cancel();
          p2.cancel();
          return Promise.delay(15);
        })
        .then(function() {
          assert.strictEqual(this.count, 0);
        });
    });

    it('should handle rejections', function() {
      this.throwError = true;
      return this.throttle.fire()
        .bind(this)
        .then(function() {
          assert.ok(false, 'Expected error');
        }, function(err) {
          assert.strictEqual(err.message, 'Fail');
        });
    });
  });

  describe('Batcher', function() {

    beforeEach(function() {
      this.count = 0;
      this.batcher = new promiseUtil.Batcher(function(items) {
        this.count++;
        this.items = items;
        return 'Hello';
      }.bind(this), 10);
    });

    it('should call on add', function() {
      return this.batcher.add(10)
        .then(function(value) {
          assert.strictEqual(value, 'Hello');
        });
    });

    it('should call on add with multiple items', function() {
      return Promise.all([
          this.batcher.add(1),
          this.batcher.add(2),
        ])
        .spread(function(a,b) {
          assert.strictEqual(a, 'Hello');
          assert.strictEqual(b, 'Hello');
        });
    });

    it('should return a value', function() {
      var p1 = this.batcher.add(1);
      var p2 = this.batcher.add(2);
      var p3 = this.batcher.add(3);

      assert(p1.isCancellable());
      p1.cancel();

      return this.batcher.next()
        .bind(this)
        .then(function() {
          assert(p1.isCancelled());
          assert.strictEqual(this.count, 1);
          assert.deepEqual(this.items, [2, 3]);
          return Promise.all([p2, p3]);
        })
        .spread(function(a,b) {
          assert.strictEqual(a, 'Hello');
          assert.strictEqual(b, 'Hello');
        });
    });

    it('should not batch if all the items are cancelled', function() {
      var p1 = this.batcher.add(1);
      var p2 = this.batcher.add(2);
      p1.cancel();
      p2.cancel();

      return Promise.delay(15)
        .bind(this)
        .then(function() {
          assert.strictEqual(this.count, 0);
        });
    });

  });


  describe('Sequencer', function() {

    beforeEach(function() {
      this.inPlay = 0;
      this.count = 0;
      this.sequencer = new promiseUtil.Sequencer();
      this.fn = function() {
        this.inPlay++;
        this.count++;
        var count = this.count;
        assert.strictEqual(this.inPlay, 1);
        return Promise.delay(1)
          .bind(this)
          .then(function() {
            this.inPlay--;
            assert.strictEqual(this.inPlay, 0);
            return count;
          });
      }.bind(this);

      this.fnReject = function() {
        this.count++;
        return Promise.delay(1)
          .bind(this)
          .then(function() {
            throw new Error('Fail');
          });
      }.bind(this);

      this.fnWillBeCancelled = function() {
        this.count++;
        var promise = new Promise(function() {});

        Promise.delay(1)
          .then(function() {
            promise.cancel();
          });

        return promise;
      }.bind(this);

    });

    it('should sequence multiple calls', function() {
      return Promise.all([
          this.sequencer.chain(this.fn),
          this.sequencer.chain(this.fn)
        ])
        .bind(this)
        .spread(function(a, b) {
          assert.strictEqual(a, 1);
          assert.strictEqual(b, 2);
          assert.strictEqual(this.count, 2);
        });
    });

    it('should handle rejections', function() {
      var promises = [this.sequencer.chain(this.fnReject), this.sequencer.chain(this.fn)];
      return Promise.all(promises.map(function(promise) {
          return promise.reflect();
        }))
        .bind(this)
        .spread(function(a, b) {
          assert(a.isRejected());

          assert.strictEqual(a.reason().message, 'Fail');

          assert(b.isFulfilled());
          assert.strictEqual(b.value(), 2);
          assert.strictEqual(this.count, 2);
          return a;
        });
    });


    it('should handle upstream cancellations', function() {
      var p1 = this.sequencer.chain(this.fnWillBeCancelled);
      var p2 = this.sequencer.chain(this.fn);

      return p2.bind(this)
        .then(function(value) {
          assert(p1.isCancelled());

          assert(p2.isFulfilled());
          assert.strictEqual(value, 2);
          assert.strictEqual(this.count, 2);
        });
    });

    it('should handle downstream cancellations', function() {
      var count = 0;

      var p1 = this.sequencer.chain(function() {
        return Promise.delay(1).then(function() {
          count++;
          assert.ok(false);
        });
      });

      var p2 = this.sequencer.chain(function() {
        assert.strictEqual(count, 0);
      });

      p1.cancel();
      return p2;
    });

    it('should handle the queue being cleared', function() {
      var count = 0;
      var p1 = this.sequencer.chain(function() {
        return Promise.delay(1).then(function() {
          count++;
          return "a";
        });
      });

      var p2 = this.sequencer.chain(function() {
        return Promise.delay(1).then(function() {
          count++;
        });
      });

      p2.catch(function() {}); // Stop warnings

      var err = new Error('Queue cleared');

      return this.sequencer.clear(err)
        .then(function() {
          assert.strictEqual(count, 1);
          assert(p1.isFulfilled());
          assert.strictEqual(p1.value(), "a");

          return p2.reflect();
        })
        .then(function(r) {
          assert.strictEqual(count, 1);
          assert(r.isRejected());
          assert.strictEqual(r.reason(), err);
        });

    });

  });


});
