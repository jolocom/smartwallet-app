import React, {PropTypes} from 'react'
import NodeTypes from 'lib/node-types.js'

import Debug from 'lib/debug'
let debug = Debug('components:node')

let Node = (props) => {
  const {node} = props

  if (!node) {
    return
  }

  const NodeFullScreenComponent = NodeTypes.componentFor(node.type)

  debug('Rendering fullscreen component %s for node type %s',NodeFullScreenComponent.displayName,node.type)
  
  return (
    <NodeFullScreenComponent {...props} />
  )
}

Node.propTypes = {
  node: PropTypes.object,
  center: PropTypes.object,
  navHistory: PropTypes.object
}

export default Node
