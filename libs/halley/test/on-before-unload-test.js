'use strict';

var Halley = require('..');
var globalEvents = require('../lib/util/global-events');

describe('onbeforeunload', function() {
  var client;

  beforeEach(function() {
    client = new Halley.Client(this.urlDirect, { timeout: 45 });
  });

  afterEach(function() {
    client.disconnect();
  });

  it('should respond to beforeunload correctly', function(done) {
    var count = 0;
    var subscription = client.subscribe('/datetime', function() {
      count++;

      if (count === 3) {
        client.on('disconnect', done);
        globalEvents.trigger('beforeunload');
      }
    });

    subscription.catch(function(err) {
      done(err);
    });

  });

});
