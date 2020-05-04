import React from 'react'
import { View, StyleSheet } from 'react-native'
import { Colors } from '~/utils/colors'

interface ScreenContainerI {
  isTransparent?: boolean
}

const ScreenContainer: React.FC<ScreenContainerI> = ({
  children,
  isTransparent = false,
}) => {
  return (
    <View style={[styles.container, isTransparent && styles.transparent]}>
      {children}
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: '5%',
    paddingVertical: 50,
    backgroundColor: Colors.mainBlack,
  },
  transparent: {
    backgroundColor: 'transparent',
  },
})

export default ScreenContainer
