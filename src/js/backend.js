import AccountsAgent from 'lib/agents/accounts'
import VerificationAgent from 'lib/agents/verification'
import WalletAgent from 'lib/agents/wallet'
import GatewayAgent from 'lib/agents/gateway'
import SolidAgent from 'lib/agents/solid-wallet'
import WebIDAgent from 'lib/agents/webid'

export default class Backend {
  get accounts() {
    return new AccountsAgent()
  }

  get solid() {
    return new SolidAgent()
  }

  get gateway() {
    return new GatewayAgent()
  }

  get wallet() {
    return new WalletAgent()
  }

  get webId() {
    return new WebIDAgent()
  }

  get verification() {
    return new VerificationAgent()
  }
}
