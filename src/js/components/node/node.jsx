import React, {PropTypes} from 'react'
import Reflux from 'reflux'
import NodeStore from 'stores/node.js'
import NodeActions from 'actions/node.js'
import NodeTypes from 'lib/node-types.js'

let Node = React.createClass({
  mixins: [Reflux.listenTo(NodeStore, 'onStateUpdate', 'setInitialState')],

  onStateUpdate(newState) {
    this.setState(newState)
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
          ? <NodeFullScreenComponent {...this.state} />
          : null}
      </div>
    )
  }
})

export default Node
