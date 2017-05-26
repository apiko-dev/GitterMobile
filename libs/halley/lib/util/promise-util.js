
'use strict';

var Promise = require('bluebird');

exports.danglingFinally = danglingFinally;
exports.Synchronized    = Synchronized;
exports.LazySingleton   = LazySingleton;
exports.cancelBarrier   = cancelBarrier;
exports.after           = after;
exports.Throttle        = Throttle;
exports.Batcher         = Batcher;
exports.Sequencer       = Sequencer;

/**
 * Adds a finally clause not chained to the original
 * promise, which allows the `fn` called to use
 * reflection methods like `isFulfilled`
 *
 * Catches any errors to prevent bluebird warnings.
 * The other fork of the promise should handle the
 * real exception chain
 */
function danglingFinally(promise, fn, context) {
  promise.catch(function() {})
    .finally(function() {
      fn.call(context);
      return null;
    });

  return promise;
}
/**
 * Returns a promise which will always resolve after the provided
 * promise is no longer pending. Will resolve even if the upstream
 * promise is cancelled.
 */
function after(promise) {
  if (!promise.isPending()) return Promise.resolve();

  return new Promise(function(resolve) {
    danglingFinally(promise, function() {
      return resolve();
    });
  });
}

/* Prevent a cancel from propogating upstream */
function cancelBarrier(promise) {
  if (!promise.isPending()) return promise;

  return new Promise(function(resolve, reject) {
    return promise.then(resolve, reject);
  });
}

function LazySingleton(factory) {
  this.value = null;
  this._factory = factory;
}

LazySingleton.prototype = {
  get: function() {
    var value = this.value;
    if (value) {
      return value;
    }

    value = this.value = Promise.try(this._factory);

    return value
      .bind(this)
      .finally(function() {
        if (value !== this.value) return;

        if (!value.isFulfilled()) {
          this.value = null;
        }
      });
  },

  peek: function() {
    return this.value;
  },

  clear: function() {
    this.value = null;
  }
};

function Synchronized() {
  this._keys = {};
}

Synchronized.prototype = {
  sync: function(key, fn) {
    var keys = this._keys;
    var pending = keys[key];

    if (pending) {
      // Append to the end and wait
      pending = keys[key] = after(pending)
        .bind(this)
        .then(function() {
          if (pending === keys[key]) {
            delete keys[key];
          }

          return fn();
        });
    } else {
      // Execute immediately
      pending = keys[key] = Promise.try(fn)
        .finally(function() {
          if (pending === keys[key]) {
            delete keys[key];
          }
        });
    }

    return pending;
  }
};

function Throttle(fn, delay) {
  this._fn = fn;
  this._delay = delay;
  this._next = null;
  this._resolveNow = null;
  this._rejectNow = null;
  this._timer = null;
}

Throttle.prototype = {
  fire: function(forceImmediate) {
    if (this._next) {
      if (forceImmediate) {
        this._resolveNow();
      }

      // Return a fork of the promise
      return this._next.tap(function() { });
    }

    var promise = this._next = new Promise(function(resolve, reject) {
        this._resolveNow = resolve;
        this._rejectNow = reject;

        if (forceImmediate) {
          resolve();
        } else {
          this._timer = setTimeout(function() {
            this._timer = null;
            resolve();
          }.bind(this), this._delay);
        }
      }.bind(this))
      .bind(this)
      .finally(this._cleanup)
      .then(function() {
        return this._fn();
      });

    // Return a fork of the promise
    return promise.tap(function() {});
  },

  _cleanup: function() {
    if (this._timer) {
      clearTimeout(this._timer);
      this._timer = null;
    }

    this._next = null;
    this._fireNow = null;
    this._rejectNow = null;
  },

  destroy: function(e) {
    if (this._rejectNow) {
      this._rejectNow(e);
    }
    this._cleanup();
  }
};

function Batcher(fn, delay) {
  this._throttle = new Throttle(this._dequeue.bind(this), delay);
  this._fn = Promise.method(fn);
  this._pending = [];
}

Batcher.prototype = {
  add: function(value, forceImmediate) {
    var defer = { value: undefined, promise: undefined };

    var resolve, reject;
    var promise = new Promise(function(res, rej) {
      resolve = res;
      reject = rej;
    });

    defer.value = value;
    defer.promise = promise;

    this._pending.push(defer);

    this._throttle.fire(forceImmediate)
      .then(resolve, reject);

    return promise;
  },

  next: function(forceImmediate) {
    return this._throttle.fire(forceImmediate);
  },

  _dequeue: function() {
    var pending = this._pending;
    this._pending = [];

    var values = pending.filter(function(defer) {
      return !defer.promise.isCancelled();
    }).map(function(defer) {
      return defer.value;
    });

    if (!values.length) return;

    return this._fn(values);
  },

  destroy: function(e) {
    this._throttle.destroy(e);
    this._pending = [];
  }
};

/**
 * The sequencer will chain a series of promises together
 * one after the other.
 *
 * It will also handle rejections and cancelations
 */
function Sequencer() {
  this._queue = [];
  this._executing = false;
}

Sequencer.prototype = {
  chain: function(fn) {
    var queue = this._queue;
    var resolve, reject;

    var promise = new Promise(function(res, rej) {
      resolve = res;
      reject = rej;
    }).then(fn);

    queue.push({ resolve: resolve, reject: reject, promise: promise });
    this._dequeue();

    return promise;
  },

  _dequeue: function() {
    if (this._executing) return;
    var queue = this._queue;

    var next = queue.pop();
    if (!next) return;

    next.resolve();

    this._executing = next.promise;
    danglingFinally(next.promise, function() {
      this._executing = null;
      this._dequeue();
    }, this);
  },

  /**
   * Removes all items from the queue and rejects them with
   * the supplied error.
   *
   * Returns a promise which will always resolve once any outstanding
   * promises are finalised
   */
  clear: function(err) {
    var queue = this._queue;
    this._queue = [];

    queue.forEach(function(item) {
      item.reject(err);
    });

    if (this._executing) {
      return after(this._executing);
    } else {
      return Promise.resolve();
    }
  }
};
