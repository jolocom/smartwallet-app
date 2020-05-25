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
import ScreenContainer from '~/components/ScreenContainer'
import { ActivityIndicator } from 'react-native'

const Stack = createStackNavigator()

const LoadingScreen = () => {
  return (
    <ScreenContainer>
      <ActivityIndicator />
    </ScreenContainer>
  )
}

const DeviceAuthentication: React.FC = () => {
  const [isLoading, setIsLoading] = useState(true)
  const supportedDeviceAuthType = useDeviceAuthState()
  const dispatch = useDeviceAuthDispatch()

  useEffect(() => {
    const getAuthenticationType = async () => {
      setIsLoading(true)
      try {
        const authenticationType = await Keychain.getSupportedBiometryType()
        dispatch(authenticationType)
      } catch (e) {
        dispatch(null)
      } finally {
        setIsLoading(false)
      }
    }

    getAuthenticationType()
  }, [])

  return (
    <Stack.Navigator headerMode="none">
      {isLoading && (
        <Stack.Screen name={ScreenNames.Loading} component={LoadingScreen} />
      )}
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
