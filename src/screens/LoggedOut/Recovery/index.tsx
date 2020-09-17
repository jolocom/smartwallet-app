import React from 'react'
import {
  ScrollView,
  View,
  StyleSheet,
  InputAccessoryView,
  Platform,
} from 'react-native'

import ScreenContainer from '~/components/ScreenContainer'

import RecoveryHeader from './RecoveryHeader'
import RecoveryFooter from './RecoveryFooter'

import RecoveryContextProvider from './module/recoveryContext'
import SeedKeyInput from './SeedKeyInput'
import SeedKeySuggestions from './SeedKeySuggestions'

const Recovery: React.FC = () => {
  return (
    <>
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
      {Platform.OS === 'ios' && (
        <InputAccessoryView nativeID="suggestions">
          <View style={{ marginBottom: 10 }}>
            <SeedKeySuggestions />
          </View>
        </InputAccessoryView>
      )}
    </>
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
