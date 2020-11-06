import React from 'react'
import { View, StyleSheet, ViewProps } from 'react-native'

import { Colors } from '~/utils/colors'

interface Props {
  customStyle?: ViewProps
}

const Block: React.FC<Props> = ({ children, customStyle }) => (
  <View style={[styles.container, customStyle]}>{children}</View>
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
