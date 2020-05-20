import React, { useState, useCallback } from 'react'
import { View, ActivityIndicator } from 'react-native'

import Header, { HeaderSizes } from '~/components/Header'
import ScreenContainer from '~/components/ScreenContainer'
import PasscodeInput from '~/components/PasscodeInput'
import { strings } from '~/translations/strings'
import { Colors } from '~/utils/colors'
import Paragraph from '~/components/Paragraph'
import useDelay from '~/hooks/useDelay'

const Passcode = () => {
  const [isCreating, setIsCreating] = useState(true) // to display create passcode or verify passcode
  const [passcode, setPasscode] = useState('')
  const [verifiedPasscode, setVerifiedPasscode] = useState('')
  const [showLoading, setShowLoading] = useState(false) // to immitate loading after passcode was submit and before redirecting to verifies passcode
  const [hasError, setHasError] = useState(false) // to indicate if verifiedPasscode doesn't match passcode

  const showVerification = () => {
    setIsCreating(false)
    setShowLoading(false)
  }

  const handlePasscodeSubmit = useCallback(async () => {
    setShowLoading(true)
    await useDelay(showVerification, 1000)
  }, [])

  const handleVerifiedPasscodeSubmit = () => {
    if (passcode === verifiedPasscode) {
      console.log('Saving to the keychain')
    } else {
      setHasError(true)
    }
  }

  return (
    <ScreenContainer
      customStyles={{
        justifyContent: 'flex-start',
        paddingTop: 30,
      }}
    >
      <Header size={HeaderSizes.small} color={Colors.white90}>
        {isCreating ? strings.CREATE_PASSCODE : strings.VERIFY_PASSCODE}
      </Header>
      <Paragraph color={Colors.white70} customStyles={{ marginHorizontal: 10 }}>
        {isCreating
          ? strings.IN_ORDER_TO_PROTECT_YOUR_DATA
          : strings.YOU_WONT_BE_ABLE_TO_EASILY_CHECK_IT_AGAIN}
      </Paragraph>
      {isCreating ? (
        <PasscodeInput
          value={passcode}
          stateUpdaterFn={setPasscode}
          onSubmit={handlePasscodeSubmit}
        />
      ) : (
        <PasscodeInput
          value={verifiedPasscode}
          stateUpdaterFn={setVerifiedPasscode}
          onSubmit={handleVerifiedPasscodeSubmit}
          hasError={hasError}
        />
      )}
      {showLoading && <ActivityIndicator />}
      {hasError && (
        <Paragraph color={Colors.error}>Passcodes don't match</Paragraph>
      )}
    </ScreenContainer>
  )
}

export default Passcode
