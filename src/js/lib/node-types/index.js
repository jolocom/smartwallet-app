import NodeTypes from './node-types'

// Default node types
NodeTypes.register('profile', require('./types/profile'))
NodeTypes.register('image', require('./types/image'))
NodeTypes.register('text', require('./types/text'))

export default NodeTypes
