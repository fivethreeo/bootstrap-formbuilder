'use strict';

var basePaths = {
	src: 'app/assets/',
	dest: 'public/assets/',
	bower: 'app/assets/bower_components/'
};

var paths = {
	images: {
		src: basePaths.src + 'images/',
		dest: basePaths.dest + 'images/'
	},
	scripts: {
		src: basePaths.src + 'scripts/',
		dest: basePaths.dest + 'scripts/'
	},
	styles: {
		src: basePaths.src + 'styles/',
		dest: basePaths.dest + 'styles/'
	},
	fonts: {
		src: basePaths.src + 'fonts/',
		dest: basePaths.dest + 'fonts/'
	},
};

var appFiles = {
	styles: paths.styles.src + '**/*.less',
	scripts: [paths.scripts.src + '*.js']
};

var vendorFiles = {
	styles: [''],
	scripts: ['']
};


var gulp = require('gulp');
require('gulp-grunt')(gulp); // add all the gruntfile tasks to gulp 

var gutil = require('gulp-util');
var gh_pages = require('gulp-gh-pages');

// Allows gulp --dev to be run for a more verbose output
var isProduction = true;
var sourceMap = false;

if(gutil.env.dev === true) {
	sourceMap = true;
	isProduction = false;
}

gulp.task('clean', function (cb) {
    require('rimraf')('public', cb);
});

gulp.task('lint', function () {
    var jshint = require('gulp-jshint');

    return gulp.src(appFiles.scripts)
        .pipe(jshint())
        .pipe(jshint.reporter('default'));
});


gulp.task('images', function () {
    var cache = require('gulp-cache'),
        imagemin = require('gulp-imagemin');

    return gulp.src(paths.images.src)
        .pipe(cache(imagemin({
            progressive: true,
            interlaced: true
        })))
        .pipe(gulp.dest(paths.images.dest));
});

gulp.task('fonts', function () {
    return gulp.src(paths.fonts.src)
        .pipe(gulp.dest(paths.fonts.dest));
});

gulp.task('misc', function () {
    return gulp.src([
          'app/' + '*.{ico,png,txt}',
        ])
        .pipe(gulp.dest('public'));
});

gulp.task('less', function () {
    var less = require('gulp-less');
    
    return gulp.src(paths.styles.src + 'less/*.less')
        .pipe(less({
          paths:[
            paths.styles.src,
            paths.styles.src + 'mixins/',
            basePaths.bower
          ]
        }))
        .pipe(gulp.dest(paths.styles.src));
});

gulp.task('wiredep', function () {
    var wiredep = require('wiredep').stream;
    var inject = require('gulp-inject');

    var sources = gulp.src([
      paths.scripts.src + 'models/**/*.js',
      paths.scripts.src + 'collections/**/*.js',
      paths.scripts.src + 'views/**/*.js',
      paths.scripts.src + 'routers/**/*.js'
    ], {read: false});

    return gulp.src('app/' + '*.html')
        .pipe(wiredep({
            exclude:  [ /bootstrap.*\.css$|modernizr/ ], // use less/ move modernizr to top manually
            directory: basePaths.bower
        }))
        .pipe(inject(sources, {relative : true}))
        .pipe(gulp.dest('app'));
});

gulp.task('html', function () {
    var uglify = require('gulp-uglify'),
        minifyCss = require('gulp-minify-css'),
        useref = require('gulp-useref'),
        gulpif = require('gulp-if'),
        assets = useref.assets();

    return gulp.src('app/' + '*.html')
        .pipe(assets)
        .pipe(gulpif('*.js', isProduction ? uglify() : gutil.noop()))
        .pipe(gulpif('*.css', isProduction ? minifyCss() : gutil.noop()))
        .pipe(assets.restore())
        .pipe(useref())
        .pipe(gulp.dest('public'));
});


gulp.task('connect', function () {
    var connect = require('connect');
    var serveStatic = require('serve-static');
    var serveIndex = require('serve-index');
    var app = connect()
        .use(require('connect-livereload')({ port: 35729 }))
        .use(isProduction ? gutil.noop() : serveStatic('app'))
        .use(serveStatic('public'))
        .use(serveIndex('public'));

    require('http').createServer(app)
        .listen(9000)
        .on('listening', function() {
            console.log('Started connect web server on http://localhost:9000.');
        });
});

gulp.task('serve', ['connect'], function () {
    var livereload = require('gulp-livereload');

    livereload.listen();

    require('opn')('http://localhost:9000');

    gulp.watch([
        'public/' + '*.html',
        paths.styles.dest + '*.css',
        paths.scripts.dest + '*.js',
        paths.images.dest + '**/*'
    ]).on('change', livereload.changed);
    
    gulp.watch([
        'bower.json',
        'app/' + '*.html',
         paths.styles.src + '*.css',
         paths.scripts.src + '**/*.js',
    ], ['wiredep']);
    
    gulp.watch([
        paths.styles.src + '**/*.less',
    ], ['less']);
  
    gulp.watch([paths.images.src + '**/*'], ['images']);    
});

gulp.task('build', ['clean'], function () {
    gulp.start('dobuild')
});

gulp.task('dobuild', ['lint', 'less', 'wiredep', 'images', 'fonts', 'misc'], function () {
    isProduction ? gulp.start('html') : gutil.noop()
});

gulp.task('deploy', function() {
  return gulp.src('public/**/*')
    .pipe(gh_pages());
});

gulp.task('default', ['clean'], function () {
    gulp.start('build');
});
