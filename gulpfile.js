var browserify = require('gulp-browserify');
var browserSync = require('browser-sync').create();
var concat = require('gulp-concat');
var del = require('del');
var gulp = require('gulp');
var gulpsync = require('gulp-sync')(gulp);
var rename = require('gulp-rename');
var sass = require('gulp-sass');
var vinylPaths = require('vinyl-paths');

var sources = {
  app: './src/js/app.jsx',
  html: './src/index.html',
  img: './src/img/**/*',
  js: ['./src/js/**/*.js', './src/js/**/*.jsx'],
  lib: [
    './node_modules/babel-core/browser-polyfill.js',
    './bower_components/jquery/dist/jquery.js',
    './bower_components/d3/d3.js'
  ],
  libCss: [
    './bower_components/fontawesome/css/font-awesome.css'
  ],
  sass: './src/sass/**/*.scss'
};

var destinations = {
  css: './dist/css',
  img: './dist/img',
  js: './dist/js',
  root: './dist',
};

gulp.task('lib', function() {
  return gulp.src(sources.lib)
    .pipe(concat('lib.js'))
    .pipe(gulp.dest(destinations.js));
});

gulp.task('lib-css', function() {
  return gulp.src(sources.libCss)
    .pipe(concat('lib.css'))
    .pipe(gulp.dest(destinations.css));
});

gulp.task('scripts', function() {
  return gulp.src(sources.app)
    .pipe(browserify({
      transform: ['babelify'],
      debug: true
    }))
    .pipe(rename('app.js'))
    .pipe(gulp.dest(destinations.js))
    .pipe(browserSync.reload({stream: true}));
});


gulp.task('html', function() {
  return gulp.src(sources.html)
    .pipe(gulp.dest(destinations.root))
    .pipe(browserSync.reload({stream: true}));
});

gulp.task('img', function() {
  return gulp.src(sources.img)
    .pipe(gulp.dest(destinations.img));
});

gulp.task('sass', function () {
  return gulp.src(sources.sass)
    .pipe(sass())
    .pipe(gulp.dest(destinations.css))
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
  gulp.watch(sources.sass, ['sass']);
});

gulp.task('default', gulpsync.sync(['clean', ['img', 'lib', 'lib-css', 'sass', 'scripts', 'html'], 'serve']));
