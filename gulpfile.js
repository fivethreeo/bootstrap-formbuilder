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
		src: basePaths.src + 'js/',
		dest: basePaths.dest + 'js/'
	},
	styles: {
		src: basePaths.src + 'less/',
		dest: basePaths.dest + 'css/'
	},
	fonts: {
		src: basePaths.src + 'fonts/',
		dest: basePaths.dest + 'fonts/'
	},
};

var appFiles = {
	styles: paths.styles.src + '**/*.less',
	scripts: [paths.scripts.src + 'scripts.js']
};

var vendorFiles = {
	styles: [''],
	scripts: ['']
};


var gulp = require('gulp');
var es = require('event-stream');
var gutil = require('gulp-util');

var mainBowerFiles = require('main-bower-files');

var plugins = require("gulp-load-plugins")({
	pattern: ['gulp-*', 'gulp.*'],
	replaceString: /\bgulp[\-.]/
});

// Allows gulp --dev to be run for a more verbose output
var isProduction = true;
var sourceMap = false;

if(gutil.env.dev === true) {
	sourceMap = true;
	isProduction = false;
}

gulp.task('clean', function (cb) {
    require('rimraf')('dist', cb);
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
            basePaths.src + '*.{ico,png,txt}',
            basePaths.src + '.htaccess'
        ])
        .pipe(gulp.dest(basePaths.dest));
});

gulp.task('html', function () {
    var uglify = require('gulp-uglify'),
        minifyCss = require('gulp-minify-css'),
        useref = require('gulp-useref'),
        gulpif = require('gulp-if'),
        assets = useref.assets();

    return gulp.src('app/' + '*.html')
        .pipe(assets)
        .pipe(gulpif('*.js', uglify()))
        .pipe(gulpif('*.css', minifyCss()))
        .pipe(assets.restore())
        .pipe(useref())
        .pipe(gulp.dest('public/'));
});

gulp.task('css', function () {
    var wiredep = require('wiredep').stream;

    var lessFiles = gulp.src(appFiles.styles)
    .pipe(plugins.less())
    .pipe(gulp.dest(basePaths.dest));
});
gulp.task('wiredep', function () {
    var wiredep = require('wiredep').stream;

    gulp.src('app/*.html')
        .pipe(wiredep())
        .pipe(gulp.dest('public'));
});

gulp.task('connect', function () {
    var connect = require('connect');
    var serveStatic = require('serve-static');
    var serveIndex = require('serve-index');
    var app = connect()
        .use(require('connect-livereload')({ port: 35729 }))
        .use(serveStatic(basePaths.dest))
        .use(serveIndex('public/'));

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
        basePaths.dest + '*.html',
        paths.styles.dest + '*.css',
        paths.scripts.dest + '*.js',
        paths.images.dest + '**/*'
    ]).on('change', livereload.changed);
    
    gulp.watch('bower.json', ['css']);
});

gulp.task('build', ['lint', 'html', 'images', 'fonts', 'misc']);

gulp.task('default', ['clean'], function () {
    gulp.start('build');
});
