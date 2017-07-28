import HTTPAgent from 'lib/agents/http'

export default class gatewayAgent {
  constructor() {
    this._httpAgent = new HTTPAgent({proxy: false})
    // this._gatewayUrl =
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

  createUser({userName, seedPhrase, email, password}) {
    return this._httpAgent.get(`${this._gatewayUrl}/${userName}`,
    JSON.stringify({seedPhrase: seedPhrase, email: email, password: password}),
      {
        'Content-type': 'application/json'
      })
  }

  gatewayLogin({userName, seedPhrase}) {
    return this._httpAgent.post(
      `${this._gatewayUrl}/${userName}/login`,
      JSON.stringify({seedPhrase: seedPhrase}),
      {
        'Content-type': 'application/json'
      })
  }

  createSolidServer({userName, seedPhrase}) {
    return this._httpAgent.post(
      `${this._gatewayUrl}/${userName}/solid/create-identity`,
      JSON.stringify({seedPhrase: seedPhrase}),
      {
        'Content-type': 'application/json'
      })
  }
}
