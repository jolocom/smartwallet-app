import * as _ from 'lodash'
import WalletCrypto from 'smartwallet-contracts/lib/wallet-crypto'
import HTTPAgent from 'lib/agents/http'
import * as settings from 'settings'

export default class GatewayAgent {
  constructor(gatewayUrl) {
    this._httpAgent = new HTTPAgent({proxy: false})
    this._gatewayUrl = gatewayUrl
  }

  retrieveEtherPrice() {
    return this._httpAgent.get(
      settings.blockchain.jolocomEtherAddress +
      '/exchange-rate/ether', null,
      {credentials: 'omit'}
    )
  }

  getBalanceEther({userName, walletAddress}) {
    return this._httpAgent.post(
      `${this._gatewayUrl}/${userName}/ethereum/get-balance`,
      JSON.stringify({walletAddress}),
      {'Content-type': 'application/json'}
    )
  }

  sendEther({userName, seedPhrase, receiver, amountEther, data, gasInWei}) {
    return this._httpAgent.post(
      `${this._gatewayUrl}/${userName}/ethereum/send-ether`,
      JSON.stringify({seedPhrase, receiver, amountEther, data, gasInWei}),
      {'Content-type': 'application/json'}
    )
  }

  createEthereumIdentityContract({userName, walletAddress, seedPhrase}) {
    return this._httpAgent.post(
      `${this._gatewayUrl}/${userName}/ethereum/create-identity`,
      JSON.stringify({walletAddress, seedPhrase}),
      {'Content-type': 'application/json'}
    )
  }

  buyEther({stripeToken, walletAddress}) {
    return this._httpAgent.post(
      'https://verification.jolocom.com/ether/buy/ether',
      JSON.stringify({stripeToken: JSON.stringify(stripeToken), walletAddress}),
      {'Content-type': 'application/json'},
      {credentials: 'omit'}
    )
  }

  checkOwnUrlDoesExist({userName, gatewayUrl}) {
    return new Promise((resolve, reject) => {
      this._httpAgent.get(
        `${gatewayUrl}/${userName}`
      )
      .then((response) => {
        resolve() // eslint-disable-line max-len
      })
      .catch((e) => {
        if (!!e.response && e.response.status === 404) { // eslint-disable-line max-len
          resolve()
        } else if (e instanceof TypeError && e.message === 'Failed to fetch') {
          reject(new Error('This Domain URL is not correct. Please double check.')) // eslint-disable-line max-len
        } else {
          reject(new Error('network error, please make sure you have an internet connection')) // eslint-disable-line max-len
        }
      })
    })
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

  getDisplayName({userName}) {
    return this._httpAgent.get(
      `${this._gatewayUrl}/${userName}/identity/name/display`
    )
  }

  register({userName, seedPhrase, email, password}) {
    return this._httpAgent.put(
      `${this._gatewayUrl}/${userName}`,
      JSON.stringify({seedPhrase, email, password}),
      {'Content-type': 'application/json'}
      // {credentials: 'omit'}
    )
  }

  getWalletAddress({userName}) {
    return this._httpAgent.get(
      `${this._gatewayUrl}/${userName}/ethereum`
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

  // createSolidIdentity({userName, seedPhrase}) {
  //   return this._httpAgent.post(
  //     `${this._gatewayUrl}/${userName}/solid/create-identity`,
  //     JSON.stringify({seedPhrase: seedPhrase}),
  //     {'Content-type': 'application/json'}
  //   )
  // }

  grantAccessToRequester(user, body) {
    return this._httpAgent.post(
      user + '/access/grant',
      JSON.stringify(body),
      {'Content-type': 'application/json'}
    )
  }

  getConnectedServicesOverview({userName}) {
    return this._httpAgent.get(
      `${this._gatewayUrl}/${userName}/access`
    )
  }

  revokeServiceAccess({userName, identity, pattern}) {
    const read = 'false'
    const write = 'false'
    return this._httpAgent.post(
      `${this._gatewayUrl}/${userName}/access/revoke`,
      JSON.stringify({identity, pattern, read, write}),
      {'Content-type': 'application/json'}
    )
  }

  verify({userName, seedPhrase, identity, attributeType,
     attributeId, attributeValue}) {
    let url = `${this._gatewayUrl}/${userName}/verify`
    let body = {
      seedPhrase,
      identity,
      attributeType,
      attributeId,
      attributeValue
    }
    return this._httpAgent.post(
      url, JSON.stringify(body),
      {'Content-type': 'application/json'}
    )
  }

  proxyGet(requestUrl) {
    // TODO put correct url
    return this._httpAgent.get(
      requestUrl
    )
  }

  storeAttribute({userName, attributeType, attributeId, attributeData}) {
    let url = `${this._gatewayUrl}/${userName}/identity/${attributeType}`
    if (attributeId) {
      url += `/${attributeId}`
    }

    let serialized
    if (_.isPlainObject(attributeData)) {
      serialized = new WalletCrypto().serializeData(attributeData)
    } else {
      serialized = JSON.stringify(attributeData)
    }
    return this._httpAgent.put(
      url,
      serialized,
      {'Content-type': 'application/json'}
    )
  }

  deleteAttribute({userName, attributeType, attributeId}) {
    let url = `${this._gatewayUrl}/${userName}/identity/${attributeType}`
    if (attributeId) {
      url += `/${attributeId}`
    }

    return this._httpAgent.delete(url)
  }

  async getOwnAttributes({userName, type, checkVerified}) {
    const multiple = typeof type !== 'string'
    const types = multiple ? type : [type]

    const allAttributes = await Promise.all(types.map(async type => {
      const typeAttributesIds = await this._httpAgent.get(
        `${this._gatewayUrl}/${userName}/identity/${type}`
      )
      const [typeAttributes, typeVerifications] = await Promise.all([
        Promise.all(typeAttributesIds.map(
          async id => {
            let attrValue = await this._httpAgent.get(
              `${this._gatewayUrl}/${userName}/identity/${type}/${id}`
            )
            if (_.isArray(attrValue)) {
              attrValue = _.fromPairs(attrValue)
            }
            return attrValue
          }
        )),
        Promise.all(typeAttributesIds.map(
          async id => {
            return await this._httpAgent.get(
              `${this._gatewayUrl}/${userName}` +
              `/identity/${type}/${id}/verifications`
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

  // getApiVersion() {
  //   return this._httpAgent.get(`${this._gatewayUrl}/system/info`)
  // }

  // createEthereumIdentity({userName, seedPhrase}) {
  //   return this._httpAgent.post(
  //     `${this._gatewayUrl}/${userName}/ethereum/create-identity`,
  //     JSON.stringify({seedPhrase: seedPhrase}),
  //     {'Content-type': 'application/json'}
  //   )
  // }

}
