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

  // for short randomStrings
  randomString(length) {
    // Hope this is trully random, will need to do some extra research.
    return Date.now().toString(36).substring(2, length + 3)
  },

  webidRoot(webid) {
    return webid.match(/^(.*)\/profile\/card#me$/)[1]
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
    return `${proxy}/proxy?url=${encodeURIComponent(encodeURI(uri))}`
  }
}

export default Util
