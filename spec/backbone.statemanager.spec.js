(function() {
  var _this = this;

  describe('Backbone.StateManager', function() {
    beforeEach(function() {
      return _this._states = _.clone(spec.helper.states);
    });
    afterEach(function() {
      return delete _this._states;
    });
    it('exists under Backbone.StateManager', function() {
      return expect(Backbone.StateManager).toBeDefined();
    });
    describe('constructor', function() {
      it('creates a states object', function() {
        var stateManager;
        stateManager = new Backbone.StateManager;
        return expect(stateManager.states).toBeDefined();
      });
      return it('calls addState with passed state', function() {
        var stateManager;
        spyOn(Backbone.StateManager.States.prototype, 'add');
        stateManager = new Backbone.StateManager(_this._states);
        return expect(stateManager.states.add).toHaveBeenCalledWith('noTransitions', jasmine.any(Object));
      });
    });
    describe('prototype', function() {
      beforeEach(function() {
        return _this.stateManager = new Backbone.StateManager(_this._states);
      });
      afterEach(function() {
        return delete _this.stateManager;
      });
      describe('initialize', function() {
        return it('calls triggerState on the first state found that has initial : true set on it', function() {
          spyOn(Backbone.StateManager.prototype, 'triggerState');
          _this.stateManager.initialize();
          return expect(_this.stateManager.triggerState).toHaveBeenCalledWith('withInitial', jasmine.any(Object));
        });
      });
      describe('addState', function() {
        beforeEach(function() {
          return spyOn(_this.stateManager.states, 'add');
        });
        it('sets the state passed to states with the states callback', function() {
          _this.stateManager.addState('noTransitions', _this._states.noTransitions);
          expect(_this.stateManager.states.add).toHaveBeenCalled();
          return expect(_this.stateManager.states.states.noTransitions).toEqual(jasmine.any(Object));
        });
        return it('triggers remove:state and passes state name', function() {
          spyOn(_this.stateManager, 'trigger');
          _this.stateManager.addState('noTransitions');
          return expect(_this.stateManager.trigger).toHaveBeenCalledWith('add:state', 'noTransitions');
        });
      });
      describe('removeState', function() {
        beforeEach(function() {
          return spyOn(_this.stateManager.states, 'remove');
        });
        it('removes the state', function() {
          _this.stateManager.removeState('noTransitions');
          expect(_this.stateManager.states.remove).toHaveBeenCalled();
          return expect(_this.stateManager.states.noTransitions).toBeUndefined();
        });
        return it('triggers remove:state and passes state name', function() {
          spyOn(_this.stateManager, 'trigger');
          _this.stateManager.removeState('noTransitions');
          return expect(_this.stateManager.trigger).toHaveBeenCalledWith('remove:state', 'noTransitions');
        });
      });
      describe('getCurrentState', function() {
        return it('returns the current state', function() {
          _this.stateManager.currentState = _this._states.noTransitions;
          return expect(_this.stateManager.getCurrentState()).toEqual(_this._states.noTransitions);
        });
      });
      describe('triggerState', function() {
        beforeEach(function() {
          spyOn(_this.stateManager, 'enterState');
          return spyOn(_this.stateManager, 'exitState');
        });
        it('calls exitState for the current state if it exists with new state name', function() {
          _this.stateManager.currentState = 'bar';
          _this.stateManager.triggerState('foo');
          return expect(_this.stateManager.exitState).toHaveBeenCalledWith({
            toState: 'foo',
            fromState: 'bar'
          });
        });
        it('calls enterState for the new state', function() {
          _this.stateManager.triggerState('foo');
          return expect(_this.stateManager.enterState).toHaveBeenCalledWith('foo', jasmine.any(Object));
        });
        return describe('the current state is the same as the new state', function() {
          beforeEach(function() {
            return _this.stateManager.currentState = 'foo';
          });
          it('does nothing if options.reEnter is not set', function() {
            expect(_this.stateManager.triggerState('foo')).toEqual(false);
            expect(_this.stateManager.exitState).not.toHaveBeenCalled();
            return expect(_this.stateManager.enterState).not.toHaveBeenCalled();
          });
          return it('re-enters the state if optoins.reEnter is set', function() {
            expect(_this.stateManager.triggerState('foo', {
              reEnter: true
            })).not.toEqual(false);
            expect(_this.stateManager.exitState).toHaveBeenCalledWith(jasmine.any(Object));
            return expect(_this.stateManager.enterState).toHaveBeenCalledWith('foo', jasmine.any(Object));
          });
        });
      });
      describe('exitState', function() {
        beforeEach(function() {
          return spyOn(_this.stateManager.states, 'find');
        });
        describe('with invalid parameters', function() {
          it('returns false if the states exit property is not a method', function() {
            _this.stateManager.states.find.andReturn(_this._states.nonMethodExit);
            return expect(_this.stateManager.exitState()).toBeFalsy();
          });
          return it('returns false if the currentState does not exist', function() {
            _this.stateManager.states.find.andReturn(false);
            return expect(_this.stateManager.exitState()).toBeFalsy();
          });
        });
        describe('with valid parameters', function() {
          beforeEach(function() {
            spyOn(_this.stateManager, 'trigger');
            spyOn(_this._states.noTransitions, 'exit');
            _this.stateManager.states.find.andReturn(new Backbone.StateManager.State('noTransitions', _this._states.noTransitions));
            _this.stateManager.currentState = 'noTransitions';
            return _this.stateManager.exitState();
          });
          afterEach(function() {
            return delete _this.stateManager.currentState;
          });
          it('triggers before:exit:state', function() {
            return expect(_this.stateManager.trigger).toHaveBeenCalledWith('before:exit:state', 'noTransitions', jasmine.any(Object), jasmine.any(Object));
          });
          it('calls the exit method on the state', function() {
            return expect(_this._states.noTransitions.exit).toHaveBeenCalledWith(jasmine.any(Object));
          });
          it('triggers exit:state', function() {
            return expect(_this.stateManager.trigger).toHaveBeenCalledWith('exit:state', 'noTransitions', jasmine.any(Object), jasmine.any(Object));
          });
          return it('deletes the currentState', function() {
            return expect(_this.stateManager.currentState).toBeUndefined();
          });
        });
        return describe('on states with transitions set', function() {
          beforeEach(function() {
            _this.stateManager.states.find.andReturn({
              exit: (function() {}),
              __proto__: Backbone.StateManager.State.prototype
            });
            _this.transitionCallback = jasmine.createSpy('transitionCallback');
            spyOn(Backbone.StateManager.State.prototype, 'findTransition').andReturn(_this.transitionCallback);
            _this.stateManager.currentState = 'enterTransition';
            return _this.stateManager.exitState({
              toState: 'enterTransition'
            });
          });
          afterEach(function() {
            delete _this.stateManager.currentState;
            return delete _this.transitionCallback;
          });
          it('calls onBeforeExitTo if it exists for the state passed', function() {
            expect(Backbone.StateManager.State.prototype.findTransition).toHaveBeenCalledWith('onBeforeExitTo', 'enterTransition');
            return expect(_this.transitionCallback).toHaveBeenCalledWith(jasmine.any(Object));
          });
          return it('calls onExitTo if it exists for the state passed', function() {
            expect(Backbone.StateManager.State.prototype.findTransition).toHaveBeenCalledWith('onExitTo', 'enterTransition');
            return expect(_this.transitionCallback).toHaveBeenCalledWith(jasmine.any(Object));
          });
        });
      });
      return describe('enterState', function() {
        beforeEach(function() {
          return spyOn(_this.stateManager.states, 'find');
        });
        describe('with invalid parameters', function() {
          it('returns false if the states enter property is not a method', function() {
            _this.stateManager.states.find.andReturn(_this._states.nonMethodEnter);
            return expect(_this.stateManager.enterState('noTransitions')).toBeFalsy();
          });
          return it('returns false if the currentState does not exist', function() {
            _this.stateManager.states.find.andReturn(false);
            return expect(_this.stateManager.enterState('noTransitions')).toBeFalsy();
          });
        });
        describe('with valid parameters', function() {
          beforeEach(function() {
            spyOn(_this.stateManager, 'trigger');
            spyOn(_this._states.noTransitions, 'enter');
            _this.stateManager.states.find.andReturn(new Backbone.StateManager.State('noTransitions', _this._states.noTransitions));
            _this.stateManager.currentState = 'noTransitions';
            return _this.stateManager.enterState('noTransitions');
          });
          afterEach(function() {
            return delete _this.stateManager.currentState;
          });
          it('triggers before:enter:state', function() {
            return expect(_this.stateManager.trigger).toHaveBeenCalledWith('before:enter:state', 'noTransitions', jasmine.any(Object), jasmine.any(Object));
          });
          it('calls the enter method on the state', function() {
            return expect(_this._states.noTransitions.enter).toHaveBeenCalledWith(jasmine.any(Object));
          });
          it('triggers enter:state', function() {
            return expect(_this.stateManager.trigger).toHaveBeenCalledWith('enter:state', 'noTransitions', jasmine.any(Object), jasmine.any(Object));
          });
          return it('sets the currentState', function() {
            return expect(_this.stateManager.currentState).toEqual('noTransitions');
          });
        });
        return describe('on states with transitions set', function() {
          beforeEach(function() {
            _this.stateManager.states.find.andReturn({
              enter: (function() {}),
              __proto__: Backbone.StateManager.State.prototype
            });
            _this.transitionCallback = jasmine.createSpy('transitionCallback');
            spyOn(Backbone.StateManager.State.prototype, 'findTransition').andReturn(_this.transitionCallback);
            return _this.stateManager.enterState('enterTransition', {
              fromState: 'exitTransition'
            });
          });
          afterEach(function() {
            delete _this.stateManager.currentState;
            return delete _this.transitionCallback;
          });
          it('calls onBeforeEnterFrom if it exists for the state passed', function() {
            expect(Backbone.StateManager.State.prototype.findTransition).toHaveBeenCalledWith('onBeforeEnterFrom', 'exitTransition');
            return expect(_this.transitionCallback).toHaveBeenCalledWith(jasmine.any(Object));
          });
          return it('calls onEnterFrom if it exists for the state passed', function() {
            expect(Backbone.StateManager.State.prototype.findTransition).toHaveBeenCalledWith('onEnterFrom', 'exitTransition');
            return expect(_this.transitionCallback).toHaveBeenCalledWith(jasmine.any(Object));
          });
        });
      });
    });
    return describe('addStateManager', function() {
      it('creates a new StateManager', function() {
        var StateManager, spy, target;
        StateManager = Backbone.StateManager;
        spy = spyOn(Backbone, 'StateManager').andCallThrough();
        spy.__proto__ = StateManager;
        spy.prototype = StateManager.prototype;
        target = {
          states: _this._states
        };
        Backbone.StateManager.addStateManager(target);
        expect(Backbone.StateManager).toHaveBeenCalledWith(jasmine.any(Object), jasmine.any(Object));
        return expect(target.stateManager).toBeDefined();
      });
      it('if states is set to a function, executes it', function() {
        var StateManager, states, target;
        StateManager = Backbone.StateManager;
        states = jasmine.createSpy('states').andReturn(_this._states);
        target = {
          states: states
        };
        Backbone.StateManager.addStateManager(target);
        expect(states).toHaveBeenCalled();
        return expect(_.keys(target.stateManager.states.states)).toEqual(_.keys(_this._states));
      });
      it('binds all of targets states methods to the target', function() {
        var target;
        spyOn(_, 'bind');
        target = {
          states: _this._states
        };
        Backbone.StateManager.addStateManager(target);
        return expect(_.bind).toHaveBeenCalledWith(jasmine.any(Function), target);
      });
      it('allows callthrough on the target for triggerState', function() {
        var target;
        target = {
          states: _this._states
        };
        spyOn(Backbone.StateManager.prototype, 'triggerState');
        Backbone.StateManager.addStateManager(target);
        expect(target.triggerState).toBeDefined();
        target.triggerState('foo');
        return expect(Backbone.StateManager.prototype.triggerState).toHaveBeenCalledWith('foo');
      });
      it('allows callthrough on the target for getCurrentState', function() {
        var target;
        target = {};
        spyOn(Backbone.StateManager.prototype, 'getCurrentState');
        Backbone.StateManager.addStateManager(target);
        expect(target.getCurrentState).toBeDefined();
        target.getCurrentState();
        return expect(Backbone.StateManager.prototype.getCurrentState).toHaveBeenCalled();
      });
      it('calls initialize on the state manager', function() {
        spyOn(Backbone.StateManager.prototype, 'initialize');
        Backbone.StateManager.addStateManager({});
        return expect(Backbone.StateManager.prototype.initialize).toHaveBeenCalled();
      });
      return it('does not call initialize if options.initialize is set to false(y)', function() {
        spyOn(Backbone.StateManager.prototype, 'initialize');
        _.each([false, null, 0], function(value) {
          Backbone.StateManager.addStateManager({}, {
            initialize: value
          });
          return expect(Backbone.StateManager.prototype.initialize).not.toHaveBeenCalled();
        });
        Backbone.StateManager.addStateManager({}, {
          initialize: void 0
        });
        return expect(Backbone.StateManager.prototype.initialize).toHaveBeenCalled();
      });
    });
  });

}).call(this);
