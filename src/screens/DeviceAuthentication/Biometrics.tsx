import React, { useState } from 'react'
import TouchID from 'react-native-touch-id'
import Keychain from 'react-native-keychain'
import { View } from 'react-native'

import ScreenContainer from '~/components/ScreenContainer'
import Header, { HeaderSizes } from '~/components/Header'
import Paragraph from '~/components/Paragraph'
import Btn from '~/components/Btn'
import BtnGroup from '~/components/BtnGroup'

import { strings } from '~/translations/strings'
import { useDeviceAuthDispatch } from './module/context'
import { TouchableOpacity } from 'react-native'
import { Colors } from '~/utils/colors'
import useSuccessProtection from './useSuccessProtection'
import TouchIdIcon from '~/assets/svg/TouchIdIcon'
import FaceIdIcon from '~/assets/svg/FaceIdIcon'
import Ripple from '~/components/Ripple'

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

  const dispatch = useDeviceAuthDispatch()

  const handleProtectionSet = useSuccessProtection()

  const fallbackToPasscode = () => {
    dispatch(null)
  }

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

        //TODO: store prefered DeviceAuth method somewhere.
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
        <Btn onPress={fallbackToPasscode}>{strings.I_WILL_RATHER_SET_PIN}</Btn>
      </BtnGroup>
    </ScreenContainer>
  )
}

export default Biometrics
