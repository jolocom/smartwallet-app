import EventEmitter from 'events'

export default class AuthService extends EventEmitter {
  constructor(backend) {
    super()
    this.backend = backend
    this.currentUser = null
    this.on('changed', user => { this._storeWebId() })

    if (typeof localStorage !== 'undefined') {
      const savedSession = localStorage.getItem('jolocom.smartWallet')
      if (savedSession) {
        this._setCurrentUser({
          wallet: this.backend.wallet.loginFromSerialized(savedSession)
        }, {dontSaveSession: true})
      }
    }
  }

  _storeWebId() {
    localStorage.setItem('jolocom.webId', this.currentUser.wallet.webId)
  }

  _setCurrentUser(user, {dontSaveSession} = {}) {
    this.currentUser = user
    if (!dontSaveSession) {
      localStorage.setItem('jolocom.smartWallet', user.wallet.serialize())
    }
    this.emit('changed', this.currentUser.wallet.webId || null)
  }

  async registerWithSeedPhrase({userName, seedPhrase, pin}) {
    this._setCurrentUser({
      wallet: await this.backend.wallet
      .registerWithSeedPhrase({userName, seedPhrase, pin})
    })
    return this.currentUser
  }

  async registerWithCredentials({userName, email, password, pin}) {
    this._setCurrentUser({
      wallet: await this.backend.wallet.registerWithCredentials({
        userName, email, password, pin
      })
    })
    return this.currentUser
  }

  async loginWithSeedPhrase({userName, seedPhrase, pin}) {
    this._setCurrentUser({
      wallet: await this.backend.loginWithSeedPhrase({
        userName, seedPhrase, pin
      })
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
