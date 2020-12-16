import React from 'react'
import Passcode from '~/components/Passcode'
import ScreenContainer from '~/components/ScreenContainer'
import { strings } from '~/translations'

const PasscodeTest = () => {
  const handleSubmit = async (pin: string) => {
    setTimeout(() => {
      console.log('Submitting pin', { pin })
    }, 1000)
  }

  return (
    <ScreenContainer
      hasHeaderBack
      customStyles={{ justifyContent: 'flex-start' }}
    >
      <Passcode onSubmit={handleSubmit}>
        <Passcode.Header title={strings.ENTER_YOUR_PASSCODE} />
        <Passcode.Input />
        <Passcode.Forgot />
      </Passcode>
    </ScreenContainer>
  )
}

export default PasscodeTest
