import React, { useState, useCallback, Dispatch, SetStateAction } from 'react'
import { View } from 'react-native'

import Header, { HeaderSizes } from '~/components/Header'
import ScreenContainer from '~/components/ScreenContainer'
import PasscodeInput from '~/components/PasscodeInput'
import { strings } from '~/translations/strings'
import { Colors } from '~/utils/colors'
import Paragraph from '~/components/Paragraph'

const PASSCODE_LENGTH = new Array(4).fill(0)

type addPasscodeFnT = (prevState: string, passcode?: string) => string
type removePasscodeFnT = (prevState: string) => string

const Passcode = () => {
  const [isCreating, setIsCreating] = useState(true)
  const [passcode, setPasscode] = useState('')
  const [verifiedPasscode, setVerifiedPasscode] = useState('')

  // a callback function that is passed (when we changing passcode) to setPasscode or setVerifiedPasscode
  const addToPasscodeCb: addPasscodeFnT = (prevState, passcode) => {
    // if (prevState.length >= PASSCODE_LENGTH.length) return prevState
    return (prevState + passcode).slice(0, PASSCODE_LENGTH.length)
  }

  // a callback function that is passed (when we removing digits from passcode) to setPasscode or setVerifiedPasscode
  const removeFromPasscodeCb: removePasscodeFnT = (prevState) =>
    prevState.slice(0, prevState.length - 1)

  // the first parameter is a setter function of passcode or verifiedPasscode, the second is deciding to add or to remove from/to passcode
  const updatePasscode = (
    passcodeManipulationFn: addPasscodeFnT | removePasscodeFnT,
  ) => {
    return (passcodeUpdaterFn: Dispatch<SetStateAction<string>>) => {
      return (passcode?: string) => {
        passcodeUpdaterFn((prevState: string) =>
          passcodeManipulationFn(prevState, passcode),
        )
      }
    }
  }

  const addToPasscode = updatePasscode(addToPasscodeCb)
  const removeFromPasscode = updatePasscode(removeFromPasscodeCb)

  const handleAddingPasscode = addToPasscode(setPasscode)
  const handleAddingVerifiedPasscode = addToPasscode(setVerifiedPasscode)

  const handleRemovingPasscode = removeFromPasscode(setPasscode)
  const handleRemovingVerifiedPasscode = removeFromPasscode(setVerifiedPasscode)

  const handlePasscodeSubmit = useCallback(() => {
    setIsCreating(false)
  }, [])

  const handleVerifiedPasscodeSubmit = () => {
    console.log('Saving to the keychain')
  }

  return (
    <ScreenContainer
      customStyles={{ justifyContent: 'flex-start', paddingTop: 30 }}
    >
      <Header size={HeaderSizes.small} color={Colors.white90}>
        {isCreating ? strings.CREATE_PASSCODE : strings.VERIFY_PASSCODE}
      </Header>
      <Paragraph color={Colors.white70} customStyles={{ marginHorizontal: 10 }}>
        {isCreating
          ? strings.IN_ORDER_TO_PROTECT_YOUR_DATA
          : strings.YOU_WONT_BE_ABLE_TO_EASILY_CHECK_IT_AGAIN}
      </Paragraph>
      <View style={{ marginTop: '30%' }}>
        {isCreating ? (
          <PasscodeInput
            value={passcode}
            onAdd={handleAddingPasscode}
            onRemove={handleRemovingPasscode}
            onSubmit={() => handlePasscodeSubmit()}
          />
        ) : (
          <PasscodeInput
            value={verifiedPasscode}
            onAdd={handleAddingVerifiedPasscode}
            onRemove={handleRemovingVerifiedPasscode}
            onSubmit={handleVerifiedPasscodeSubmit}
          />
        )}
      </View>
    </ScreenContainer>
  )
}

export default Passcode
