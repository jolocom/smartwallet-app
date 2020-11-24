import React from 'react'
import { StyleSheet, TouchableOpacity, View } from 'react-native'
import { Colors } from 'react-native/Libraries/NewAppScreen'
import { debugView } from '~/utils/dev'

const Dots = () => {
  return (
    <TouchableOpacity style={styles.container}>
      {['a', 'b', 'c'].map((c) => (
        <View key={c} style={styles.dot} />
      ))}
    </TouchableOpacity>
  )
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    paddingTop: 5,
    // paddingRight: 14,
    flex: 0.15,
    // ...debugView(),
  },
  dot: {
    width: 4,
    height: 4,
    borderRadius: 2,
    backgroundColor: Colors.black,
    marginHorizontal: 2,
  },
})

export default Dots
