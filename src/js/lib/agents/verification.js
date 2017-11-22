import * as request from 'superagent-es6-promise'

export default class VerificationAgent {
  constructor() {
    this.request = request
  }

  async startVerifyingEmail({wallet, email, id, pin}) {
    return await this._startVerifying({
      wallet, pin, dataType: 'email', id, data: email
    })
  }

  async startVerifyingPhone({wallet, phone, type, id, pin}) {
    return await this._startVerifying({
      wallet, pin, dataType: 'phone', id, data: `${type}.${phone}`
    })
  }

  async _startVerifying({wallet, data, id, dataType, pin}) {
    await Promise.all([
      this.request.post(wallet.identityURL + '/access/grant').send({
        identity: 'https://identity.jolocom.com/verification',
        pattern: `/identity/${dataType}/${id}`,
        read: true
      }).withCredentials(),
      this.request.post(wallet.identityURL + '/access/grant').send({
        identity: 'https://identity.jolocom.com/verification',
        pattern: `/identity/${dataType}/${id}/verifications`,
        read: true,
        write: true
      }).withCredentials()
    ])

    await this.request.post(
      `${VERIFICATION_PROV}/${dataType}/start-verification`
    ).send({
      identity: wallet.identityURL,
      id, [dataType]: data
    })
  }

  async verifyEmail({wallet, email, id, code}) {
    await this._verify({wallet, dataType: 'email', id, data: email, code})
  }

  async verifyPhone({wallet, type, phone, id, code}) {
    await this._verify({
      wallet, dataType: 'phone',
      id, data: `${type}.${phone}`, code
    })
  }

  async _verify({wallet, dataType, id, data, code}) {
    await this.request.post(
      `${VERIFICATION_PROV}/${dataType}/verify`
    ).send({
      identity: wallet.identityURL,
      id,
      [dataType]: data,
      code
    })
  }
}
