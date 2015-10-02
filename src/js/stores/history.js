import Reflux from 'reflux'
import NodeActions from 'actions/node'

let HistoryStore = Reflux.createStore({
  listenables: NodeActions,
  init() {
    this.nodes = []
  },
  getInitialState() {
    return {
      nodes: []
    }
  }
})

export default HistoryStore
