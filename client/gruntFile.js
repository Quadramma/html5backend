module.exports = function(grunt) {

  grunt.loadNpmTasks('grunt-contrib-concat');
  grunt.loadNpmTasks('grunt-contrib-jshint');
  grunt.loadNpmTasks('grunt-contrib-uglify');
  grunt.loadNpmTasks('grunt-contrib-clean');
  grunt.loadNpmTasks('grunt-contrib-copy');
  grunt.loadNpmTasks('grunt-contrib-watch');
  grunt.loadNpmTasks('grunt-recess');
  grunt.loadNpmTasks('grunt-karma');
  grunt.loadNpmTasks('grunt-html2js');

  // Default task.
  //grunt.registerTask('default', ['jshint', 'build', 'karma:unit']);
  grunt.registerTask('default', ['jshint', 'build']);
  //grunt.registerTask('build', ['clean', 'html2js', 'concat', 'recess:build', 'copy:assets']);
  grunt.registerTask('build', ['clean', 'html2js', 'concat', 'copy:css', 'copy:assets', 'copy:fonts_awesome', 'copy:fonts_bootstrap']);
  //grunt.registerTask('release', ['clean', 'html2js', 'uglify', 'jshint', 'concat:index', 'recess:min', 'copy:assets']);
  grunt.registerTask('release', ['clean', 'html2js', 'uglify', 'jshint', 'concat:index', 'copy:css', 'copy:assets']);
  //    ,'karma:unit'
  grunt.registerTask('test-watch', ['karma:watch']);

  // Print a timestamp (useful for when watching)
  grunt.registerTask('timestamp', function() {
    grunt.log.subhead(Date());
  });

  var karmaConfig = function(configFile, customOptions) {
    var options = {
      configFile: configFile,
      keepalive: true
    };
    var travisOptions = process.env.TRAVIS && {
      browsers: ['Firefox'],
      reporters: 'dots'
    };
    return grunt.util._.extend(options, customOptions, travisOptions);
  };

  // Project configuration.
  grunt.initConfig({
    distdir: 'dist',
    pkg: grunt.file.readJSON('package.json'),
    banner: '/*! <%= pkg.title || pkg.name %> - v<%= pkg.version %> - <%= grunt.template.today("yyyy-mm-dd") %>\n' +
      '<%= pkg.homepage ? " * " + pkg.homepage + "\\n" : "" %>' +
      ' * Copyright (c) <%= grunt.template.today("yyyy") %> <%= pkg.author %>;\n' +
      ' * Licensed <%= _.pluck(pkg.licenses, "type").join(", ") %>\n */\n',
    src: {
      js: ['src/**/*.js'],
      css: ['src/**/*.css'],
      jsTpl: ['<%= distdir %>/templates/**/*.js'],
      specs: ['test/**/*.spec.js'],
      scenarios: ['test/**/*.scenario.js'],
      html: ['src/**/*.html'],
      tpl: {
        app: ['src/app/**/*.tpl.html'],
        common: ['src/common/**/*.tpl.html']
      },
      less: ['src/less/stylesheet.less'], // recess:build doesn't accept ** in its file patterns
      lessWatch: ['src/less/**/*.less']
    },
    clean: ['<%= distdir %>/**/*.js', '<%= distdir %>/**/*.jpg', '<%= distdir %>/**/*.png', '<%= distdir %>/**/*.ico', '<%= distdir %>/**/*.html'],
    copy: {
      fonts_awesome: {
        files: [{
          dest: '<%= distdir %>/fonts',
          src: ['**'],
          expand: true,
          cwd: 'bower_components/components-font-awesome/fonts/'
        }]
      },
      fonts_bootstrap: {
        files: [{
          dest: '<%= distdir %>/fonts',
          src: ['**'],
          expand: true,
          cwd: 'bower_components/bootstrap/fonts/'
        }]
      },
      assets: {
        files: [{
          dest: '<%= distdir %>',
          src: '**/*',
          expand: true,
          cwd: 'src/assets'
        }]
      },
      css: {
        files: [{
          dest: '<%= distdir %>/css/',
          src: '**/*',
          expand: true,
          cwd: 'src/css/'
        }]
      }
    },
    karma: {
      unit: {
        options: karmaConfig('test/config/unit.js')
      },
      watch: {
        options: karmaConfig('test/config/unit.js', {
          singleRun: false,
          autoWatch: true
        })
      }
    },
    html2js: {
      app: {
        options: {
          base: 'src/app'
        },
        src: ['<%= src.tpl.app %>'],
        dest: '<%= distdir %>/templates/app.js',
        module: 'templates.app'
      },
      common: {
        options: {
          base: 'src/common'
        },
        src: ['<%= src.tpl.common %>'],
        dest: '<%= distdir %>/templates/common.js',
        module: 'templates.common'
      }
    },
    concat: {
      dist: {
        options: {
          banner: "<%= banner %>"
        },
        src: ['<%= src.js %>', '<%= src.jsTpl %>'],
        dest: '<%= distdir %>/<%= pkg.name %>.js'
      },
      index: {
        src: ['src/index.html'],
        dest: '<%= distdir %>/index.html',
        options: {
          process: true
        }
      },
      mongo: {
        src: ['vendor/mongolab/*.js'],
        dest: '<%= distdir %>/mongolab.js'
      },
      bootstrap: {
        src: ['bower_components/jquery/jquery.js', 'bower_components/components-underscore/underscore.js', 'bower_components/store/dist/store2.js', 'bower_components/angular/angular.js', 'vendor/rLite.js', 'bower_components/angular-resource/angular-resource.js', 'bower_components/bootstrap/dist/js/bootstrap.js', 'vendor/angular-ui/bootstrap/*.js'],
        dest: '<%= distdir %>/bootstrap.js'
      },
      css: {
        src: ['bower_components/bootstrap/dist/css/bootstrap.css', 'bower_components/components-font-awesome/css/font-awesome.css'], //,'snippets/dropdownmenuui/dropdownmenuui.css'
        dest: '<%= distdir %>/css/bootstrap.css'
      }
    },
    uglify: {
      dist: {
        options: {
          banner: "<%= banner %>"
        },
        src: ['<%= src.js %>', '<%= src.jsTpl %>'],
        dest: '<%= distdir %>/<%= pkg.name %>.js'
      },
      mongo: {
        src: ['vendor/mongolab/*.js'],
        dest: '<%= distdir %>/mongolab.js'
      },
      bootstrap: {
        src: ['bower_components/jquery/jquery.js', 'bower_components/angular/angular.js', 'vendor/rLite.js', 'bower_components/angular-resource/angular.js', 'bower_components/bootstrap/dist/js/bootstrap.js', 'vendor/angular-ui/bootstrap/*.js'],
        dest: '<%= distdir %>/bootstrap.js'
      },
      css: {
        src: ['bower_components/bootstrap/dist/css/bootstrap.css', 'bower_components/components-font-awesome/css/font-awesome.css', 'snippets/menublack/menublack.css'],
        dest: '<%= distdir %>/css/bootstrap.css'
      }
    },
    recess: {
      build: {
        files: {
          '<%= distdir %>/<%= pkg.name %>.css': ['<%= src.less %>']
        },
        options: {
          compile: true
        }
      },
      min: {
        files: {
          '<%= distdir %>/<%= pkg.name %>.css': ['<%= src.less %>']
        },
        options: {
          compress: true
        }
      }
    },
    watch: {
      all: {
        files: ['<%= src.js %>', '<%= src.css %>', '<%= src.specs %>', '<%= src.lessWatch %>', '<%= src.tpl.app %>', '<%= src.tpl.common %>', '<%= src.html %>'],
        tasks: ['default', 'timestamp']
      },
      build: {
        files: ['<%= src.js %>', '<%= src.specs %>', '<%= src.lessWatch %>', '<%= src.tpl.app %>', '<%= src.tpl.common %>', '<%= src.html %>'],
        tasks: ['build', 'timestamp']
      }
    },
    jshint: {
      files: ['gruntFile.js', '<%= src.js %>', '<%= src.jsTpl %>', '<%= src.specs %>', '<%= src.scenarios %>'],
      options: {
        curly: true,
        eqeqeq: true,
        immed: true,
        latedef: true,
        newcap: true,
        noarg: true,
        sub: true,
        boss: true,
        eqnull: true,
        globals: {}
      }
    }
  });

};