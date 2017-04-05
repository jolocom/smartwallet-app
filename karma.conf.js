var path = require('path')
var webpackConfig = require('./webpack.config.test.js')

module.exports = function (config) {
  webpackConfig.resolve.alias.routes = path.join(
		__dirname, 'src', 'js', 'routes', 'default'
	)

  config.set({
    browsers: [ 'PhantomJS' ],
    singleRun: true, // just run once by default
    frameworks: [ 'mocha', 'sinon-chai' ], // use the mocha test framework
    files: [
      'test/index.js' // just load this file
    ],
    preprocessors: {
      // preprocess with webpack and our sourcemap loader
      'test/index.js': [ 'webpack', 'sourcemap' ],
      'src/js/**/!(*.test).jsx?': 'coverage'
    },
    reporters: [ 'mocha', 'coverage' ], // report results in this format
    mochaReporter: {
      showDiff: true
    },
    coverageReporter: {
      type: 'lcovonly',
      dir: 'coverage',
      subdir: '.',
      file: 'lcov.info'
    },
    webpack: webpackConfig,
    webpackServer: {
      noInfo: true // please don't spam the console when running in karma!
    },
    phantomjsLauncher: {
      // Have phantomjs exit if a ResourceError is encountered
      // (useful if karma exits without killing phantom)
      exitOnResourceError: true
    }
  })
}
