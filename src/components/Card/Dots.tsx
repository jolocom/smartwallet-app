import React from 'react'
import { StyleSheet, TouchableOpacity, View } from 'react-native'
import { Colors } from 'react-native/Libraries/NewAppScreen'
import { IWithCustomStyle } from './Card'

const Dots: React.FC<IWithCustomStyle> = ({ customStyles }) => {
  return (
    <TouchableOpacity style={[styles.container, customStyles]}>
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
    flex: 0.15,
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
