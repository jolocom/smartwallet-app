import React, { useEffect } from 'react'
import { createStackNavigator } from '@react-navigation/stack'
import Keychain from 'react-native-keychain'

import { ScreenNames } from '~/types/screens'

import Passcode from './Passcode'
import Biometry from './Biometry'

import DeviceAuthContextProvider, {
  useDeviceAuthDispatch,
  useDeviceAuthState,
} from './module/deviceAuthContext'
import { setBiometryType } from './module/deviceAuthActions'

const Stack = createStackNavigator()

const DeviceAuthentication: React.FC = () => {
  const dispatch = useDeviceAuthDispatch()
  const { isPasscodeView } = useDeviceAuthState()

  // on this step we chceck wether user device supports biometrics
  useEffect(() => {
    const getAuthenticationType = async () => {
      try {
        const authenticationType = await Keychain.getSupportedBiometryType()
        dispatch(setBiometryType(authenticationType))
      } catch (e) {
        dispatch(setBiometryType(null))
      }
    }

    getAuthenticationType()
  }, [])

  return (
    <Stack.Navigator headerMode="none">
      {isPasscodeView ? (
        <Stack.Screen name={ScreenNames.Passcode} component={Passcode} />
      ) : (
        <Stack.Screen name={ScreenNames.Biometry} component={Biometry} />
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
