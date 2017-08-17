var webpack = require('webpack')
var path = require('path')

var defaultGatewayUrl = ''
if (process.env.USE_LOCAL_GATEWAY === 'true') {
  defaultGatewayUrl = 'http://localhost:5678'
}

module.exports = {
  entry: [
    'babel-polyfill',
    'whatwg-fetch',
    'react-hot-loader/patch',
    'webpack-dev-server/client?http://localhost:8080',
    'webpack/hot/only-dev-server',
    './src/js/main.jsx',
    './src/index.html'
  ],
  stats: {
    errorDetails: true
  },
  resolve: {
    extensions: ['', '.js', '.jsx', '.json'],
    root: path.join(__dirname, 'src', 'js'),
    alias: {
      actions: 'actions',
      components: 'components',
      stores: 'stores',
      lib: 'lib',
      styles: 'styles',
      routes: path.join(__dirname, 'src', 'js', 'routes', 'default.jsx'),
      settings: path.join(__dirname, 'config', 'development.js')
    }
  },
  output: {
    path: path.join(__dirname, 'dist', 'js'),
    filename: 'bundle.js',
    publicPath: 'js'
  },
  externals: [{
    xmlhttprequest: '{XMLHttpRequest:XMLHttpRequest}'
  }],
  plugins: [
    new webpack.HotModuleReplacementPlugin(),
    new webpack.DefinePlugin({
      'IDENTITY_GATEWAY_URL': process.env.IDENTITY_GATEWAY_URL
      ? '"' + process.env.IDENTITY_GATEWAY_URL + '"'
      : '"' + defaultGatewayUrl + '"'
    })
  ],
  module: {
    loaders: [
      {
        test: /\.jsx?$/,
        loader: 'babel',
        include: [
          path.join(__dirname, 'src', 'js'),
          path.join(__dirname, 'test'),
          path.join(__dirname, 'node_modules', 'ethereumjs-tx')
        ]
      },
      {
        test: /\.html$/,
        loader: 'file?name=[name].[ext]'
      },
      {
        test: /\.json$/,
        loader: 'json-loader'
      }
    ]
  }
}
