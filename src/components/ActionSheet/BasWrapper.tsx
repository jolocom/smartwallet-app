import React from 'react'
import { View, StyleSheet, ViewStyle } from 'react-native'
import { Colors } from '~/utils/colors'

const BasWrapper: React.FC<{
  customStyle?: ViewStyle
}> = ({ children, customStyle = {} }) => {
  return <View style={[styles.wrapper, customStyle]}>{children}</View>
}

const styles = StyleSheet.create({
  wrapper: {
    width: '100%',
    backgroundColor: Colors.lightBlack,
    borderRadius: 20,
    justifyContent: 'center',
    paddingHorizontal: 20,
    paddingTop: 55,
    paddingBottom: 20,
    marginBottom: 28,
    alignItems: 'center',
    marginTop: 28,
  },
})

export default BasWrapper
