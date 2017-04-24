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
    console.log(
      'WalletAgent: See Transactions and Smartcontracts on: https://ropsten.etherscan.io/'
    )
    let password = '1234'
    let wallet = new SmartWallet()
    wallet
      .init(seedPhrase, password)
      .then(result => {
        return wallet.createDigitalIdentity(userName, password)
        console.log('wallet created')
        console.log(result)
      })
      .then(identityAddress => {
        wallet.setIdentityAddress(identityAddress)
        return wallet.addIdentityAddressToLookupContract(identityAddress)
      })
      .then(result => {
        console.log(
          'WalletAgent: identityAddress addedtoLookupContract Transaction waiting to be mined txhash -> ' +
            result.txhash
        )

        return wallet.waitingForTransactionToBeMined(
          result.lookupContractAddress,
          result.txhash
        )
      })
      .then(transactionMined => {
        console.log(
          'WalletAgent: Transaction add address to lookup contracted got mined -> ' +
            transactionMined
        )
        return wallet.addProperty('webid', 'fakewebid_', password)
      })
      .then(txhash => {
        console.log(
          'WalletAgent: addPropertyTransaction waiting to be mined txhash: ' +
            txhash
        )
        let identityAddress = wallet.getIdentityAddress()
        return wallet.waitingForTransactionToBeMined(identityAddress, txhash)
      })
      .then(txhash => {
        console.log(
          'WalletAgent: addPropertyTransaction got minded txhash: ' + txhash
        )
        wallet.getProperty('webid').then(webid => {
          console.log(webid)
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
    let password = '1234'

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
