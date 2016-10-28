import Reflux from 'reflux'
import ViewShared from 'actions/shared-nodes.js'
import PermissionAgent from 'lib/agents/permissions.js'

export default Reflux.createStore({
  listenables: ViewShared,

  init() {
    this.pAgent = new PermissionAgent()
    this.state = {
      shared: {}
    }
  },

  getInitialState() {
    return this.state
  },

  onGetOverview(uri) {
    this.pAgent.getSharedNodes(uri).then(res => {
      console.log(res)
      this.trigger({shared: res})
    })
  }
})
