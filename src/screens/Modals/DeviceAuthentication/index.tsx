import React, { useEffect } from 'react'
import { createStackNavigator } from '@react-navigation/stack'
import Biometry from 'react-native-biometrics'

import { ScreenNames } from '~/types/screens'

import DeviceAuthContextProvider, {
  useDeviceAuthDispatch,
  useDeviceAuthState,
} from './module/deviceAuthContext'
import { setBiometryType } from './module/deviceAuthActions'
import CreateWalletPin from './CreateWalletPin'
import WalletBiometry from './WalletBiometry'
import { useBiometry } from '~/hooks/biometry'

const WalletAuthenticationStack = createStackNavigator()

const DeviceAuthentication: React.FC = () => {
  const dispatch = useDeviceAuthDispatch()
  const { isPasscodeView } = useDeviceAuthState()
  const { getEnrolledBiometry } = useBiometry()

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
    <WalletAuthenticationStack.Navigator headerMode="none">
      {isPasscodeView ? (
        <WalletAuthenticationStack.Screen
          name={ScreenNames.CreateWalletPin}
          component={CreateWalletPin}
        />
      ) : (
        <WalletAuthenticationStack.Screen
          name={ScreenNames.WalletBiometry}
          component={WalletBiometry}
        />
      )}
    </WalletAuthenticationStack.Navigator>
  )
}

export default function () {
  return (
    <DeviceAuthContextProvider>
      <DeviceAuthentication />
    </DeviceAuthContextProvider>
  )
}
