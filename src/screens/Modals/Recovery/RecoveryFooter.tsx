import React, { useCallback, memo } from 'react'
import { Animated, Platform, StyleSheet } from 'react-native'
import {
  StackActions,
  useNavigation,
  useRoute,
  RouteProp,
} from '@react-navigation/native'
import { useDispatch } from 'react-redux'

import { setLogged, setDid } from '~/modules/account/actions'

import BtnGroup from '~/components/BtnGroup'
import Btn, { BtnTypes } from '~/components/Btn'
import AbsoluteBottom from '~/components/AbsoluteBottom'

import { strings } from '~/translations/strings'

import { useLoader } from '~/hooks/loader'
import { useAgent, useShouldRecoverFromSeed } from '~/hooks/sdk'

import Suggestions from './SeedKeySuggestions'
import useAnimateRecoveryFooter from './useAnimateRecoveryFooter'
import { useRecoveryState, useRecoveryDispatch } from './module/recoveryContext'
import { resetPhrase } from './module/recoveryActions'
import { useKeyboard } from './useKeyboard'
import { useResetKeychainValues } from '~/hooks/deviceAuth'
import { PIN_SERVICE } from '~/utils/keychainConsts'
import { ScreenNames } from '~/types/screens'
import { RootStackParamList } from '~/RootNavigation'
import { LoggedInStackParamList } from '~/screens/LoggedIn'

interface RecoveryFooterI {
  areSuggestionsVisible: boolean
  handlePhraseSubmit: () => void
  isPhraseComplete: boolean
}

const useRecoveryPhraseUtils = (phrase: string[]) => {
  const loader = useLoader()
  const recoveryDispatch = useRecoveryDispatch()
  const dispatch = useDispatch()

  const agent = useAgent()
  const shouldRecoverFromSeed = useShouldRecoverFromSeed(phrase)
  const resetPin = useResetKeychainValues(PIN_SERVICE)

  const route = useRoute<
    RouteProp<LoggedInStackParamList, ScreenNames.PasscodeRecovery>
  >()
  const navigation = useNavigation()

  const isAccessRestore = route?.params?.isAccessRestore ?? false

  const handlePhraseSubmit = useCallback(async () => {
    const success = await loader(async () => await submitCb(), {
      loading: strings.MATCHING,
    })
    if (success) {
      dispatch(setLogged(true))
      const replaceAction = StackActions.replace(ScreenNames.Main)
      navigation.dispatch(replaceAction)
    } else recoveryDispatch(resetPhrase())
  }, [phrase])

  const restoreEntropy = async () => {
    const shouldRecover = await shouldRecoverFromSeed()

    if (shouldRecover) {
      await resetPin()
    } else {
      throw new Error('Failed to reset the Passcode!')
    }
  }

  const submitCb = async () => {
    if (isAccessRestore) {
      await restoreEntropy()
    } else {
      const idw = await agent.loadFromMnemonic(phrase.join(' '))
      dispatch(setDid(idw.did))
    }
  }

  const isPhraseComplete = phrase.length === 12

  return { handlePhraseSubmit, isPhraseComplete }
}

const RecoveryFooter: React.FC<RecoveryFooterI> = memo(
  ({ areSuggestionsVisible, handlePhraseSubmit, isPhraseComplete }) => {
    const { animatedBtns, animatedSuggestions } = useAnimateRecoveryFooter()
    const navigation = useNavigation()

    const { keyboardHeight } = useKeyboard()

    return (
      <>
        {Platform.OS === 'android' && areSuggestionsVisible && (
          <AbsoluteBottom
            customStyles={{
              bottom: keyboardHeight + 10,
            }}
          >
            <Animated.View
              style={[styles.footer, { opacity: animatedSuggestions }]}
            >
              <Suggestions />
            </Animated.View>
          </AbsoluteBottom>
        )}

        {/* don't use AbsoluteBottom component here it disables buttons on Android */}
        <Animated.View style={{ width: '100%', opacity: animatedBtns }}>
          <BtnGroup>
            <Btn onPress={handlePhraseSubmit} disabled={!isPhraseComplete}>
              {strings.CONFIRM}
            </Btn>
            <Btn type={BtnTypes.secondary} onPress={() => navigation.goBack()}>
              {strings.BACK}
            </Btn>
          </BtnGroup>
        </Animated.View>
      </>
    )
  },
)

const styles = StyleSheet.create({
  footer: {
    width: '100%',
  },
})

export default function () {
  const { phrase, areSuggestionsVisible } = useRecoveryState()

  const { handlePhraseSubmit, isPhraseComplete } = useRecoveryPhraseUtils(
    phrase,
  )

  return (
    <RecoveryFooter
      areSuggestionsVisible={areSuggestionsVisible}
      handlePhraseSubmit={handlePhraseSubmit}
      isPhraseComplete={isPhraseComplete}
    />
  )
}
