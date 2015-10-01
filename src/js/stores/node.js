import Reflux from 'reflux'
import NodeActions from 'actions/node'

let pinned = []

let NodeStore = Reflux.createStore({
  listenables: NodeActions,
  getInitialState() {
    return {
      pinned: []
    }
  },
  onPin(node) {
    // FIXME: not guaranteed to be unique
    if (pinned.filter((n) => n.name && n.name == node.name).length != 0) {
      console.log('Node is already pinned!')
      return
    }

    node.id = pinned.length + 1

    // @TODO store in localStorage?
    pinned.push(node)

    this.trigger({
      pinned: pinned
    })
  }
})

export default NodeStore
