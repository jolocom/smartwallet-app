var browserify = require('gulp-browserify');
var del = require('del');
var gulp = require('gulp');
var rename = require('gulp-rename');
var vinylPaths = require('vinyl-paths');

var sources = {
  html: './src/index.html',
  app: './src/js/app.jsx',
  js: ['./src/js/**/*.js', './src/js/**/*.jsx'],
};


var destinations = {
  html: './dist',
  app: './dist/js',
};

gulp.task('html', function() {
  gulp.src(sources.html)
    .pipe(gulp.dest(destinations.html))
});

gulp.task('scripts', function() {
  gulp.src(sources.app)
    .pipe(browserify({
      transform: ['babelify'],
      debug: true
    }))
    .pipe(rename('app.js'))
    .pipe(gulp.dest(destinations.app))
});


gulp.task('clean', function () {
  gulp.src('./dist/*').pipe(vinylPaths(del));
});

gulp.task('watch', function() {
  gulp.watch(sources.js, ['scripts']);
  gulp.watch(sources.html, ['html']);
});

gulp.task('default', ['clean', 'watch', 'html', 'scripts']);
