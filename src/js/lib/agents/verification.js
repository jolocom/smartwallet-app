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

  async verifyEmail({email, code}) {
    await this._verify({
      did,
      value: email,
      attrType: 'email',
      code
    })
  }

  async verifyPhone({did, phone, code}) {
    await this._verify({
      did,
      value: phone,
      attrType: 'phone',
      code
    })
  }

  async _verify({did, attrType, value, code}) {
    console.log('VERIFY====')
    await this.request.post(
      `${VERIFICATION_PROV}/${dataType}/finish-verification`,
      {did, value, attrType, code},
      {'Content-Type': 'application/json'}
    )
  }
}
