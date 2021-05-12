import React, { useCallback } from 'react'
import { Image } from 'react-native'
import { NavigationProp, StackActions } from '@react-navigation/native'
import { StyleSheet } from 'react-native'

import Btn, { BtnTypes } from '~/components/Btn'
import ScreenContainer from '~/components/ScreenContainer'
import { strings } from '~/translations/strings'
import { ScreenNames } from '~/types/screens'
import BP from '~/utils/breakpoints'
import AbsoluteBottom from '~/components/AbsoluteBottom'
import JoloText, { JoloTextKind, JoloTextWeight } from '~/components/JoloText'
import { JoloTextSizes } from '~/utils/fonts'
import { Colors } from '~/utils/colors'

interface PropsI {
  navigation: NavigationProp<{}>
}

const PinRecoveryInstructions: React.FC<PropsI> = ({ navigation }) => {
  const redirectToRecovery = () => {
    const pushAction = StackActions.push(ScreenNames.PasscodeRecovery, {
      isAccessRestore: true,
    })
    navigation.dispatch(pushAction)
  }
  const handleGoBack = useCallback(() => {
    navigation.goBack()
  }, [])
  return (
    <ScreenContainer
      customStyles={{ justifyContent: 'flex-start' }}
      backgroundColor={Colors.black}
    >
      <JoloText
        kind={JoloTextKind.title}
        size={JoloTextSizes.middle}
        weight={JoloTextWeight.regular}
        color={Colors.white85}
        customStyles={{
          alignSelf: 'flex-start',
          marginTop: BP({ default: 40, xsmall: 32 }),
        }}
      >
        {strings.HOW_TO_CHANGE_PIN}
      </JoloText>
      <JoloText
        kind={JoloTextKind.subtitle}
        color={Colors.white80}
        size={JoloTextSizes.middle}
        customStyles={{
          ...styles.descriptionText,
          marginTop: BP({ xsmall: 12, small: 12, medium: 12, large: 24 }),
        }}
      >
        {strings.WE_ARE_SORRY_THAT_YOU_FORGOT}
      </JoloText>
      <JoloText
        kind={JoloTextKind.subtitle}
        color={Colors.white80}
        size={JoloTextSizes.middle}
        customStyles={{
          ...styles.descriptionText,
          marginTop: 12,
        }}
      >
        {strings.YOU_CAN_CHANGE_PIN}
      </JoloText>
      <AbsoluteBottom customStyles={styles.btnsContainer}>
        <Image
          style={styles.instructionImage}
          source={require('~/assets/images/pinrecovery.png')}
        />
        <Btn onPress={redirectToRecovery}>{strings.RESTORE_ACCESS}</Btn>
        <JoloText
          kind={JoloTextKind.subtitle}
          size={JoloTextSizes.tiniest}
          color={Colors.white70}
          customStyles={{
            paddingBottom: BP({
              xsmall: 10,
              small: 10,
              medium: 35,
              large: 35,
            }),
            lineHeight: BP({ xsmall: 14, small: 18, medium: 22, large: 22 }),
          }}
        >
          {strings.STORING_NO_AFFECT_DATA}
        </JoloText>
        <Btn onPress={handleGoBack} type={BtnTypes.secondary}>
          {strings.CANCEL}
        </Btn>
      </AbsoluteBottom>
    </ScreenContainer>
  )
}

const styles = StyleSheet.create({
  instructionImage: {
    bottom: BP({ xsmall: -120, small: -80, medium: -80, large: -50 }),
    alignSelf: 'center',
    transform: [{ scale: BP({ xsmall: 0.7, small: 1, medium: 1, large: 1 }) }],
  },
  btnsContainer: {
    alignSelf: 'center',
    bottom: 0,
  },
  descriptionText: {
    alignSelf: 'flex-start',
    textAlign: 'left',
    letterSpacing: 0,
    lineHeight: BP({ xsmall: 14, small: 18, medium: 22, large: 22 }),
    color: BP({
      xsmall: Colors.white,
      small: Colors.white90,
      medium: Colors.white70,
      large: Colors.white70,
    }),
  },
})

export default PinRecoveryInstructions
