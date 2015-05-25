'use strict';

var basePaths = {
	src: 'app/',
	dest: 'public/',
	tmp: '.tmp/',
	bower: 'app/assets/bower_components/'
};

var baseAssetPaths = {
	src: basePaths.src + 'assets/',
	dest: basePaths.dest + 'assets/',
	tmp: basePaths.tmp + 'assets/',
};

var paths = {
	images: {
		src: baseAssetPaths.src + 'images/',
		dest: baseAssetPaths.dest + 'images/',
		tmp: baseAssetPaths.tmp + 'images/'
	},
	scripts: {
		src: baseAssetPaths.src + 'scripts/',
		dest: baseAssetPaths.dest + 'scripts/',
		tmp: baseAssetPaths.tmp + 'scripts/'
	},
	styles: {
		src: baseAssetPaths.src + 'styles/',
		dest: baseAssetPaths.dest + 'styles/',
		tmp: baseAssetPaths.tmp + 'styles/'
	},
	fonts: {
		src: baseAssetPaths.src + 'fonts/',
		dest: baseAssetPaths.dest + 'fonts/',
		tmp: baseAssetPaths.tmp + 'fonts/'
	}
};

var appFiles = {
	styles: paths.styles.src + '**/*.less',
	scripts: [paths.scripts.src + '*.js']
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
  var rimraf = require('rimraf')
    
    function ccb(){ return rimraf(basePaths.tmp, cb); }
    
    return rimraf(basePaths.dest, ccb);
    
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
        ])
        .pipe(gulp.dest(basePaths.dest));
});

gulp.task('less', function () {
    var less = require('gulp-less');
    
    var lessfiles = gulp.src(paths.styles.src + 'less/*.less')
    
    var less_options = {
      paths:[
        paths.styles.src,
        paths.styles.src + 'mixins/',
        basePaths.bower
      ]
    }
    
    return lessfiles
        .pipe(less(less_options))
        .pipe(gulp.dest(paths.styles.tmp));
});

gulp.task('wiredep', function () {
    var wiredep = require('wiredep').stream;
    var inject = require('gulp-inject');

    var sources = gulp.src([paths.scripts.src + '**/*.js'], {read: false});
    var templates = gulp.src(paths.scripts.src + '**/*.ejsc'); // ejs collection
    
    var sources_options = {relative : true}
    
    var wiredep_options= {
      exclude:  [ /bootstrap.*\.css$|modernizr/ ], // use less/ move modernizr to top manually
      directory: basePaths.bower
    }

    var inject_template_options = {
        starttag: '<!-- inject:templates:{{ext}} -->',
        transform: ejsc_transform_function,
        removeTags: true
    }
        
    return gulp.src(basePaths.src + '*.html')
        .pipe(wiredep(wiredep_options))
        .pipe(inject(sources, sources_options))
        .pipe(inject(templates, inject_template_options))
        .pipe(gulp.dest(basePaths.tmp));
});

gulp.task('html', function () {
    var gulpif = require('gulp-if'),
        
        uglify = require('gulp-uglify'),
        minify = require('gulp-minify-css'),
        
        useref = require('gulp-useref'),
        assets = useref.assets({searchPath: basePaths.src}),
        
        uglifyIfJs = isProduction ? gulpif('*.js', uglify()) : gutil.noop(),
        minifyIfCss = isProduction ? gulpif('*.css', minify()) : gutil.noop();

    return gulp.src(basePaths.tmp + '*.html')
        .pipe(assets)
        .pipe(uglifyIfJs)
        .pipe(minifyIfCss)
        .pipe(assets.restore())
        .pipe(useref())
        .pipe(gulp.dest(basePaths.dest));
});


gulp.task('connect', function () {
    var connect = require('connect');
    var serveStatic = require('serve-static');
    var serveIndex = require('serve-index');
    
    var serveApp = isProduction ? gutil.noop() : serveStatic(basePaths.src);
    var serveWhich= isProduction ? basePaths.dest : basePaths.tmp;
    
    var app = connect()
        .use(require('connect-livereload')({ port: 35729 }))
        .use(serveStatic(serveWhich))
        .use(serveApp)
        .use(serveIndex(serveWhich));

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
    
    var listen_globs = isProduction ? [
        basePaths.dest + '*.html',
        paths.styles.dest + '*.css',
        paths.scripts.dest + '**/*.js',
        paths.images.dest + '**/*'
      ] : [       
        basePaths.tmp + '*.html',
        paths.styles.tmp + '*.css',
        paths.scripts.tmp + '**/*.js',
        paths.images.src + '**/*'
    ]

    gulp.watch(listen_globs).on('change', livereload.changed);
    
    gulp.watch([
        'bower.json',
        basePaths.src + '*.html',
        paths.styles.src + '*.css',
        paths.scripts.src + '**/*.js',
        paths.scripts.src + '**/*.ejsc'
    ], ['wiredep']);
    
    gulp.watch([
        paths.styles.src + '**/*.less',
    ], ['less']);
  
    gulp.watch([paths.images.src + '**/*'], ['images']);
});

gulp.task('build', ['clean'], function () {
    return gulp.start('dobuild')
});

gulp.task('dobuild', ['lint', 'less', 'wiredep', 'images', 'fonts', 'misc'], function () {
    return isProduction ? gulp.start('html') : gutil.noop()
});

gulp.task('deploy', function() {
  return gulp.src(basePaths.dest + '**/*')
    .pipe(gh_pages());
});

gulp.task('default', ['clean'], function () {
    gulp.start('build');
});

var ejsc_transform_function = function (filePath, file) {
  var path = require('path');

  var basename = path.basename(filePath, '.ejsc');
  var startTag = ['<!-- template:',  ')([^\\s]*?) (', '-->'], endTag = '<!-- endtemplate -->'
  
  function getInjectorTagsRegExp (starttag, endtag) {
    var re = '(' + makeWhiteSpaceOptional(escapeForRegExp(starttag[0])) + 
      starttag[1] +
      makeWhiteSpaceOptional(escapeForRegExp(starttag[2]))+ ')(\\s*)((\\n|\\r|.)*?)(' + 
      makeWhiteSpaceOptional(escapeForRegExp(endtag)) + ')';
      
    return new RegExp(re, 'gi');
  }
  
  function makeWhiteSpaceOptional (str) {
    return str.replace(/\s+/g, '\\s*');
  }
  
  function escapeForRegExp (str) {
    return str.replace(/[-\/\\^$*+?.()|[\]{}]/g, '\\$&');
  }
  
  return file.contents.toString('utf8').replace(
    getInjectorTagsRegExp(startTag, endTag),
    function injector (match, starttag1, name, starttag2, indent, content, endtag) {
      return '<script id="' + basename + '_' + name + '_template" type="text/template">' + indent + content + '</script>'
    }
  );
    
}