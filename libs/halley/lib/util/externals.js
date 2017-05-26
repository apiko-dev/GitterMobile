'use strict';

var dependencies = {
  use: function(deps) {
    Object.keys(deps).forEach(function(key) {
      dependencies[key] = deps[key];
    });
  }
};

module.exports = dependencies;
