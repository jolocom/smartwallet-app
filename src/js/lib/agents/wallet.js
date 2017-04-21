import {keystore} from 'eth-lightwallet'
import SmartWallet from 'lib/blockchain/smartwallet'

export default class WalletAgent {
  constructor() {}

  generateSeedPhrase(entropy) {
    let seed = keystore.generateRandomSeed(entropy)
    // only for testing testSeed has some ether on ropsten testnet
    let testSeed = 'mandate print cereal style toilet hole cave mom heavy fork network indoor'
    seed = testSeed
    return seed
  }

  getSeedPhrase(email, password) {
    return 'blabla blabla blabla blabla blabla blabla blabla blabla'
  }

  registerWithSeedPhrase(
    {
      userName,
      seedPhrase
    }
  ) {
    let password = '1234'
    let wallet = new SmartWallet()
    wallet
      .createDigitalIdentity(userName, seedPhrase, password)
      .then(identityAddress => {
        console.log(
          'WalletAgent: Identity Contract created successfull => ' +
            identityAddress
        )
        wallet.setIdentityAddress(identityAddress)
        return identityAddress
      })
      .then(identityAddress => {
        wallet
          .addIdentityAddressToLookupContract(identityAddress)
          .then(txhash => {
            console.log(
              'WalletAgent: identityAddress added to Lookup Contract successfull txhash -> ' +
                txhash
            )
            return wallet.addProperty('webid', 'fakewebid', password)
            // wallet.addProperty('username', userName, password)
          })
          .then(txhash => {
            console.log(
              'WalletAgent: property added to identity contract. waiting to be mined -> ' +
                txhash
            )
          })
      })

    return new Promise((resolve, reject) => {
      setTimeout(
        () => {
          resolve(new Wallet())
        },
        2000
      )
    })
  }

  registerWithCredentials(
    {
      userName,
      email,
      password
    }
  ) {
    return new Promise((resolve, reject) => {
      setTimeout(
        () => {
          resolve(new Wallet())
        },
        2000
      )
    })
  }

  loginWithSeedPhrase(
    {
      userName,
      seedPhrase
    }
  ) {
    return new Promise((resolve, reject) => {
      setTimeout(
        () => {
          resolve(new Wallet())
        },
        2000
      )
    })
  }

  loginWithCredentials(
    {
      userName,
      email,
      password
    }
  ) {
    return new Promise((resolve, reject) => {
      setTimeout(
        () => {
          resolve(new Wallet())
        },
        2000
      )
    })
  }
}

export class Wallet {
  constructor() {}
}
