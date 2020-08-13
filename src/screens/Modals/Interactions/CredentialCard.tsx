import React, { useState, useEffect } from 'react'
import {
  View,
  StyleSheet,
  Dimensions,
  TouchableWithoutFeedback,
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
  const handleCardTap = () => {
    // setIsAnimated(false)
    onSelect && onSelect()
  }

  return (
    <TouchableWithoutFeedback disabled={disabled} onPress={handleCardTap}>
      <View
        style={[
          styles.cardContainer,
          styles.card,
          isSmall && styles.scaledDown,
        ]}
      >
        <>
          {children}
          {(disabled || selected || hasInstruction) && (
            <View style={[styles.darken, styles.card]}>
              {selected && <Tick />}
              {hasInstruction && (
                <View style={{ alignSelf: 'center' }}>
                  <HandAnimation />
                </View>
              )}
            </View>
          )}
        </>
      </View>
    </TouchableWithoutFeedback>
  )
}

const styles = StyleSheet.create({
  card: {
    borderRadius: 13.5,
  },
  cardContainer: {
    width: CARD_WIDTH,
    height: CARD_HEIGHT,
    marginVertical: 20,
    backgroundColor: Colors.white35,
  },
  scaledDown: {
    marginLeft: -20,
    marginRight: -5,
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
