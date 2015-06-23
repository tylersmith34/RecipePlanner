module.exports = (config) ->
  config.set
    basePath: './'
    frameworks: [
      'mocha'
      'expect'
    ]
    client:
      mocha: ui: 'tdd'
      captureConsole: true
    # coverageReporter:
    #   type: 'text-summary'
    #   instrumenters:
    #     ibrik : require('ibrik')
    #   instrumenter:
    #     '**/*.coffee': 'ibrik'
    files: [
      'public/*.coffee'
      'test/*.coffee'
      # './public/bower_components/jquery/dist/jquery.min.js'
      # './public/bootstrap/js/bootstrap.min.js'
      # './public/bower_components/knockout/dist/knockout.js'
      # 'mocha.conf.js'
      # './public/**/*.coffee'
      # './public/**/*.js'
    ]
    exclude: [ '**/generated/**/*.*' ]
    preprocessors: 'public/**/*.coffee': [ 'coffee' ]
    reporters: [
      'mocha'
      'progress'
      'coverage'
    ]
    port: 9876
    colors: true
    logLevel: config.LOG_DEBUG
    autoWatch: false
    browsers: [ 'PhantomJS' ]
    singleRun: false
  return
