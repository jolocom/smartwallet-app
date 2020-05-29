import React, { useEffect } from 'react'
import Keychain from 'react-native-keychain'
import { View, Alert, Linking } from 'react-native'
import AsyncStorage from '@react-native-community/async-storage'
import {
  BIOMETRY_USERNAME,
  BIOMETRY_PASSWORD,
  BIOMETRY_SERVICE,
} from 'react-native-dotenv'

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
import useResetKeychainValues from '~/hooks/useResetKeychainValues'

interface BiometricsPropsI {
  authType: string
}

const Biometrics: React.FC<BiometricsPropsI> = ({ authType }) => {
  const handleProtectionSet = useSuccessProtection()
  const biometryType = useDeviceAuthState()

  const redirectToLoggedIn = useRedirectTo(ScreenNames.LoggedIn)

  const resetServiceValuesInKeychain = useResetKeychainValues(
    //@ts-ignore
    process.env['BIOMETRY_SERVICE'],
  )

  // 🧨🧨🧨🧨🧨
  // this is only for testing purposes !!! should be removed later on
  // this will delete credentials associated with a service name
  useEffect(() => {
    resetServiceValuesInKeychain()
  }, [])
  // 🧨🧨🧨🧨🧨

  const authenticate = async () => {
    try {
      const biometryAuthValue = await Keychain.setGenericPassword(
        //@ts-ignore
        BIOMETRY_USERNAME,
        BIOMETRY_PASSWORD,
        {
          service: BIOMETRY_SERVICE,
          accessControl: Keychain.ACCESS_CONTROL.BIOMETRY_ANY,
          accessible: Keychain.ACCESSIBLE.WHEN_UNLOCKED,
        },
      )
      if (biometryAuthValue) {
        await AsyncStorage.setItem('biometry', biometryType || '')
        handleProtectionSet()
      }
    } catch (err) {
      Alert.alert(
        strings.BIOMETRY_IS_DISABLED(biometryType),
        strings.TO_USE_BIOMETRICS_ENABLE,
        [
          {
            text: 'Settings',
            onPress: () => Linking.openSettings(),
          },
          {
            text: 'Cancel',
            onPress: () => console.log('Cancel Pressed'),
            style: 'cancel',
          },
        ],
        { cancelable: false },
      )
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
      <BtnGroup>
        <Btn type={BtnTypes.secondary} onPress={redirectToLoggedIn}>
          {strings.SKIP}
        </Btn>
      </BtnGroup>
    </ScreenContainer>
  )
}

export default Biometrics
