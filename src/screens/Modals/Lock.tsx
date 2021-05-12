import React, { useCallback, useEffect, useRef, useState } from 'react'
import { BackHandler } from 'react-native'
import { useBackHandler } from '@react-native-community/hooks'
import { BiometryType } from 'react-native-biometrics'

import { strings } from '~/translations/strings'

import ScreenContainer from '~/components/ScreenContainer'

import { useGetStoredAuthValues } from '~/hooks/deviceAuth'

import { useDispatch } from 'react-redux'
import { setAppLocked } from '~/modules/account/actions'
import { useBiometry } from '~/hooks/biometry'
import Passcode from '~/components/Passcode'
import { useGetAppStates } from '~/hooks/useAppState'
import { setPopup } from '~/modules/appState/actions'

const Lock = () => {
  const dispatch = useDispatch()
  const { keychainPin, isBiometrySelected } = useGetStoredAuthValues()
  const { authenticate, getEnrolledBiometry } = useBiometry()
  const [biometryType, setBiometryType] = useState<BiometryType>()
  const [biometryAvailable, setBiometryAvailable] = useState(false)

  const { currentAppState, prevAppState } = useGetAppStates()

  const promptedTimes = useRef(0)

  useBackHandler(() => {
    BackHandler.exitApp()
    return true
  })

  useEffect(() => {
    getEnrolledBiometry().then(({ available, biometryType }) => {
      setBiometryType(biometryType)
      setBiometryAvailable(available)
      if (available) {
        handleBiometryAuthentication()
      }
    })
  }, [])

  useEffect(() => {
    if (isBiometrySelected) {
      if (
        (currentAppState === 'active' && prevAppState === 'active') ||
        (currentAppState === 'active' && prevAppState === 'background')
      ) {
        promptedTimes.current += 1
        if (promptedTimes.current === 1) {
          handleBiometryAuthentication()
        }
      }
    }
  }, [currentAppState, prevAppState, isBiometrySelected, biometryAvailable])

  const unlockApp = useCallback(() => {
    dispatch(setAppLocked(false))
  }, [])

  const handleBiometryAuthentication = async () => {
    try {
      dispatch(setPopup(true))
      /* in case user disabled biometrics we don't want to run authenticate */
      if (biometryAvailable) {
        const { success } = await authenticate(biometryType)
        if (success) {
          unlockApp()
        }
      }
    } catch (err) {
      console.log('Error in authenticating with biometry on Lock', { err })
    } finally {
      dispatch(setPopup(false))
    }
  }

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
        justifyContent: 'flex-start',
      }}
    >
      <Passcode onSubmit={handlePINSubmit}>
        <Passcode.Container>
          <Passcode.Header
            title={strings.ENTER_YOUR_PASSCODE}
            errorTitle={strings.WRONG_PASSCODE}
          />
          <Passcode.Input />
        </Passcode.Container>
        <Passcode.Container>
          <Passcode.Forgot />
          <Passcode.Keyboard
            biometryType={isBiometrySelected ? biometryType : undefined}
            onBiometryPress={
              isBiometrySelected ? handleBiometryAuthentication : undefined
            }
          />
        </Passcode.Container>
      </Passcode>
    </ScreenContainer>
  )
}

export default Lock
