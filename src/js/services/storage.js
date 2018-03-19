export default class StorageService {
  constructor() {
    this.inBrowser = !_nativeStorageAvailable()

    /*
    if (_secureStorageAvailable()) {
      const onSuccess = () => {}
      const onFailure = () => { alert('catastrophic failure') }
      const appId = 'Jolocom_SmartWallet'

      this.secureStorage = new window.SecureStorage(onSuccess, onFailure, appId)
    }
    */
  }

/* @summary - Retrieves the key from device storage. If running in browser,
 * uses localStorage instead
 * @param {string} key - the key for retrieving the relevant value
 *
 * @returns {object} - The stored javascript object
 *
*/
  async getItem(key) {
    if (this.inBrowser) {
      const data = localStorage.getItem(key)
      return _parseIfObject(data)
    }

    return new Promise((resolve) => {
      window.NativeStorage.getItem(
        key,
        (val) => resolve(_parseIfObject(val)),
        () => resolve(null)
      )
    })
  }

/* @summary - Sets a value corresponding to the passed key on device storage.
 * If running in browser, will use localStorage instead.
 * uses localStorage instead
 *
 * @param {string} key - the key for retrieving the relevant value
 * @param {object} value - the value that needs to be stored
 *
 * @returns {object} - The stored javascript object
 *
*/
  async setItem(key, value) {
    const data = _stringifyIfObject(value)
    if (this.inBrowser) {
      localStorage.setItem(key, data)
      return Promise.resolve(value)
    }

    return new Promise((resolve, reject) => {
      return window.NativeStorage.setItem(key, data, resolve, reject)
    })
  }

/* @summary - Retrieves value from the device's secure storage. If running
 * in browser, will throw an error.
 *
 * @param {string} key - the key for retrieving the relevant value
 *
 * @returns {object} - The stored javascript object
 *
 *

  async getItemSecure(key) {
    return new Promise((resolve, reject) => {
      if (this.secureStorage) {
        return this.secureStorage.get(
          (val) => resolve(_parseIfObject(val)),
          () => resolve(null),
          key
        )
      }

      reject(new Error('No secure storage found'))
    })
  }

 * @summary - Sets value in device's secure storage. If running in browser
 * will throw an error.
 *
 * @param {string} key - the key for retrieving the relevant value
 * @param {object} value - the value that needs to be stored
 *
 * @returns {object} - The stored javascript object
 *
 *
  async setItemSecure(key, value) {
    return new Promise((resolve, reject) => {
      if (this.secureStorage) {
        const data = _stringifyIfObject(value)
        return this.secureStorage.set(resolve, reject, key, data)
      }

      return reject(new Error('No secure storage found'))
    })
  }
*/

  /*
   * @summary - Removes item corresponding to the passed key on device storage.
   * If running in browser, will use localStorage instead.
   *
   * @param {string} key - the key for item to be removed
   *
   * @returns {string} - OK as confirmation
   *
  */
  async removeItem(key) {
    if (this.inBrowser) {
      localStorage.removeItem(key)
      return Promise.resolve('OK')
    }

    return new Promise((resolve, reject) => {
      return window.NativeStorage.remove(key, resolve, reject)
    })
  }
}

const _nativeStorageAvailable = () => {
  return !!window.cordova && !!window.NativeStorage
}

/*
const _secureStorageAvailable = () => {
  return !!window.cordova && !!window.SecureStorage
}
*/

const _stringifyIfObject = (value) => {
  if (typeof value === 'object' && value !== null) {
    return JSON.stringify(value)
  }
  return value
}

const _parseIfObject = (value) => {
  try {
    return JSON.parse(value)
  } catch (e) {
    return value
  }
}
