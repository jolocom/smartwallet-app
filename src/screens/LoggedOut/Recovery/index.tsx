import React from 'react'
import { KeyboardAvoidingView } from 'react-native'

import ScreenContainer from '~/components/ScreenContainer'

import RecoveryHeader from './RecoveryHeader'
import RecoveryFooter from './RecoveryFooter'

import RecoveryContextProvider from './module/recoveryContext'
import SeedKeyInput from './SeedKeyInput'

const Recovery: React.FC = () => {
  return (
    <KeyboardAvoidingView style={{ flex: 1 }} behavior="padding">
      <ScreenContainer
        customStyles={{
          justifyContent: 'flex-start',
        }}
      >
        <RecoveryHeader />
        <SeedKeyInput />
        <RecoveryFooter />
      </ScreenContainer>
    </KeyboardAvoidingView>
  )
}

export default function () {
  return (
    <RecoveryContextProvider>
      <Recovery />
    </RecoveryContextProvider>
  )
}
