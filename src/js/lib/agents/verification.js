import * as settings from 'settings'
import HTTPAgent from './http'

export default class VerificationAgent {
  constructor() {
    this.httpAgent = new HTTPAgent({proxy: false})
  }

  async startVerifyingEmail({wallet, email}) {
    return await this.httpAgent.post(
      settings.verificationProvider + '/email/start-verification',
      {contractID: wallet.getIdentityAddress(), email}
    )
  }

  async startVerifyingPhone({wallet, phone}) {
    return await this.httpAgent.post(
      settings.verificationProvider + '/phone/start-verification',
      {contractID: wallet.getIdentityAddress(), phone}
    )
  }

  verifyEmail({contractID, email, code}) {
    return this.httpAgent.post(
      settings.verificationProvider + '/email/verify',
      {contractID, email, code}
    )
  }

  verifyPhone({contractID, phone, code}) {
    return this.httpAgent.post(
      settings.verificationProvider + '/phone/verify',
      {contractID, phone, code}
    )
  }
}
