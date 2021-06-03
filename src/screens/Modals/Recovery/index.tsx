import React from 'react'
import {
  ScrollView,
  View,
  StyleSheet,
  InputAccessoryView,
  Platform,
  LayoutChangeEvent,
} from 'react-native'
import { setScreenHeight } from '~/modules/account/actions'

import ScreenContainer from '~/components/ScreenContainer'

import RecoveryHeader from './RecoveryHeader'
import RecoveryFooter from './RecoveryFooter'

import RecoveryContextProvider from './module/recoveryContext'
import SeedKeyInput from './SeedKeyInput'
import SeedKeySuggestions from './SeedKeySuggestions'
import { useDispatch } from 'react-redux'

const Recovery: React.FC = () => {
  const dispatch = useDispatch()
  const handleLayout = (e: LayoutChangeEvent) => {
    const { height } = e.nativeEvent.layout
    dispatch(setScreenHeight(height))
  }
  return (
    <>
      <ScrollView
        keyboardShouldPersistTaps="handled"
        contentContainerStyle={{ flex: 1 }}
        scrollEnabled={false} // to prevent pulling up and down the screen
        onLayout={handleLayout}
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
          <View style={{ marginBottom: 10, marginLeft: 10 }}>
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
