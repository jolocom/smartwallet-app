import React from 'react'
import Passcode from '~/components/Passcode'
import ScreenContainer from '~/components/ScreenContainer'
import { strings } from '~/translations'

const PasscodeTest = () => {
  const handleSubmit = async (pin: string): Promise<any> => {
    return new Promise((res, rej) => {
      setTimeout(() => {
        res('success')
        rej('ooops')
      }, 100)
    })
  }

  return (
    <ScreenContainer
      hasHeaderBack
      customStyles={{ justifyContent: 'flex-start' }}
    >
      <Passcode onSubmit={handleSubmit}>
        <Passcode.Header
          title={strings.ENTER_YOUR_PASSCODE}
          errorTitle={'Wrong'}
        />
        <Passcode.Input />
        <Passcode.ExtraAction onPress={() => {}}>
          {'Passcode extra action'}
        </Passcode.ExtraAction>
      </Passcode>
    </ScreenContainer>
  )
}

export default PasscodeTest
