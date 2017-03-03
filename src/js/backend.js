import AccountsAgent from 'lib/agents/accounts'
import WebIDAgent from 'lib/agents/webid'

export default class Backend {
  get accounts() {
    return new AccountsAgent()
  }

  get webId() {
    return new WebIDAgent()
  }
}
