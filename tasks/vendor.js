var gulp = require('gulp');

gulp.task('vendor', function() {
  return gulp.src([
      './node_modules/angular/*.min.js*',
      './node_modules/angular-ui-router/release/*.min.js'
    ])
    .pipe(gulp.dest('./build/vendor'));
});
