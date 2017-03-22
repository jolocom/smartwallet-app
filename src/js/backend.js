import AccountsAgent from 'lib/agents/accounts'
import WalletAgent from 'lib/agents/wallet'
import WebIDAgent from 'lib/agents/webid'

export default class Backend {
  get accounts() {
    return new AccountsAgent()
  }

  get wallet() {
    return new WalletAgent()
  }

  get webId() {
    return new WebIDAgent()
  }
}
