/*eslint-disable */

var browserify = require('gulp-browserify');
var concat = require('gulp-concat');
var del = require('del');
var eslint = require('gulp-eslint');
var gulp = require('gulp');
var gulpsync = require('gulp-sync')(gulp);
var rename = require('gulp-rename');
var sass = require('gulp-sass');
var vinylPaths = require('vinyl-paths');

var sources = {
  app: './src/js/main.jsx',
  data: './data/**/*',
  html: './src/index.html',
  img: './src/img/**/*',
  js: ['./src/js/**/*.js', './src/js/**/*.jsx'],
  lib: [
    './node_modules/babel-core/browser-polyfill.js'
  ],
  libFonts: [
  ],
  libCss: [
  ],
  sass: './src/sass/**/*.scss'
};

var destinations = {
  css: './dist/css',
  fonts: './dist/fonts',
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

gulp.task('lib-fonts', function() {
  return gulp.src(sources.libFonts)
    .pipe(gulp.dest(destinations.fonts));
});

gulp.task('scripts', function() {
  return gulp.src(sources.app)
    .pipe(browserify({
      transform: ['babelify'],
      debug: true,
      paths: [
        './node_modules',
        './src/js'
      ]
    }))
    .pipe(rename('app.js'))
    .pipe(gulp.dest(destinations.js));
});


gulp.task('html', function() {
  return gulp.src(sources.html)
    .pipe(gulp.dest(destinations.root));
});

gulp.task('data', function() {
  return gulp.src(sources.data)
    .pipe(gulp.dest(destinations.root));
});

gulp.task('img', function() {
  return gulp.src(sources.img)
    .pipe(gulp.dest(destinations.img));
});

gulp.task('sass', function () {
  return gulp.src(sources.sass)
    .pipe(sass())
    .pipe(concat('jolocom.css'))
    .pipe(gulp.dest(destinations.css));
});

gulp.task('clean', function () {
  return gulp.src('./dist/*').pipe(vinylPaths(del));
});

gulp.task('lint', function () {
    return gulp.src(sources.js)
        .pipe(eslint())
        .pipe(eslint.format());
        //.pipe(eslint.failOnError());
});

gulp.task('watch', function() {
  gulp.watch(sources.js, ['lint', 'scripts']);
  gulp.watch(sources.html, ['html']);
  gulp.watch(sources.sass, ['sass']);
});

gulp.task('default', gulpsync.sync(['clean', 'lint', ['data', 'img', 'lib', 'lib-css', 'lib-fonts', 'sass', 'scripts', 'html'], 'watch']));
