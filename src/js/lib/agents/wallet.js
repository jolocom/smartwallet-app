import SolidWalletAgent from 'lib/agents/solid-wallet'
import WebIDAgent from 'lib/agents/webid'

export default class WalletAgent {
  constructor() {
    this.webid = new WebIDAgent()
    this.solid = new SolidWalletAgent(this.webid.getWebId())
  }

  generateSeedPhrase(randomString) {
    return 'blabla blabla blabla blabla blabla blabla blabla blabla'
  }

  getSeedPhrase(email, password) {
    return 'blabla blabla blabla blabla blabla blabla blabla blabla'
  }

  registerWithSeedPhrase({userName, seedPhrase}) {
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        resolve(new Wallet())
      }, 2000)
    })
  }

  registerWithCredentials({userName, email, password}) {
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        resolve(new Wallet())
      }, 2000)
    })
  }

  checkPassphrase({passphrase}) {
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        resolve(new Wallet())
      }, 2000)
    })
  }

  loginWithSeedPhrase({userName, seedPhrase}) {
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        resolve(new Wallet())
      }, 2000)
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

  deleteEntry(type, email) {
    return this.solid.deleteEntry(type, email)
  }
  updateEntry(type, email) {
    return this.solid.updateEntry(type, email)
  }
  setEntry(type, email) {
    return this.solid.setEntry(type, email)
  }

}

export class Wallet {
  constructor() {
    this.webID = 'https://live.webid.jolocom.de/profile/card'
    this.lightWaller = 'something'
  }

  getUserInformation({email}) {
    const identity = {
      webId: 'https://live.webid.jolocom.de/profile/card',
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
