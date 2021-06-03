import React from 'react'
import { View } from 'react-native'
import Pills from './draggable/ios/Pills'
import { IDndProps } from './types'

const Dnd: React.FC<IDndProps> = ({ tags, updateTags }) => {
  return (
    <View
      style={{
        flex: 1,
        justifyContent: 'flex-end',
        paddingBottom: '60%',
      }}
    >
      <Pills tags={tags} updateTags={updateTags} />
    </View>
  )
}

export default Dnd
