import React, { useCallback, memo } from 'react'
import { Animated, StyleSheet } from 'react-native'
import { useNavigation } from '@react-navigation/native'

import BtnGroup from '~/components/BtnGroup'
import Btn, { BtnTypes } from '~/components/Btn'

import { strings } from '~/translations/strings'

import useRedirectTo from '~/hooks/useRedirectTo'
import { useLoader } from '~/hooks/useLoader'

import { ScreenNames } from '~/types/screens'
import { useSDK } from '~/utils/sdk/context'

import Suggestions from './SeedKeySuggestions'
import useAnimateRecoveryFooter from './useAnimateRecoveryFooter'
import AbsoluteBottom from '~/components/AbsoluteBottom'
import { useRecoveryState, useRecoveryDispatch } from './module/recoveryContext'
import { resetPhrase } from './module/recoveryActions'

interface RecoveryFooterI {
  areSuggestionsVisible: boolean
  handlePhraseSubmit: () => void
  isPhraseComplete: boolean
}

const useRecoveryPhraseUtils = (phrase: string[]) => {
  const loader = useLoader()
  const dispatch = useRecoveryDispatch()
  const redirectToClaims = useRedirectTo(ScreenNames.LoggedIn)
  const SDK = useSDK()

  const handlePhraseSubmit = useCallback(async () => {
    const success = await loader(
      () => SDK.bemw.initWithMnemonic(phrase.join(' ')),
      {
        loading: strings.MATCHING,
      },
    )

    if (success) redirectToClaims()
    else dispatch(resetPhrase())
  }, [phrase])

  const isPhraseComplete = phrase.length === 12

  return { handlePhraseSubmit, isPhraseComplete }
}

const RecoveryFooter: React.FC<RecoveryFooterI> = memo(
  ({ areSuggestionsVisible, handlePhraseSubmit, isPhraseComplete }) => {
    const { animatedBtns, animatedSuggestions } = useAnimateRecoveryFooter()
    const navigation = useNavigation()

    if (areSuggestionsVisible) {
      return (
        <AbsoluteBottom>
          <Animated.View
            style={[styles.footer, { opacity: animatedSuggestions }]}
          >
            <Suggestions />
          </Animated.View>
        </AbsoluteBottom>
      )
    }
    return (
      <AbsoluteBottom>
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
      </AbsoluteBottom>
    )
  },
)

const styles = StyleSheet.create({
  footer: {
    width: '100%',
    position: 'absolute',
    bottom: 10,
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
