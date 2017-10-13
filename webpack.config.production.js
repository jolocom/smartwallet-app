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
    filename: '[name].js'
  },
  module: {
    rules: [
      {
        test: /\.jsx?$/,
        include: [
          path.resolve(__dirname, '/src/js'),
          path.resolve(__dirname, 'test'),
        ],
        exclude: [/node_modules/],
        loader: 'babel-loader'
      }
    ]  
  },
  resolve: {
    modules: [
      path.resolve(__dirname) + '/src/js',
      // path.resolve('./'),
      path.resolve('./node_modules')
    ],
    extensions: ['.*', '.js', '.jsx', '.json'],
    alias: {
      'actions': 'actions',
      'components': 'components',
      'stores': 'stores',
      'lib': 'lib',
      'styles': 'styles',
      'routes': path.resolve(__dirname, '/src/js/routes/default.jsx'),
      'settings': path.resolve(__dirname) + '/config/production.js'
    },
  },
  externals: [{
    xmlhttprequest: '{XMLHttpRequest:XMLHttpRequest}'
  }],
  plugins: [
    new webpack.HotModuleReplacementPlugin(),
    new webpack.optimize.CommonsChunkPlugin({
      name: 'vendor'
      }),
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
