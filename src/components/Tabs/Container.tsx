import React from 'react'
import { StyleSheet, View, ViewStyle } from 'react-native'

interface IProps {
  customStyles?: ViewStyle
}

const TabsContainer: React.FC<IProps> = ({ children, customStyles }) => {
  return <View style={[styles.container, customStyles]}>{children}</View>
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignSelf: 'flex-start',
  },
})

export default TabsContainer
