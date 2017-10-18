const path = require('path'),
      webpack = require('webpack')

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
      },
      {
        test: /\.html$/,
         use: ['file-loader?name=[name].[ext]']
      }
    ]
  },
  devServer: {
    stats: {
      errorDetails: true
    }
  },
  resolve: {
    modules: [
      path.resolve(__dirname, 'src/js'),
      path.resolve(__dirname, 'node_modules'),
      path.resolve(__dirname, 'node_modules/ethereumjs.-tx')
    ],
    extensions: ['*','.js', '.jsx', '.json'],
    alias: {
      'actions': 'actions',
      'components': 'components',
      'stores': 'stores',
      'lib': 'lib',
      'styles': 'styles',
      'routes': path.resolve(__dirname, 'src/js/routes/default.jsx'),
      'settings': path.resolve(__dirname, 'config/development.js')
    }
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
  ]
}

