/* jshint browser:true */
'use strict';

var Events = require('../util/externals').Events;
var extend = require('../util/externals').extend;
var debug  = require('debug')('halley:global-events');
// var ReactNative = require('react-native')
// var NetInfo = ReactNative.NetInfo

var SLEEP_TIMER_INTERVAL = 30000;

var globalEvents = {};
extend(globalEvents, Events);

/* Only install the listener in a browser environment */
if (typeof window !== 'undefined') {
  install();
}

installSleepDetector();

module.exports = globalEvents;

function fire(type) {
  return function(e) {
    debug(type);
    globalEvents.trigger(type, e);
  };
}

function install() {
//   window.addEventListener('online', fire('network'), false);
//   window.addEventListener('offline', fire('network'), false);

//   var navigatorConnection = window.navigator && (window.navigator.connection || window.navigator.mozConnection || window.navigator.webkitConnection);

//   if (navigatorConnection) {
//     navigatorConnection.addEventListener('typechange', fire('network'), false);
//   }
}

function installSleepDetector() {
  var sleepLast = Date.now();

  var timer = setInterval(function() {
    var now = Date.now();

    if(sleepLast - now > SLEEP_TIMER_INTERVAL * 2) {
      /* Sleep detected */
      debug('sleep');
      globalEvents.trigger('sleep');
    }

    sleepLast = now;
  }, SLEEP_TIMER_INTERVAL);

  // Unreference the timer in nodejs
  if (timer.unref) {
    timer.unref();
  }
}
