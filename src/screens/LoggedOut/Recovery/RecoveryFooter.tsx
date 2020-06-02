import React, { useCallback, memo } from 'react'
import { Animated, StyleSheet, Platform } from 'react-native'
import { useNavigation } from '@react-navigation/native'

import BtnGroup from '~/components/BtnGroup'
import Btn, { BtnTypes } from '~/components/Btn'

import { strings } from '~/translations/strings'

import useRedirectTo from '~/hooks/useRedirectTo'
import { useLoader } from '~/hooks/useLoader'

import { ScreenNames } from '~/types/screens'

import Suggestions from './SeedKeySuggestions'
import useAnimateRecoveryFooter from './useAnimateRecoveryFooter'
import { useRecoveryState } from './module/recoveryContext'
import { useSDK } from '~/hooks/sdk'

interface RecoveryFooterI {
  areSuggestionsVisible: boolean
  handlePhraseSubmit: () => void
  isPhraseComplete: boolean
}

const useRecoveryPhraseUtils = (phrase: string[]) => {
  const loader = useLoader()
  const redirectToClaims = useRedirectTo(ScreenNames.LoggedIn)
  const redirectToWalkthrough = useRedirectTo(ScreenNames.Walkthrough)
  const SDK = useSDK()

  const handlePhraseSubmit = useCallback(async () => {
    const success = await loader(
      () => SDK.bemw.initWithMnemonic(phrase.join(' ')),
      {
        loading: strings.MATCHING,
      },
    )

    if (success) redirectToClaims()
    else redirectToWalkthrough()
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
        <Animated.View
          style={[styles.footer, { opacity: animatedSuggestions }]}
        >
          <Suggestions />
        </Animated.View>
      )
    }
    return (
      <Animated.View style={{ width: '100%', opacity: animatedBtns }}>
        <BtnGroup>
          <Btn onPress={handlePhraseSubmit} disabled={!isPhraseComplete}>
            {strings.CONFIRM}
          </Btn>
          <Btn type={BtnTypes.secondary} onPress={() => navigation.goBack()}>
            {strings.BACK_TO_WALKTHROUGH}
          </Btn>
        </BtnGroup>
      </Animated.View>
    )
  },
)

const styles = StyleSheet.create({
  footer: {
    height: 50,
    position: 'absolute',
    bottom: 10,
    width: '100%',
    ...Platform.select({
      android: {
        bottom: 30,
      },
    }),
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
