import RNFetchBlob from 'rn-fetch-blob'
// required as some dependencies (ethereum stuff) think we are node and check
// the version
process.version = 'v11.13.0'
// react-native uses a old version of JS Core that does not support
// String.prototype.normalize. This is used in bip39 and therefore needs a polyfill
String.prototype.normalize = function (form: string): string {
  return require('unorm')[String(form).toLowerCase()](this)
}

// @ts-ignore
global.fetch = new RNFetchBlob.polyfill.Fetch({ auto: true }).build()

// @ts-ignore
global.Blob = RNFetchBlob.polyfill.Blob
