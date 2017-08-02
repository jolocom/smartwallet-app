import EventEmitter from 'events'

export default class AuthService extends EventEmitter {
  constructor(backend) {
    super()
    this.backend = backend
    this.currentUser = null
    this.on('changed', user => { this._storeWebId() })

    if (typeof localStorage !== 'undefined') {
      const savedSession = localStorage.getItem('jolocom.identity')
      if (savedSession) {
        this._setCurrentUser({
          wallet: new Wallet(JSON.parse(savedSession))
        })
      }
    }
  }

  async login({seedPhrase, pin}) {
    const res = await this.backend.login({seedPhrase, pin})
    const walletConfig = {
      [`seedPhrase.${pin}`]: seedPhrase,
      userName: res.userName
    }

    this._localStorage.setItem('jolocom.identity', walletConfig)
    this._setCurrentUser({
      wallet: new Wallet(walletConfig)
    })
  }

  register({userName, seedPhrase}) {
    return this.backend.register({userName, seedPhrase})
  }

  _setCurrentUser(user) {
    this.currentUser = user
    this.emit('changed', user)
  }
}

export class Wallet {
  constructor({gateway, userName, seedPhrase}) {
    this._gateway = gateway
    this.userName = userName
    this.seedPhrase = seedPhrase
  }
}
