import React, { useEffect } from 'react'
import { createStackNavigator } from '@react-navigation/stack'

import { ScreenNames } from '~/types/screens'

import WalletAuthContextProvider, {
  useWalletAuthDispatch,
  useWalletAuthState,
} from './module/walletAuthContext'
import { setBiometryType } from './module/walletAuthActions'
import CreateWalletPin from './CreateWalletPin'
import WalletBiometry from './WalletBiometry'
import { useBiometry } from '~/hooks/biometry'

const WalletAuthenticationStack = createStackNavigator()

const WalletAuthentication: React.FC = () => {
  const dispatch = useWalletAuthDispatch()
  const { isPasscodeView } = useWalletAuthState()
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
    <WalletAuthContextProvider>
      <WalletAuthentication />
    </WalletAuthContextProvider>
  )
}
