    //Gruntfile
    module.exports = function(grunt) {

    //Initializing the configuration object
      grunt.initConfig({

        // Task configuration
        concat: {
          options: {
            separator: ';',
          },
          js: {
            src: [
              'bower_components/jquery/dist/jquery.js',
              'bower_components/bootstrap/dist/js/bootstrap.js',
              'bower_components/mediaCheck/js/mediaCheck.js',
              'assets/javascript/editor.js'
            ],
            dest: 'server/static/javascript/editor.js',
          }
        },
        jade: {
          compile: {
            options: {
              debug: false,
              pretty: true
            },
            files: {
              'server/index.html': ['assets/jade/index.jade'] 
              /*
              'server/bandet.html': ['assets/jade/index.jade'],
              'server/cd.html': ['assets/jade/index.jade'],
              'server/historie.html': ['assets/jade/index.jade'],
              'server/bilder.html': ['assets/jade/index.jade'],
              'server/linker.html': ['assets/jade/index.jade'],
              'server/nyheter.html': ['assets/jade/index.jade'],
              'server/jubileum.html': ['assets/jade/index.jade']
              */
            }
          }
        },
        less: {
          editor: {
            options: {
              // compress: true,  //minifying the result
              plugins : [ new (require('less-plugin-autoprefix'))({browsers : [ 'last 2 versions', 'ie 9' ]}) ]
            },
            files: {
              'server/static/stylesheets/editor.css':'assets/less/editor.less'
            }
          }
        },
        uglify: {
          options: {
            mangle: true  // Use if you want the names of your functions and variables unchanged
          },
          editor: {
            files: {
              'server/static/javascript/editor.js': 'server/static/javascript/editor.js',
            }
          }
        },
        watch: {
          js: {
            files: [
              //watched files
              'bower_components/jquery/jquery.js',
              'bower_components/bootstrap/dist/js/bootstrap.js',
              'assets/javascript/editor.js'
            ],   
            tasks: ['concat:js'],     //tasks to run
            options: {
              livereload: true                        //reloads the browser
            }
          },
          less: {
            files: ['assets/less/*.less'],  //watched files
            tasks: ['less:development'],                          //tasks to run
            options: {
              livereload: true,                        //reloads the browser
            }
          },
          jade: {
            files: ['assets/jade/*.jade'],  //watched files
            tasks: ['jade'],                          //tasks to run
            options: {
              livereload: true,                        //reloads the browser
              autoprefix: true
            }
          },
          copy: {
            files: ['assets/static/**/*.*'],  //watched files
            tasks: ['copy:staticfiles'],                          //tasks to run
            options: {
              livereload: true,                        //reloads the browser
              autoprefix: true
            }
          }
        },
        copy: {
          glyphicons: {
            expand: true,
            cwd: 'bower_components/bootstrap/dist/fonts/',
            src: '**',
            dest: 'server/static/fonts/',
            flatten: false
          },
          
          staticfiles: {
            expand: true,
            cwd: 'assets/static/',
            src: '**',
            dest: 'server/static/',
            flatten: false
          }
        },
        buildcontrol: {
          options: {
            dir: 'server',
            commit: true,
            push: true,
            message: 'Built %sourceName% from commit %sourceCommit% on branch %sourceBranch%'
          },
          pages: {
            options: {
              remote: 'git@github.com:fivethreeo/typeeditor.git',
              branch: 'gh-pages'
            }
          }
        }
      });


  // Plugin loading
  grunt.loadNpmTasks('grunt-contrib-concat');
  grunt.loadNpmTasks('grunt-contrib-watch');
  grunt.loadNpmTasks('grunt-contrib-less');
  grunt.loadNpmTasks('grunt-contrib-uglify');
  grunt.loadNpmTasks('grunt-contrib-copy');
  grunt.loadNpmTasks('grunt-contrib-jade');
  grunt.loadNpmTasks('grunt-build-control');

  // Task definition
  grunt.registerTask('default', ['watch']);

  };