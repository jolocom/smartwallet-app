const path = require('path'),
      webpack = require('webpack'),
      HtmlWebpackPlugin = require('html-webpack-plugin'),
      CleanWebpackPlugin = require('clean-webpack-plugin')

module.exports = {

  entry: {
    main: './src/js/main.jsx',
    vendor: [
      'babel-polyfill',
      'whatwg-fetch'
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
  resolve: {
    modules: [
      path.resolve(__dirname) + '/src/js'
    ],
    extensions: ['*', '.js', '.jsx', '.json'],
    alias: {
      'actions': 'actions',
      'components': 'components',
      'stores': 'stores',
      'lib': 'lib',
      'styles': 'styles',
      'settings': path.resolve(__dirname) + '/config/production.js'
    },
  },
  externals: [{
    xmlhttprequest: '{XMLHttpRequest:XMLHttpRequest}'
  }],
  plugins: [
    new HtmlWebpackPlugin({
      title: 'Output Management'
    }),
    new webpack.DefinePlugin({
      'IDENTITY_GATEWAY_URL': process.env.TIER === 'staging'
      ? '"https://staging.identity.jolocom.com"'
      : '"https://identity.jolocom.com"'
    })
  ]
}
