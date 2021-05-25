import React from 'react'
import { StyleSheet, View } from 'react-native'
import { ITabPersistChildren } from './types'

const PersistChildren: React.FC<ITabPersistChildren> = ({
  children,
  isContentVisible,
}) => {
  // NOTE: not using `display: none` for hiding the content, b/c it causes
  // the re-render of the `SectionList` component
  return (
    <View
      style={{
        zIndex: isContentVisible ? 10 : -10,
        opacity: isContentVisible ? 1 : 0,
        ...StyleSheet.absoluteFillObject,
      }}
    >
      {children}
    </View>
  )
}

export default PersistChildren
