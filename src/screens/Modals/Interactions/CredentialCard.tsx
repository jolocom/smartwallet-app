import React from 'react'
import { View, StyleSheet, Dimensions } from 'react-native'
import { Colors } from '~/utils/colors'

interface PropsI {
  isSmall?: boolean
}

const WIDTH = Dimensions.get('window').width * 0.83
const HEIGHT = WIDTH * 0.64

const CredentialCard: React.FC<PropsI> = ({ children, isSmall = false }) => {
  return (
    <View style={[styles.cardContainer, isSmall && styles.scaledDown]}>
      {children}
    </View>
  )
}

const styles = StyleSheet.create({
  cardContainer: {
    borderRadius: 13.5,
    borderColor: Colors.white90,
    borderWidth: 1,
    width: WIDTH,
    height: HEIGHT,
    marginVertical: 20,
  },
  scaledDown: {
    transform: [{ scale: 0.83 }],
  },
})

export default CredentialCard
