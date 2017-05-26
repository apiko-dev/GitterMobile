'use strict';

var wtf      = require('wtfnode'); // Must be first
var Halley   = require('../..');
var Promise  = require('bluebird');

var url      = process.argv[2];

var client = new Halley.Client(url);

function doSubscribe() {
  return client.publish('/channel', { data: 1 })
    .then(function() {
      var resolve;
      var gotMessage = new Promise(function(res) {
        resolve = res;
      });

      return [gotMessage, client.subscribe('/datetime', function() {
        resolve();
      })];
    })
    .spread(function(message, subscription) {
      return subscription.unsubscribe();
    });
}

function doNoSubscribe() {
  return client.connect()
    .then(function() {
      return Promise.delay(client._advice.timeout + 1000);
    });
}

(process.env.SUBSCRIBE ? doSubscribe() : doNoSubscribe())
  .then(function() {
    return client.disconnect();
  })
  .then(function() {
    client = null;
    setInterval(function() {
      wtf.dump();
    }, 1000).unref();
  })
  .catch(function(err) {
    console.error(err && err.stack || err);
    process.exit(1);
  })
  .done();
