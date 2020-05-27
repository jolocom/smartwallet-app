import React, { useState } from 'react'
import TouchID from 'react-native-touch-id'
import Keychain from 'react-native-keychain'
import { View } from 'react-native'
import AsyncStorage from '@react-native-community/async-storage'

import ScreenContainer from '~/components/ScreenContainer'
import Header, { HeaderSizes } from '~/components/Header'
import Paragraph from '~/components/Paragraph'
import Btn, { BtnTypes } from '~/components/Btn'
import BtnGroup from '~/components/BtnGroup'

import { strings } from '~/translations/strings'
import { TouchableOpacity } from 'react-native'
import { Colors } from '~/utils/colors'
import useSuccessProtection from './useSuccessProtection'
import TouchIdIcon from '~/assets/svg/TouchIdIcon'
import FaceIdIcon from '~/assets/svg/FaceIdIcon'
import Ripple from '~/components/Ripple'
import useRedirectTo from '~/hooks/useRedirectTo'
import { ScreenNames } from '~/types/screens'
import { useDeviceAuthState } from './module/context'

interface BiometricsPropsI {
  authType: string
}

const authConfig = {
  title: 'Authentication Required',
  fallbackLabel: '',
  passcodeFallback: false,
}

const Biometrics: React.FC<BiometricsPropsI> = ({ authType }) => {
  const [error, setError] = useState(null)

  const handleProtectionSet = useSuccessProtection()
  const biometryType = useDeviceAuthState()

  const redirectToLoggedIn = useRedirectTo(ScreenNames.LoggedIn)

  const authenticate = async () => {
    setError(null)
    try {
      const isAuthenticated = await TouchID.authenticate(
        strings.TO_PROTECT_YOUR_DATA_AND_CONFIDENTIALITY,
        authConfig,
      )

      // if biometrics from device match
      if (isAuthenticated) {
        handleProtectionSet()

        await AsyncStorage.setItem('preferedLocalAuthType', biometryType || '')
      }
    } catch (e) {
      setError(e.message)
    }
  }

  return (
    <ScreenContainer customStyles={{ justifyContent: 'space-between' }}>
      <View>
        <Header size={HeaderSizes.small}>
          {strings.USE_ID_TO_AUTHORIZE(authType)}
        </Header>
        <Paragraph color={Colors.white70}>
          {strings.SO_YOU_DONT_NEED_TO_CONFIRM}
        </Paragraph>
      </View>
      <TouchableOpacity onPress={authenticate}>
        <View
          style={{
            position: 'absolute',
            top: 0,
            bottom: 0,
            left: 0,
            right: 0,
            justifyContent: 'center',
            alignItems: 'center',
          }}
        >
          <Ripple
            color={Colors.activity}
            initialValue1={5}
            maxValue1={15}
            maxValue2={15}
          />
        </View>
        {authType === Keychain.BIOMETRY_TYPE.FACE_ID ? (
          <FaceIdIcon />
        ) : (
          <TouchIdIcon />
        )}
      </TouchableOpacity>
      <Paragraph color={Colors.success}>
        {strings.TAP_TO_ACTIVATE(authType)}
      </Paragraph>
      {error && <Paragraph color={Colors.error}>{error}</Paragraph>}
      <BtnGroup>
        <Btn type={BtnTypes.secondary} onPress={redirectToLoggedIn}>
          {strings.SKIP}
        </Btn>
      </BtnGroup>
    </ScreenContainer>
  )
}

export default Biometrics
