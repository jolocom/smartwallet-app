import React, { useCallback, useEffect, useRef } from 'react'
import { useBackHandler } from '@react-native-community/hooks'

import { strings } from '~/translations/strings'

import ScreenContainer from '~/components/ScreenContainer'

import { useGetStoredAuthValues } from '~/hooks/deviceAuth'

import { useDispatch } from 'react-redux'
import { setAppLocked } from '~/modules/account/actions'
import { useBiometry } from '~/hooks/biometry'
import Passcode from '~/components/Passcode'
import { useAppStateNew } from '~/hooks/useAppState'

const Lock = () => {
  const dispatch = useDispatch()
  const { keychainPin, isBiometrySelected } = useGetStoredAuthValues()
  const { authenticate, getEnrolledBiometry } = useBiometry();

  // TODO: remove deprecate useAppState
  const { currentAppState, prevAppState } = useAppStateNew();

  const promptedTimes = useRef(0)

  useEffect(() => {
    if (isBiometrySelected) { 
      if ((currentAppState === 'active' && prevAppState === 'active') || currentAppState === 'active' && prevAppState === 'background') {
        promptedTimes.current += 1;
        if (promptedTimes.current === 1) {
          handleBiometryAuthentication()
        }
      }
    }
  }, [currentAppState, prevAppState, isBiometrySelected])
  
  const unlockApp = useCallback(() => {
    dispatch(setAppLocked(false))
  }, [])
    
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
