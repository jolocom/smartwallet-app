import * as settings from 'settings'
import {WalletManager, Wallet} from 'smartwallet-contracts'
import HTTPAgent from 'lib/agents/http'

// only for testing testSeed has some ether on ropsten testnet
export const TEST_SEED = 'mandate print cereal style toilet hole' +
  ' cave mom heavy fork network indoor'

export default class WalletAgent {
  constructor() {
    this._manager = new WalletManager(settings.blockchain);
    this._wallet = new Wallet(settings.blockchain);
    this._httpAgent = new HTTPAgent({proxy: false})
  }

  generateSeedPhrase(entropy) {
    let seed = this._manager.generateSeedPhrase(entropy)
    return seed
  }

  // retrieveSeedPhrase({email, password}) {
  //   return this._manager._seedStorage.getSeed({email, password})
  // }

  // registerWithSeedPhrase({userName, seedPhrase, pin}) {
  //   return this._manager.registerWithSeedPhrase({
  //     userName, seedPhrase, pin
  //   })
  // }
  //
  // registerWithCredentials({userName, email, password, pin, seedPhrase}) {
  //   return this._manager.registerWithCredentials({
  //     userName, email, password, pin, seedPhrase
  //   })
  // }
  //
  // loginWithCredentials({email, password, pin}) {
  //   return this._manager.loginWithCredentials({email, password, pin})
  // }
  //
  // loginFromSerialized(serialized) {
  //   return this._manager.loginFromSerialized(serialized)
  // }
}
