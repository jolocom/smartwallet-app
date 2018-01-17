// TODO Does native storage api accept objects?
const storage = {
  setItem: async (key, value) => {
    if (!nativeStorageAvailable()) {
      if (typeof value === 'object' && value !== null) {
        value = JSON.stringify(value)
      }

      localStorage.setItem(key, value)
      return Promise.resolve(value)
    }

    return new Promise((resolve, reject) => {
      window.NativeStorage.setItem(key, value, resolve, reject)
    })
  },

  getItem: async (key) => {
    if (!nativeStorageAvailable()) {
      const data = localStorage.getItem(key)
      try {
        return JSON.parse(data)
      } catch(e) {
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

export default storage
