import React, { useCallback, useEffect, useRef } from 'react'
import { View, StyleSheet, TextInput, Keyboard } from 'react-native'
import { useRecoveryDispatch, useRecoveryState } from './module/recoveryContext'

import { Colors } from '~/utils/colors'
import { getSuggestedSeedKeys, isKeyValid } from '~/utils/mnemonic'
import { BackArrowIcon, ForthArrowIcon } from '~/assets/svg'

import RecoveryInputMetadata from './RecoveryInputMetadata'
import Arrow, { ArrowDirections } from './Arrow'

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

  const selectPrevWord = () => {
    dispatch(setCurrentWordIdx(currentWordIdx - 1))
  }
  const selectNextWord = () => {
    dispatch(setCurrentWordIdx(currentWordIdx + 1))
  }

  const handleInputFocus = useCallback(() => {
    dispatch(showSuggestions())
  }, [])

  const handleSeedKeyChange = useCallback((val: string) => {
    dispatch(setSeedKey(val))
  }, [])

  const handleKeyboardDismiss = () => {
    dispatch(hideSuggestions())
    Keyboard.dismiss()
  }

  // this is invoked when next keyboard button is pressed
  const handleSubmitEditing = (e) => {
    if (keyIsValid) {
      dispatch(submitKey(e.nativeEvent.text))
    } else {
      handleKeyboardDismiss()
      inputRef.current?.blur()
    }
  }

  // when we move with arrows select a current seedKey
  useEffect(() => {
    dispatch(setSeedKey(phrase[currentWordIdx]))
  }, [currentWordIdx])

  // this for showing buttons back instead of suggestions
  useEffect(() => {
    if (currentWordIdx === 12 && phrase.length === 12) {
      dispatch(hideSuggestions())
      dispatch(setKeyIsValid(false))
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
          keyIsValid && styles.inputValid,
        ]}
      >
        {currentWordIdx > 0 && (
          <Arrow direction={ArrowDirections.left} onPress={selectPrevWord}>
            <BackArrowIcon />
          </Arrow>
        )}
        <TextInput
          value={seedKey}
          ref={inputRef}
          editable={currentWordIdx < 12}
          onChangeText={handleSeedKeyChange}
          onSubmitEditing={handleSubmitEditing}
          onFocus={handleInputFocus}
          style={styles.input}
          testID="seedphrase-input"
          keyboardAppearance="dark"
          underlineColorAndroid="transparent"
          autoCapitalize="none"
          //@ts-ignore
          textAlign="center"
          returnKeyType="next"
          blurOnSubmit={false}
          spellCheck={false}
          autoCorrect={false}
        />
        {currentWordIdx !== phrase.length && (
          <Arrow direction={ArrowDirections.right} onPress={selectNextWord}>
            {currentWordIdx < 12 && <ForthArrowIcon />}
          </Arrow>
        )}
      </View>
      <RecoveryInputMetadata />
    </View>
  )
}

const styles = StyleSheet.create({
  inputContainer: {
    width: '100%',
    marginTop: 20,
  },
  inputField: {
    width: '100%',
    backgroundColor: 'black',
    height: 80,
    borderRadius: 7,
    paddingHorizontal: 16,
    flexDirection: 'row',
    justifyContent: 'center',
    textAlign: 'center',
    borderWidth: 2,
  },
  input: {
    fontSize: 34,
    width: '70%',
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
