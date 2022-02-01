import React from 'react'
import { View } from 'react-native'
import { debugView } from '~/utils/dev'
import Pills from './draggable/ios/Pills'
import { IDndProps } from './types'

const Dnd: React.FC<IDndProps> = ({ tags, updateTags }) => {
  return (
    <View>
      <Pills tags={tags} updateTags={updateTags} />
    </View>
  )
}

export default Dnd
