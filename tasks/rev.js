var gulp = require('gulp');
var rev = require('gulp-rev');
var revDel = require('rev-del');

gulp.task('rev', function() {
  return gulp.src([
      './build/**/{styles.css,scripts.js,vendor.js}'
    ])
    .pipe(rev())
    .pipe(gulp.dest('./build'))
    .pipe(rev.manifest())
    .pipe(revDel({
      dest: './build'
    }))
    .pipe(gulp.dest('./build'));
});
