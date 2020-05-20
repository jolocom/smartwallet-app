import React from 'react'
import { View, StyleSheet, Platform } from 'react-native'

export enum BtnsAlignment {
  vertical,
  horizontal,
}

interface PropsI {
  alignment?: BtnsAlignment
}

const BtnGroup: React.FC<PropsI> = ({
  alignment = BtnsAlignment.vertical,
  children,
}) => {
  return (
    <View
      style={[
        styles.container,
        alignment === BtnsAlignment.horizontal && styles.horizontal,
      ]}
    >
      {children}
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    width: '100%',
    ...Platform.select({
      android: {
        marginBottom: 20,
      },
      ios: {
        marginBottom: 50,
      },
    }),
  },
  horizontal: {
    flexDirection: 'row',
  },
})

export default BtnGroup
