export async function getPassword(): Promise<string> {
  // At the time of writing this file, the encryption password is stored in
  // react-native-keychain and accessesed through src/lib/keychain.ts, but code
  // is reproduced here in case things change in the future

  if (typeof navigator !== 'undefined' && navigator.product == 'ReactNative') {
    // We load react-native-keychain here conditionally because it is not
    // transpiled and cannot be loaded into ts-node (if running migrations locally
    // on dev machine)
    const Keychain = require('react-native-keychain')

    const keyChainData = await Keychain.getGenericPassword()
    if (keyChainData && keyChainData.password) {
      return keyChainData.password
    } else {
      throw new Error("Can't load password from react-native-keychain")
    }
  } else {
    const password = process.env.SMARTWALLET_PASSWORD
    if (!password) {
      throw new Error(
        'Node envrionment detected. ' +
          'Please set a password in the environment variable SMARTWALLET_PASSWORD',
      )
    }
    return password
  }
}
