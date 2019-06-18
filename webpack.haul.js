const path = require('path')

module.exports = ({ platform }, { module, resolve }) => ({
  entry: `./index.ts`,
  module: {
    ...module,
    rules: [
      {
        test: /\.jsx?$/,
        exclude: /node_modules\/(?!(typeforce|asn1.js|jolocom-lib|base64url|jsonld|rdf-canonize|tiny-secp256k1|bip32|bip39)\/).*/,
        loader: 'babel-loader'
      },
      {
        test: /\.svg$/,
        exclude: /node_modules/,
        use: ['babel-inline-import-loader', 'babel-loader']
      },
      {
        test: /\.xml$/,
        exclude: /node_modules/,
        use: ['babel-inline-import-loader', 'babel-loader']
      },
      {
        test: /\.tsx?$/,
        loader: 'babel-loader!ts-loader'
      },
      ...module.rules
    ]
  },
  resolve: {
    ...resolve,
    alias: {
      src: path.resolve(__dirname, 'src/'),
      react: path.join(__dirname, 'node_modules/react'),
      'react-native': path.join(__dirname, 'node_modules/react-native')
    },
    extensions: [
      `.${platform}.ts`,
      `.${platform}.tsx`,
      '.ts',
      '.tsx',
      '.native.ts',
      '.native.tsx',
      '.json',
      ...resolve.extensions
    ]
  }
})
