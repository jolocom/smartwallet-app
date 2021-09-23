import React, { useCallback, memo } from 'react'
import { Animated, Platform, StyleSheet } from 'react-native'
import { useRoute, RouteProp } from '@react-navigation/native'
import { useDispatch } from 'react-redux'

import { setLogged, setDid } from '~/modules/account/actions'

import BtnGroup from '~/components/BtnGroup'
import Btn, { BtnTypes } from '~/components/Btn'
import AbsoluteBottom from '~/components/AbsoluteBottom'

import { useLoader } from '~/hooks/loader'
import { StorageKeys, useAgent, useShouldRecoverFromSeed } from '~/hooks/sdk'

import Suggestions from './SeedKeySuggestions'
import useAnimateRecoveryFooter from './useAnimateRecoveryFooter'
import { useRecoveryState, useRecoveryDispatch } from './module/recoveryContext'
import { resetPhrase } from './module/recoveryActions'
import { useKeyboard } from './useKeyboard'
import { useResetKeychainValues } from '~/hooks/deviceAuth'
import { ScreenNames } from '~/types/screens'
import { useReplaceWith, usePop, useGoBack } from '~/hooks/navigation'
import { LockStackParamList } from '~/screens/LoggedIn/LockStack'
import useTranslation from '~/hooks/useTranslation'
import { useGetResetStoredCountdownValues } from '~/components/Passcode/hooks'

interface RecoveryFooterI {
  areSuggestionsVisible: boolean
  handlePhraseSubmit: () => void
  handleCancel: () => void
  isPhraseComplete: boolean
}

const useRecoveryPhraseUtils = (phrase: string[]) => {
  const { t } = useTranslation()
  const loader = useLoader()
  const recoveryDispatch = useRecoveryDispatch()
  const replaceWith = useReplaceWith()
  const dispatch = useDispatch()
  const pop = usePop()
  const goBack = useGoBack()

  const agent = useAgent()
  const shouldRecoverFromSeed = useShouldRecoverFromSeed(phrase)
  const resetPin = useResetKeychainValues()

  const resetCountdownValues = useGetResetStoredCountdownValues()

  const route =
    useRoute<RouteProp<LockStackParamList, ScreenNames.PasscodeRecovery>>()

  const isAccessRestore = route?.params?.isAccessRestore ?? false

  const handlePhraseSubmit = useCallback(async () => {
    const handleDone = (error: unknown) => {
      if (!error) {
        dispatch(setLogged(true))
        replaceWith(ScreenNames.LoggedIn)
      } else recoveryDispatch(resetPhrase())
    }
    await loader(
      () => submitCb(),
      {
        loading: t('Recovery.confirmLoader'),
      },
      handleDone,
    )
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
      await resetCountdownValues()
    } else {
      const idw = await agent.loadFromMnemonic(phrase.join(' '))
      await agent.storage.store.setting(StorageKeys.isOnboardingDone, {
        finished: true,
      })
      dispatch(setDid(idw.did))
    }
  }

  const isPhraseComplete = phrase.length === 12

  const handleCancel = () => {
    if (isAccessRestore) {
      pop(2)
    } else {
      goBack()
    }
  }

  return { handlePhraseSubmit, isPhraseComplete, handleCancel }
}

const RecoveryFooter: React.FC<RecoveryFooterI> = memo(
  ({
    areSuggestionsVisible,
    handlePhraseSubmit,
    handleCancel,
    isPhraseComplete,
  }) => {
    const { t } = useTranslation()
    const { animatedBtns, animatedSuggestions } = useAnimateRecoveryFooter()
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
              {t('Recovery.confirmBtn')}
            </Btn>
            <Btn type={BtnTypes.secondary} onPress={handleCancel}>
              {t('Recovery.exitBtn')}
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

  const { handlePhraseSubmit, handleCancel, isPhraseComplete } =
    useRecoveryPhraseUtils(phrase)

  return (
    <RecoveryFooter
      areSuggestionsVisible={areSuggestionsVisible}
      handlePhraseSubmit={handlePhraseSubmit}
      handleCancel={handleCancel}
      isPhraseComplete={isPhraseComplete}
    />
  )
}
