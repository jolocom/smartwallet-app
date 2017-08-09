import * as settings from 'settings'
import HTTPAgent from './http'

export default class VerificationAgent {
  constructor() {
    this.httpAgent = new HTTPAgent({proxy: false})
  }

  async startVerifyingEmail({wallet, email, id, pin}) {
    return await this._startVerifying({
      wallet, pin, dataType: 'email', data: email
    })
  }

  async startVerifyingPhone({wallet, phone, id, pin}) {
    return await this._startVerifying({
      wallet, pin, dataType: 'phone', data: phone
    })
  }

  async _startVerifying({wallet, data, id, dataType, pin}) {
    await this.httpAgent.post(
      settings.verificationProvider + `/${dataType}/start-verification`,
      {
        identity: wallet.identityURL,
        id,
        [dataType]: data
      }
    )
  }

  async verifyEmail({contractID, email, id, code}) {
    await this._verify({contractID, dataType: 'email', id, data: email, code})
  }

  async verifyPhone({contractID, phone, id, code}) {
    await this._verify({contractID, dataType: 'phone', id, data: phone, code})
  }

  async _verify({wallet, dataType, id, data, code}) {
    await this.httpAgent.post(
      settings.verificationProvider + `/${dataType}/verify`,
      {
        identity: wallet.identityURL,
        id,
        [dataType]: data,
        code
      }
    )
  }
}
