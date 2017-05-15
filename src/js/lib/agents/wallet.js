import * as settings from 'settings'
import {WalletManager} from 'smartwallet-contracts'
import VerificationAgent from './verification'
// import SolidAgent from './solid-wallet'

export default class WalletAgent {
  constructor() {
    this._manager = new WalletManager(settings.blockchain)
  }

  generateSeedPhrase(entropy) {
    let seed = this._manager.generateSeedPhrase(entropy)
    // only for testing testSeed has some ether on ropsten testnet
    let testSeed = 'mandate print cereal style toilet hole' +
      ' cave mom heavy fork network indoor'
    seed = testSeed
    return seed
  }
  getSeedPhrase(email, password) {
    return 'blabla blabla blabla blabla blabla blabla blabla blabla'
  }

  registerWithSeedPhrase({userName, seedPhrase, pin}) {
    return this._manager.registerWithSeedPhrase({
      userName, seedPhrase, pin
    })
  }

  registerWithCredentials({userName, email, password}) {
    return this._manager.registerWithCredentials({userName, email, password})
  }

  loginWithSeedPhrase({userName, seedPhrase}) {
    return this._manager.loginWithSeedPhrase({userName, seedPhrase})
  }

  loginWithCredentials({userName, email, password}) {
    return this._manager.loginWithCredentials({userName, email, password})
  }

  expertLogin({passphrase, pin}) {
    return new Promise((resolve, reject) => {
      setTimeout(
        () => {
          resolve(new Wallet())
        },
        2000
      )
    })
  }

  getAccountInformation() {
    return new Promise((resolve, reject) => {
      setTimeout(
        () => {
          let information = {
            emails: [
              {address: 'address1@example.com', verified: true},
              {address: 'address2@example.com', verified: false}
            ],

            telNums: [
              {num: '+4917912345678', type: 'work', verified: true},
              {num: '+4917923456789', type: 'personal', verified: false}
            ]
          }
          resolve(information)
        },
        2000
      )
    })
  }

  deleteEmail(email) {
    return new Promise((resolve, reject) => {
      setTimeout(
        () => {
          resolve()
        },
        2000
      )
    })
  }

  updateEmail(email) {
    return new Promise((resolve, reject) => {
      setTimeout(
        () => {
          resolve()
        },
        2000
      )
    })
  }

  setEmail(email) {
    return new Promise((resolve, reject) => {
      setTimeout(
        () => {
          resolve()
        },
        2000
      )
    })
  }
}

export class Wallet {
  constructor() {
    this.webId = localStorage.getItem('jolocom.webId')
    this.lightWallet = 'something'
    this._verification = new VerificationAgent()
    // this.solid = new SolidAgent()
  }

  getUserInformation({email}) {
    const identity = {
      webId: 'https://recordeddemo.webid.jolocom.de/profile/card#me',
      username: {
        value: 'AnnikaHamman',
        verified: ''
      },
      contact: {
        phone: [
          {
            number: '+49 176 12345678',
            type: 'mobile',
            verified: true
          }
        ],
        email: [
          {
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
          }
        ]
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
      setTimeout(
        () => {
          resolve(identity)
          /* reject() */
        },
        2000
      )
    })
  }

  getAccountInformation() {
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        const information = {
          emails: [
            {value: 'address1@example.com', verified: false},
            {value: 'address2@example.com', verified: false}
          ],
          phoneNumbers: [
            {value: '+491000222678', type: 'work', verified: true},
            {value: '+4917923456789', type: 'personal', verified: false}
          ]
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

  deletePhone(phone) {
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        resolve()
      }, 2000)
    })
  }

  updatePhone(phone) {
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        resolve()
      }, 2000)
    })
  }

  setPhone(phone) {
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        resolve()
      }, 2000)
    })
  }

  startConfirmEmail({email}) {
    return this._verification.startVerifyingEmail({webID: this.webID, email})
  }

  finishConfirmEmail({email, code}) {
    return this._verification.verifyEmail({webID: this.webID, email, code})
  }
}
