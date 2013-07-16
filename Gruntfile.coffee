module.exports = (grunt)->
  'use strict'

  # Project configuration.
  grunt.initConfig

    coffeelint:
      gruntfile:
        src: 'Gruntfile.coffee'
      lib:
        src: ['src/*.coffee']
      test:
        src: ['src/spec/*.coffee']
      options:
        no_trailing_whitespace:
          level: 'error'
        max_line_length:
          level: 'warn'

    coffee:
      tests:
        files:
          'spec/helper.spec.js'                      : ['src/spec/helper.spec.coffee']
          'spec/backbone.statemanager.spec.js'       : ['src/spec/backbone.statemanager.spec.coffee']
          'spec/backbone.statemanager.state.spec.js' : ['src/spec/backbone.statemanager.state.spec.coffee']
          'spec/backbone.statemanager.states.spec.js': ['src/spec/backbone.statemanager.states.spec.coffee']

      lib:
        expand:true
        flatten: true
        src  : ['src/*.coffee']
        dest : '.'
        ext:'.statemanager.js'

    uglify:
      my_target:
        files:
          'backbone.statemanager.js.min': ['backbone.statemanager.js']

    haml: 
      runner: 
        files: 
          'spec_runner.html': 'src/spec_runner.haml'
    
    clean: ['./*.js', 'spec/']

  # plugins.
  # grunt.loadNpmTasks 'grunt-simple-mocha'
  grunt.loadNpmTasks 'grunt-coffeelint'
  grunt.loadNpmTasks 'grunt-contrib-coffee'
  grunt.loadNpmTasks 'grunt-contrib-clean'
  grunt.loadNpmTasks 'grunt-contrib-haml'
  grunt.loadNpmTasks 'grunt-contrib-uglify'

  # tasks.
  grunt.registerTask 'build', [
    'coffee'
    'uglify'
    'haml'
  ]

  grunt.registerTask 'default', ['build']

