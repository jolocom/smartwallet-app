import React from 'react'
import { StyleSheet, View } from 'react-native'
import { IWithCustomStyle } from '~/types/props'

const TabsContainer: React.FC<IWithCustomStyle> = ({
  children,
  customStyles,
}) => {
  return <View style={[styles.container, customStyles]}>{children}</View>
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignSelf: 'flex-start',
  },
})

export default TabsContainer
