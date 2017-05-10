import EventEmitter from 'event-emitter'

export default class AuthService extends EventEmitter {
  constructor(backend) {
    this.backend = backend
    this._currentUser = null
    this._currentUser = {
      wallet: new (require('../lib/agents/wallet').Wallet)()
    }
    this.on('changed', (user) => this.storeWebId())
  }

  set currentUser(user) {
    this._currentUser = user
    this.emit('changed', this.currentUser)
  }

  get currentUser() {
    return this._currentUser
  }

  async registerWithSeedPhrase({userName, seedPhrase}) {
    this.currentUser = {
      wallet: await this.backend.registerWithSeedPhrase({userName, seedPhrase})
    }
    return this.currentUser
  }

  async registerWithCredentials({userName, email, password}) {
    this.currentUser = {
      wallet: await this.backend.registerWithCredentials({
        userName, email, password
      })
    }
    return this.currentUser
  }

  storeWebId () {
    localStorage.setItem('jolocom.webId', this.currentUser.wallet.webId || '')
  }

  async loginWithSeedPhrase({userName, seedPhrase}) {
    this.currentUser = {
      wallet: await this.backend.loginWithSeedPhrase({userName, seedPhrase})
    }
    return this.currentUser
  }

  async loginWithCredentials({userName, email, password}) {
    this.currentUser = {
      wallet: await this.backend.loginWithCredentials({
        userName, email, password
      })
    }
    return this.currentUser
  }
}
