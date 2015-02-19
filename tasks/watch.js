var gulp = require('gulp');
var browserSync = require('browser-sync');

gulp.task('watch', function() {
  gulp.watch('./src/*.html', ['html', browserSync.reload]);
  gulp.watch('./src/**/*.less', ['styles']);
  gulp.watch('./src/**/*.{js,json,jsx}', ['scripts', browserSync.reload]);
  gulp.watch('./build/**/{styles.css,scripts.js,vendor.js}', ['rev']);
});
