// Generated by CoffeeScript 1.3.3

/*
Backbone.Statemanager, v0.0.1-alpha
Copyright (c)2012 Patrick Camacho and Mark Roseboom, Crashlytics
Distributed under MIT license
http://github.com/crashlytics/backbone.statemanager
*/


(function() {

  Backbone.StateManager = (function(Backbone, _) {
    var StateManager, _deepBindAll;
    StateManager = function(states, options) {
      this.options = options != null ? options : {};
      this.states = new StateManager.States(states);
      return this;
    };
    StateManager.extend = Backbone.View.extend;
    _.extend(StateManager.prototype, Backbone.Events, {
      getCurrentState: function() {
        return this.currentState;
      },
      addState: function(name, callbacks) {
        this.states.add(name, callbacks);
        return this.trigger('add:state', name);
      },
      removeState: function(name) {
        this.states.remove(name);
        return this.trigger('remove:state', name);
      },
      initialize: function(options) {
        var initial;
        if (options == null) {
          options = {};
        }
        if (initial = this.states.findInitial()) {
          return this.triggerState(initial, options);
        }
      },
      triggerState: function(state, options) {
        if (options == null) {
          options = {};
        }
        if (!(state === this.currentState && !options.reEnter)) {
          _.extend(options, {
            toState: state,
            fromState: this.currentState
          });
          if (this.currentState) {
            this.exitState(options);
          }
          return this.enterState(state, options);
        } else {
          return false;
        }
      },
      enterState: function(name, options) {
        var state, _base, _base1;
        if (options == null) {
          options = {};
        }
        if (!((state = this.states.find(name)) && _.isFunction(state.enter))) {
          return false;
        }
        this.trigger('before:enter:state', name, state, options);
        if (typeof (_base = state.findTransition('onBeforeEnterFrom', options.fromState)) === "function") {
          _base(options);
        }
        state.enter(options);
        if (typeof (_base1 = state.findTransition('onEnterFrom', options.fromState)) === "function") {
          _base1(options);
        }
        this.trigger('enter:state', name, state, options);
        this.currentState = name;
        return this;
      },
      exitState: function(options) {
        var state, _base, _base1;
        if (options == null) {
          options = {};
        }
        if (!((state = this.states.find(this.currentState)) && _.isFunction(state.exit))) {
          return false;
        }
        this.trigger('before:exit:state', this.currentState, state, options);
        if (typeof (_base = state.findTransition('onBeforeExitTo', options.toState)) === "function") {
          _base(options);
        }
        state.exit(options);
        if (typeof (_base1 = state.findTransition('onExitTo', options.toState)) === "function") {
          _base1(options);
        }
        this.trigger('exit:state', this.currentState, state, options);
        delete this.currentState;
        return this;
      }
    });
    StateManager.States = function(states) {
      var _this = this;
      this.states = {};
      if (states && _.isObject(states)) {
        _.each(states, function(value, key) {
          return _this.add(key, value);
        });
      }
      return this;
    };
    _.extend(StateManager.States.prototype, {
      add: function(name, callbacks) {
        if (!(_.isString(name) && _.isObject(callbacks))) {
          return false;
        }
        return this.states[name] = new StateManager.State(name, callbacks);
      },
      remove: function(name) {
        if (!_.isString(name)) {
          return false;
        }
        return delete this.states[name];
      },
      find: function(name) {
        if (!_.isString(name)) {
          return false;
        }
        return _.chain(this.states).find(function(state) {
          return state.matchName(name);
        }).value();
      },
      findInitial: function() {
        var _this = this;
        return _.find(this.states, function(value, name) {
          return value.initial;
        });
      }
    });
    StateManager.State = function(name, options) {
      this.name = name;
      _.extend(this, options);
      this.regExpName = StateManager.State._regExpStateConversion(this.name);
      return this;
    };
    _.extend(StateManager.State.prototype, {
      matchName: function(name) {
        return this.regExpName.test(name);
      },
      findTransition: function(type, name) {
        var _this = this;
        if (!(this.transitions && _.isString(name) && _.isString(type))) {
          return false;
        }
        return _.find(this.transitions, function(value, key) {
          return key.indexOf("" + type + ":") === 0 && StateManager.State._regExpStateConversion(key.substring(type.length + 1)).test(name);
        });
      }
    });
    StateManager.State._regExpStateConversion = function(name) {
      name = name.replace(/[-[\]{}()+?.,\\^$|#\s]/g, '\\$&').replace(/:\w+/g, '([^\/]+)').replace(/\*\w+/g, '(.*?)');
      return new RegExp("^" + name + "$");
    };
    StateManager.addStateManager = function(target, options) {
      var stateManager;
      if (options == null) {
        options = {};
      }
      if (!target) {
        new Error('Target must be defined');
      }
      _deepBindAll(target.states, target);
      target.stateManager = stateManager = new Backbone.StateManager(target.states, options);
      target.triggerState = function() {
        return stateManager.triggerState.apply(stateManager, arguments);
      };
      target.getCurrentState = function() {
        return stateManager.getCurrentState();
      };
      if (options.initialize || _.isUndefined(options.initialize)) {
        stateManager.initialize(options);
      }
      return delete target.states;
    };
    _deepBindAll = function(obj) {
      var target;
      target = _.last(arguments);
      _.each(obj, function(value, key) {
        if (_.isFunction(value)) {
          return obj[key] = _.bind(value, target);
        } else if (_.isObject(value)) {
          return obj[key] = _deepBindAll(value, target);
        }
      });
      return obj;
    };
    return StateManager;
  })(Backbone, _);

}).call(this);
