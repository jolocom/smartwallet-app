import Reflux from 'reflux'
import ViewShared from 'actions/shared-nodes.js'
import PermissionAgent from 'lib/agents/permissions.js'

export default Reflux.createStore({
  listenables: ViewShared,

  init() {
    this.state = {}
  },

  getInitialState() {
    return this.state
  },

  onGetOverview(uri) {
    this.pAgent = new PermissionAgent(uri)
    this.pAgent.getSharedNodes(uri).then(res => {
      this.trigger({shared: res})
    })
  }
})
