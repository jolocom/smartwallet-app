import Reflux from 'reflux'
import PrivacyActions from 'actions/privacy-settings'
import AclAgent from 'lib/agents/acl'

export default Reflux.createStore({
  listenables: PrivacyActions,
  init() {

  },

  getInitialState() {
  },

  fetchInitialData(user) {
    this.aclAgent = new AclAgent(user)
    this.aclAgent.fetchInfo().then(this.trigger({}))
  },

  allowRead(user) {
    this.aclAgent.allow(user, 'read')
    this.aclAgent.commitIndex()
      .then(this.aclAgent.commit())
      .then(this.trigger())
  }
})
