import * as settings from 'settings'
import {WalletManager} from 'smartwallet-contracts'
import HTTPAgent from 'lib/agents/http'

// only for testing testSeed has some ether on ropsten testnet
export const TEST_SEED = 'mandate print cereal style toilet hole' +
  ' cave mom heavy fork network indoor'

export default class WalletAgent {
  constructor() {
    this._manager = new WalletManager(settings.blockchain)
    this._httpAgent = new HTTPAgent({proxy: false})
  }

  generateSeedPhrase(entropy) {
    let seed = this._manager.generateSeedPhrase(entropy)
    // @TODO remove this
    // seed = TEST_SEED

    return seed
  }

  getRequesterIdentity(identity) {
    console.log('getRequesterIdentity: ', identity)
    return new Promise((resolve, reject) => {
      setTimeout(() => resolve('foo'), 2000)
    }) // just for testing

    // return this._httpAgent.get(
    //   'https://' + identity + '/identity/name/display'
    // )
  }

  grantAccessToRequester(user, body) {
    // console.log('HTTPAgent user & body', user, body)
    return new Promise((resolve, reject) => {
      setTimeout(() => resolve('put action OK'), 2000)
    }) // just for testing

    // return this._httpAgent.put(
    //   'https://identity.' + user + '.com/access/grant',
    //   body
    // )
  }

  retrieveEtherPrice() { // returns {ethForEur: <number>}
    return this._httpAgent.get(
      settings.blockchain.jolocomEtherAddress +
      '/exchange-rate/ether'
    )
  }

  buyEther({stripeToken, walletAddress}) {
    return this._httpAgent.post(
      'https://verification.jolocom.com/ether/buy/ether',
      JSON.stringify({stripeToken: JSON.stringify(stripeToken), walletAddress}),
      {
        'Content-type': 'application/json'
      },
      {credentials: 'omit'}
    )
  }

  retrieveSeedPhrase({email, password}) {
    return this._manager._seedStorage.getSeed({email, password})
  }

  registerWithSeedPhrase({userName, seedPhrase, pin}) {
    return this._manager.registerWithSeedPhrase({
      userName, seedPhrase, pin
    })
  }

  registerWithCredentials({userName, email, password, pin, seedPhrase}) {
    return this._manager.registerWithCredentials({
      userName, email, password, pin, seedPhrase
    })
  }

  loginWithSeedPhrase({seedPhrase, pin}) {
    return this._manager.loginWithSeedPhrase({seedPhrase, pin})
  }

  loginWithCredentials({email, password, pin}) {
    return this._manager.loginWithCredentials({email, password, pin})
  }

  loginFromSerialized(serialized) {
    return this._manager.loginFromSerialized(serialized)
  }
}
