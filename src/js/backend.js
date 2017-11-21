import AccountsAgent from 'lib/agents/accounts'
import VerificationAgent from 'lib/agents/verification'
import GatewayAgent from 'lib/agents/gateway'
import WebIDAgent from 'lib/agents/webid'
import * as settings from 'settings'

export default class Backend {
  constructor(gatewayUrl) {
    if (gatewayUrl === undefined) {
      this._gatewayUrl = settings.gateway
    } else {
      this._gatewayUrl = gatewayUrl
    }
  }

  get accounts() {
    return new AccountsAgent()
  }

  set gateway(gatewayUrl) {
    this._gatewayUrl = gatewayUrl
  }

  get gateway() {
    return new GatewayAgent(this._gatewayUrl)
  }

  get webId() {
    return new WebIDAgent()
  }

  get verification() {
    return new VerificationAgent()
  }
}
