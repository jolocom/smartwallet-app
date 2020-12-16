import React, { useCallback, useEffect, useRef, useState } from 'react'
import { View, StyleSheet, TextInput, ActivityIndicator } from 'react-native'
import { useBackHandler } from '@react-native-community/hooks'
import { useNavigation } from '@react-navigation/native'

import { strings } from '~/translations/strings'

import ScreenContainer from '~/components/ScreenContainer'
import PasscodeInput from '~/components/PasscodeInput'
import Btn, { BtnTypes } from '~/components/Btn'
import AbsoluteBottom from '~/components/AbsoluteBottom'
import JoloText, { JoloTextKind, JoloTextWeight } from '~/components/JoloText'

import { useKeyboard } from '~/screens/Modals/Recovery/useKeyboard'

import { useGetStoredAuthValues } from '~/hooks/deviceAuth'
import { useRedirectTo } from '~/hooks/navigation'

import { Colors } from '~/utils/colors'
import { JoloTextSizes } from '~/utils/fonts'

import { ScreenNames } from '~/types/screens'
import { useDispatch } from 'react-redux'
import { setAppLocked } from '~/modules/account/actions'
import { useBiometry } from '~/hooks/biometry'

const Lock = () => {
  const [pin, setPin] = useState('')
  const [hasError, setHasError] = useState(false)

  const {
    keychainPin,
    isBiometrySelected,
    isLoadingStorage,
  } = useGetStoredAuthValues()

  const { keyboardHeight } = useKeyboard()
  const dispatch = useDispatch()
  const { authenticate, getEnrolledBiometry } = useBiometry()

  const navigation = useNavigation()

  const redirectToPinRecoveryInstruction = useRedirectTo(
    ScreenNames.PinRecoveryInstructions,
  )

  const unlockApp = useCallback(() => {
    dispatch(setAppLocked(false))
    navigation.goBack()
  }, [])

  const pinInputRef = useRef<TextInput>(null)

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
        } else {
          pinInputRef.current?.focus()
        }
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

  useEffect(() => {
    if (pin.length < 4 && hasError) {
      setHasError(false)
    }
  }, [pin])

  const handlePINSubmit = () => {
    if (keychainPin.toString() === pin) {
      unlockApp()
    } else {
      setHasError(true)
      setTimeout(() => {
        setHasError(false)
        setPin('')
        pinInputRef.current?.focus()
      }, 1000)
    }
  }

  return (
    <ScreenContainer
      customStyles={{
        marginTop: '30%',
        justifyContent: 'flex-start',
      }}
    >
      <JoloText
        kind={JoloTextKind.title}
        size={JoloTextSizes.middle}
        weight={JoloTextWeight.regular}
        color={Colors.white90}
      >
        {strings.ENTER_YOUR_PASSCODE}
      </JoloText>
      {isLoadingStorage ? (
        <ActivityIndicator />
      ) : (
        <>
          <View style={styles.inputContainer}>
            <PasscodeInput
              value={pin}
              stateUpdaterFn={setPin}
              onSubmit={handlePINSubmit}
              hasError={hasError}
              errorStateUpdaterFn={setHasError}
              ref={pinInputRef}
            />
          </View>
          <AbsoluteBottom customStyles={{ bottom: keyboardHeight }}>
            <Btn
              type={BtnTypes.secondary}
              onPress={redirectToPinRecoveryInstruction}
            >
              {strings.FORGOT_YOUR_PIN}
            </Btn>
          </AbsoluteBottom>
        </>
      )}
    </ScreenContainer>
  )
}

const styles = StyleSheet.create({
  inputContainer: {
    marginTop: 20,
  },
})

export default Lock
