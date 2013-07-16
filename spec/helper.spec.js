(function() {
  window.spec = {
    helper: {
      states: {
        noTransitions: {
          enter: function() {},
          exit: function() {}
        },
        withInitial: {
          initial: true,
          enter: function() {},
          exit: function() {}
        },
        nonMethodExit: {
          enter: function() {},
          exit: {}
        },
        nonMethodEnter: {
          enter: {},
          exit: function() {}
        },
        exitTransition: {
          enter: function() {},
          exit: function() {},
          transitions: {
            'onBeforeExitTo:enterTransition': function() {},
            'onExitTo:enterTransition': function() {}
          }
        },
        enterTransition: {
          enter: function() {},
          exit: function() {},
          transitions: {
            'onBeforeEnterFrom:exitTransition': function() {},
            'onEnterFrom:exitTransition': function() {}
          }
        }
      }
    }
  };

}).call(this);
