import React from 'react'
import { IWithCustomStyle } from '~/types/props'
import { View, StyleSheet } from 'react-native'
import { Colors } from '~/utils/colors'

const Block: React.FC<IWithCustomStyle> = ({ children, customStyles = {} }) => (
  <View style={[styles.container, customStyles]}>{children}</View>
)

const styles = StyleSheet.create({
  container: {
    backgroundColor: Colors.haiti,
    elevation: 15,
    width: '100%',
    borderRadius: 8,
  },
})

export default Block
