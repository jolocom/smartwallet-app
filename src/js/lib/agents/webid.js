import HTTPAgent from './http.js'

// WebID related functions
class WebIDAgent {
  constructor() {
    this.http = new HTTPAgent({proxy: true})
  }

  // Gets the webId of the currently logged in user from local storage,
  getWebId() {
    const wallet = localStorage.getItem('jolocom.identity')
    let webId
    try {
      webId = JSON.parse(wallet).userName
    } catch (e) {
      // TODO Handle
      console.error('No webId found')
    }
    return webId
  }
}

export default WebIDAgent
