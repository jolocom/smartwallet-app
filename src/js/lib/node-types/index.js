import NodeTypes from './node-types'
import {PRED} from 'lib/namespaces'

import profileCfg from './types/profile'

// Default node types
// NodeTypes.register('profile', require('./types/profile'))
// NodeTypes.register('image', require('./types/image'))
// NodeTypes.register('text', require('./types/text'))
NodeTypes.register(PRED.Person, profileCfg)

export default NodeTypes
