   //Gruntfile
    module.exports = function(grunt) {

  // Project configuration.
  grunt.initConfig( {
    generate : {
      options : {
        dest   : 'app/assets/scripts/',
        prompt : false,
        map : {
          "backbone/View" : 'views/:dir/',
          "backbone/Model" : 'models/:dir/',
          "backbone/Collection" : 'collections/:dir/',
          "backbone/Route" : 'routers/:dir/'
        }
      }
    }
  } );

  // Actually load this plugin's task(s).
  grunt.loadNpmTasks('grunt-generate');
};