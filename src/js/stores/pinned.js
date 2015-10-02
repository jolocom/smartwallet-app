import Reflux from 'reflux'
import NodeActions from 'actions/node'

let PinnedStore = Reflux.createStore({
  listenables: NodeActions,
  init() {
    this.nodes = this.getStoredNodes()
  },
  getInitialState() {
    return {
      nodes: this.nodes
    }
  },
  storeNodes() {
    try {
      localStorage.setItem('jlc.pinned', JSON.stringify(this.nodes))
    } catch(e) {console.error(e)}
  },
  getStoredNodes() {
    try {
      return JSON.decode(localStorage.getItem('jlc.pinned'))
    } catch(e) {
      console.error(e)
      return []
    }
  },
  onPin(node) {
    // FIXME: not guaranteed to be unique
    if (this.nodes.filter((n) => n.name && n.name == node.name).length != 0) {
      console.log('Node is already pinned!')
      return
    }

    node.id = this.nodes.length + 1

    this.nodes.push(node)

    this.storeNodes()

    this.trigger({
      nodes: this.nodes
    })
  }
})

export default PinnedStore
