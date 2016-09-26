import React, {PropTypes} from 'react'
import NodeTypes from 'lib/node-types.js'

import graphActions from 'actions/graph-actions'

import Debug from 'lib/debug'
let debug = Debug('components:node')

let Node = React.createClass({

  propTypes: {
    node: PropTypes.object,
    center: PropTypes.object,
    navHistory: PropTypes.array,
    routeParams: PropTypes.object
  },
  
  render: function() {
    let {node} = this.props

    if (!node || this.props.routeParams.node !== node.uri) {
      debug('Fetching more information on node', this.props.routeParams.node)
      graphActions.viewNode(this.props.routeParams.node) // hydrates activeNode
      return <div></div>
    }

    const NodeFullScreenComponent = NodeTypes.componentFor(node.type)

    debug('Rendering fullscreen component %s for node type %s',
      NodeFullScreenComponent.displayName,
      node.type
    )

    return (
      <NodeFullScreenComponent {...this.props} />
    )
  }
  
})

export default Node
