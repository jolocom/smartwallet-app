const path = require('path'),
      webpack = require('webpack'),
      HtmlWebpackPlugin = require('html-webpack-plugin'),
      CleanWebpackPlugin = require('clean-webpack-plugin')

let defaultGatewayUrl = ''
if (process.env.USE_LOCAL_GATEWAY === 'true') {
  defaultGatewayUrl = 'http://localhost:5678'
}

module.exports = {

  entry: {
    main: './src/js/main.jsx',
    vendor: [
      'babel-polyfill',
      'whatwg-fetch',
      // 'react-hot-loader',
      // 'webpack-dev-server/client?http://localhost:8080',
      // 'webpack/hot/only-dev-server'
    ]
  },
  output: {
    path: path.resolve(__dirname, 'dist'),
    filename: 'bundle.js'
  },
  module: {
    rules: [
      { 
        test: /\.jsx?$/, 
        include: [
          path.join(__dirname, 'src', 'js'),
          path.join(__dirname, 'test'),
          path.join(__dirname, 'node_modules', 'ethereumjs-tx')
        ],
        loader: 'babel-loader' 
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
      path.resolve(__dirname) + '/src/js'
    ],
    extensions: ['*','.js', '.jsx', '.json'],
    alias: {
      'actions': 'actions',
      'components': 'components',
      'stores': 'stores',
      'lib': 'lib',
      'styles': 'styles',
      'routes': path.resolve(__dirname, '/src/js/routes/default.jsx'),
      'settings': path.resolve(__dirname) + '/config/development.js'
    }
  },
  externals: [{
    xmlhttprequest: '{XMLHttpRequest:XMLHttpRequest}'
  }],
  plugins: [
    new HtmlWebpackPlugin({
      title: 'Output Management'
    }),
    // new webpack.HotModuleReplacementPlugin(),
    new webpack.DefinePlugin({
      'IDENTITY_GATEWAY_URL': process.env.IDENTITY_GATEWAY_URL
      ? '"' + process.env.IDENTITY_GATEWAY_URL + '"'
      : '"' + defaultGatewayUrl + '"'
    })
  ]
}

