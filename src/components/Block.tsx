import React from 'react'
import { View, StyleSheet, ViewStyle } from 'react-native'

import { Colors } from '~/utils/colors'
import { debugView } from '~/utils/dev'

export enum BlockAlign {
  left = 'flex-start',
  center = 'center',
}

interface Props {
  align?: BlockAlign
  customStyle?: ViewStyle
}

const Block: React.FC<Props> = ({
  children,
  customStyle = {},
  align = BlockAlign.center,
}) => (
  <View style={[styles.container, { alignItems: align }, customStyle]}>
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
