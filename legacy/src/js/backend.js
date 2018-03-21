import JolocomLib from 'jolocom-lib'
import VerificationAgent from 'lib/agents/verification'
import EthereumAgent from 'lib/agents/ethereum'
import EncryptionAgent from 'lib/agents/encryption'
import HttpAgent from 'lib/agents/http'

export default class Backend {
  constructor(config) {
    this.config = config
  }

  get ethereum() {
    return new EthereumAgent(this.config)
  }

  get jolocomLib() {
    return new JolocomLib(this.config)
  }

  get verification() {
    return new VerificationAgent()
  }

  get encryption() {
    return new EncryptionAgent()
  }

  get httpAgent() {
    return new HttpAgent()
  }
}
