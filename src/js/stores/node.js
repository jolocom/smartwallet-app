import Reflux from 'reflux'
import NodeActions from 'actions/node'

export default Reflux.createStore({
  listenables: NodeActions,
  getInitialState() {
    return {
      node: []
    }
  },
  onLoad(uri) {
    console.log(uri)
  },
  onRemove() {
    console.log('remove node')
  }
})
