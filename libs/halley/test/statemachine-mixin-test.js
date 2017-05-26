'use strict';

var StateMachineMixin = require('../lib/mixins/statemachine-mixin');
var assert            = require('assert');
var extend            = require('../lib/util/externals').extend;
var Promise           = require('bluebird');

describe('statemachine-mixin', function() {

  describe('normal flow', function() {

    beforeEach(function() {

      var TEST_FSM = {
        name: "test",
        initial: "A",
        transitions: {
          A: {
            t1: "B"
          },
          B: {
            t2: "C"
          },
          C: {
            t3: "A"
          }
        }
      };

      function TestMachine() {
        this.initStateMachine(TEST_FSM);
      }

      TestMachine.prototype = {
      };
      extend(TestMachine.prototype, StateMachineMixin);

      this.testMachine = new TestMachine();
    });

    it('should transition', function() {
      return this.testMachine.transitionState('t1')
        .bind(this)
        .then(function() {
          assert(this.testMachine.stateIs('B'));
        });
    });

    it('should serialize transitions', function() {
      return Promise.all([
          this.testMachine.transitionState('t1'),
          this.testMachine.transitionState('t2')
        ])
        .bind(this)
        .then(function() {
          assert(this.testMachine.stateIs('C'));
        });
    });

    it('should handle optional transitions', function() {
      return this.testMachine.transitionState('doesnotexist', { optional: true })
        .bind(this)
        .then(function() {
          assert(this.testMachine.stateIs('A'));
        });
    });

    it('should reject invalid transitions', function() {
      return this.testMachine.transitionState('doesnotexist')
        .bind(this)
        .then(function() {
          assert.ok(false);
        }, function(err) {
          assert.strictEqual(err.message, 'Unable to perform transition doesnotexist from state A');
        });
    });

    it('should proceed with queued transitions after a transition has failed', function() {
      return Promise.all([
          this.testMachine.transitionState('doesnotexist'),
          this.testMachine.transitionState('t1'),
        ].map(function(p) { return p.reflect(); }))
        .bind(this)
        .spread(function(p1, p2) {
          assert(p1.isRejected());
          assert(p2.isFulfilled());
          assert(this.testMachine.stateIs('B'));
        });

    });
  });

  describe('automatic transitioning', function() {

    beforeEach(function() {

      var TEST_FSM = {
        name: "test",
        initial: "A",
        transitions: {
          A: {
            t1: "B",
            t2: "C"
          },
          B: {
            t3: "C"
          },
          C: {
            t4: "A"
          }
        }
      };

      function TestMachine() {
        this.initStateMachine(TEST_FSM);
      }

      TestMachine.prototype = {
        _onEnterA: function() {
          return 't1';
        },
        _onEnterB: function() {
          return 't3';
        },
        _onEnterC: function() {
        }
      };
      extend(TestMachine.prototype, StateMachineMixin);

      this.testMachine = new TestMachine();

    });

    it('should transition', function() {
      return this.testMachine.transitionState('t1')
        .bind(this)
        .then(function() {
          assert(this.testMachine.stateIs('C'));
        });
    });

    it.skip('should reject on state transitions', function() {
      return Promise.all([
          this.testMachine.waitForState({
            rejected: 'B',
            fulfilled: 'C'
          }),
          this.testMachine.transitionState('t1')
        ])
        .bind(this)
        .then(function() {
          assert.ok(false);
        }, function(err) {
          assert.strictEqual(err.message, 'State is B');
        });
    });

    it.skip('should wait for state transitions when already in the state', function() {
      return this.testMachine.waitForState({
          fulfilled: 'A'
        })
        .bind(this)
        .then(function() {
          assert(this.testMachine.stateIs('A'));
        });
    });

    it.skip('should reject state transitions when already in the state', function() {
      return this.testMachine.waitForState({
          fulfilled: 'C',
          rejected: 'A'
        })
        .bind(this)
        .then(function() {
          assert.ok(false);
        }, function() {
          assert.ok(true);
        });
    });

    it.skip('should timeout waiting for state transitions', function() {
      return this.testMachine.waitForState({
          fulfilled: 'C',
          rejected: 'B',
          timeout: 1
        })
        .bind(this)
        .then(function() {
          assert.ok(false);
        }, function(err) {
          assert.strictEqual(err.message, 'Timeout waiting for state C');
        });
    });

  });

  describe('error handling', function() {

    beforeEach(function() {

      var TEST_FSM = {
        name: "test",
        initial: "A",
        transitions: {
          A: {
            t1: "B",
            t4: "C",
            t6: 'FAIL_ON_ENTER'
          },
          B: {
            t2: "C",
            error: 'D'
          },
          C: {
            t5: 'E'
          },
          D: {
            t3: "E"
          },
          E: {

          },
          FAIL_ON_ENTER: {

          }
        }
      };

      function TestMachine() {
        this.initStateMachine(TEST_FSM);
      }

      TestMachine.prototype = {
        _onLeaveC: function() {
        },
        _onEnterB: function() {
          throw new Error('Failed to enter B');
        },
        _onEnterFAIL_ON_ENTER: function() {
          throw new Error('Failed on enter');
        }
      };
      extend(TestMachine.prototype, StateMachineMixin);

      this.testMachine = new TestMachine();

    });

    it('should handle errors on transition', function() {
      return this.testMachine.transitionState('t1')
        .bind(this)
        .then(function() {
          assert(this.testMachine.stateIs('D'));
        });
    });

    it('should transition to error state before other queued transitions', function() {
      return Promise.all([
          this.testMachine.transitionState('t1'),
          this.testMachine.transitionState('t3'),
        ].map(function(p) { return p.reflect(); }))
        .bind(this)
        .spread(function(p1, p2) {
          assert(p1.isFulfilled());
          assert(p2.isFulfilled());
          assert(this.testMachine.stateIs('E'));
        });
    });


    it('should throw the original error if the state does not have an error transition', function() {
      return this.testMachine.transitionState('t6')
        .bind(this)
        .then(function() {
          assert.ok(false);
        }, function(err) {
          assert.strictEqual(err.message, 'Failed on enter');
        });
    });

  });

  describe('dedup', function() {

    beforeEach(function() {

      var TEST_FSM = {
        name: "test",
        initial: "A",
        transitions: {
          A: {
            t1: "B"
          },
          B: {
            t1: "C"
          },
          C: {
          }
        }
      };

      function TestMachine() {
        this.initStateMachine(TEST_FSM);
      }

      TestMachine.prototype = {
        _onEnterB: function() {
          this.bCount = this.bCount ? this.bCount + 1 : 1;
          return Promise.delay(1);
        },
        _onEnterC: function() {
          return Promise.delay(1);
        }
      };
      extend(TestMachine.prototype, StateMachineMixin);

      this.testMachine = new TestMachine();
    });

    it('should transition with dedup', function() {
      return Promise.all([
          this.testMachine.transitionState('t1'),
          this.testMachine.transitionState('t1', { dedup: true }),
        ])
        .bind(this)
        .then(function() {
          assert.strictEqual(this.testMachine.bCount, 1);
          assert(this.testMachine.stateIs('B'));
        });
    });

    it('should clearup pending transitions', function() {
      return this.testMachine.transitionState('t1')
        .bind(this)
        .then(function() {
          assert.strictEqual(this.testMachine.bCount, 1);
          assert(this.testMachine.stateIs('B'));
          assert.deepEqual(this.testMachine._pendingTransitions, {});
        });
    });

    it('should transition with dedup followed by non-dedup', function() {
      return Promise.all([
          this.testMachine.transitionState('t1'),
          this.testMachine.transitionState('t1', { dedup: true }),
          this.testMachine.transitionState('t1'),
        ])
        .bind(this)
        .then(function() {
          assert(this.testMachine.stateIs('C'));
          assert.deepEqual(this.testMachine._pendingTransitions, {});
        });
    });

    it('should dedup against the first pending transition', function() {
      var p1 = this.testMachine.transitionState('t1');
      var p2 = this.testMachine.transitionState('t1');
      var p3 = this.testMachine.transitionState('t1', { dedup: true })
        .bind(this)
        .then(function() {
          assert(p1.isFulfilled());
          assert(p2.isPending());
        });

      return Promise.all([p1, p2, p3])
        .bind(this)
        .then(function() {
          assert(this.testMachine.stateIs('C'));
          assert.deepEqual(this.testMachine._pendingTransitions, {});
        });
    });

  });

  describe('cancellation', function() {
    beforeEach(function() {

      var TEST_FSM = {
        name: "test",
        initial: "A",
        transitions: {
          A: {
            t1: "B",
          },
          B: {
            t2: "C",
          },
          C: {
            t3: "D"
          },
          D: {
          }
        }
      };

      function TestMachine() {
        this.count = 0;
        this.initStateMachine(TEST_FSM);
      }

      TestMachine.prototype = {
        _onEnterB: function() {
          return Promise.delay(1);
        },
        _onEnterC: function() {
          return Promise.delay(5)
            .bind(this)
            .then(function() {
              this.count++;
            });
        }
      };
      extend(TestMachine.prototype, StateMachineMixin);

      this.testMachine = new TestMachine();
    });

    it('should handle cancellations before they execute', function() {
      var p1 = this.testMachine.transitionState('t1');
      var p2 = this.testMachine.transitionState('t2');

      p2.cancel();
      return Promise.delay(5)
        .bind(this)
        .then(function() {
          assert(!p1.isCancelled());
          return p1;
        })
        .then(function() {
          assert(this.testMachine.stateIs('B'));
        });
    });

    it('should not cancel transitions after they start', function() {
      var p;
      return this.testMachine.transitionState('t1')
        .bind(this)
        .then(function() {
          p = this.testMachine.transitionState('t2');
          return Promise.delay(1);
        })
        .then(function() {
          assert(p.isCancellable());
          p.cancel();
          return Promise.delay(5);
        })
        .then(function() {
          assert.strictEqual(this.testMachine.count, 1);
          assert(this.testMachine.stateIs('C'));
        });
    });

  });


  describe('resetTransition', function() {
    beforeEach(function() {
      var self = this;
      var TEST_FSM = {
        name: "test",
        initial: "A",
        globalTransitions: {
          disable: "DISABLED"
        },
        transitions: {
          A: {
            t1: "B",
            t2: "C",
            t5: "D"
          },
          B: {
            t3: "C"
          },
          C: {
            t4: "B"
          },
          D: {
            t6: "A"
          },
          DISABLED: {

          }
        }
      };

      function TestMachine() {
        this.initStateMachine(TEST_FSM);
      }

      TestMachine.prototype = {
        _onLeaveA: function() {
          self.leaveACount++;
        },
        _onEnterB: function() {
          self.enterBCount++;
          return Promise.delay(1, 't3');
        },
        _onLeaveB: function() {
          self.leaveBCount++;
        },
        _onEnterC: function() {
          self.enterCCount++;
          return Promise.delay(1, 't4');
        }
      };
      extend(TestMachine.prototype, StateMachineMixin);

      this.testMachine = new TestMachine();
      this.leaveACount = 0;
      this.enterBCount = 0;
      this.leaveBCount = 0;
      this.enterCCount = 0;
    });

    it('should transition', function() {
      var promise = this.testMachine.transitionState('t1');

      promise.catch(function() {}); // Prevent warnings here

      var resetReason = new Error('We need to reset');
      return this.testMachine.resetTransition('disable', resetReason)
        .bind(this)
        .then(function() {
          assert.strictEqual(this.leaveACount, 1);
          assert.strictEqual(this.enterBCount, 1);
          assert.strictEqual(this.leaveBCount, 1);
          assert.strictEqual(this.enterCCount, 0);

          assert(this.testMachine.stateIs('DISABLED'));

          return promise; // Ensure the original transition completed
        })
        .then(function() {
          assert.ok(false);
        }, function(err) {
          assert.strictEqual(err, resetReason);
        });
    });

    it('should not cancel the first transition', function() {
      var promise1 = this.testMachine.transitionState('t5');
      var promise2 = this.testMachine.transitionState('t5');
      var promise3 = this.testMachine.transitionState('tXXX');

      var resetReason = new Error('We need to reset');
      return this.testMachine.resetTransition('disable', resetReason)
        .bind(this)
        .then(function() {
          assert.strictEqual(this.leaveACount, 1);
          assert(this.testMachine.stateIs('DISABLED'));
          assert(promise1.isFulfilled());
          assert(promise2.reason(), resetReason);
          assert(promise3.reason(), resetReason);
      });
    });


  });
});
