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

  loginWithCredentials({userName, email, password}) {
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        resolve(new Wallet())
      }, 2000)
    })
  }

  expertLogin({passphrase, pin}) {
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        resolve(new Wallet())
      }, 2000)
    })
  }

  getAccountInformation() {
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        let information = {
          emails: [{address: 'address1@example.com', verified: true},
            {address: 'address2@example.com', verified: false}],

          telNums: [{num: '+4917912345678', type: 'work', verified: true},
            {num: '+4917923456789', type: 'personal', verified: false}]
        }
        resolve(information)
      }, 2000)
    })
  }

  deleteEmail(email) {
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        resolve()
      }, 2000)
    })
  }

  updateEmail(email) {
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        resolve()
      }, 2000)
    })
  }

  setEmail(email) {
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        resolve()
      }, 2000)
    })
  }
}

export class Wallet {
  constructor() {
    this.webID = 'https://demo.webid.jolocom.com/profile/card'
    this.lightWaller = 'something'
  }

  getUserInformation({email}) {
    const identity = {
      webId: 'https://demo.webid.jolocom.com/profile/card',
      username: {
        value: 'AnnikaHamman',
        verified: ''
      },
      contact: {
        phone: [{
          number: '+49 176 12345678',
          type: 'mobile',
          verified: true
        }],
        email: [{
          address: 'info@jolocom.com',
          type: 'mobile',
          verified: true
        },
        {
          address: 'info@jolocom.com',
          type: 'mobile',
          verified: false
        },
        {
          address: 'info@jolocom.com',
          type: 'mobile',
          verified: true
        }]
      },
      Repuation: 0,
      passport: {
        number: null,
        givenName: null,
        familyName: null,
        birthDate: null,
        gender: null,
        street: null,
        streetAndNumber: null,
        city: null,
        zip: null,
        state: null,
        country: null
      }
    }
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        resolve(identity)
        /* reject() */
      }, 2000)
    })
  }
}
