const path = require('path');
const webpack = require('webpack')

module.exports = {

  entry: [
  'babel-polyfill',
  'whatwg-fetch',
  './src/js/main.jsx'
],
  output: {
    path: path.resolve(__dirname, 'dist/js'),
    filename: '[name].js',
    publicPath: 'js'
  },
  module: {
    rules: [
      {
        test: /\.jsx?$/,
        include: [
          path.resolve(__dirname, 'src/js'),
          path.resolve(__dirname, 'test'),
          path.resolve(__dirname, 'node_modules/ethereumjs.-tx')
        ],
        exclude: /node_modules/,
        use: {
          loader: 'babel-loader'
        }
      }
    ]
  },
  resolve: {
    modules: [
      path.resolve(__dirname, 'src/js'),
      path.resolve(__dirname, 'node_modules')
    ],
    extensions: ['.*', '.js', '.jsx', '.json'],
    alias: {
      'actions': 'actions',
      'components': 'components',
      'stores': 'stores',
      'lib': 'lib',
      'styles': 'styles',
      'settings': path.resolve(__dirname, 'config/production.js')
    }
  },
  externals: [{
    xmlhttprequest: '{XMLHttpRequest:XMLHttpRequest}'
  }],
  plugins: [
    new webpack.HotModuleReplacementPlugin(),
    new webpack.DefinePlugin({
      'IDENTITY_GATEWAY_URL': process.env.TIER === 'staging'
      ? '"https://staging.identity.jolocom.com"'
      : '"https://identity.jolocom.com"'
    })
  ]
}
