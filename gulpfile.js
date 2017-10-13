/*eslint-disable */

const gulp = require('gulp'),
  gutil = require('gulp-util'),
  webpack = require('webpack'),
  WebpackDevServer = require('webpack-dev-server'),
  webpackConfig = require('./webpack.config.js'),
  webpackConfigProduction = require('./webpack.config.production.js'),
  eslint = require('gulp-eslint'),
  fs = require('fs'),
  path = require('path'),
  concat = require('gulp-concat'),
  clean = require('gulp-clean'),
  rename = require('gulp-rename'),

  cordova = require('cordova-lib').cordova

function startDevServer(config, callback) {
	// modify some webpack config options
	let myConfig = Object.create(config);
	myConfig.devtool = 'eval';

	// Start a webpack-dev-server
	new WebpackDevServer(webpack(myConfig), {
		https: false,
		publicPath: '/' + myConfig.output.publicPath,
		hot: true,
		inline: true,
		contentBase: 'dist',
		stats: {
			colors: true
		}
	}).listen(8080, '0.0.0.0', function (err) {
		if (err) throw new gutil.PluginError('webpack-dev-server', err);
		gutil.log('[webpack-dev-server]', 'http://localhost:8080');
	});
};

function setRoutesEntry(config, entry) {
  var myConfig = config
	var entry = entry || process.env.ENTRY || 'default';
	myConfig.resolve.alias.routes = path.join(
		__dirname, 'src', 'js', 'routes', entry + '.jsx'
  );
	return myConfig;
}

gulp.task('lint', function() {
    return gulp.src([
    	'src/js/**/*.js',
    	'src/js/**/*.jsx',
    	'!src/js/**/*.test.js',
    	'!src/js/**/*.test.jsx'
    ]).pipe(eslint())
      .pipe(eslint.format())
      .pipe(eslint.failAfterError());
});

// The development server (the recommended option for development)
gulp.task('default', ['webpack-dev-server']);

gulp.task('wallet', function(callback) {
	var myConfig = setRoutesEntry(webpackConfig, 'wallet');
	startDevServer(myConfig, callback);
});

gulp.task('html', ['clean'], function() {
  return gulp.src('./src/index.html')
    .pipe(gulp.dest('./dist/'));
});

gulp.task('img', function() {
  return gulp.src('./src/img/**.*')
    .pipe(gulp.dest('./dist/img'));
});

//This task takes care of moving the test dummy data into dist.
gulp.task('data', function(){
  return gulp.src('./data/**/*')
    .pipe(gulp.dest('./dist/'));
});

gulp.task('clean', function () {
  return gulp.src('./dist/index.html', {read: false})
    .pipe(clean());
});

// Build and watch cycle (another option for development)
// Advantage: No server required, can run app from filesystem
// Disadvantage: Requests are not blocked until bundle is available,
// can serve an old app on refresh
gulp.task('build-dev', ['webpack:build-dev', 'html', 'img', 'data'], function() {
	gulp.watch(['src/**/*'], ['webpack:build-dev']);
});

// Production build
gulp.task('build', ['webpack:build', 'html', 'img']);

gulp.task('webpack:build', function(callback) {
	// modify some webpack config options
  var myConfig = webpackConfigProduction;
  var myConfig = setRoutesEntry(webpackConfigProduction);
	myConfig.plugins = myConfig.plugins.concat(
		new webpack.DefinePlugin({
			'process.env.NODE_ENV': JSON.stringify('production')
		}),
		new webpack.optimize.UglifyJsPlugin()
	);

	// run webpack
	webpack(myConfig, function(err, stats) {
		if(err) throw new gutil.PluginError('webpack:build', err);
		gutil.log('[webpack:build]', stats.toString({
			colors: true
		}));
		callback();
  });
  webpack(webpackConfigProduction)
});

// modify some webpack config options
var myDevConfig = Object.create(webpackConfig);
myDevConfig.devtool = 'sourcemap';

// create a single instance of the compiler to allow caching
var devCompiler = webpack(myDevConfig);

gulp.task('webpack:build-dev', function(callback) {
	// run webpack
	devCompiler.run(function(err, stats) {
		if(err) throw new gutil.PluginError('webpack:build-dev', err);
		gutil.log('[webpack:build-dev]', stats.toString({
			colors: true
		}));
		callback();
	});
});

gulp.task('webpack-dev-server', function(callback) {
	startDevServer(webpackConfig, callback)
});

// Cordova tasks
gulp.task('html:cordova', ['clean'], function() {
  return gulp.src('./src/cordova.html')
    .pipe(rename('index.html'))
    .pipe(gulp.dest('./dist/'));
});

gulp.task('build:cordova', [
  'webpack:build', 'html:cordova', 'img'
]);

gulp.task('cordova:configure', function() {
  var config = process.env.ENTRY || 'graph'

  return gulp.src('./app/' + config + '.xml')
    .pipe(rename('config.xml'))
    .pipe(gulp.dest('./app/'));
});

gulp.task('cordova:init', ['cordova:add-ios', 'cordova:add-android'])

gulp.task('cordova:add-ios', ['cordova:configure'], function (callback) {
  process.chdir(path.join(__dirname, 'app'));

  var exists = fs.existsSync(
    path.join(cordova.findProjectRoot(), 'platforms', 'ios')
  );

  Promise.resolve()
    .then(function() {
      if (exists) {
        return cordova.raw.platforms('rm', 'ios');
      }
    })
    .then(function() {
      return cordova.raw.platforms('add', 'ios');
    })
    .then(function() {
      callback()
    })
    .catch(function(e) {
      callback(e)
    })
});

gulp.task('cordova:add-android', ['cordova:configure'], function (callback) {
  process.chdir(path.join(__dirname, 'app'));

  var exists = fs.existsSync(
    path.join(cordova.findProjectRoot(), 'platforms', 'android')
  );

  Promise.resolve()
    .then(function() {
      if (exists) {
        return cordova.raw.platforms('rm', 'android');
      }
    })
    .then(function() {
      return cordova.raw.platforms('add', 'android');
    })
    .then(function() {
      callback()
    })
    .catch(function(e) {
      callback(e)
    })
});

gulp.task('release:ios', ['build:cordova', 'cordova:add-ios'], function (callback) {
  process.chdir(path.join(__dirname, 'app'));

  var config = process.env.ENTRY || 'graph'

  Promise.resolve()
    .then(function() {
      return cordova.raw.build({
        'platforms': ['ios'],
        'options': [
          '--release',
          '--gradleArg=--no-daemon',
          '--buildConfig=' + config + '.json'
        ]
      });
    })
    .then(function() {
      callback()
    })
    .catch(function(e) {
      callback(e)
    })
});

gulp.task('release:android', ['build:cordova', 'cordova:add-android'], function (callback) {
  process.chdir(path.join(__dirname, 'app'));

  Promise.resolve()
    .then(function() {
      return cordova.raw.build({
        'platforms': ['android'],
        'options': [
          '--release',
          '--gradleArg=--no-daemon',
          '--buildConfig=../cordova.json'
        ]
      });
    })
    .then(function() {
      callback()
    })
    .catch(function(e) {
      callback(e)
    })
});
