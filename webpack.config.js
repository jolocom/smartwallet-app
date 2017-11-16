const webpack = require('webpack')
const path = require('path')

let defaultGatewayUrl = ''
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
  resolve: {
    extensions: ['*', '.ts.', '.js', '.jsx', '.json'],
    alias: {
      actions: path.resolve(__dirname, 'src/js/actions'),
      components: path.resolve(__dirname, 'src/js/components'),
      lib: path.resolve(__dirname, 'src/js/lib'),
      redux_state: path.resolve(__dirname, 'src/js/redux_state'),
      services: path.resolve(__dirname, 'src/js/services'),
      stores: path.resolve(__dirname, 'src/js/stores'),
      styles: path.resolve(__dirname, 'src/js/styles'),
      routes: path.resolve(__dirname, 'src/js/routes'),
      settings: path.resolve(__dirname, 'config/development.js')
    }
  },
  output: {
    path: path.resolve(__dirname, 'dist/js'),
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
    rules: [
      {
        test: /\.jsx?$/,
        include: [
          path.resolve(__dirname, 'src/js'),
          path.resolve(__dirname, 'test'),
          path.resolve(__dirname, 'node_modules/ethereumjs-tx')
        ],
        loader: 'babel-loader'
      },
      {
        test: /\.html$/,
        loader: 'file-loader?name=[name].[ext]'
      }
    ]
  }
}
