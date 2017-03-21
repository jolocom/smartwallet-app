export default class WalletAgent {
  generateSeedPhrase() {
    return 'blabla blabla blabla blabla blabla blabla blabla blabla'
  }

  getSeedPhrase(email, password) {
    return 'blabla blabla blabla blabla blabla blabla blabla blabla'
  }

  registerWithSeedPhrase({userName, seedPhrase}) {

  }

  registerWithCredentials({userName, email, password}) {

  }

  loginWithSeedPhrase({userName, seedPhrase}) {

  }

  loginWithCredentials({userName, email, password}) {

  }
}

export class Wallet {
  constructor() {
    this.webID = 'https://demo.webid.jolocom.com/profile/card'
    this.lightWaller = 'something'
  }
}
