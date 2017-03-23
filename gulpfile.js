/*eslint-disable */

var gulp = require('gulp');
var gutil = require('gulp-util');
var webpack = require('webpack');
var WebpackDevServer = require('webpack-dev-server');
var webpackConfig = require('./webpack.config.js');
var webpackConfigProduction = require('./webpack.config.production.js');
var eslint = require('gulp-eslint');

var path = require('path');
var concat = require('gulp-concat');

function startDevServer(config, callback) {
	// modify some webpack config options
	var myConfig = Object.create(config);
	myConfig.devtool = 'eval';
	myConfig.debug = true;

	// Start a webpack-dev-server
	new WebpackDevServer(webpack(myConfig), {
		https: true,
		publicPath: '/' + myConfig.output.publicPath,
		hot: true,
		inline: true,
		contentBase: 'dist',
		stats: {
			colors: true
		}
	}).listen(8080, '0.0.0.0', function (err) {
		if (err) throw new gutil.PluginError('webpack-dev-server', err);
		gutil.log('[webpack-dev-server]', 'https://localhost:8080');
	});
}

function setRoutesEntry(config, entry) {
	var myConfig = Object.create(config);
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

gulp.task('html', function() {
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
	var myConfig = setRoutesEntry(webpackConfigProduction);
	myConfig.plugins = myConfig.plugins.concat(
		new webpack.DefinePlugin({
			'process.env': {
				// This has effect on the react lib size
				'NODE_ENV': JSON.stringify('production')
			}
		}),
		new webpack.optimize.DedupePlugin(),
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
});

// modify some webpack config options
var myDevConfig = Object.create(webpackConfig);
myDevConfig.devtool = 'sourcemap';
myDevConfig.debug = true;


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
