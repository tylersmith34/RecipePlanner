module.exports = (grunt) ->
  baseResourcesDir = "./public"
  grunt.initConfig
    karma:
      options:
        configFile: "./karma.conf.coffee"
        background: true
        client:
          mocha: {ui: "tdd"}
          captureConsole: yes
      test:
        options:
          singleRun: no
      start:
        options:
          singleRun: no

    coffee:
      compile:
        expand: yes
        cwd: baseResourcesDir
        src: "**/*.coffee"
        dest: "#{baseResourcesDir}/generated/"
        ext: ".js"

    coffeelint:
      files:
        src: ["#{baseResourcesDir}/**/*.coffee"]
      options:
        "no_trailing_whitespace":
          "level": "ignore"
        "indentation":
          "level": "ignore"
        "max_line_length":
          "level": "ignore"

    watch:
      test:
        files: [
          "#{baseResourcesDir}/js/**/*.js"
          "#{baseResourcesDir}/js/**/*.coffee"
          "./test/**/*.js"
          "./test/**/*.coffee"
        ]
        tasks: ["test"]
        options:
          interrupt: yes
      compile:
        files: ["#{baseResourcesDir}/**/*.coffee",
          "#{baseResourcesDir}/**/*.less"]
        tasks: ["compile"]
        options:
          interrupt: yes

  grunt.loadNpmTasks "grunt-karma"
  grunt.loadNpmTasks "grunt-contrib-coffee"
  grunt.loadNpmTasks "grunt-contrib-watch"
  grunt.loadNpmTasks "grunt-coffeelint"

  grunt.registerTask "test", ["coffeelint", "karma:test"]
  grunt.registerTask "compile", ["coffee"]
  grunt.registerTask "default", ["compile", "test", "karma"]
