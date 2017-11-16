const webpack = require('webpack')
const path = require('path')

module.exports = {
  entry: [
    'babel-polyfill',
    'whatwg-fetch',
    './src/js/main.jsx'
  ],
  resolve: {
    extensions: ['*', '.js', '.jsx', '.json'],
    alias: {
      components: path.resolve(__dirname, 'src/js/components'),
      lib: path.resolve(__dirname, 'src/js/lib'),
      redux_state: path.resolve(__dirname, 'src/js/redux_state'),
      services: path.resolve(__dirname, 'src/js/services'),
      stores: path.resolve(__dirname, 'src/js/stores'),
      styles: path.resolve(__dirname, 'src/js/styles'),
      routes: path.resolve(__dirname, 'src/js/routes'),
      settings: path.resolve(__dirname, 'config/production.js')
    }
  },
  output: {
    path: path.resolve(__dirname, 'dist/js'),
    filename: 'bundle.js',
    publicPath: 'js/'
  },
  externals: [{
    xmlhttprequest: '{XMLHttpRequest:XMLHttpRequest}'
  }],
  plugins: [
    new webpack.DefinePlugin({
      'IDENTITY_GATEWAY_URL': process.env.TIER === 'staging'
      ? '"https://staging.identity.jolocom.com"'
      : '"https://identity.jolocom.com"'
    })],
  module: {
    rules: [
      {
        test: /\.jsx?$/,
        include: [
          path.resolve(__dirname, 'test'),
          path.resolve(__dirname, 'node_modules/ethereumjs-tx'),
          path.resolve(__dirname, 'src/js')
        ],
        loader: 'babel-loader'
      }
    ]
  }
}
