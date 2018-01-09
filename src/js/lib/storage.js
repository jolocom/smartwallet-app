const storage = {
  setItem: async (key, value) => {
    console.log(nativeStorageAvailable()) // eslint-disable-line no-console
    if (!nativeStorageAvailable()) {
      localStorage.setItem(key, value)
      return Promise.resolve(value)
    }

    return new Promise((resolve, reject) => {
      window.NativeStorage.setItem(key, value, resolve, reject)
    })
  },

  getItem: async (key) => {
    if (!nativeStorageAvailable()) {
      return Promise.resolve(localStorage.getItem(key))
    }

    return new Promise((resolve, reject) => {
      window.NativeStorage.getItem(key, resolve, reject)
    })
  }
}

const nativeStorageAvailable = () => {
  return !!window.cordova && !!window.NativeStorage
}

export default storage
