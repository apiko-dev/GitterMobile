'use strict';

var errors = require('../lib/util/errors');
var Promise = require('bluebird');
var assert = require('assert');

describe('errors', function() {

  it('TransportError should work with bluebird', function() {
    return Promise.reject(new errors.TransportError())
      .catch(errors.TransportError, errors.BayeuxError, function() {
      })
      .catch(function() {
        assert.ok(false);
      });
  });

  it('BayeuxError should work with bluebird', function() {
    return Promise.reject(new errors.BayeuxError())
      .catch(errors.TransportError, errors.BayeuxError, function() {
      })
      .catch(function() {
        assert.ok(false);
      });
  });

});
