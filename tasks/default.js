var gulp = require('gulp');
var runSequence = require('run-sequence');

gulp.task('default', function(callback) {
  runSequence('clean', ['build', 'vendor'], 'browser-sync', 'styles', 'watch', callback);
});
