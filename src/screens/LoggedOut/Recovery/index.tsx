import React, { useState, useEffect, useRef } from 'react'
import {
  View,
  StyleSheet,
  TextInput,
  Keyboard,
  Platform,
  KeyboardAvoidingView,
} from 'react-native'

import ScreenContainer from '~/components/ScreenContainer'
import Header, { HeaderSizes } from '~/components/Header'
import Btn, { BtnTypes } from '~/components/Btn'
import BtnGroup from '~/components/BtnGroup'
import Paragraph from '~/components/Paragraph'

import { Colors } from '~/utils/colors'
import { getSuggestedSeedKeys, isKeyValid } from '~/utils/mnemonic'

import Suggestions from './Suggestions'
import Arrow, { ArrowDirections } from './Arrow'
import useIdentityOperation, {
  IdentityMethods,
} from '~/hooks/useIdentityOperation'
import { strings } from '~/translations/strings'

const Recovery: React.FC = ({ navigation }) => {
  const [seedKey, setSeedKey] = useState('') // input value
  const [phrase, setPhrase] = useState<string[]>([]) // seed phrase
  const [currentWordIdx, setCurrentWordIdx] = useState(0) // used to be able to navigate back and forth across seed phrase
  const [suggestedKeys, setSuggestedKeys] = useState<string[]>([]) // suggestions from bip39
  const [keyHasError, setHasError] = useState(false) // used to color border of input in 'failed' color and display an error
  const [keyIsValid, setKeyIsValid] = useState(false) // used to color border of input in 'success' color

  const [areBtnsVisible, setBtnsVisible] = useState(true)
  const inputRef = useRef()

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

  const handlePhraseSubmit = useIdentityOperation(
    IdentityMethods.recoverIdentity,
    phrase,
  )

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

  useEffect(() => {
    Keyboard.addListener('keyboardDidHide', showBtns)
    return () => {
      Keyboard.removeListener('keyboardDidHide', showBtns)
    }
  }, [])

  const dismissKeyboard = () => {
    Keyboard.dismiss()
    selectNextWord()
    setKeyIsValid(false)
  }

  const showBtns = () => {
    setBtnsVisible(true)
    inputRef.current.blur()
  }

  const hideBtns = () => {
    setBtnsVisible(false)
  }

  return (
    <KeyboardAvoidingView
      style={{ flex: 1 }}
      behavior={Platform.OS == 'ios' ? 'padding' : 'height'}
    >
      <ScreenContainer customStyles={{ justifyContent: 'space-between' }}>
        <View style={styles.header}>
          {phrase.length ? (
            <>
              <Header>
                {currentWordIdx === phrase.length
                  ? phrase.length
                  : currentWordIdx + 1}
                /12
              </Header>
              <View style={styles.seedPhraseContainer}>
                {phrase.map((seedKey, idx) => (
                  <Header
                    key={seedKey + idx}
                    size={HeaderSizes.small}
                    color={
                      currentWordIdx === 12
                        ? Colors.success
                        : idx === currentWordIdx
                        ? Colors.white
                        : Colors.activity
                    }
                    customStyles={{ marginHorizontal: 3 }}
                  >
                    {seedKey}
                  </Header>
                ))}
              </View>
            </>
          ) : (
            <>
              <Header>{strings.RECOVERY}</Header>
              <Paragraph>{strings.START_ENTERING_SEED_PHRASE}</Paragraph>
            </>
          )}
        </View>
        <View style={styles.inputContainer}>
          <View
            style={[
              styles.inputField,
              keyHasError && styles.inputError,
              keyIsValid && styles.inputValid,
            ]}
          >
            {currentWordIdx > 0 && (
              <Arrow onPress={selectPrevWord}>
                <Paragraph>prev</Paragraph>
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
              keyboardAppearance="dark"
              underlineColorAndroid="transparent"
              autoCapitalize="none"
              textAlign="center"
              returnKeyType="next"
              blurOnSubmit={false}
              spellCheck={false}
              autoCorrect={false}
            />
            {currentWordIdx !== phrase.length && (
              <Arrow direction={ArrowDirections.right} onPress={selectNextWord}>
                {currentWordIdx < 11 && <Paragraph>next</Paragraph>}
              </Arrow>
            )}
            {currentWordIdx === 11 && phrase.length === 12 && (
              <Arrow
                direction={ArrowDirections.right}
                onPress={dismissKeyboard}
              >
                <Paragraph>done</Paragraph>
              </Arrow>
            )}
          </View>
          <View style={styles.inputMeta}>
            {keyHasError ? (
              <Paragraph color={Colors.error}>
                {strings.CANT_MATCH_WORD}
              </Paragraph>
            ) : (
              <Paragraph>{strings.WHAT_IF_I_FORGOT}</Paragraph>
            )}
          </View>
        </View>
        {areBtnsVisible ? (
          <BtnGroup>
            <Btn onPress={handlePhraseSubmit} disabled={phrase.length !== 12}>
              {strings.CONFIRM}
            </Btn>
            <Btn type={BtnTypes.secondary} onPress={() => navigation.goBack()}>
              {strings.BACK_TO_WALKTHROUGH}
            </Btn>
          </BtnGroup>
        ) : (
          <View style={styles.footer}>
            <Suggestions
              suggestedKeys={suggestedKeys}
              onSelectKey={handleKeySubmit}
            />
          </View>
        )}
      </ScreenContainer>
    </KeyboardAvoidingView>
  )
}

const styles = StyleSheet.create({
  body: {
    width: '100%',
    justifyContent: 'space-between',
  },
  header: {
    alignItems: 'center',
  },
  seedPhraseContainer: {
    flexWrap: 'wrap',
    flexDirection: 'row',
    justifyContent: 'center',
    marginTop: 5,
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
  inputMeta: {
    marginTop: 15,
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
  footer: {
    height: 50,
    width: '100%',
    ...Platform.select({
      android: {
        marginBottom: 20,
      },
    }),
  },
})

export default Recovery
