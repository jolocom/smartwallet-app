import React, {PropTypes} from 'react'
import Reflux from 'reflux'
import NodeStore from 'stores/node.js'
import GraphStore from 'stores/graph-store.js'
import NodeActions from 'actions/node.js'
import NodeTypes from 'lib/node-types.js'
import Loading from 'components/common/loading.jsx'

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
      NodeActions.initiate(this.props.params.node,
      this.state.graphState.center.uri)
    }
  },

  render() {
    let selectedNode
    let NodeFullScreenComponent
    let initialized = false

    if (this.state && this.state.initialized) {
      initialized = true
      if (this.state.graphState.center.uri === this.props.params.node) {
        selectedNode = this.state.graphState.center
      } else {
        selectedNode = this.state.graphState.neighbours.find(el => {
          return el.uri === this.props.params.node
        })
      }
      NodeFullScreenComponent = NodeTypes.componentFor(selectedNode.type)
    }
    /* TODO Here we need to have a loading screen before the actual
    state is there my React Fu is not there yet :D
    */
    return (
      <div>
        {initialized
          ? <NodeFullScreenComponent
            node={selectedNode}
            writePerm={this.state.writePerm}
            centerWritePerm={this.state.centerWritePerm}
            graphState={this.state.graphState} />
          : null}
      </div>
    )
  }
})

export default Node
