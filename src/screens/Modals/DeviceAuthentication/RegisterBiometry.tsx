import React from 'react'
import AsyncStorage from '@react-native-community/async-storage'
import FingerprintScanner from 'react-native-fingerprint-scanner'
import { useBackHandler } from '@react-native-community/hooks'
import { useDispatch } from 'react-redux'

import ScreenContainer from '~/components/ScreenContainer'
import Btn, { BtnTypes } from '~/components/Btn'
import AbsoluteBottom from '~/components/AbsoluteBottom'
import JoloText, { JoloTextKind } from '~/components/JoloText'
import ScreenHeader from '~/components/ScreenHeader'
import BiometryAnimation from '~/components/BiometryAnimation'

import { strings } from '~/translations/strings'

import useSuccess from '~/hooks/useSuccess'

import { setPopup } from '~/modules/appState/actions'

import { useDeviceAuthState } from './module/deviceAuthContext'
import { useRedirectToLoggedIn } from './useRedirectToLoggedIn'
import { getBiometryHeader, getBiometryDescription } from './utils/getText'

import { handleNotEnrolled } from '~/utils/biometryErrors'
import { Colors } from '~/utils/colors'
import { JoloTextSizes } from '~/utils/fonts'

const RegisterBiometry: React.FC = () => {
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
      const biometry = await AsyncStorage.getItem('biometry')
      console.log({ biometry })

      displaySuccessLoader()
      handleRedirectToLogin()
    } catch (err) {
      if (err.name === 'FingerprintScannerNotEnrolled') {
        handleNotEnrolled(biometryType)
      }
    }
  }

  useBackHandler(() => true)

  return (
    <ScreenContainer customStyles={{ justifyContent: 'flex-start' }}>
      <ScreenHeader
        title={getBiometryHeader(biometryType)}
        subtitle={strings.SO_YOU_DONT_NEED_TO_CONFIRM}
      />
      <BiometryAnimation
        biometryType={biometryType}
        handleAuthenticate={handleAuthenticate}
      />
      <JoloText
        kind={JoloTextKind.subtitle}
        size={JoloTextSizes.middle}
        color={Colors.activity}
        customStyles={{ paddingHorizontal: 25, opacity: 0.8 }}
      >
        {strings.TAP_TO_ACTIVATE}
      </JoloText>
      <AbsoluteBottom>
        <Btn type={BtnTypes.secondary} onPress={handleRedirectToLogin}>
          {strings.SKIP}
        </Btn>
      </AbsoluteBottom>
    </ScreenContainer>
  )
}

export default RegisterBiometry
