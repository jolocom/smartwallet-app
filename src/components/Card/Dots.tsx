import React from 'react'
import { StyleSheet, TouchableOpacity, View } from 'react-native'
import { Colors } from '~/utils/colors'
import { IWithCustomStyle } from './types'

const Dots: React.FC<IWithCustomStyle> = ({ customStyles }) => {
  const handleShowMenu = () => {
    console.log('You should see menu now')
  }
  return (
    <TouchableOpacity
      onPress={handleShowMenu}
      style={[styles.container, customStyles]}
      testID="card-action-more"
    >
      <View style={styles.dots}>
        {[...Array(3).keys()].map((c) => (
          <View key={c} style={styles.dot} />
        ))}
      </View>
    </TouchableOpacity>
  )
}

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    alignItems: 'center',
    justifyContent: 'center',
    width: 50,
    height: 50,
  },
  dots: {
    flexDirection: 'row',
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
