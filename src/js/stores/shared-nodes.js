import Reflux from 'reflux'
import ViewShared from 'actions/shared-nodes.js'

export default Reflux.createStore({
  listenables: ViewShared,

  onGetOverview() {
  }
})
