import React, { useCallback, memo } from 'react'
import { Animated, Platform, StyleSheet } from 'react-native'
import { StackActions, useNavigation, useRoute } from '@react-navigation/native'
import { useDispatch, useSelector } from 'react-redux'

import { setLogged, setDid } from '~/modules/account/actions'

import BtnGroup from '~/components/BtnGroup'
import Btn, { BtnTypes } from '~/components/Btn'
import AbsoluteBottom from '~/components/AbsoluteBottom'

import { strings } from '~/translations/strings'

import { useLoader } from '~/hooks/useLoader'
import { useSDK } from '~/hooks/sdk'

import Suggestions from './SeedKeySuggestions'
import useAnimateRecoveryFooter from './useAnimateRecoveryFooter'
import { useRecoveryState, useRecoveryDispatch } from './module/recoveryContext'
import { resetPhrase } from './module/recoveryActions'
import { useKeyboard } from './useKeyboard'
import useResetKeychainValues from '~/hooks/useResetKeychainValues'
import { PIN_SERVICE } from '~/utils/keychainConsts'
import { isLocalAuthSet } from '~/modules/account/selectors'
import { ScreenNames } from '~/types/screens'

interface RecoveryFooterI {
  areSuggestionsVisible: boolean
  handlePhraseSubmit: () => void
  isPhraseComplete: boolean
}

const useRecoveryPhraseUtils = (phrase: string[]) => {
  const loader = useLoader()
  const recoveryDispatch = useRecoveryDispatch()
  const dispatch = useDispatch()
  const SDK = useSDK()
  const route = useRoute()

  const isAuthSet = useSelector(isLocalAuthSet)
  const navigation = useNavigation()

  const resetPin = useResetKeychainValues(PIN_SERVICE)

  const { isAccessRestore } = route.params

  const restoreEntropy = async () => {
    // TODO: do actual phrase comparison
    await resetPin()
    // throw new Error('oops')
  }

  const submitCb = async () => {
    if (isAccessRestore) {
      await restoreEntropy()
    } else {
      const idw = await SDK.initWithMnemonic(phrase.join(' '))
      dispatch(setDid(idw.did))
    }
  }

  const handlePhraseSubmit = useCallback(async () => {
    const success = await loader(async () => await submitCb(), {
      loading: strings.MATCHING,
    })

    if (success) {
      dispatch(setLogged(true))
      const replaceAction = StackActions.replace(ScreenNames.LoggedIn)
      navigation.dispatch(replaceAction)
    } else recoveryDispatch(resetPhrase())
  }, [phrase])

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
