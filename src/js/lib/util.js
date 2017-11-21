import url from 'url'

// Misc utility functions
let Util = {
  stringLessThan(s1, s2) {
    if (s1 < s2) {
      return true
    }
    return false
  },

  stringMin(s1, s2) {
    if (Util.stringLessThan(s1, s2)) {
      return s1
    }
    return s2
  },

  stringMax(s1, s2) {
    if (Util.stringLessThan(s1, s2)) {
      return s2
    }
    return s1
  },

  distance(x1, y1, x2, y2) {
    return Math.sqrt(Math.pow((x1 - x2), 2) +
                     Math.pow((y1 - y2), 2))
  },

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
  },

  /*
   * @summary Proxies a uri or not depending on the mode.
   * @param {string} uri - The uri to be proxied.
   * @return {string} uri - proxied / not proxied uri depending on mode.
   */

  uriToProxied(uri) {
  },

  /*
   * @summary Returns the firstname initial of a user.
   * E.g: Useful for the Avatar, when a user does not have an image.
   * @param {object} person - to seek their initial
   * @return {string} initial - inital of person
   */
  nameInitial(person) {
    let initial
    if (!person.name || !person.name.trim()) {
      // otherPerson.name = 'Unnamed'
      initial = '?'
    } else if (person) {
      initial = person.name[0].toUpperCase()
    } else {
      initial = '?'
    }
    return initial
  }
}

export default Util
