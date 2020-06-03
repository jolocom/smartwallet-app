import React, { useEffect } from 'react'
import { createStackNavigator } from '@react-navigation/stack'
import Keychain from 'react-native-keychain'

import { ScreenNames } from '~/types/screens'

import Passcode from './Passcode'
import Biometry from './Biometry'

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
      <Stack.Screen name={ScreenNames.Biometry} component={Biometry} />
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
