'use strict';

var Promise = require('bluebird');

function Extensions() {
  this._extensions = [];
}

Extensions.prototype = {
  add: function(extension) {
    this._extensions.push(extension);
  },

  remove: function(extension) {
    this._extensions = this._extensions.filter(function(e) {
      return e !== extension;
    });
  },

  pipe: function(stage, message) {
    var extensions = this._extensions;

    if (!extensions || extensions.length === 0) return Promise.resolve(message);

    extensions = extensions.filter(function(extension) {
      return extension && extension[stage];
    });

    if (!extensions.length) return Promise.resolve(message);

    // Since most of the extensions are synchronous, using
    // a callback style iterator tends to be an order
    // of magnitude faster than a Promise.reduce style
    // function here
    return new Promise(function(resolve) {
      var index = 0;
      (function next(message) {
        var current = index++;
        if (current >= extensions.length) {
          return resolve(message);
        }

        var extension = extensions[current];
        var fn = extension[stage];
        fn.call(extension, message, next);
      })(message);
    });
  }
};

module.exports = Extensions;
