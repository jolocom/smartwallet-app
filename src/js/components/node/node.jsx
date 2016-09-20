import React, {PropTypes} from 'react'
import NodeTypes from 'lib/node-types.js'

import graphActions from 'actions/graph-actions'

import Debug from 'lib/debug'
let debug = Debug('components:node')

let Node = (props) => {
  let {node} = props

  if (!node) {
    debug('Fetching more information on node', props.routeParams.node)
    graphActions.viewNode(props.routeParams.node)
    return <div></div>
  }

  const NodeFullScreenComponent = NodeTypes.componentFor(node.type)

  debug('Rendering fullscreen component %s for node type %s',
    NodeFullScreenComponent.displayName,
    node.type
  )

  return (
    <NodeFullScreenComponent {...props} />
  )
}

Node.propTypes = {
  node: PropTypes.object,
  center: PropTypes.object,
  navHistory: PropTypes.array,
  routeParams: PropTypes.object
}

export default Node
