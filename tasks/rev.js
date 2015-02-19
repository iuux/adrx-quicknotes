var gulp = require('gulp');
var del = require('del');
var rev = require('gulp-rev');

// Would like to replace this with `rev-del`, but not getting it to work.
// https://github.com/callumacrae/rev-del
gulp.task('rev-del', function(callback) {
  del(['./build/**/{styles-*.css,scripts-*.js,vendor-*.js}'], callback);
});

gulp.task('rev', ['rev-del'], function() {
  return gulp.src([
      './build/**/{styles.css,scripts.js,vendor.js}'
    ])
    .pipe(rev())
    .pipe(gulp.dest('./build'))
    .pipe(rev.manifest())
    .pipe(gulp.dest('./build'));
});
