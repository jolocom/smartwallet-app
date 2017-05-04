import url from 'url'
import {proxy} from 'settings'

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

  webidRoot(webid) {
    let matches =
      // WTF :D
      webid.match(/^(.*)\/profile\/card#me$/) ||
      webid.match(/^(.*)\/profile\/card#i$/) ||
      webid.match(/^(.*)\/profile\/card$/)
    return matches && matches[1]
  },

  urlWithoutHash(target) {
    let obj = url.parse(target)
    obj.hash = null
    return url.format(obj)
  },

  linkToState(target, property) {
    return (e) => {
      target.setState({
        [property]: e.target.value
      })
    }
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
   * @summary Returns the user's profile folder uri.
   *   assuming they are using one.
   * @param {string} webId - webId of the user.
   * @return {string} uri - Uri to the profile folder.
   */

  getProfileFolderUri(webId) {
    return `${this.webidRoot(webId)}/profile`
  },

  /*
   * @summary Returns the uri of the index file belonging to an user.
   * @param {string} uri - WebID of the user.
   *   if empty, no the current webid is used.
   * @return {string} uri - Uri to the index file.
   */
  // TODO introduce discovery mechanism / protocol.
  // This is too hardcoded.
  getIndexUri(uri) {
    const WebIdAgent = require('lib/agents/webid').default
    const webId = (new WebIdAgent()).getWebId()
    let indexUri = this.webidRoot(webId)
    indexUri += `/little-sister/index/${this.formatWebId(uri)}`
    return indexUri
  },

  // TODO Rethink
  formatWebId(webId) {
    return this.webidRoot(webId).replace(/[: ./]/g, '')
  },

  /*
   * @summary Proxies a uri or not depending on the mode.
   * @param {string} uri - The uri to be proxied.
   * @return {string} uri - proxied / not proxied uri depending on mode.
   */

  uriToProxied(uri) {
    if (!uri) {
      return
    }
    let mode = localStorage.getItem('jolocom.auth-mode')
    if (mode === 'cert') {
      return uri
    }
    return `${proxy}/proxy?url=${uri}`
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
