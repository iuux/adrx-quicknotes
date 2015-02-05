var gulp = require('gulp');
var browserSync = require('browser-sync');

gulp.task('watch', function() {
  gulp.watch(['./src/**/*.html'], ['build', browserSync.reload]);
});
