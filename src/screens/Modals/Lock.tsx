import React, { useCallback, useEffect } from 'react'
import { useBackHandler } from '@react-native-community/hooks'
import { useNavigation } from '@react-navigation/native'

import { strings } from '~/translations/strings'

import ScreenContainer from '~/components/ScreenContainer'

import { useGetStoredAuthValues } from '~/hooks/deviceAuth'

import { useDispatch } from 'react-redux'
import { setAppLocked } from '~/modules/account/actions'
import { useBiometry } from '~/hooks/biometry'
import Passcode from '~/components/Passcode'

const Lock = () => {
  const {
    keychainPin,
    isBiometrySelected,
    isLoadingStorage,
  } = useGetStoredAuthValues()

  const dispatch = useDispatch()
  const { authenticate, getEnrolledBiometry } = useBiometry()

  const navigation = useNavigation()

  const unlockApp = useCallback(() => {
    dispatch(setAppLocked(false))
    navigation.goBack()
  }, [])

  /* START -> Biometry authentication if applicatble */
  /* this will only be invoked if we stored biometry */
  const handleBiometryAuthentication = async () => {
    try {
      /* in case user disabled biometrics we don't want to run authenticate */
      const { available, biometryType } = await getEnrolledBiometry()

      if (available) {
        const { success } = await authenticate(biometryType)
        if (success) {
          unlockApp()
        }
        // else {
        //   pinInputRef.current?.focus()
        // }
      }
    } catch (err) {
      console.log('Error in authenticating with biometry on Lock', { err })
    }
  }

  useEffect(() => {
    const promptBiometry = async () => {
      if (isBiometrySelected) {
        await handleBiometryAuthentication()
      }
    }
    promptBiometry()
  }, [isBiometrySelected])
  /* START -> Biometry authentication if applicatble */

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
