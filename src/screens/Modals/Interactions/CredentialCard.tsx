import React from 'react'
import { View, StyleSheet, Dimensions } from 'react-native'
import { Colors } from '~/utils/colors'

interface PropsI {
  isSmall?: boolean
  disabled?: boolean
  selected?: boolean
}

const WIDTH = Dimensions.get('window').width * 0.83
const HEIGHT = WIDTH * 0.64

const CredentialCard: React.FC<PropsI> = ({
  children,
  isSmall = false,
  disabled = false,
  selected,
}) => {
  return (
    <View
      style={[styles.cardContainer, styles.card, isSmall && styles.scaledDown]}
    >
      {children}
      {disabled && <View style={[styles.darken, styles.card]} />}
    </View>
  )
}

const styles = StyleSheet.create({
  card: {
    borderRadius: 13.5,
  },
  cardContainer: {
    width: WIDTH,
    height: HEIGHT,
    marginVertical: 20,
    backgroundColor: Colors.white,
  },
  scaledDown: {
    transform: [{ scale: 0.83 }],
  },
  darken: {
    position: 'absolute',
    left: 0,
    top: 0,
    width: '100%',
    height: '100%',
    backgroundColor: Colors.mainBlack,
    opacity: 0.85,
  },
})

export default CredentialCard
