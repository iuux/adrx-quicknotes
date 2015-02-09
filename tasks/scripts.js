var gulp = require('gulp');
var browserify = require('browserify');
var reactify = require('reactify');
//var watchify = require('watchify');
var source = require('vinyl-source-stream');
var buffer = require('vinyl-buffer');
var uglify = require('gulp-uglify');
var gzip = require('gulp-gzip');

var bundler = browserify({
  noparse: ['react', 'react/addons', 'reflux', 'fastclick', 'react-router'],
  entries: ['./src/scripts/main.jsx'],
  transform: [reactify],
  extensions: ['.jsx'],
  debug: true,
  cache: {},
  packageCache: {},
  fullPaths: true
});

gulp.task('scripts', function() {
  return bundler.bundle()
    //.on('error', onError)
    .pipe(source('scripts.js'))
    //.pipe(prod ? $.streamify($.uglify()) : $.util.noop())
    .pipe(gulp.dest('./build'))
    .pipe(buffer())
    .pipe(uglify())
    .pipe(gzip())
    .pipe(gulp.dest('./build'));
});
