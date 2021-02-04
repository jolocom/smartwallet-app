import React from 'react'
import { useBackHandler } from '@react-native-community/hooks'
import { useDispatch } from 'react-redux'

import ScreenContainer from '~/components/ScreenContainer'
import Btn, { BtnTypes } from '~/components/Btn'
import AbsoluteBottom from '~/components/AbsoluteBottom'
import JoloText, { JoloTextKind } from '~/components/JoloText'
import ScreenHeader from '~/components/ScreenHeader'
import BiometryAnimation from '~/components/BiometryAnimation'

import { strings } from '~/translations/strings'
import { useSuccess } from '~/hooks/loader'
import { setPopup } from '~/modules/appState/actions'

import { useDeviceAuthState } from './module/deviceAuthContext'
import { useRedirectToLoggedIn } from '~/hooks/navigation'
import { getBiometryHeader } from './utils/getText'

import { Colors } from '~/utils/colors'
import { JoloTextSizes } from '~/utils/fonts'
import { useBiometry } from '~/hooks/biometry'

const RegisterBiometry: React.FC = () => {
  const { biometryType } = useDeviceAuthState()
  const { authenticate, setBiometry } = useBiometry()
  const displaySuccessLoader = useSuccess()

  const dispatch = useDispatch()

  const handleRedirectToLogin = useRedirectToLoggedIn()

  const handleAuthenticate = async () => {
    dispatch(setPopup(true))
    try {
      const result = await authenticate(biometryType)
      if (result.success) {
        setBiometry(biometryType)
        displaySuccessLoader(handleRedirectToLogin)
      }
    } catch (err) {
      console.log('Error authenticating with Biometrics in RegisterBiometry', {
        err,
      })
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
