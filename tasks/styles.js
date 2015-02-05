var gulp = require('gulp');
var less = require('gulp-less');
var prefix = require('gulp-autoprefixer');
var concat = require('gulp-concat');
var browserSync = require('browser-sync');

gulp.task('styles', function() {
  return gulp.src([
      './src/styles/main.less'
    ])
    .pipe(less({
      compress: true
    }))
    .on('error', console.error)
    .pipe(prefix())
    .pipe(concat('bundle.css'))
    .pipe(gulp.dest('./build'))
    .pipe(browserSync.reload({
      stream: true
    }));
});
