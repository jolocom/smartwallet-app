import React from 'react'
import { View } from 'react-native'
import { ITabPersistChildren } from './types'
import { debugView } from '~/utils/dev'

const PersistChildren: React.FC<ITabPersistChildren> = ({
  children,
  isContentVisible,
}) => {
  return (
    <View
      style={{
        display: isContentVisible ? 'flex' : 'none',
        flex: 1,
      }}
    >
      {children}
    </View>
  )
}

export default PersistChildren
