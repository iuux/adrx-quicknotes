var gulp = require('gulp');

gulp.task('vendor', function() {
  return gulp.src([
      './node_modules/angular/angular.min.js'
    ])
    .pipe(gulp.dest('./build/vendor'));
});
