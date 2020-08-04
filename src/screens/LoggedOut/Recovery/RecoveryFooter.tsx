import React, { useCallback, memo } from 'react'
import { Animated, StyleSheet } from 'react-native'
import { useNavigation } from '@react-navigation/native'
import { useDispatch } from 'react-redux'

import { setLogged } from '~/modules/account/actions'

import BtnGroup from '~/components/BtnGroup'
import Btn, { BtnTypes, BtnSize } from '~/components/Btn'
import AbsoluteBottom from '~/components/AbsoluteBottom'

import { strings } from '~/translations/strings'

import { useLoader } from '~/hooks/useLoader'
import { useSDK } from '~/hooks/sdk'

import Suggestions from './SeedKeySuggestions'
import useAnimateRecoveryFooter from './useAnimateRecoveryFooter'
import { useRecoveryState, useRecoveryDispatch } from './module/recoveryContext'
import { resetPhrase } from './module/recoveryActions'
import { useKeyboard } from './useKeyboard'
import BP from '~/utils/breakpoints'

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

  const handlePhraseSubmit = useCallback(async () => {
    const success = await loader(
      async () => SDK.initWithMnemonic(phrase.join(' ')),
      {
        loading: strings.MATCHING,
      },
    )

    if (success) dispatch(setLogged(true))
    else recoveryDispatch(resetPhrase())
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
        {areSuggestionsVisible && (
          <AbsoluteBottom
            customStyles={{
              bottom: keyboardHeight + BP({ large: 0, medium: 10, small: 10 }),
            }}
          >
            <Animated.View
              style={[styles.footer, { opacity: animatedSuggestions }]}
            >
              <Suggestions />
            </Animated.View>
          </AbsoluteBottom>
        )}

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
