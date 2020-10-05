import React, { useEffect, useRef, useState } from 'react'
import {
  View,
  StyleSheet,
  Dimensions,
  Animated,
  TouchableOpacity,
} from 'react-native'
import { Colors } from '~/utils/colors'
import { SuccessTick } from '~/assets/svg'
import { HandAnimation } from '~/components/HandAnimation'

interface PropsI {
  isSmall?: boolean
  disabled?: boolean
  selected?: boolean
  onSelect?: () => void
  hasInstruction?: boolean
}

export const CARD_WIDTH = Dimensions.get('window').width * 0.83
export const CARD_HEIGHT = CARD_WIDTH * 0.64
export const SMALL_CARD_SCALE = 0.84

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
  hasInstruction = false,
  selected,
  onSelect,
}) => {
  const instructionOpacity = useRef(new Animated.Value(0)).current
  const [cardHeight, setCardHeight] = useState(CARD_HEIGHT)

  useEffect(() => {
    Animated.timing(instructionOpacity, {
      duration: !hasInstruction && !disabled && !selected ? 200 : 0,
      toValue: hasInstruction || disabled || selected ? 0.85 : 0,
      useNativeDriver: true,
    }).start()
  }, [hasInstruction, disabled, selected])

  const handleCardTap = () => {
    onSelect && onSelect()
  }

  return (
    <TouchableOpacity
      activeOpacity={onSelect ? 0.85 : 1}
      disabled={disabled}
      onPress={handleCardTap}
    >
      <View
        style={[
          styles.cardContainer,
          styles.card,
          { height: cardHeight },
          isSmall && styles.scaledDown,
        ]}
        onLayout={(event) => {
          const { width, height } = event.nativeEvent.layout
          setCardHeight(height)
        }}
      >
        <>
          {children}
          <Animated.View
            style={[
              styles.darken,
              styles.card,
              { opacity: instructionOpacity },
            ]}
          >
            {selected && <Tick />}
            {!selected && hasInstruction && (
              <View style={[{ alignSelf: 'center' }]}>
                <HandAnimation />
              </View>
            )}
          </Animated.View>
        </>
      </View>
    </TouchableOpacity>
  )
}

const styles = StyleSheet.create({
  card: {
    borderRadius: 13.5,
  },
  cardContainer: {
    width: CARD_WIDTH,
    height: CARD_HEIGHT,
    backgroundColor: Colors.white,
    alignItems: 'center',
    justifyContent: 'center',
  },
  scaledDown: {
    marginHorizontal: -CARD_WIDTH * ((1 - SMALL_CARD_SCALE) / 2),
    marginVertical: -CARD_HEIGHT * ((1 - SMALL_CARD_SCALE) / 2),
    transform: [{ scale: SMALL_CARD_SCALE }],
  },
  darken: {
    position: 'absolute',
    left: 0,
    top: 0,
    width: '100%',
    height: '100%',
    backgroundColor: Colors.mainBlack,
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
