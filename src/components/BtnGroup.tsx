import React from 'react'
import { View, StyleSheet } from 'react-native'
import { IWithCustomStyle } from '~/types/props'

const BtnGroup: React.FC<IWithCustomStyle> = ({
  children,
  customStyles = {},
}) => <View style={[styles.container, customStyles]}>{children}</View>

const styles = StyleSheet.create({
  container: {
    width: '100%',
    marginBottom: 16,
  },
})

export default BtnGroup
