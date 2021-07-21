import React, { useCallback } from 'react'
import { Image, View } from 'react-native'
import { NavigationProp, StackActions } from '@react-navigation/native'
import { StyleSheet } from 'react-native'

import Btn, { BtnTypes } from '~/components/Btn'
import ScreenContainer from '~/components/ScreenContainer'
import { ScreenNames } from '~/types/screens'
import BP from '~/utils/breakpoints'
import JoloText, { JoloTextKind, JoloTextWeight } from '~/components/JoloText'
import { JoloTextSizes } from '~/utils/fonts'
import { Colors } from '~/utils/colors'
import useTranslation from '~/hooks/useTranslation'

interface PropsI {
  navigation: NavigationProp<{}>
}

const PinRecoveryInstructions: React.FC<PropsI> = ({ navigation }) => {
  const { t } = useTranslation()

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
          textAlign: 'left',
        }}
      >
        {t('PasscodeRecoveryInstructions.header')}
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
        {t('PasscodeRecoveryInstructions.subheader1')}
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
        {t('PasscodeRecoveryInstructions.subheader2')}
      </JoloText>
      <View style={styles.btnsContainer}>
        <View>
          <View style={styles.instructionImage}>
            <JoloText
              color={Colors.purple}
              size={JoloTextSizes.mini}
              customStyles={styles.instructionText}
            >
              {t('PasscodeRecoveryInstructions.imageCaption')}
            </JoloText>
            <Image source={require('~/assets/images/pinrecovery.png')} />
          </View>
          <Btn onPress={redirectToRecovery}>
            {t('PasscodeRecoveryInstructions.submitBtn')}
          </Btn>
          <JoloText
            kind={JoloTextKind.subtitle}
            size={JoloTextSizes.tiniest}
            color={Colors.white70}
            customStyles={{
              lineHeight: BP({ xsmall: 14, small: 18, medium: 22, large: 22 }),
            }}
          >
            {t('PasscodeRecoveryInstructions.footer')}
          </JoloText>
        </View>
        <Btn onPress={handleGoBack} type={BtnTypes.secondary}>
          {t('PasscodeRecoveryInstructions.cancelBtn')}
        </Btn>
      </View>
    </ScreenContainer>
  )
}

const styles = StyleSheet.create({
  instructionText: {
    position: 'absolute',
    top: -40,
    right: '15%',
    width: 130,
  },
  instructionImage: {
    //bottom: BP({ xsmall: -120, small: -80, medium: -80, large: -50 }),
    bottom: '-15%',
    alignSelf: 'center',
    transform: [{ scale: BP({ xsmall: 0.7, small: 1, medium: 1, large: 1 }) }],
  },
  btnsContainer: {
    alignSelf: 'center',
    justifyContent: 'space-between',
    width: '100%',
    paddingBottom: 16,
    flex: 1,
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
