import React from 'react'
import { ScrollView, View, StyleSheet } from 'react-native'

import ScreenContainer from '~/components/ScreenContainer'

import RecoveryHeader from './RecoveryHeader'
import RecoveryFooter from './RecoveryFooter'

import RecoveryContextProvider from './module/recoveryContext'
import SeedKeyInput from './SeedKeyInput'

const Recovery: React.FC = () => {
  return (
    <ScrollView
      keyboardShouldPersistTaps="handled"
      contentContainerStyle={{ flex: 1 }}
    >
      <ScreenContainer
        customStyles={{
          justifyContent: 'space-between',
        }}
      >
        <View style={styles.headerContainer}>
          <RecoveryHeader />
          <SeedKeyInput />
        </View>
        <RecoveryFooter />
      </ScreenContainer>
    </ScrollView>
  )
}

const styles = StyleSheet.create({
  headerContainer: {
    flex: 1,
    width: '100%',
  },
})

export default function () {
  return (
    <RecoveryContextProvider>
      <Recovery />
    </RecoveryContextProvider>
  )
}
