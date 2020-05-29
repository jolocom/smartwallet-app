import React, { useEffect } from 'react'
import { createStackNavigator } from '@react-navigation/stack'
import Keychain from 'react-native-keychain'

import { ScreenNames } from '~/types/screens'

import Passcode from './Passcode'
import TouchId from './TouchId'
import FaceId from './FaceId'
import Fingerprint from './Fingerprint'

import DeviceAuthContextProvider, {
  useDeviceAuthDispatch,
} from './module/context'

const Stack = createStackNavigator()

const DeviceAuthentication: React.FC = () => {
  const dispatch = useDeviceAuthDispatch()

  // on this step we chceck wether user device supports biometrics
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
      <Stack.Screen name={ScreenNames.Passcode} component={Passcode} />
      <Stack.Screen name={ScreenNames.TouchId} component={TouchId} />
      <Stack.Screen name={ScreenNames.FaceId} component={FaceId} />
      <Stack.Screen name={ScreenNames.Fingerprint} component={Fingerprint} />
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
