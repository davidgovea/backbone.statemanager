(function() {
  var _this = this;

  describe('Backbone.StateManager.State', function() {
    beforeEach(function() {
      return _this._states = _.clone(spec.helper.states);
    });
    afterEach(function() {
      return delete _this._states;
    });
    describe('constructor', function() {
      return it('creates a regexp of the name', function() {
        var state;
        state = new Backbone.StateManager.State('foo', {});
        return expect(state.regExpName).toBeDefined();
      });
    });
    return describe('prototype', function() {
      describe('matchName', function() {
        return it('creates a regular expression out of the name', function() {
          var test;
          test = new Backbone.StateManager.State('foo', _this._states[0]);
          spyOn(test.regExpName, 'test');
          test.matchName('foo');
          return expect(test.regExpName.test).toHaveBeenCalledWith('foo');
        });
      });
      return describe('findTransition', function() {
        describe('straight match', function() {
          return it('finds functions who have a key matching the type and name', function() {
            var test;
            test = new Backbone.StateManager.State('foo', {
              transitions: {
                'onFoo:Bar*splat': function() {}
              }
            });
            return expect(test.findTransition('onFoo', 'Bar123')).toEqual(jasmine.any(Function));
          });
        });
        return describe('not match', function() {
          return it('finds functions who have a key that does not match the name', function() {
            var test, transitions;
            transitions = {
              'onFoo:Bar*splat': function() {
                return 'bar match';
              },
              'onFoo:not:Bar*splat': function() {
                return 'not bar match';
              }
            };
            test = new Backbone.StateManager.State('foo', {
              transitions: transitions
            });
            return expect(test.findTransition('onFoo', 'Baz123')()).toEqual('not bar match');
          });
        });
      });
    });
  });

}).call(this);
