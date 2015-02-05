var gulp = require('gulp');
var browserSync = require('browser-sync');

gulp.task('watch', function() {
  gulp.watch('./src/*.html', ['build', browserSync.reload]);
  gulp.watch('./src/**/*.less', ['styles']);
  gulp.watch([
    './src/**/*.{js,json}',
    './src/modules/**/*.html'
    ], ['scripts', browserSync.reload]);
});
