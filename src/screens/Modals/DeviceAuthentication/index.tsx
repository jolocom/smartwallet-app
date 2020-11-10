import React, { useEffect } from 'react'
import { createStackNavigator } from '@react-navigation/stack'

import { ScreenNames } from '~/types/screens'

import DeviceAuthContextProvider, {
  useDeviceAuthDispatch,
  useDeviceAuthState,
} from './module/deviceAuthContext'
import { setBiometryType } from './module/deviceAuthActions'
import RegisterPin from './RegisterPin'
import RegisterBiometry from './RegisterBiometry'
import FingerprintScanner from 'react-native-fingerprint-scanner'

const Stack = createStackNavigator()

const DeviceAuthentication: React.FC = () => {
  const dispatch = useDeviceAuthDispatch()
  const { isPasscodeView } = useDeviceAuthState()

  // on this step we check wether user device supports biometrics
  useEffect(() => {
    const getAuthenticationType = async () => {
      try {
        const type = await FingerprintScanner.isSensorAvailable()

        dispatch(setBiometryType(type))
      } catch (e) {
        console.log({ e })
        if (e?.name === 'FingerprintScannerNotEnrolled') {
          // fingerprint (biometry is reality) is available but is not enrolled
          dispatch(setBiometryType(null))
        } else if (
          e?.name === 'FingerprintScannerNotAvailable' ||
          e?.name === 'FingerprintScannerNotSupported'
        ) {
          // fingerprint (biometry is reality) is not supported
          dispatch(setBiometryType(null))
        }
      }
    }

    getAuthenticationType()
  }, [])

  return (
    <Stack.Navigator headerMode="none">
      {isPasscodeView ? (
        <Stack.Screen name={ScreenNames.RegisterPin} component={RegisterPin} />
      ) : (
        <Stack.Screen
          name={ScreenNames.RegisterBiometry}
          component={RegisterBiometry}
        />
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
