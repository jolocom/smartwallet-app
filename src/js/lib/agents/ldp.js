import HTTPAgent from './http.js'
import {LDP} from '../namespaces.js'

// Linked-Data Platform related functions
class LDPAgent extends HTTPAgent {
  // create a directory on LDP server
  createBasicContainer(containerUrl) {
    let headers = {
      'Content-Type': 'text/turtle',
      'Link': `<${LDP.BasicContainer}>; rel="type"`
    }

    return this.put(containerUrl, headers)
  }
}

export default LDPAgent
