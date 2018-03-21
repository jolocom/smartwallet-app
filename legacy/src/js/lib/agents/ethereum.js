import HTTPAgent from './http.js'

export default class EthereumAgent {
  constructor(config) {
    this.http = new HTTPAgent()
    this.fuelingEndpoint = config.fuelingEndpoint
  }

  async requestEther({did, address}) {
    return this.http.post(this.fuelingEndpoint, {address, did})
  }
}
