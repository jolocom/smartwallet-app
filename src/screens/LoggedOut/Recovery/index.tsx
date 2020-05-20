import React from 'react'
import { KeyboardAvoidingView, Platform } from 'react-native'

import ScreenContainer from '~/components/ScreenContainer'

import RecoveryHeader from './RecoveryHeader'
import RecoveryFooter from './RecoveryFooter'

import RecoveryContextProvider, {
  useRecoveryState,
} from './module/recoveryContext'
import SeedKeyInput from './SeedKeyInput'

const Recovery: React.FC = () => {
  const recoveryState = useRecoveryState()
  const { areSuggestionsVisible } = recoveryState

  return (
    <KeyboardAvoidingView style={{ flex: 1 }} behavior="padding">
      <ScreenContainer
        customStyles={{
          ...Platform.select({
            android: {
              paddingTop: 20,
            },
            ios: {
              paddingTop: 50,
            },
          }),

          justifyContent: areSuggestionsVisible
            ? 'flex-start'
            : 'space-between',
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
