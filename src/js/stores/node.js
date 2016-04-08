import Reflux from 'reflux'
import NodeActions from 'actions/node'

import GraphAgent from 'lib/agents/graph.js'

let {add} = NodeActions

let graphAgent = new GraphAgent()

export default Reflux.createStore({
  listenables: NodeActions,
  getInitialState() {
    return {
      node: null
    }
  },
  onLoad(uri) {
    console.log(uri)
  },
  onAdd(origin, identity, node) {
    console.log('onAdd', arguments)
    let p
    if (!node.uri) {
      console.log('creating a new one')
      p = graphAgent.createAndConnectNode(node.title, node.description, origin, identity)
    } else {
      console.log('connecting existing node')
      p = graphAgent.connectNode(origin, node.uri)
    }

    return p.then(add.completed)
  },
  onAddCompleted() {
    this.trigger({
      completed: true
    })
  },
  onRemove() {
    console.log('remove node')
  }
})
