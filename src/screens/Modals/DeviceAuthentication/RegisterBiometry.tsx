import React from 'react'
import AsyncStorage from '@react-native-community/async-storage'
import FingerprintScanner from 'react-native-fingerprint-scanner'

import ScreenContainer from '~/components/ScreenContainer'
import Btn, { BtnTypes } from '~/components/Btn'
import AbsoluteBottom from '~/components/AbsoluteBottom'

import { strings } from '~/translations/strings'

import useSuccess from '~/hooks/useSuccess'

import { Colors } from '~/utils/colors'

import { useDeviceAuthState } from '../DeviceAuthentication/module/deviceAuthContext'

import {
  getBiometryHeader,
  getBiometryActionText,
  getBiometryDescription,
} from '../DeviceAuthentication/utils/getText'
import BiometryAnimation from '~/components/BiometryAnimation'
import { handleNotEnrolled } from '~/utils/biometryErrors'
import { setPopup } from '~/modules/appState/actions'
import { useDispatch } from 'react-redux'
import { useRedirectToLoggedIn } from '../DeviceAuthentication/useRedirectToLoggedIn'
import ScreenHeader from '~/components/ScreenHeader'
import JoloText, { JoloTextKind } from '~/components/JoloText'
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
        color={Colors.success}
        customStyles={{ paddingHorizontal: 25 }}
      >
        {getBiometryActionText(biometryType)}
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
