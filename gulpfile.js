var browserify = require('gulp-browserify');
var del = require('del');
var gulp = require('gulp');
var rename = require('gulp-rename');
var vinylPaths = require('vinyl-paths');
 

gulp.task('scripts', function() {
    gulp.src('src/js/**/*.js')
        .pipe(browserify({
            transform: ['babelify'],
            debug: true
        }))
        .pipe(gulp.dest('./dist/js'))
});

gulp.task('react', function() {
    gulp.src('src/react/**/*.jsx')
        .pipe(browserify({
            transform: ['reactify'],
            es6: true,
            target: 'es5',
            debug : true
        }))
        .pipe(rename({
            extname: '.js'
        }))
        .pipe(gulp.dest('./dist/react'))
});


gulp.task('clean', function () {
    gulp.src('./dist/', {read: false}).pipe(vinylPaths(del));
});

gulp.task('default', ['clean', 'scripts', 'react']);
