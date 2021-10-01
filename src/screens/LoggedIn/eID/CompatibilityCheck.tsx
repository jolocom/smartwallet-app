import React, { useEffect } from 'react'
import { View, StyleSheet } from 'react-native'
import { useNavigation } from '@react-navigation/native'
import { StackActions } from '@react-navigation/routers'

import ScreenContainer from '~/components/ScreenContainer'
import JoloText, { JoloTextKind } from '~/components/JoloText'
import Btn, { BtnTypes } from '~/components/Btn'
import { Colors } from '~/utils/colors'

import { eIDScreens, aa2EmitterTemp, AA2Messages } from '.'

const CompatibilityCheck = () => {
  useEffect(() => {
    aa2EmitterTemp.on(AA2Messages.Reader, () => {
      /**
       * TODO:
       * 1. update loader status
       */
    })
  }, [])
  const navigation = useNavigation()
  const handleCheckCompatibility = () => {
    /**
     * TODO:
     * 1. show NFC popup
     * 2. initiate loader
     */
  }
  const handleShowPinInstructions = () => {
    navigation.navigate(eIDScreens.PINInstructions)
  }

  const handleClose = () => {
    navigation.dispatch(StackActions.pop())
  }
  return (
    <ScreenContainer>
      <JoloText kind={JoloTextKind.title}>
        Before you proceed you with digital interaction your device must meet
        certain technical requirements
      </JoloText>
      <View style={styles.optionContainer}>
        <JoloText color={Colors.success}>1</JoloText>
        <JoloText kind={JoloTextKind.title}>
          Check if your ID card is ready to be used
        </JoloText>

        <Btn type={BtnTypes.quinary} onPress={handleCheckCompatibility}>
          Check compatibility
        </Btn>
      </View>

      <View style={styles.optionContainer}>
        <JoloText color={Colors.success}>2</JoloText>
        <JoloText kind={JoloTextKind.title}>
          Make sure that your 6-digit PIN was activated
        </JoloText>

        <Btn type={BtnTypes.quinary} onPress={handleShowPinInstructions}>
          More info
        </Btn>
      </View>

      <Btn type={BtnTypes.tertiary} onPress={handleClose}>
        All done
      </Btn>
    </ScreenContainer>
  )
}

const styles = StyleSheet.create({
  optionContainer: {
    marginVertical: 20,
    alignItems: 'center',
    width: '100%',
  },
})

export default CompatibilityCheck
