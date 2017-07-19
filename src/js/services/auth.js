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
          wallet: this.backend.loginFromSerialized(savedSession)
        }, {dontSaveSession: true})
      }
    }
  }

  _storeWebId() {
    localStorage.setItem('jolocom.webId', this.currentUser.wallet.webId)
  }

  _setCurrentUser(user, {dontSaveSession} = {}) {
    this.currentUser = user
    if (user && !dontSaveSession) {
      localStorage.setItem('jolocom.smartWallet', user.wallet.serialize())
    }
    this.emit('changed', user && user.wallet.webId || null)
  }

  async registerWithSeedPhrase({userName, seedPhrase, pin}) {
    this._setCurrentUser({
      wallet: await this.backend
      .registerWithSeedPhrase({userName, seedPhrase, pin})
    })
    return this.currentUser
  }

  async registerWithCredentials({userName, email, password, pin, seedPhrase}) {
    this._setCurrentUser({
      wallet: await this.backend.registerWithCredentials({
        userName, email, password, pin, seedPhrase
      })
    })
    return this.currentUser
  }

  async loginWithSeedPhrase({seedPhrase, pin}) {
    this._setCurrentUser({
      wallet: await this.backend
        .loginWithSeedPhrase({seedPhrase, pin})
    })
    return this.currentUser
  }

  async loginWithCredentials({email, password, pin}) {
    this._setCurrentUser({
      wallet: await this.backend.loginWithCredentials({
        email, password, pin
      })
    })
    return this.currentUser
  }
}
