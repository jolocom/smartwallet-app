export default class StorageService {
  constructor() {
    this.inBrowser = !nativeStorageAvailable()
  }

  async setItem(key, value) {
    if (this.inBrowser) {
      if (typeof value === 'object' && value !== null) {
        value = JSON.stringify(value)
      }

      console.log("storage")
      localStorage.setItem(key, value)
      return Promise.resolve(value)
    }

    return new Promise((resolve, reject) => {
      window.NativeStorage.setItem(key, value, resolve, reject)
    })
  }

  async getItem(key) {
    if (this.inBrowser) {
      const data = localStorage.getItem(key)
      try {
        return JSON.parse(data)
      } catch (e) {
        return Promise.resolve(localStorage.getItem(key))
      }
    }

    return new Promise((resolve) => {
      window.NativeStorage.getItem(key, resolve, () => resolve(null))
    })
  }
}

const nativeStorageAvailable = () => {
  return !!window.cordova && !!window.NativeStorage
}
