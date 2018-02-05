import JolocomLib from 'jolocom-lib'
import VerificationAgent from 'lib/agents/verification'
import EncryptionAgent from 'lib/agents/encryption'

export default class Backend {
  constructor(config) {
    this.config = config
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
}
