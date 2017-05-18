import * as settings from 'settings'
import HTTPAgent from './http'

export default class VerificationAgent {
  constructor() {
    this.httpAgent = new HTTPAgent({proxy: false})
  }

  startVerifyingEmail({webID, email}) {
    return this.httpAgent.post(
      settings.verificationProvider + '/email/start-verification',
      {webID, email}
    )
  }

  startVerifyingPhone({webID, phone}) {
    return this.httpAgent.post(
      settings.verificationProvider + '/phone/start-verification',
      {webID, phone}
    )
  }

  verifyEmail({webID, email, code}) {
    return this.httpAgent.post(
      settings.verificationProvider + '/email/verify',
      {webID, email, code}
    )
  }

  verifyPhone({webID, phone, code}) {
    return this.httpAgent.post(
      settings.verificationProvider + '/phone/verify',
      {webID, phone, code}
    )
  }
}
