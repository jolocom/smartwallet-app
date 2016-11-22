import React, {PropTypes} from 'react'
import Reflux from 'reflux'
import NodeStore from 'stores/node.js'
import GraphStore from 'stores/graph-store.js'
import NodeActions from 'actions/node.js'
import NodeTypes from 'lib/node-types.js'

let Node = React.createClass({
  /*
     We need the graph store state so that we can quickly retrieve
     the connection between the center node and the node we are focused
     on right now.
  */
  mixins: [Reflux.listenTo(NodeStore, 'onStateUpdate', 'setInitialState'),
           Reflux.listenTo(GraphStore, 'x', 'getGraphState')],

  onStateUpdate(newState) {
    this.setState(newState)
  },

  getGraphState(graphState) {
    this.state.graphState = graphState
  },

  setInitialState(initState) {
    this.state = initState
  },

  propTypes: {
    params: PropTypes.object
  },

  componentDidMount() {
    if (!this.state.initialized) {
      NodeActions.initiate(this.props.params.node)
    }
  },

  render() {
    let NodeFullScreenComponent
    let initialized = false

    if (this.state && this.state.initialized) {
      initialized = true
      NodeFullScreenComponent = NodeTypes.componentFor(this.state.type)
    }

    return (
      <div>
        {initialized
          ? <NodeFullScreenComponent
            uri={this.state.uri}
            graphState={this.state.graphState} />
          : null}
      </div>
    )
  }
})

export default Node
