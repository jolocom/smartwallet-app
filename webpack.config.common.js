const webpack = require('webpack')
const path = require('path')
const HtmlWebpackPlugin = require('html-webpack-plugin')
const CopyWebpackPlugin = require('copy-webpack-plugin')

const base = path.resolve(__dirname, 'src', 'js')

module.exports = {
  entry: [
    'react-hot-loader/patch',
    'babel-polyfill',
    'whatwg-fetch',
    path.resolve(__dirname, 'src', 'js', 'main.jsx')
  ],
  resolve: {
    extensions: ['*', '.ts.', '.js', '.jsx', '.json'],
    alias: {
      components: `${base}/components`,
      lib: `${base}/lib`,
      redux_state: `${base}/redux_state`,
      services: `${base}/services`,
      styles: `${base}/styles`,
      routes: `${base}/routes`
    }
  },
  output: {
    path: path.resolve(__dirname, 'dist'),
    filename: './js/bundle.js'
  },
  externals: [{
    xmlhttprequest: '{XMLHttpRequest:XMLHttpRequest}'
  }],
  plugins: [
    new CopyWebpackPlugin([{
      from: path.resolve(__dirname, 'src', 'img'),
      to: path.resolve(__dirname, 'dist', 'img')
    }]),
    new HtmlWebpackPlugin({
      template: path.resolve(__dirname, 'src', 'index.html')
    }),
    new webpack.DefinePlugin({
      'IDENTITY_GATEWAY_URL': JSON.stringify(getGatewayUri()),
      'VERIFICATION_PROV': JSON.stringify('https://verification.jolocom.com'),
      'STRIPE_PUB_KEY': JSON.stringify('pk_test_6pRNASCoBOKtIshFeQd4XMUh')
    })
  ],
  module: {
    rules: [
      {
        test: /\.jsx?$/,
        include: [
          path.resolve(__dirname, 'src', 'js')
        ],
        loader: 'babel-loader'
      }
    ]
  }
}

function getGatewayUri() {
  const { GW } = process.env
  switch (GW) {
    case 'LOCAL':
      return 'http://localhost:5678'
    case 'STAGING':
      return 'https://staging.identity.jolocom.com'
    case 'PRODUCTION':
      return 'https://identity.jolocom.com'
    default:
      return 'https://identity.jolocom.com'
  }
}
