import Reflux from 'reflux'
import NodeActions from 'actions/node'
import solid from 'solid-client'

import GraphAgent from 'lib/agents/graph.js'

let {add, upload} = NodeActions

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

      // @TODO if node.file, upload file (solid supports form/multi-part)

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
  onUpload(origin, identity, node) {
    let uri = this._nodeContainerForIdentity(identity)
    solid.web.put(`${uri}${node.file.name}`, node.file, node.file.type).then(upload.completed)
  },
  onUploadCompleted(result) {
  },
  onRemove() {
    console.log('remove node')
  },
  _nodeContainerForIdentity(identity) {
    let identityRoot = identity.match(/^(.*)\/profile\/card#me$/)[1]
    let cont =  `${identityRoot}/little-sister/files/`
    return cont
  }
})
