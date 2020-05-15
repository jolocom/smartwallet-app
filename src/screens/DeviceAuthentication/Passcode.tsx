import React from 'react'
import ScreenContainer from '~/components/ScreenContainer'

import Header from '~/components/Header'
import PasscodeInput from '~/components/PasscodeInput'

const Passcode = () => {
  return (
    <ScreenContainer>
      <Header>Passcode</Header>
      <PasscodeInput />
    </ScreenContainer>
  )
}

export default Passcode
