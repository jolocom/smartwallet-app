import React, {PropTypes} from 'react'
import Reflux from 'reflux'
import NodeStore from 'stores/node.js'
import NodeActions from 'actions/node.js'
import NodeTypes from 'lib/node-types.js'

let Node = React.createClass({
  mixins: [
    Reflux.listenTo(NodeStore, 'onStateUpdate')
  ],

  propTypes: {
    params: PropTypes.object,
    graph: PropTypes.object
  },

  getInitialState() {
    return {
      uri: null,
      initialized: false,
      selectedNode: {}
    }
  },

  onStateUpdate(newState) {
    this.setState(newState)
  },

  componentDidMount() {
    // In order to trigger componentDidUpdate
    this.setState(this.state)
  },

  // @TODO we have to find something better then passing around the graph state
  // into all child components
  componentDidUpdate() {
    // the props are not available instantly, so this has to be here
    // rather than in DidMount
    const {graph} = this.props
    if (!this.state.initialized && graph && graph.center) {
      NodeActions.initiate(graph, this.props.params.node)
    }
  },

  /*
  componentWillUpdate(nextProps, nextState) {
    if (nextState.initialized) {
      const {graph} = this.props
      if (graph.center.uri === this.props.params.node) {
        this.selectedNode = graph.center
      } else {
        this.selectedNode = graph.neighbours.find(el => {
          return el.uri === this.props.params.node
        })
      }
    }
  },
  */

  render() {
    let NodeFSComponent
    let initialized = false
    if (this.state.initialized && this.state.selectedNode) {
      initialized = true
    }

    if (initialized) {
      NodeFSComponent = NodeTypes.componentFor(this.state.selectedNode.type)
    }

    /* TODO Here we need to have a loading screen before the actual
    state is there my React Fu is not there yet :D
    --> GenericFullScreen should be moved here, so we can render the loading
    screen in there and then render the NodeType component from there
    */
    return (
      <div>
        {initialized
          ? <NodeFSComponent
            node={this.state.selectedNode}
            writePerm={this.state.writePerm}
            centerWritePerm={this.state.centerWritePerm}
            graphState={this.props.graph} />
          : null}
      </div>
    )
  }
})

export default Node
