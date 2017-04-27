export default class AuthService {
  constructor(backend) {
    this.backend = backend
    this.currentUser = null
    this.currentUser = {
      wallet: new (require('../lib/agents/wallet').Wallet)()
    }
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
