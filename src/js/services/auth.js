import EventEmitter from 'events'

export default class AuthService extends EventEmitter {
  constructor(backend) {
    super()
    this.backend = backend
    this.currentUser = null
    this.currentUser = {
      wallet: new (require('../lib/agents/wallet').Wallet)()
    }
    this.on('changed', () => this._storeWebId())
    this._setCurrentUser(this.currentUser)
  }

  _storeWebId () {
    console.log('============= store \n \n ')
    localStorage.setItem('jolocom.webId', 'test')
  }

  _setCurrentUser(user) {
    this.currentUser = user
    console.log('======== set')
    this.emit('changed', this.currentUser)
  }

  async registerWithSeedPhrase({userName, seedPhrase}) {
    this._setCurrentUser({
      wallet: await this.backend.registerWithSeedPhrase({userName, seedPhrase})
    })
    return this.currentUser
  }

  async registerWithCredentials({userName, email, password}) {
    this._setCurrentUser({
      wallet: await this.backend.registerWithCredentials({
        userName, email, password
      })
    })
    return this.currentUser
  }

  async loginWithSeedPhrase({userName, seedPhrase}) {
    this._setCurrentUser({
      wallet: await this.backend.loginWithSeedPhrase({userName, seedPhrase})
    })
    return this.currentUser
  }

  async loginWithCredentials({userName, email, password}) {
    this._setCurrentUser({
      wallet: await this.backend.loginWithCredentials({
        userName, email, password
      })
    })
    return this.currentUser
  }
}
