import HTTPAgent from 'lib/agents/http'
import * as settings from 'settings'

export default class GatewayAgent {
  constructor() {
    this._httpAgent = new HTTPAgent({proxy: false})
    this._gatewayUrl = settings.gateway
  }

  getApiVersion() {
    return this._httpAgent.get(`${this._gatewayUrl}/system/info`)
  }

  createEthereumIdentity({userName, seedPhrase}) {
    return this._httpAgent.post(
      `${this._gatewayUrl}/${userName}/ethereum/create-identity`,
      JSON.stringify({seedPhrase: seedPhrase}),
      {'Content-type': 'application/json'}
    )
  }

  checkUserDoesNotExist({userName}) {
    return new Promise((resolve, reject) => {
      this.getUserInformation({userName})
      .then((response) => {
        reject(new Error('This username already exists!'))
      })
      .catch((e) => {
        // console.log(e.typeError)
        if (!!e.response && e.response.status === 404) {
          resolve()
        } else {
          // eslint-disable-next-line max-len
          reject(new Error('network error, please make sure you have an internet connection'))
        }
      })
    })
  }

  getUserInformation({userName}) {
    return this._httpAgent.get(
      `${this._gatewayUrl}/${userName}`
    )
  }

  register({userName, seedPhrase, email, password}) {
    return this._httpAgent.put(
      `${this._gatewayUrl}/${userName}`,
      JSON.stringify({seedPhrase, email, password}),
      {'Content-type': 'application/json'},
      // {credentials: 'omit'}
    )
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

  async getOwnAttributes({userName, type, checkVerified}) {
    const multiple = typeof type !== 'string'
    const types = multiple ? type : [type]

    const allAttributes = await Promise.all(types.map(async type => {
      const typeAttributesIds = await this._httpAgent.get(
        `${this._gatewayUrl}/${userName}/${type}`
      )
      const [typeAttributes, typeVerifications] = await Promise.all([
        Promise.all(typeAttributesIds.map(
          async id => {
            return await this._httpAgent.get(
              `${this._gatewayUrl}/${userName}/${type}/${id}`
            )
          }
        )),
        Promise.all(typeAttributesIds.map(
          async id => {
            return await this._httpAgent.get(
              `${this._gatewayUrl}/${userName}/${type}/${id}/verifications`
            )
          }
        ))
      ])

      return typeAttributesIds.map((id, idx) => {
        return {
          id,
          contents: typeAttributes[idx],
          verified: Object.keys(typeVerifications[idx]).length > 0
        }
      })
    }))

    return allAttributes
  }
}
