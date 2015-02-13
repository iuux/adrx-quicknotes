var gulp = require('gulp');
var runSequence = require('run-sequence');

gulp.task('default', function(callback) {
  runSequence('clean', ['html', 'icons', 'styles', 'vendor', 'scripts'], 'browser-sync', 'watch', callback);
});
