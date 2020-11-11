import React, { useCallback, memo } from 'react'
import { Animated, Platform, StyleSheet } from 'react-native'
import { Buttons } from 'src/styles'
// import {
//   StackActions,
//   useNavigation,
//   useRoute,
//   RouteProp,
// } from '@react-navigation/native'
import { useDispatch } from 'react-redux'
import I18n from 'i18n-js'

import Suggestions from './SeedKeySuggestions'
import useAnimateRecoveryFooter from './useAnimateRecoveryFooter'
import { useRecoveryState, useRecoveryDispatch } from './module/recoveryContext'
// import { resetPhrase } from './module/recoveryActions'
import { useKeyboard } from './useKeyboard'
// import { useResetKeychainValues } from '~/hooks/deviceAuth'
// import { PIN_SERVICE } from '~/utils/keychainConsts'
// import { ScreenNames } from '~/types/screens'
// import { RootStackParamList } from '~/RootNavigation'
import strings from 'src/locales/strings'
import AbsoluteBottom from 'src/ui/deviceauth/components/AbsoluteBottom'
import BtnGroup from './components/BtnGroup'
import { JolocomButton } from 'src/ui/structure'
import Btn from 'src/ui/deviceauth/components/Btn'
import { BtnTypes } from './components/Btn'

interface RecoveryFooterI {
  areSuggestionsVisible: boolean
  handlePhraseSubmit: () => void
  isPhraseComplete: boolean
}

const useRecoveryPhraseUtils = (phrase: string[], handleButtonPress) => {
  // const recoveryDispatch = useRecoveryDispatch()
  // const dispatch = useDispatch()

  // const shouldRecoverFromSeed = useShouldRecoverFromSeed(phrase)
  // const resetPin = useResetKeychainValues(PIN_SERVICE)

  // const route = useRoute<RouteProp<RootStackParamList, 'Recovery'>>()
  // const route = useRoute()
  // const navigation = useNavigation()

  // const { isPINrecovery } = route.params

  const handlePhraseSubmit = () => {
    // await loader(async () => await submitCb(), {
    //   loading: strings.MATCHING,
    // })
    // if (success) {
    //   const replaceAction = StackActions.replace(ScreenNames.LoggedIn)
    //   navigation.dispatch(replaceAction)
    // } else recoveryDispatch(resetPhrase())
    console.log('SUBMITTING')
    console.log({})

    handleButtonPress(phrase)
  }

  // const restoreEntropy = async () => {
  //   const shouldRecover = await shouldRecoverFromSeed()

  //   if (shouldRecover) {
  //     await resetPin()
  //   } else {
  //     throw new Error('Failed to reset the Passcode!')
  //   }
  // }

  // const submitCb = async () => {
  //   if (isPINrecovery) {
  //     await restoreEntropy()
  //   } else {
  //     const idw = await agent.loadFromMnemonic(phrase.join(' '))
  //     dispatch(setDid(idw.did))
  //   }
  // }

  const isPhraseComplete = phrase.length === 12

  return { handlePhraseSubmit, isPhraseComplete }
}

const RecoveryFooter: React.FC<RecoveryFooterI> = memo(
  ({ areSuggestionsVisible, handlePhraseSubmit, isPhraseComplete }) => {
    const { animatedBtns, animatedSuggestions } = useAnimateRecoveryFooter()
    // const navigation = useNavigation()

    const { keyboardHeight } = useKeyboard()

    return (
      <>
        {Platform.OS === 'android' && areSuggestionsVisible && (
          <AbsoluteBottom
            customStyles={{
              bottom: keyboardHeight + 10,
            }}>
            <Animated.View
              style={[styles.footer, { opacity: animatedSuggestions }]}>
              <Suggestions />
            </Animated.View>
          </AbsoluteBottom>
        )}

        {/* don't use AbsoluteBottom component here it disables buttons on Android */}
        <Animated.View style={{ width: '100%', opacity: animatedBtns }}>
          <BtnGroup>
            <JolocomButton
              testID="restoreAccount"
              disabled={!isPhraseComplete}
              onPress={isPhraseComplete ? handlePhraseSubmit : () => undefined}
              text={I18n.t(strings.RESTORE_ACCOUNT)}
              containerStyle={{
                marginHorizontal: 30,
                ...Buttons.buttonStandardContainer,
              }}
              textStyle={Buttons.buttonStandardText}
            />
            {/* <Btn onPress={handlePhraseSubmit} disabled={!isPhraseComplete}>
              {strings.CONFIRM}
            </Btn>
            <Btn type={BtnTypes.secondary} onPress={() => navigation.goBack()}>
              {strings.GO_BACK}
            </Btn> */}
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

export default function(props) {
  console.log({ props })

  const { phrase, areSuggestionsVisible } = useRecoveryState()

  const { handlePhraseSubmit, isPhraseComplete } = useRecoveryPhraseUtils(
    phrase,
    props.handleButtonPress,
  )

  return (
    <RecoveryFooter
      areSuggestionsVisible={areSuggestionsVisible}
      handlePhraseSubmit={handlePhraseSubmit}
      isPhraseComplete={isPhraseComplete}
    />
  )
}
