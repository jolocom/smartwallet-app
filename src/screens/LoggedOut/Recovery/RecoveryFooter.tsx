import React, { useCallback } from 'react'
import { Animated, StyleSheet, Platform } from 'react-native'
import { useNavigation } from '@react-navigation/native'

import BtnGroup from '~/components/BtnGroup'
import Btn, { BtnTypes } from '~/components/Btn'

import { strings } from '~/translations/strings'

import useRedirectTo from '~/hooks/useRedirectTo'
import { useLoader } from '~/hooks/useLoader'

import { ScreenNames } from '~/types/screens'

import SDK from '~/utils/SDK'

import Suggestions from './SeedKeySuggestions'
import useAnimateRecoveryFooter from './useAnimateRecoveryFooter'
import { useRecoveryState } from './module/context'

// 🧨 rename it as I also return suggestions here
const useRecoveryPhrase = () => {
  const loader = useLoader()
  const redirectToClaims = useRedirectTo(ScreenNames.LoggedIn)
  const redirectToWalkthrough = useRedirectTo(ScreenNames.Walkthrough)
  // 🧨 this will be re-rendered every time recovery state changes
  const { phrase, areSuggestionsVisible } = useRecoveryState()

  const handlePhraseSubmit = useCallback(async () => {
    const success = await loader(() => SDK.recoverIdentity(phrase), {
      loading: strings.MATCHING,
    })

    if (success) redirectToClaims()
    else redirectToWalkthrough()
  }, [phrase])

  const isPhraseComplete = phrase.length === 12

  return { handlePhraseSubmit, isPhraseComplete, areSuggestionsVisible }
}

const RecoveryFooter: React.FC = () => {
  const { animatedBtns, animatedSuggestions } = useAnimateRecoveryFooter()
  const navigation = useNavigation()

  const {
    handlePhraseSubmit,
    isPhraseComplete,
    areSuggestionsVisible,
  } = useRecoveryPhrase()

  if (areSuggestionsVisible) {
    return (
      <Animated.View style={[styles.footer, { opacity: animatedSuggestions }]}>
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
}

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

export default RecoveryFooter
