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
    console.log(seedPhrase)
    let password = '1234'
    let wallet = new SmartWallet()
    return new Promise((resolve, reject) => {
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

          return wallet.waitingToBeMinedaAddToLookup(
            result.lookupContractAddress,
            result.txhash
          )
        })
        .then(transaction => {
          console.log(
            'WalletAgent: Transaction add address to lookup contracted got mined -> ' +
              transaction.transactionHash
          )
          let privateKeyWebID = wallet.generatePrivateKeyForWebID()
          wallet.setWebIDPrivateKey(privateKeyWebID)
          console.log('WalletAgent: privatekey WebID')
          console.log(privateKeyWebID)
          let encryptedWebID = wallet.encryptPrivateKeyForWebID(
            privateKeyWebID
          )
          console.log('WalletAgent: privatekey WebID encrypted')
          console.log(encryptedWebID)
          return wallet.addProperty('webidkey', encryptedWebID, password)
        })
        .then(txhash => {
          console.log(
            'WalletAgent: addPropertyTransaction waiting to be mined txhash: ' +
              txhash
          )
          let identityAddress = wallet.getIdentityAddress()
          return wallet.waitingToBeMinedaAddProperty(identityAddress, txhash)
        })
        .then(transaction => {
          console.log(
            'WalletAgent: addPropertyTransaction got minded txhash: ' +
              transaction.transactionHash
          )
        })
      resolve(wallet)
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
          resolve(new SmartWallet())
        },
        2000
      )
    })
  }

  loginWithSeedPhrase(userName, seedPhrase) {
    let password = '1234'
    console.log('WalletAgent: Login with Seedphrase')
    console.log(userName)
    console.log(seedPhrase)
    let wallet = new SmartWallet()
    return new Promise((resolve, reject) => {
      wallet
        .init(seedPhrase, password)
        .then(result => {
          return wallet.getIdentityAddressFromLookupContract(
            userName,
            password
          )
          console.log('wallet created')
          console.log(result)
        })
        .then(identityAddress => {
          console.log('WalletAgent: got identity Address from Lookup Table')
          console.log(identityAddress)
          wallet.setIdentityAddress(identityAddress)
          return wallet.getProperty('webidkey')
        })
        .then(webIdEncrypted => {
          console.log('WalletAgent: private key of the webId')
          wallet.setWebIDPrivateKey(
            wallet.decryptPrivateKeyForWebID(webIdEncrypted)
          )
          console.log(wallet.getWebIDPrivateKey())
          resolve(wallet)
        })
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
          resolve(new SmartWallet())
        },
        2000
      )
    })
  }
}
