import React, {PropTypes} from 'react'
import NodeTypes from 'lib/node-types.js'

let Node = (props) => {
  const {node} = props

  if (!node) {
    return
  }

  const NodeFullScreenComponent = NodeTypes.componentFor(node.type)

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
