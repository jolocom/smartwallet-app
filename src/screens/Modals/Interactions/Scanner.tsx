import React, { useRef } from 'react'
import ActionSheet from 'react-native-actions-sheet'

import Btn from '~/components/Btn'
import Header from '~/components/Header'

import ScreenContainer from '~/components/ScreenContainer'
import SingleCredential from './SingleCredential'
import MultipleCredentials from './MultipleCredentials'

const Scanner: React.FC = () => {
  const actionSheetSingleRef = useRef<ActionSheet>(null)
  const actionSheetMultipleRef = useRef<ActionSheet>(null)

  const openSingleCredential = () => {
    actionSheetSingleRef.current?.setModalVisible(true)
  }

  const openMultipleCredential = () => {
    actionSheetMultipleRef.current?.setModalVisible(true)
  }

  return (
    <ScreenContainer>
      <Header>Scanner</Header>
      <Btn onPress={openSingleCredential}>Receive single credential</Btn>
      <Btn onPress={openMultipleCredential}>Receive multiple credentials</Btn>
      <SingleCredential
        ref={actionSheetSingleRef}
        title="You recieved an ID Card"
        description="Good news, your request was successful and you have recieved the necessary document. Dont forget to save it!"
        ctaText="Receive"
      />
      <MultipleCredentials
        ref={actionSheetMultipleRef}
        ctaText="Receive"
        title="Name of Service"
        description="Choose one or more documents provided by this
 service and we will generate them for you"
      />
    </ScreenContainer>
  )
}

export default Scanner
