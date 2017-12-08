export default Util = {
  randomString(length) {
    return Math.random().toString(36).substr(2, 5)
  },

  isChrome() {
    return /Chrome/.test(navigator.userAgent) &&
           /Google Inc/.test(navigator.vendor)
  },

  isSafari() {
    return /Safari/.test(navigator.userAgent) &&
      /Apple Computer/.test(navigator.vendor)
  }
}
