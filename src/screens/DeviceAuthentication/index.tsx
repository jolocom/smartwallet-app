import React, { useEffect, useState } from 'react'
import { createStackNavigator } from '@react-navigation/stack'
import Keychain from 'react-native-keychain'

import { ScreenNames } from '~/types/screens'

import Passcode from './Passcode'
import TouchId from './TouchId'
import FaceId from './FaceId'
import Fingerprint from './Fingerprint'

import DeviceAuthContextProvider, {
  useDeviceAuthDispatch,
  useDeviceAuthState,
} from './module/context'

const Stack = createStackNavigator()

const DeviceAuthentication: React.FC = () => {
  const supportedDeviceAuthType = useDeviceAuthState()
  const dispatch = useDeviceAuthDispatch()

  useEffect(() => {
    const getAuthenticationType = async () => {
      try {
        const authenticationType = await Keychain.getSupportedBiometryType()
        dispatch(authenticationType)
      } catch (e) {
        dispatch(null)
      }
    }

    getAuthenticationType()
  }, [])

  return (
    <Stack.Navigator headerMode="none">
      {supportedDeviceAuthType === Keychain.BIOMETRY_TYPE.TOUCH_ID && (
        <Stack.Screen name={ScreenNames.TouchId} component={TouchId} />
      )}
      {supportedDeviceAuthType === Keychain.BIOMETRY_TYPE.FACE_ID && (
        <Stack.Screen name={ScreenNames.FaceId} component={FaceId} />
      )}
      {supportedDeviceAuthType === Keychain.BIOMETRY_TYPE.FINGERPRINT && (
        <Stack.Screen name={ScreenNames.Fingerprint} component={Fingerprint} />
      )}
      {!supportedDeviceAuthType && (
        <Stack.Screen name={ScreenNames.Passcode} component={Passcode} />
      )}
    </Stack.Navigator>
  )
}

export default function () {
  return (
    <DeviceAuthContextProvider>
      <DeviceAuthentication />
    </DeviceAuthContextProvider>
  )
}
