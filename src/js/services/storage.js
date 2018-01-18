// TODO Does native storage api accept objects?
export default class StorageService {
  constructor() {
    this.inBrowser = !nativeStorageAvailable()
  }

  async setItem(key, value) {
    if (this.inBrowser) {
      if (typeof value === 'object' && value !== null) {
        value = JSON.stringify(value)
      }

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

    return new Promise((resolve, reject) => {
      window.NativeStorage.getItem(key, resolve, reject)
    })
  }
}

const nativeStorageAvailable = () => {
  return !!window.cordova && !!window.NativeStorage
}
