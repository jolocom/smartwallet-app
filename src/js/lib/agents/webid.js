import LDPAgent from './ldp.js'
import {endpoint} from 'settings'

// WebID related functions
class WebIDAgent extends LDPAgent {

  // Should this send it to the proxy?
  isFakeIDAvailable(username) {
    return this.head(`${endpoint}/${username}`)
      .then(() => {
        return false
      }).catch(() => {
        return true
      })
  }

  // Gets the webId of the currently loged in user from local storage,
  // maybe this will need to change, doesn't need to be a promise anymore.
  getWebID() {
    return Promise.resolve(localStorage.getItem('jolocom.webId'))
  }
}

export default WebIDAgent
