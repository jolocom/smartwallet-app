import Reflux from 'reflux'
import NodeActions from 'actions/node'

import GraphAgent from 'lib/agents/graph.js'

let graphAgent = new GraphAgent()

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
  onAdd(origin, identity, node) {
    let p
    if (!node.uri) {
      console.log('creating a new one')
      p = graphAgent.createAndConnectNode(node.title, node.description, origin, identity)
    } else {
      console.log('connecting existing node')
      p = graphAgent.connectNode(origin, node.uri)
    }

    return p
  },
  onRemove() {
    console.log('remove node')
  }
})
