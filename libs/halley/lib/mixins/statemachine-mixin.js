'use strict';

var Promise       = require('bluebird');
var Sequencer     = require('../util/promise-util').Sequencer;
var cancelBarrier = require('../util/promise-util').cancelBarrier;
var debug         = require('debug')('halley:fsm');

var StateMachineMixin = {
  initStateMachine: function(config) {
    this._config = config;
    this._state = config.initial;
    this._sequencer = new Sequencer();
    this._pendingTransitions = {};
    this._stateReset = false;
  },

  getState: function() {
    return this._state;
  },

  stateIs: function() {
    // 99% case optimisation
    if (arguments.length === 1) {
      return this._state === arguments[0];
    }

    for(var i = 0; i < arguments.length; i++) {
      if(this._state === arguments[i]) return true;
    }

    return false;
  },

  transitionState: function(transition, options) {
    // No new states can be queued during a reset
    if (this._stateReset) return Promise.reject(this._stateReset);

    var pending = this._pendingTransitions;

    if (options && options.dedup) {
      // The caller can specify that it there is already
      // a pending transition of the given type
      // wait on that, rather than queueing another.
      var pendingTransition = this._findPending(transition);

      if (pendingTransition) {
        debug('transition state: %s (dedup)', transition);
        return pendingTransition;
      }
    }

    var next = this._sequencer.chain(function() {
      return this._dequeueTransition(transition, options);
    }.bind(this));

    if (!pending[transition]) {
      // If this is the first transition of it's type
      // save it for deduplication
      pending[transition] = next;
    }

    return next.finally(function() {
      if (pending[transition] === next) {
        delete pending[transition];
      }
    });
  },

  resetTransition: Promise.method(function(transition, reason, options) {
    if (this._stateReset) return; // TODO: consider

    if (options && options.dedup) {
      var pending = this._findPending(transition);
      if (pending) {
        debug('transition state: %s (dedup)', transition);
        return pending;
      }
    }

    this._stateReset = reason;

    return this._sequencer.clear(reason)
      .bind(this)
      .then(function() {
        this._stateReset = null;
        return this.transitionState(transition, options);
      });
  }),

  _findPending: function(transition) {
    var pending = this._pendingTransitions;

    // The caller can specify that it there is already
    // a pending transition of the given type
    // wait on that, rather than queueing another.
    return pending[transition];
  },

  _dequeueTransition: Promise.method(function(transition, options) {
    var optional = options && options.optional;

    debug('%s: Performing transition: %s', this._config.name, transition);
    var newState = this._findTransition(transition);
    if (!newState) {
      if(!optional) {
        throw new Error('Unable to perform transition ' + transition + ' from state ' + this._state);
      }

      return null;
    }

    if (newState === this._state) return null;

    debug('%s: leave: %s', this._config.name, this._state);
    this._triggerStateLeave(this._state, newState);

    var oldState = this._state;
    this._state = newState;

    debug('%s enter:%s', this._config.name, this._state);
    var promise = this._triggerStateEnter(this._state, oldState)
      .bind(this)
      .catch(this._transitionError)
      .then(function(nextTransition) {
        if (nextTransition) {
          if (this._stateReset) {
            // No automatic transition on state reset
            throw this._stateReset;
          }

          return this._dequeueTransition(nextTransition);
        }

        return null;
      })


    // State transitions can't be cancelled
    return cancelBarrier(promise);
  }),

  /* Find the next state, given the current state and a transition */
  _findTransition: function(transition) {
    var currentState = this._state;
    var transitions = this._config.transitions;
    var newState = transitions[currentState] && transitions[currentState][transition];
    if (newState) return newState;

    var globalTransitions = this._config.globalTransitions;
    return globalTransitions && globalTransitions[transition];
  },

  _triggerStateLeave: function(currentState, nextState) {
    var handler = this['_onLeave' + currentState];
    if (handler) {
      return handler.call(this, nextState);
    }
  },

  _triggerStateEnter: Promise.method(function(newState, oldState) {
    if (this.onStateChange) {
      this.onStateChange(newState, oldState);
    }

    var handler = this['_onEnter' + newState];
    if (handler) {
      return handler.call(this, oldState) || null;
    }

    return null;
  }),

  _transitionError: function(err) {
    // No automatic transitions on stateReset
    if (this._stateReset) throw err;

    var state = this._state;
    debug('Error while entering state %s: %s', state, err);

    // Check if the state has a error transition
    var errorTransitionState = this._findTransition('error');
    if (errorTransitionState) {
      return this._dequeueTransition('error');
    }

    /* No error handler, just throw */
    throw err;
  }
};

module.exports = StateMachineMixin;
