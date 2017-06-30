import * as settings from 'settings'
import {WalletManager} from 'smartwallet-contracts'

// only for testing testSeed has some ether on ropsten testnet
const TEST_SEED = 'mandate print cereal style toilet hole' +
  ' cave mom heavy fork network indoor'

export default class WalletAgent {
  constructor() {
    this._manager = new WalletManager(settings.blockchain)
  }

  generateSeedPhrase(entropy) {
    let seed = this._manager.generateSeedPhrase(entropy)
    // @TODO remove this
    seed = TEST_SEED
    return seed
  }

  retrieveSeedPhrase({email, password}) {
    return this._manager.retrieveSeedPhrase({email, password})
  }

  registerWithSeedPhrase({userName, seedPhrase, pin}) {
    return this._manager.registerWithSeedPhrase({
      userName, seedPhrase, pin
    })
  }

  registerWithCredentials({userName, email, password, pin}) {
    return this._manager.registerWithCredentials({
      userName, email, password, pin
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
