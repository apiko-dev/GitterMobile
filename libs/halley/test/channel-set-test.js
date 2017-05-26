'use strict';

var ChannelSet   = require('../lib/protocol/channel-set');
var Subscription = require('../lib/protocol/subscription');
var assert       = require('assert');
var Promise      = require('bluebird');
var sinon        = require('sinon');

function settleAll(promises) {
  return Promise.all(promises.map(function(promise) { return promise.reflect(); }));
}

describe('channel-set', function() {

  beforeEach(function() {
    this.onSubscribe = sinon.spy(function() {
      return Promise.delay(1);
    });

    this.onUnsubscribe = sinon.spy(function() {
      return Promise.delay(1);
    });

    this.onSubscribeBadChannel = sinon.spy(function() {
      return Promise.delay(1).throw(new Error('Fail'));
    });

    this.onUnsubscribeBadChannel = sinon.spy(function() {
      return Promise.delay(1).throw(new Error('Fail'));
    });

    this.sub1 = new Subscription();
    this.sub2 = new Subscription();
    this.sub3 = new Subscription();

    this.channelSet = new ChannelSet(this.onSubscribe, this.onUnsubscribe);
    this.channelSetBadChannel = new ChannelSet(this.onSubscribeBadChannel, this.onUnsubscribeBadChannel);
  });

  it('should subscribe', function() {
    return this.channelSet.subscribe('/x', this.sub1)
      .bind(this)
      .then(function() {
        assert(this.onSubscribe.calledWith('/x'));
        assert(this.onSubscribe.calledOnce);

        assert.deepEqual(this.channelSet.getKeys(), ['/x']);
      });
  });

  it('should unsubscribe correctly', function() {
    return this.channelSet.subscribe('/x', this.sub1)
      .bind(this)
      .then(function() {
        assert(this.onSubscribe.calledWith('/x'));
        assert(this.onSubscribe.calledOnce);
        assert(this.onUnsubscribe.notCalled);

        return this.channelSet.unsubscribe('/x', this.sub1);
      })
      .then(function() {
        assert(this.onSubscribe.calledOnce);
        assert(this.onUnsubscribe.calledOnce);
        assert(this.onUnsubscribe.calledWith('/x'));
      });
  });


  it('should serialize multiple subscribes that occur in parallel', function() {
    return Promise.all([
        this.channelSet.subscribe('/x', this.sub1),
        this.channelSet.subscribe('/x', this.sub2)
      ])
      .bind(this)
      .then(function() {
        assert(this.onSubscribe.calledWith('/x'));
        assert(this.onSubscribe.calledOnce);
      })
      .then(function() {
        assert.deepEqual(this.channelSet.getKeys(), ['/x']);
      });
  });

  it('should fail both subscriptions when subscribe occurs in parallel', function() {
    var p1 = this.channelSetBadChannel.subscribe('/x', this.sub1);
    var p2 = this.channelSetBadChannel.subscribe('/x', this.sub2);

    // Surpress warnings in tests:
    p1.catch(function() {});
    p2.catch(function() {});

    return settleAll([p1, p2])
      .bind(this)
      .each(function(x) {
        assert(x.isRejected());

        assert(this.onSubscribeBadChannel.calledWith('/x'));
        assert(this.onSubscribeBadChannel.calledTwice);
      })
      .then(function() {
        assert.deepEqual(this.channelSetBadChannel.getKeys(), []);
      });
  });

  it('should serialize subscribes followed by unsubscribed', function() {
    return Promise.all([
        this.channelSet.subscribe('/x', this.sub1),
        this.channelSet.unsubscribe('/x', this.sub1),
        this.channelSet.subscribe('/x', this.sub2)
      ])
      .bind(this)
      .then(function() {
        assert(this.onSubscribe.calledWith('/x'));
        assert(this.onSubscribe.calledTwice);

        assert(this.onUnsubscribe.calledWith('/x'));
        assert(this.onUnsubscribe.calledOnce);

        assert.deepEqual(this.channelSet.getKeys(), ['/x']);
      });
  });

  it('should handle parallel subscribes being cancelled', function() {
    var s1 = this.channelSet.subscribe('/x', this.sub1);
    var s2 = this.channelSet.subscribe('/x', this.sub2);

    s1.cancel();

    return s2
      .bind(this)
      .then(function() {
        assert(s1.isCancelled());

        assert(this.onSubscribe.calledWith('/x'));
        assert(this.onSubscribe.calledTwice);
      });

  });

});
