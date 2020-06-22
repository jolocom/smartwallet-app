import React, { useRef } from 'react'

import Btn from '~/components/Btn'
import Header from '~/components/Header'

import ScreenContainer from '~/components/ScreenContainer'
import ReceiveCredential from './ReceiveSingleCredential'

const Scanner: React.FC = () => {
  const receiveCredential = () => {
    actionSheetRef.current?.setModalVisible(true)
  }
  const actionSheetRef = useRef(null)

  return (
    <ScreenContainer>
      <Header>Scanner</Header>
      <Btn onPress={receiveCredential}>Receive single credential</Btn>
      <ReceiveCredential
        ref={actionSheetRef}
        title="You recieved an ID Card"
        description="Good news, your request was successful and you have recieved the necessary document. Dont forget to save it!"
      />
    </ScreenContainer>
  )
}

export default Scanner
