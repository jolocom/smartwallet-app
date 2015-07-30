var browserify = require('gulp-browserify');
var browserSync = require('browser-sync').create();
var concat = require('gulp-concat');
var del = require('del');
var gulp = require('gulp');
var gulpsync = require('gulp-sync')(gulp);
var rename = require('gulp-rename');
var vinylPaths = require('vinyl-paths');

var sources = {
  html: './src/index.html',
  app: './src/js/app.jsx',
  js: ['./src/js/**/*.js', './src/js/**/*.jsx'],
  lib: ['./node_modules/babel-core/browser-polyfill.js']
};

var destinations = {
  html: './dist',
  app: './dist/js',
};

gulp.task('lib', function() {
  return gulp.src(sources.lib)
    .pipe(concat('lib.js'))
    .pipe(gulp.dest(destinations.app));
});

gulp.task('scripts', function() {
  return gulp.src(sources.app)
    .pipe(browserify({
      transform: ['babelify'],
      debug: true
    }))
    .pipe(rename('app.js'))
    .pipe(gulp.dest(destinations.app))
    .pipe(browserSync.reload({stream: true}));
});


gulp.task('html', function() {
  return gulp.src(sources.html)
    .pipe(gulp.dest(destinations.html))
    .pipe(browserSync.reload({stream: true}));
});


gulp.task('clean', function () {
  return gulp.src('./dist/*').pipe(vinylPaths(del));
});

gulp.task('serve', function() {
  browserSync.init(
    {
      server: {
        baseDir: './dist'
      }
    }
  );
  gulp.watch(sources.js, ['scripts']);
  gulp.watch(sources.html, ['html']);
});

gulp.task('default', gulpsync.sync(['clean', ['lib', 'scripts', 'html'], 'serve']));
