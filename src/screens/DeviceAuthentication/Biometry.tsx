import React from 'react'
import { View } from 'react-native'
import AsyncStorage from '@react-native-community/async-storage'
import FingerprintScanner from 'react-native-fingerprint-scanner'

import ScreenContainer from '~/components/ScreenContainer'
import Header, { HeaderSizes } from '~/components/Header'
import Paragraph, { ParagraphSizes } from '~/components/Paragraph'
import Btn, { BtnTypes } from '~/components/Btn'
import AbsoluteBottom from '~/components/AbsoluteBottom'

import { strings } from '~/translations/strings'

import useSuccess from '~/hooks/useSuccess'

import { Colors } from '~/utils/colors'

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
import { useRedirectToLoggedIn } from './useRedirectToLoggedIn'

const Biometry: React.FC = () => {
  const { biometryType } = useDeviceAuthState()
  const displaySuccessLoader = useSuccess()

  const dispatch = useDispatch()

  const handleRedirectToLogin = useRedirectToLoggedIn()

  const handleAuthenticate = async () => {
    dispatch(setPopup(true))
    try {
      await FingerprintScanner.authenticate({
        description: getBiometryDescription(biometryType),
        fallbackEnabled: false, // on this stage we don't want to prompr use passcode as a fallback
      })

      await AsyncStorage.setItem('biometry', biometryType || '')

      displaySuccessLoader()
      handleRedirectToLogin()
    } catch (err) {
      if (err.name === 'FingerprintScannerNotEnrolled') {
        handleNotEnrolled(biometryType)
      }
    }
  }

  return (
    <ScreenContainer customStyles={{ justifyContent: 'flex-start' }}>
      <View>
        <Header>{getBiometryHeader(biometryType)}</Header>
        <Paragraph size={ParagraphSizes.medium} color={Colors.white70}>
          {strings.SO_YOU_DONT_NEED_TO_CONFIRM}
        </Paragraph>
      </View>
      <BiometryAnimation
        biometryType={biometryType}
        handleAuthenticate={handleAuthenticate}
      />
      <Paragraph
        color={Colors.success}
        size={ParagraphSizes.medium}
        customStyles={{ paddingHorizontal: 25 }}
      >
        {getBiometryActionText(biometryType)}
      </Paragraph>
      <AbsoluteBottom>
        <Btn type={BtnTypes.secondary} onPress={handleRedirectToLogin}>
          {strings.SKIP}
        </Btn>
      </AbsoluteBottom>
    </ScreenContainer>
  )
}

export default Biometry
