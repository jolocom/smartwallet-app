import React, { useState } from 'react'
import { View, StyleSheet } from 'react-native'
import { Colors } from '~/utils/colors'
import LinearGradient from 'react-native-linear-gradient'

interface Props {
  selected: boolean
}

const ToggleIcon: React.FC<Props> = ({ selected }) => {
  const gradient = [Colors.carnationPink, Colors.hyacinthPink]

  return (
    <View style={styles.container}>
      {selected && (
        <LinearGradient
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 0 }}
          style={styles.gradient}
          colors={gradient}
        />
      )}
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    width: 17,
    height: 17,
    borderRadius: 25,
    borderWidth: 0.6,
    borderStyle: 'solid',
    borderColor: Colors.sadGrey,
  },
  gradient: {
    flex: 1,
    borderRadius: 25,
  },
})

export default ToggleIcon
