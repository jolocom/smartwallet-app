import VerificationAgent from 'lib/agents/verification'
import GatewayAgent from 'lib/agents/gateway'
import EncryptionAgent from 'lib/agents/encryption'

export default class Backend {
  constructor(gatewayUrl) {
    if (gatewayUrl === undefined) {
      this._gatewayUrl = IDENTITY_GATEWAY_URL
    } else {
      this._gatewayUrl = gatewayUrl
    }
  }

  set gateway(gatewayUrl) {
    this._gatewayUrl = gatewayUrl
  }

  get gateway() {
    return new GatewayAgent(this._gatewayUrl)
  }

  get verification() {
    return new VerificationAgent()
  }

  get encryption() {
    return new EncryptionAgent()
  }
}
