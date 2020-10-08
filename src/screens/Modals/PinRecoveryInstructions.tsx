import React, { useCallback } from 'react'
import { NavigationProp, StackActions } from '@react-navigation/native'

import Btn, { BtnTypes } from '~/components/Btn'
import ScreenContainer from '~/components/ScreenContainer'
import { strings } from '~/translations/strings'
import { ScreenNames } from '~/types/screens'
// import { ForgotPinInstructions } from '~/assets/svg'
import { StyleSheet, View } from 'react-native'
import BP from '~/utils/breakpoints'
import AbsoluteBottom from '~/components/AbsoluteBottom'
import JoloText, { JoloTextKind } from '~/components/JoloText'
import { JoloTextSizes } from '~/utils/fonts'
import { Colors } from '~/utils/colors'

interface PropsI {
  navigation: NavigationProp<{}>
}

const PinRecoveryInstructions: React.FC<PropsI> = ({ navigation }) => {
  const redirectToRecovery = () => {
    const pushAction = StackActions.push(ScreenNames.Recovery, {
      isAccessRestore: true,
    })
    navigation.dispatch(pushAction)
  }
  const handleGoBack = useCallback(() => {
    navigation.goBack()
  }, [])
  return (
    <ScreenContainer>
      <JoloText
        kind={JoloTextKind.title}
        size={JoloTextSizes.middle}
        customStyles={{
          paddingTop: BP({ xsmall: 20, small: 20, medium: 30, large: 50 }),
          alignSelf: 'flex-start',
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
      <View style={styles.imageContainer}>
        {/* <ForgotPinInstructions /> */}
      </View>
      <AbsoluteBottom customStyles={styles.btnsContainer}>
        <Btn onPress={redirectToRecovery}>{strings.RESTORE_ACCESS}</Btn>
        <JoloText
          kind={JoloTextKind.subtitle}
          size={JoloTextSizes.mini}
          color={Colors.white70}
          customStyles={{
            paddingHorizontal: BP({
              xsmall: 10,
              small: 10,
              medium: 25,
              large: 25,
            }),
            lineHeight: 15,
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
  imageContainer: {
    transform: [
      { scale: BP({ xsmall: 0.7, small: 0.7, medium: 1, large: 1 }) },
    ],
    position: 'absolute',
    bottom: BP({ xsmall: -80, small: -80, medium: -80, large: -50 }),
  },
  btnsContainer: {
    alignSelf: 'center',
    bottom: 0,
  },
  descriptionText: {
    alignSelf: 'flex-start',
    textAlign: 'left',
  },
})

export default PinRecoveryInstructions
