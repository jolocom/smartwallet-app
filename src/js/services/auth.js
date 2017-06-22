import EventEmitter from 'events'

export default class AuthService extends EventEmitter {
  constructor(backend) {
    super()
    this.backend = backend
    this.currentUser = null
    this.on('changed', user => { this._storeWebId() })
    this._setCurrentUser({
      wallet: new (require('../lib/agents/wallet').Wallet)()
    })
  }

  _storeWebId() {
    localStorage.setItem('jolocom.webId', this.currentUser.wallet.webId)
  }

  _setCurrentUser(user) {
    this.currentUser = user
    this.emit('changed', this.currentUser.wallet.webId || null)
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

  async loginWithSeedPhrase({userName, seedPhrase, pin}) {
    this._setCurrentUser({
      wallet: await this.backend.loginWithSeedPhrase({userName, seedPhrase, pin})
    })
    return this.currentUser
  }

  async loginWithCredentials({userName, email, password, pin}) {
    this._setCurrentUser({
      wallet: await this.backend.loginWithCredentials({
        userName, email, password, pin
      })
    })
    return this.currentUser
  }
}
