var gulp = require('gulp');

gulp.task('build', function() {
  return gulp.src('./src/*.html')
    .pipe(gulp.dest('./build'));
});
