var path = require('path')

module.exports = {
  devtool: 'inline-source-map',
  debug: true,
  test: true,
  entry: [
    './src/js/main.jsx'
  ],
  resolve: {
    extensions: ['', '.js', '.jsx', '.json'],
    root: path.join(__dirname, 'src', 'js'),
    alias: {
      actions: 'actions',
      components: 'components',
      stores: 'stores',
      lib: 'lib',
      styles: 'styles',
      settings: path.join(__dirname, 'config', 'test.js')
    }
  },
  output: {
    path: path.join(__dirname, 'dist', 'js'),
    filename: 'bundle.js',
    publicPath: 'js/'
  },
  module: {
    noParse: [
      /node_modules\/sinon/
    ],
    loaders: [
      {
        test:   /\.jsx?/,
        loader: 'babel',
        include: [path.join(__dirname, 'src', 'js'), path.join(__dirname, 'test')],
        exclude: 'node_modules'
      },
      {
        test: /\.json$/,
        loader: 'json-loader'
      }
    ]
  },
  externals: [{
    xmlhttprequest: '{XMLHttpRequest:XMLHttpRequest}',
    'react/lib/ReactContext': 'window',
    'react/lib/ExecutionEnvironment': true,
    'react/addons': true
  }]
}
