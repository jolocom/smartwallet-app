import React, { useEffect } from 'react'
import { createStackNavigator } from '@react-navigation/stack'
import Biometry from 'react-native-biometrics'

import { ScreenNames } from '~/types/screens'

import DeviceAuthContextProvider, {
  useDeviceAuthDispatch,
  useDeviceAuthState,
} from './module/deviceAuthContext'
import { setBiometryType } from './module/deviceAuthActions'
import RegisterPin from './RegisterPin'
import RegisterBiometry from './RegisterBiometry'
import { useBiometry } from '~/hooks/biometry'

const Stack = createStackNavigator()

const DeviceAuthentication: React.FC = () => {
  const dispatch = useDeviceAuthDispatch()
  const { isPasscodeView } = useDeviceAuthState()
  const {getEnrolledBiometry} = useBiometry();

  // on this step we check wether user device supports biometrics
  useEffect(() => {
    const getAuthenticationType = async () => {
      try {
        const { available, biometryType } = await getEnrolledBiometry()
        if (available) {
          dispatch(setBiometryType(biometryType))
        } else {
          setBiometryType(null)
        }
      } catch (e) {
        dispatch(setBiometryType(null))
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
