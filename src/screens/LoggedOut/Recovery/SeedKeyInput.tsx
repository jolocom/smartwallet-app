import React, { useCallback, useEffect, useRef, useState } from 'react'
import {
  View,
  StyleSheet,
  TextInput,
  NativeSyntheticEvent,
  TextInputSubmitEditingEventData,
} from 'react-native'
import { useRecoveryDispatch, useRecoveryState } from './module/recoveryContext'

import LeftArrow from '~/components/LeftArrow'
import RightArrow from '~/components/RightArrow'

import useDelay from '~/hooks/useDelay'

import { Fonts } from '~/utils/fonts'
import BP from '~/utils/breakpoints'
import { Colors } from '~/utils/colors'
import { getSuggestedSeedKeys, isKeyValid } from '~/utils/mnemonic'

import RecoveryInputMetadata from './RecoveryInputMetadata'
import {
  setSeedKey,
  setCurrentWordIdx,
  setSuggestedKeys,
  showSuggestions,
  setKeyIsValid,
  setHasError,
  submitKey,
  hideSuggestions,
} from './module/recoveryActions'

const SeedKeyInput: React.FC = () => {
  const inputRef = useRef<TextInput>(null)

  const dispatch = useRecoveryDispatch()
  const {
    currentWordIdx,
    phrase,
    seedKey,
    suggestedKeys,
    keyHasError,
    keyIsValid,
  } = useRecoveryState()

  const [isSuccessBorder, setIsSuccessBorder] = useState(keyIsValid)

  const selectPrevWord = () => {
    dispatch(setCurrentWordIdx(currentWordIdx - 1))
  }
  const selectNextWord = () => {
    dispatch(setCurrentWordIdx(currentWordIdx + 1))
  }

  const handleSeedKeyChange = useCallback(
    (val: string) => {
      if (currentWordIdx < 12) {
        dispatch(setSeedKey(val))
      }
    },
    [currentWordIdx],
  )

  const handleInputFocus = useCallback(() => {
    dispatch(showSuggestions())
  }, [])

  const handleInputBlur = () => {
    dispatch(hideSuggestions())
  }

  // this is invoked when next keyboard button is pressed
  const handleSubmitEditing = (
    e: NativeSyntheticEvent<TextInputSubmitEditingEventData>,
  ) => {
    if (keyIsValid) {
      dispatch(submitKey(e.nativeEvent.text))
    }
  }

  // after the phrase is complete - keyboard hides, to bring keyoboard back when user moves across keys in phrase
  useEffect(() => {
    if (!inputRef.current?.isFocused()) {
      inputRef.current?.focus()
    }
  }, [currentWordIdx])

  // when we move with arrows select a current seedKey
  useEffect(() => {
    const updateInput = async () => {
      await useDelay(() => {
        dispatch(setSeedKey(phrase[currentWordIdx]))
      }, 200)
      if (currentWordIdx !== 0) {
        setIsSuccessBorder(true)
        await useDelay(() => setIsSuccessBorder(false), 100)
      }
    }
    updateInput()
  }, [currentWordIdx])

  // this for showing buttons back instead of suggestions
  useEffect(() => {
    if (currentWordIdx === 12 && phrase.length === 12) {
      dispatch(hideSuggestions())
      dispatch(setKeyIsValid(false))
      inputRef.current?.blur()
    }
  }, [currentWordIdx, phrase])

  // this is for fetching suggested keys based on the input
  useEffect(() => {
    if (seedKey && seedKey.length > 1) {
      const suggestions = getSuggestedSeedKeys(seedKey)
      dispatch(setSuggestedKeys(suggestions))

      const isValid = isKeyValid(seedKey)
      dispatch(setKeyIsValid(isValid))
    } else {
      dispatch(setSuggestedKeys([]))
    }
  }, [seedKey])

  // this is for coloring input box to indicate no match error
  useEffect(() => {
    if (seedKey && seedKey.length > 1 && !suggestedKeys.length) {
      dispatch(setHasError(true))
    } else {
      dispatch(setHasError(false))
    }
  }, [suggestedKeys])

  return (
    <View style={styles.inputContainer}>
      <View
        style={[
          styles.inputField,
          keyHasError && styles.inputError,
          isSuccessBorder && styles.inputValid,
        ]}
      >
        {currentWordIdx > 0 && <LeftArrow handlePress={selectPrevWord} />}
        <TextInput
          value={seedKey}
          ref={inputRef}
          onChangeText={handleSeedKeyChange}
          onSubmitEditing={handleSubmitEditing}
          onFocus={handleInputFocus}
          onBlur={handleInputBlur}
          style={styles.input}
          testID="seedphrase-input"
          keyboardAppearance="dark"
          underlineColorAndroid="transparent"
          autoCapitalize="none"
          autoFocus
          //@ts-ignore
          textAlign="center"
          returnKeyType="done"
          blurOnSubmit={false}
          spellCheck={false}
          autoCorrect={false}
        />
        {currentWordIdx !== phrase.length && currentWordIdx < 12 && (
          <RightArrow handlePress={selectNextWord} />
        )}
      </View>
      {!suggestedKeys.length ? <RecoveryInputMetadata /> : null}
    </View>
  )
}

const styles = StyleSheet.create({
  inputContainer: {
    width: '100%',
    marginTop: 50,
  },
  inputField: {
    width: '100%',
    backgroundColor: 'black',
    height: BP({
      small: 50,
      medium: 80,
      large: 80,
    }),
    borderRadius: 7,
    paddingHorizontal: 16,
    flexDirection: 'row',
    justifyContent: 'center',
    textAlign: 'center',
    borderWidth: 2,
  },
  input: {
    width: '70%',
    fontFamily: Fonts.Medium,
    fontSize: 34,
    fontWeight: '500',
    color: Colors.white,
    textDecorationLine: 'none',
  },
  inputError: {
    borderColor: Colors.error,
    borderWidth: 2,
  },
  inputValid: {
    borderColor: Colors.success,
  },
})

export default SeedKeyInput
