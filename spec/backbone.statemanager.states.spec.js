(function() {
  var _this = this;

  describe('Backbone.StateManager.States', function() {
    beforeEach(function() {
      return _this._states = _.clone(spec.helper.states);
    });
    afterEach(function() {
      return delete _this._states;
    });
    describe('constructor', function() {
      it('creates a hash', function() {
        var states;
        states = new Backbone.StateManager.States;
        return expect(states.states).toBeDefined();
      });
      return it('adds passed in states', function() {
        var states;
        spyOn(Backbone.StateManager.States.prototype, 'add');
        states = new Backbone.StateManager.States(_this._states);
        return expect(states.add).toHaveBeenCalled();
      });
    });
    return describe('prototype', function() {
      beforeEach(function() {
        return _this.states = new Backbone.StateManager.States(_this._states);
      });
      describe('add', function() {
        it('creates a new Backbone.StateManager.State object', function() {
          spyOn(Backbone.StateManager, 'State');
          _this.states.add('foo', {});
          return expect(Backbone.StateManager.State).toHaveBeenCalledWith('foo', {});
        });
        return it('add the new object to states', function() {
          _this.states.add('foo', {});
          return expect(_this.states.states.foo).toBeDefined();
        });
      });
      describe('remove', function() {
        return it('removes the reference to the provided name', function() {
          _this.states.states.foo = {};
          _this.states.remove('foo');
          return expect(_this.states.states.foo).toBeUndefined();
        });
      });
      describe('find', function() {
        return it('does a regular expression check to find a state that matches the provided name', function() {
          return expect(_this.states.find('noTransitions')).toEqual(jasmine.any(Object));
        });
      });
      return describe('findInitial', function() {
        return it('identifies the first state who is marked as initial', function() {
          return expect(_this.states.findInitial()).toEqual('withInitial');
        });
      });
    });
  });

}).call(this);
