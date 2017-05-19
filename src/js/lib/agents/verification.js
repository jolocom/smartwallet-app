import * as settings from 'settings'
import HTTPAgent from './http'

export default class VerificationAgent {
  constructor() {
    this.httpAgent = new HTTPAgent({proxy: false})
  }

  startVerifyingEmail({contractID, email}) {
    return this.httpAgent.post(
      settings.verificationProvider + '/email/start-verification',
      {contractID, email}
    )
  }

  startVerifyingPhone({contractID, phone}) {
    return this.httpAgent.post(
      settings.verificationProvider + '/phone/start-verification',
      {contractID, phone}
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
