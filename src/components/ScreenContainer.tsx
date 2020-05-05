import React from 'react'
import { View, StyleSheet, ViewStyle, SafeAreaView } from 'react-native'
import { Colors } from '~/utils/colors'

interface ScreenContainerI {
  isTransparent?: boolean
  customStyles?: ViewStyle
}

const ScreenContainer: React.FC<ScreenContainerI> = ({
  children,
  customStyles,
  isTransparent = false,
}) => {
  return (
    <View
      style={[
        styles.container,
        { ...customStyles },
        isTransparent && styles.transparent,
      ]}
    >
      {children}
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: '5%',
    paddingTop: 50,
    backgroundColor: Colors.mainBlack,
  },
  transparent: {
    backgroundColor: 'transparent',
  },
})

export default ScreenContainer
