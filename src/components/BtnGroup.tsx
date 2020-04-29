import React, { useEffect, useState } from 'react'
import { View, StyleSheet, Keyboard } from 'react-native'

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
    position: 'absolute',
    bottom: 20,
  },
  horizontal: {
    flexDirection: 'row',
  },
})

export default BtnGroup
