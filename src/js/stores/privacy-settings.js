import Reflux from 'reflux'
import PrivacyActions from 'actions/privacy-settings'
import AclAgent from 'lib/agents/acl'

export default Reflux.createStore({
  listenables: PrivacyActions,
  init() {
    this.state = {
      viewAllowList: []
    }
  },

  getInitialState() {
    return this.state
  },

  fetchInitialData(user) {
    this.aclAgent = new AclAgent(user)
    this.aclAgent.fetchInfo().then(this.trigger({}))
  },

  allowRead(user) {
    this.aclAgent.allow(user, 'read')
    this.state.viewAllowList.push({
      label: user,
      key: this.state.viewAllowList.length,
      canEdit: false,
      list: 'viewAllow'
    })
    this.trigger(this.state)
  },

  allowWrite(user) {
    this.aclAgent.removeAllow(user, 'read')
    this.state.editAllowList.push({
      label: user,
      key: this.state.editAllowList.length,
      canEdit: false,
      list: 'editAllow'
    })
    this.trigger(this.state)
  }
})
