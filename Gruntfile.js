   //Gruntfile
    module.exports = function(grunt) {

  // Project configuration.
  grunt.initConfig( {
    generate : {
      options : {
        dest   : 'app/assets/scripts/',
        prompt : false,
        map : {
          "backbone/View" : ':dir/views/',
          "backbone/Model" : ':dir/models/',
          "backbone/Collection" : ':dir/collections/',
          "backbone/Route" : ':dir/routers/'
        }
      }
    }
  } );

  // Actually load this plugin's task(s).
  grunt.loadNpmTasks('grunt-generate');
};