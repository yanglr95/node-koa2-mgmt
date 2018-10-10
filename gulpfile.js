var gulp = require('gulp');
var stylus = require('gulp-stylus');
var cleanCSS = require('gulp-clean-css');
//var concat = require('gulp-concat');
var uglify = require('gulp-uglify');
//var sourcemaps = require('gulp-sourcemaps');
var gutil = require('gulp-util');
var source = require('vinyl-source-stream');
var buffer = require('vinyl-buffer');
var browserify = require('browserify');
var babelify = require('babelify');
var pugify = require('pugify').pug({ pretty: false });
var nib = require('nib');

var paths = {
  styl: ['public/css/*.styl'],
  scriptEntries: 'public/js/app.js',
  scriptDest: 'public/dist/app.js'
};

// stylus
gulp.task('css', function() {
  gulp.src(paths.styl)
    .pipe(stylus({
      compress: true,
      use: [nib()],
      url: {
        name: 'url',
        limit: 10000,
        paths: ['public']
      }
    }))
    .pipe(cleanCSS())
    .pipe(gulp.dest('public/dist/'));
});

// stylus-dev
gulp.task('css-dev', function() {
  gulp.src(paths.styl)
    .pipe(stylus({
      linenos: true,
      compress: false,
      use: [nib()],
      url: {
        name: 'url',
        limit: 10000,
        paths: ['public']
      }
    }))
    .pipe(gulp.dest('public/dist'));
});

// build browserify
gulp.task('js', function() {
  var b = browserify({
    entries: paths.scriptEntries,
    debug: false
  });

  return b
    .transform(babelify, { presets: ['es2015'] })
    .transform(pugify)
    .bundle()
    .pipe(source(paths.scriptDest))
    .pipe(buffer())
    //.pipe(stripDebug())
    //.pipe(sourcemaps.init({loadMaps: true}))
    // Add transformation tasks to the pipeline here.
    .pipe(uglify())
    .on('error', gutil.log)
    //.pipe(sourcemaps.write('./'))
    .pipe(gulp.dest('./'));
});

// build browserify
gulp.task('js-dev', function() {
  var b = browserify({
    entries: paths.scriptEntries,
    debug: false
  });

  return b
    .transform(babelify, { presets: ['es2015'] })
    .transform(pugify)
    .bundle()
    .pipe(source(paths.scriptDest))
    .pipe(buffer())
    //.pipe(stripDebug())
    //.pipe(sourcemaps.init({loadMaps: true}))
    // Add transformation tasks to the pipeline here.
    //.pipe(uglify())
    .on('error', gutil.log)
    //.pipe(sourcemaps.write('./'))
    .pipe(gulp.dest('./'));
});

gulp.task('watch', function() {
  gulp.watch(['public/**/*.styl', 'public/assets/**/*.*'], ['css-dev']);
  gulp.watch(['public/js/**/*.*', 'public/lib/**/*.*'], ['js-dev']);
});

// build
gulp.task('build', ['css', 'js']);

// The default task (called when you run `gulp` from cli)
gulp.task('default', ['build']);