const webpack = require('webpack')
const path = require('path')

const base = path.resolve(__dirname, 'src', 'js')

module.exports = {
  context: path.resolve(__dirname, 'src', 'js'),
  entry: [
    'babel-polyfill',
    'whatwg-fetch',
    'react-hot-loader/patch',
    'webpack-dev-server/client?http://localhost:8080',
    'webpack/hot/only-dev-server',
    './main.jsx'
  ],
  resolve: {
    extensions: ['*', '.ts.', '.js', '.jsx', '.json'],
    alias: {
      components: `${base}/components`,
      lib: `${base}/lib`,
      redux_state: `${base}/redux_state`,
      services: `${base}/services`,
      styles: `${base}/styles`,
      routes: `${base}/routes`,
      settings: path.resolve(__dirname, 'config', 'development.js')
    }
  },
  output: {
    path: path.resolve(__dirname, 'dist', 'js'),
    filename: 'bundle.js',
    publicPath: 'js'
  },
  externals: [{
    xmlhttprequest: '{XMLHttpRequest:XMLHttpRequest}'
  }],
  plugins: [
    new webpack.HotModuleReplacementPlugin(),
    new webpack.DefinePlugin({ 'IDENTITY_GATEWAY_URL': getGatewayUri() })
  ],
  module: {
    rules: [
      {
        test: /\.jsx?$/,
        include: [
          path.resolve(__dirname, 'src', 'js')
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

function getGatewayUri() {
  const { USE_LOCAL_GATEWAY, IDENTITY_GATEWAY_URL } = process.env

  if (USE_LOCAL_GATEWAY) {
    return '"http://localhost:5678"'
  }

  return IDENTITY_GATEWAY_URL ? `"${IDENTITY_GATEWAY_URL}"` : '""'
}
