import Reflux from 'reflux'
import NodeActions from 'actions/node'

let NodeStore = Reflux.createStore({
  listenables: NodeActions,
  init() {
    this.nodes = []
  },
  getInitialState() {
    return {
      nodes: []
    }
  },
  onAdd() {
    console.log('add node')
  },
  onRemove() {
    console.log('remove node')
  }
})

export default NodeStore
