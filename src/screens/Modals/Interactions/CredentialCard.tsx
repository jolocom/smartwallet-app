import React from 'react'
import {
  View,
  StyleSheet,
  Dimensions,
  TouchableWithoutFeedback,
} from 'react-native'
import { Colors } from '~/utils/colors'
import { SuccessTick } from '~/assets/svg'

interface PropsI {
  isSmall?: boolean
  disabled?: boolean
  selected?: boolean
  onSelect?: () => void
}

const WIDTH = Dimensions.get('window').width * 0.83
const HEIGHT = WIDTH * 0.64

const Tick = () => {
  return (
    <View style={styles.iconContainer}>
      <SuccessTick color={Colors.white} />
    </View>
  )
}

const CredentialCard: React.FC<PropsI> = ({
  children,
  isSmall = false,
  disabled = false,
  selected,
  onSelect,
}) => {
  return (
    <TouchableWithoutFeedback disabled={disabled} onPress={onSelect}>
      <View
        style={[
          styles.cardContainer,
          styles.card,
          isSmall && styles.scaledDown,
        ]}
      >
        {children}
        {(disabled || selected) && (
          <View style={[styles.darken, styles.card]}>
            {selected && <Tick />}
          </View>
        )}
      </View>
    </TouchableWithoutFeedback>
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
    backgroundColor: 'transparent',
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
    justifyContent: 'center',
  },
  iconContainer: {
    width: 46,
    height: 46,
    borderRadius: 23,
    borderWidth: 1,
    borderColor: Colors.white,
    alignItems: 'center',
    justifyContent: 'center',
    alignSelf: 'center',
  },
})

export default CredentialCard
