import * as request from 'superagent-es6-promise'

export default class VerificationAgent {
  constructor() {
    this.request = request
  }

  async startVerifyingEmail({did, email, id, pin}) {
    return await this._startVerifying({
      did, pin, dataType: 'email', id, data: email
    })
  }

  async startVerifyingPhone(claim) {
    return await this._startVerifying(
      claim
    )
  }

  async _startVerifying(claim) {
    const endpoint = 'https://verification.jolocom.com/phone/start-verification'
    return await this.request.post(endpoint)
      .set('Content-Type', 'application/json')
      .send({ claim: claim })
  }

  async verifyEmail({did, email, id, code}) {
    await this._verify({did, dataType: 'email', id, data: email, code})
  }

  async verifyPhone({did, type, phone, id, code}) {
    await this._verify({
      did, dataType: 'phone',
      id, data: `${type}.${phone}`, code
    })
  }

  async _verify({did, dataType, id, data, code}) {
    await this.request.post(
      `${VERIFICATION_PROV}/${dataType}/verify`
    ).send({
      identity: did.identityURL,
      id,
      [dataType]: data,
      code
    })
  }
}
