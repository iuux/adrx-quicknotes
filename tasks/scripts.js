var gulp = require('gulp');
var browserify = require('browserify');
var reactify = require('reactify');
var source = require('vinyl-source-stream');
var buffer = require('vinyl-buffer');
var uglify = require('gulp-uglify');
var gzip = require('gulp-gzip');

var bundler = browserify({
  entries: ['./src/scripts/main.jsx'],
  transform: [reactify],
  extensions: ['.jsx'],
  debug: true
});

gulp.task('scripts', function() {
  return bundler.bundle()
    .pipe(source('scripts.js'))
    .pipe(gulp.dest('./build'))
    .pipe(buffer())
    .pipe(uglify())
    .pipe(gzip())
    .pipe(gulp.dest('./build'));
});
