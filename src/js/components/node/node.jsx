import React, {PropTypes} from 'react'
import Reflux from 'reflux'
import NodeStore from 'stores/node.js'
import NodeActions from 'actions/node.js'
import NodeTypes from 'lib/node-types.js'

let Node = React.createClass({
  mixins: [
    Reflux.listenTo(NodeStore, 'onStateUpdate', 'setInitialState')
  ],

  propTypes: {
    params: PropTypes.object,
    graph: PropTypes.object
  },

  onStateUpdate(newState) {
    this.setState(newState)
  },

  setInitialState(initState) {
    this.setState(initState)
  },

  // @TODO we have to find something better then passing around the graph state
  // into all child components
  componentDidUpdate(prevProps, prevState) {
    const graph = this.props.graph

    if (!this.state.initialized && graph && graph.center) {
      NodeActions.initiate(this.props.params.node, graph.center.uri)
    }
  },

  render() {
    let selectedNode
    let NodeFullScreenComponent
    let initialized = false

    if (this.state && this.state.initialized) {
      initialized = true
      if (this.props.graph.center.uri === this.props.params.node) {
        selectedNode = this.props.graph.center
      } else {
        selectedNode = this.state.graph.neighbours.find(el => {
          return el.uri === this.props.params.node
        })
      }
      NodeFullScreenComponent = NodeTypes.componentFor(selectedNode.type)
    }

    /* TODO Here we need to have a loading screen before the actual
    state is there my React Fu is not there yet :D
    --> GenericFullScreen should be moved here, so we can render the loading
    screen in there and then render the NodeType component from there
    */
    return (
      <div>
        {initialized
          ? <NodeFullScreenComponent
            node={selectedNode}
            writePerm={this.state.writePerm}
            centerWritePerm={this.state.centerWritePerm}
            graphState={this.state.graph} />
          : null}
      </div>
    )
  }
})

export default Node
