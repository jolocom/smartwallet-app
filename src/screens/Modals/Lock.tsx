import React, { useCallback } from 'react'
import { useBackHandler } from '@react-native-community/hooks'

import { strings } from '~/translations/strings'

import ScreenContainer from '~/components/ScreenContainer'

import { useGetStoredAuthValues } from '~/hooks/deviceAuth'

import { useDispatch } from 'react-redux'
import { setAppLocked } from '~/modules/account/actions'
import { useBiometry } from '~/hooks/biometry'
import Passcode from '~/components/Passcode'
import { useAppState } from '~/hooks/useAppState';
import { AppStateStatus, Platform } from 'react-native';

const Lock = () => {
  const dispatch = useDispatch()
  const { keychainPin, isBiometrySelected } = useGetStoredAuthValues()
  const { authenticate, getEnrolledBiometry } = useBiometry();

  const unlockApp = useCallback(() => {
    dispatch(setAppLocked(false))
  }, [])

  // do not run biometry authentication when the app is in the background
  useAppState((appState: AppStateStatus, nextAppState: AppStateStatus) => {
    if (Platform.OS === 'ios' && appState.match(/background/) && nextAppState.match(/active/)) {
      promptBiometry()
    }
    appState = nextAppState
  })

  const handleBiometryAuthentication = async () => {
    try {
      /* in case user disabled biometrics we don't want to run authenticate */
      const { available, biometryType } = await getEnrolledBiometry()

      if (available) {
        const { success } = await authenticate(biometryType)
        if (success) {
          unlockApp()
        }
      }
    } catch (err) {
      console.log('Error in authenticating with biometry on Lock', { err })
    }
  }
  const promptBiometry = useCallback(async () => {
    try {
      if (isBiometrySelected) {
        await handleBiometryAuthentication()
      }
    } catch (e) {
      console.log('Prompting biometry has failed', {e});
      
    }
  }, [isBiometrySelected])


  /* disable hardwareback button default functionality */
  useBackHandler(() => true)

  const handlePINSubmit = (pin: string) => {
    if (keychainPin.toString() === pin) {
      unlockApp()
    } else {
      throw new Error("Pins don't match")
    }
  }

  return (
    <ScreenContainer
      customStyles={{
        marginTop: '20%',
        justifyContent: 'flex-start',
      }}
    >
      <Passcode onSubmit={handlePINSubmit}>
        <Passcode.Header
          title={strings.ENTER_YOUR_PASSCODE}
          errorTitle={strings.WRONG_PASSCODE}
        />
        <Passcode.Input />
        <Passcode.Forgot />
      </Passcode>
    </ScreenContainer>
  )
}

export default Lock
