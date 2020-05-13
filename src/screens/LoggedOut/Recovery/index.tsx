import React, { useState, useEffect } from 'react'
import {
  View,
  StyleSheet,
  TextInput,
  Keyboard,
  KeyboardAvoidingView,
} from 'react-native'

import ScreenContainer from '~/components/ScreenContainer'
import { useLoader } from '~/hooks/useLoader'
import { Colors } from '~/utils/colors'
import SDK from '~/utils/SDK'
import { getSuggestedSeedKeys, isKeyValid } from '~/utils/mnemonic'
import { BackArrowIcon, ForthArrowIcon } from '~/assets/svg'
import { strings } from '~/translations/strings'
import { ScreenNames } from '~/types/screens'

import Arrow, { ArrowDirections } from './Arrow'
import useBtnsVisibility from './useBtnsVisibility'
import RecoveryInputMetadata from './RecoveryInputMetadata'
import RecoveryHeader from './RecoveryHeader'
import RecoveryFooter from './RecoveryFooter'
import useRedirectTo from '~/hooks/useRedirectTo'

const Recovery: React.FC = () => {
  const [seedKey, setSeedKey] = useState('') // input value
  const [phrase, setPhrase] = useState<string[]>([]) // seed phrase
  const [currentWordIdx, setCurrentWordIdx] = useState(0) // used to be able to navigate back and forth across seed phrase
  const [suggestedKeys, setSuggestedKeys] = useState<string[]>([]) // suggestions from bip39
  const [keyHasError, setHasError] = useState(false) // used to color border of input in 'failed' color and display an error
  const [keyIsValid, setKeyIsValid] = useState(false) // used to color border of input in 'success' color

  const { inputRef, areBtnsVisible, hideBtns } = useBtnsVisibility()
  const loader = useLoader()
  const redirectToClaims = useRedirectTo(ScreenNames.LoggedIn)
  const redirectToWalkthrough = useRedirectTo(ScreenNames.Walkthrough)

  const handleKeySubmit = (word = seedKey) => {
    if (word) {
      if (currentWordIdx === phrase.length) {
        setPhrase((prevPhrase) => [...prevPhrase, word]) // when we are adding seedKey at the end of the phrase
      } else {
        // this is when we are moving across seed phrase back and forth with arrows - it sets
        setPhrase((prevState) => {
          const phrase = prevState.slice()
          phrase[currentWordIdx] = word
          return phrase
        })
      }
      setCurrentWordIdx((prevIdx) => prevIdx + 1) // move to the next word
      setKeyIsValid(false)
    }
  }

  const handlePhraseSubmit = async () => {
    const success = await loader(() => SDK.recoverIdentity(phrase), {
      loading: strings.MATCHING,
    })

    if (success) redirectToClaims()
    else redirectToWalkthrough()
  }

  const selectPrevWord = () => {
    setCurrentWordIdx((prevState) => prevState - 1)
  }
  const selectNextWord = () => {
    setCurrentWordIdx((prevState) => prevState + 1)
  }

  useEffect(() => {
    setSeedKey(phrase[currentWordIdx])
  }, [currentWordIdx])

  useEffect(() => {
    if (seedKey && seedKey.length > 1) {
      const suggestions = getSuggestedSeedKeys(seedKey)
      setSuggestedKeys(suggestions)

      const isValid = isKeyValid(seedKey)
      setKeyIsValid(isValid)
    } else {
      setSuggestedKeys([])
    }
  }, [seedKey])

  useEffect(() => {
    if (seedKey && seedKey.length > 1 && !suggestedKeys.length) {
      setHasError(true)
    } else {
      setHasError(false)
    }
  }, [suggestedKeys])

  const dismissKeyboard = () => {
    Keyboard.dismiss()
    selectNextWord()
    setKeyIsValid(false)
  }

  return (
    <KeyboardAvoidingView style={{ flex: 1 }} behavior="padding">
      <ScreenContainer
        customStyles={{
          justifyContent: areBtnsVisible ? 'space-between' : 'flex-start',
        }}
      >
        <RecoveryHeader phrase={phrase} currentWordIdx={currentWordIdx} />
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
              onChangeText={setSeedKey}
              onSubmitEditing={
                keyIsValid
                  ? (e) => handleKeySubmit(e.nativeEvent.text)
                  : Keyboard.dismiss
              }
              onFocus={hideBtns}
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
                {currentWordIdx < 11 && <ForthArrowIcon />}
              </Arrow>
            )}
            {currentWordIdx === 11 && phrase.length === 12 && (
              <Arrow
                direction={ArrowDirections.right}
                onPress={dismissKeyboard}
              >
                <ForthArrowIcon />
              </Arrow>
            )}
          </View>
          <RecoveryInputMetadata keyHasError={keyHasError} />
        </View>
        <RecoveryFooter
          suggestedKeys={suggestedKeys}
          areBtnsVisible={areBtnsVisible}
          handleKeySubmit={handleKeySubmit}
          handlePhraseSubmit={handlePhraseSubmit}
          isPhraseComplete={phrase.length === 12}
        />
      </ScreenContainer>
    </KeyboardAvoidingView>
  )
}

const styles = StyleSheet.create({
  body: {
    width: '100%',
    justifyContent: 'space-between',
  },
  inputContainer: {
    width: '100%',
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

export default Recovery
