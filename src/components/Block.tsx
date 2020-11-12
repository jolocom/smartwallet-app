import React from 'react'
import { View, StyleSheet, ViewProps } from 'react-native'

import { Colors } from '~/utils/colors'

export enum BlockAlign {
  left = 'flex-start',
  center = 'center',
}

interface Props {
  align?: BlockAlign
  customStyle?: ViewProps
}

const Block: React.FC<Props> = ({
  children,
  customStyle = {},
  align = BlockAlign.center,
}) => (
  <View style={[styles.container, { justifyContent: align }, customStyle]}>
    {children}
  </View>
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
