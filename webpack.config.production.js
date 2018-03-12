const webpack = require('webpack')
const UglifyJSPlugin = require('uglifyjs-webpack-plugin')
const merge = require('webpack-merge')

const common = require('./webpack.config.common.js')
module.exports = merge(common, {
  plugins: [
    new webpack.optimize.AggressiveMergingPlugin(),
    new UglifyJSPlugin({
      uglifyOptions: {
        mangle: {
          reserved: [
            'Buffer',
            'BigInteger',
            'Point',
            'ECPubKey',
            'ECKey',
            'sha512_asm',
            'asm',
            'ECPair',
            'HDNode'
          ]
        }
      }
    }),
    new webpack.LoaderOptionsPlugin({
      minimize: true,
      debug: false
    }),
    new webpack.DefinePlugin({
      'process.env.NODE_ENV': '"production"'
    })
  ]
})
