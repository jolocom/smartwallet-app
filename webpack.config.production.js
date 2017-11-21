const webpack = require('webpack')
const path = require('path')

const base = path.resolve(__dirname, 'src', 'js')

module.exports = {
  entry: [
    'babel-polyfill',
    'whatwg-fetch',
    './src/js/main.jsx'
  ],
  resolve: {
    extensions: ['*', '.js', '.jsx', '.json'],
    alias: {
      components: `${base}/components`,
      lib: `${base}/lib`,
      redux_state: `${base}/redux_state`,
      services: `${base}/services`,
      styles: `${base}/styles`,
      routes: `${base}/routes`,
      settings: path.resolve(__dirname, 'config', 'production.js')
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
