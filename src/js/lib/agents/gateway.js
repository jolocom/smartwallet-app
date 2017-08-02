import HTTPAgent from 'lib/agents/http'

export default class GatewayAgent {
  constructor() {
    this._httpAgent = new HTTPAgent({proxy: false})
    // this._gatewayUrl =
    this._localStorage = localStorage
  }

  getApiVersion() {
    return this._httpAgent.get(`${this._gatewayUrl}/system/info`)
  }

  createEthereumIdentity({userName, seedPhrase}) {
    return this._httpAgent.post(
      `${this._gatewayUrl}/${userName}/ethereum/create-identity`,
      JSON.stringify({seedPhrase: seedPhrase}),
      {
        'Content-type': 'application/json'
      })
  }

  getUserInformation({userName}) {
    return this._httpAgent.get(`${this._gatewayUrl}/${userName}`)
  }

  register({userName, seedPhrase, email, password}) {
    return this._httpAgent.get(`${this._gatewayUrl}/${userName}`,
    JSON.stringify({seedPhrase: seedPhrase, email: email, password: password}),
      {
        'Content-type': 'application/json'
      })
  }

  login({seedPhrase}) {
    return this._httpAgent.post(
      `${this._gatewayUrl}/login`,
      JSON.stringify({seedPhrase}),
      {
        'Content-type': 'application/json'
      }
    )
  }

  createSolidIdentity({userName, seedPhrase}) {
    return this._httpAgent.post(
      `${this._gatewayUrl}/${userName}/solid/create-identity`,
      JSON.stringify({seedPhrase: seedPhrase}),
      {
        'Content-type': 'application/json'
      })
  }
}
