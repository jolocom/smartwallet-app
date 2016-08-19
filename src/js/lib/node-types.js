import NodeTypes from 'lib/lib/node-types'
import {PRED} from 'lib/namespaces'

import Profile from 'components/node/fullscreen/types/profile'
NodeTypes.register(PRED.Person, {
  component: Profile
})

import Text from 'components/node/fullscreen/types/text'
NodeTypes.register(PRED.Document, {
  component: Text
})

export default NodeTypes