import HTTPAgent from './http'

export default class VerificationAgent {
  constructor() {
    this.request = new HTTPAgent()
  }

  async startVerifyingEmail({email}) {
    return await this._startVerifying(email)
  }

  async startVerifyingPhone(claim) {
    return await this._startVerifying(claim)
  }

  async _startVerifying(claim) {
    const endpoint = 'https://verification.jolocom.com/phone/start-verification'
    return await this.request.post(
      endpoint,
      {claim},
      {'Content-Type': 'application/json'}
    )
  }

  async verifyEmail({did, code}) {
    return await this._verify({
      did,
      attrType: 'email',
      code
    })
  }

  async verifyPhone({did, code}) {
    return await this._verify({
      did,
      attrType: 'phone',
      code
    })
  }

  async _verify({did, attrType, code}) {
    const url = `${VERIFICATION_PROV}/${attrType}/finish-verification`
    return await this.request.post(
      url,
      {identity: did, attrType, code},
      {'Content-Type': 'application/json'}
    )
  }
}
