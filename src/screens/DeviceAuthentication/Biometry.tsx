import React from 'react'
import { View } from 'react-native'
import AsyncStorage from '@react-native-community/async-storage'
import FingerprintScanner from 'react-native-fingerprint-scanner'

import ScreenContainer from '~/components/ScreenContainer'
import Header, { HeaderSizes } from '~/components/Header'
import Paragraph from '~/components/Paragraph'
import Btn, { BtnTypes } from '~/components/Btn'
import AbsoluteBottom from '~/components/AbsoluteBottom'

import { strings } from '~/translations/strings'

import useRedirectTo from '~/hooks/useRedirectTo'
import useSuccess from '~/hooks/useSuccess'

import { Colors } from '~/utils/colors'

import { ScreenNames } from '~/types/screens'

import { useDeviceAuthState } from './module/deviceAuthContext'

import {
  getBiometryHeader,
  getBiometryActionText,
  getBiometryDescription,
} from './utils/getText'
import BiometryAnimation from '~/components/BiometryAnimation'
import { handleNotEnrolled } from '~/utils/biometryErrors'
import { setPopup } from '~/modules/appState/actions'
import { useDispatch } from 'react-redux'

const Biometry: React.FC = () => {
  const { biometryType } = useDeviceAuthState()
  const displaySuccessLoader = useSuccess()
  const redirectToLoggedIn = useRedirectTo(ScreenNames.LoggedIn)

  const dispatch = useDispatch()

  const handleAuthenticate = async () => {
    dispatch(setPopup(true))
    try {
      await FingerprintScanner.authenticate({
        description: getBiometryDescription(biometryType),
        fallbackEnabled: false, // on this stage we don't want to prompr use passcode as a fallback
      })

      await AsyncStorage.setItem('biometry', biometryType || '')

      displaySuccessLoader()
      redirectToLoggedIn()
    } catch (err) {
      if (err.name === 'FingerprintScannerNotEnrolled') {
        handleNotEnrolled(biometryType)
      }
    }
  }

  return (
    <ScreenContainer customStyles={{ justifyContent: 'flex-start' }}>
      <View>
        <Header size={HeaderSizes.small}>
          {getBiometryHeader(biometryType)}
        </Header>
        <Paragraph color={Colors.white70}>
          {strings.SO_YOU_DONT_NEED_TO_CONFIRM}
        </Paragraph>
      </View>
      <BiometryAnimation
        biometryType={biometryType}
        handleAuthenticate={handleAuthenticate}
      />
      <Paragraph
        color={Colors.success}
        customStyles={{ paddingHorizontal: 25 }}
      >
        {getBiometryActionText(biometryType)}
      </Paragraph>
      <AbsoluteBottom>
        <Btn type={BtnTypes.secondary} onPress={redirectToLoggedIn}>
          {strings.SKIP}
        </Btn>
      </AbsoluteBottom>
    </ScreenContainer>
  )
}

export default Biometry
