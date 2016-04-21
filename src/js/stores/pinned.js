import Reflux from 'reflux'
import PinnedActions from 'actions/pinned'
import NodeActions from 'actions/node'

export default Reflux.createStore({
  listenables: [PinnedActions, NodeActions],
  init() {
    this.nodes = this.getStoredNodes()
  },
  getInitialState() {
    return {
      show: false,
      nodes: this.nodes || []
    }
  },
  storeNodes() {
    try {
      localStorage.setItem('jlc.pinned', JSON.stringify(this.nodes))
    } catch(e) {console.error(e)}
  },
  getStoredNodes() {
    try {
      return JSON.parse(localStorage.getItem('jlc.pinned')) || []
    } catch(e) {
      console.error(e)
      return []
    }
  },
  onShow() {
    this.trigger({show: true, nodes: this.nodes})
  },
  onHide() {
    this.trigger({show: false, nodes: this.nodes})
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
