var gulp = require('gulp');
var svg = require('gulp-svg-symbols');
var rename = require('gulp-rename');

gulp.task('icons', function() {
  return gulp.src('./src/assets/**/*.svg')
    .pipe(svg({
      id: 'qn-Icon--%f',
      templates: ['default-svg']
    }))
    .pipe(rename('icons.svg'))
    .pipe(gulp.dest('./build'));
});
