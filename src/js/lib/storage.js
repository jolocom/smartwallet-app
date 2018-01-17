const storage = {
  // SMARTEN
  setItem: async (key, value) => {
    if (!nativeStorageAvailable()) {
      localStorage.setItem(key, value)
      return Promise.resolve(value)
    }

    return new Promise((resolve, reject) => {
      window.NativeStorage.setItem(key, value, resolve, reject)
    })
  },

  // SMARTEN
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
