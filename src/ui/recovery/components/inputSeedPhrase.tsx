import * as React from 'react'
import { StyleSheet, Text, TextInput, View } from 'react-native'
import { Container, JolocomButton } from '../../structure'
import { JolocomTheme } from '../../../styles/jolocom-theme.android'
import { Button } from 'react-native-material-ui'
import {
  buttonStandardContainer,
  buttonStandardText,
} from '../../../styles/buttons'
import { largeText, noteText } from '../../../styles/typography'
import { Colors } from '../../../styles'
import {
  CheckMarkIcon,
  NextIcon,
  PreviousIcon,
  SpinningIcon,
} from '../../../resources'
import { WordState } from '../container/inputSeedPhrase'
import Rotation from '../../animation/Rotation'

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'flex-start',
    backgroundColor: JolocomTheme.primaryColorBlack,
  },
  header: {
    ...largeText,
    color: 'white',
    marginTop: 32,
  },
  mnemonicSection: {
    flexDirection: 'row',
    width: '100%',
    height: 150,
    flexWrap: 'wrap',
    marginTop: 16,
    justifyContent: 'center',
  },
  note: {
    ...noteText,
    textAlign: 'center',
    lineHeight: 26,
    marginHorizontal: 50,
  },
  mnemonicWord: {
    ...noteText,
    margin: 2,
    fontSize: 24,
  },
  inputSection: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  textInput: {
    width: '50%',
    fontSize: 38,
  },
  correct: {
    color: 'white',
  },
  error: {
    color: Colors.purpleMain,
  },
  wordListWrapper: {
    flexDirection: 'row',
    position: 'relative',
    height: 40,
    width: '100%',
  },
  wordListSection: {
    position: 'absolute',
    flexDirection: 'row',
    left: 0,
    flexWrap: 'nowrap',
    width: '100%',
    // margin: 12,
  },
})
interface InputSeedPhraseProps {
  handleButtonPress: () => void
  handleTextInput: (text: string) => void
  selectWord: (word: string) => void
  openKeyboard: (ref: TextInput) => void
  handleDoneButton: () => void
  mnemonic: string[]
  currentWord: string
  isValid: boolean
  wordList: string[]
  validWord: boolean
  markedWord: number
  handleNextWord: () => void
  handlePreviousWord: () => void
  wordState: WordState
}
const InputSeedPhraseComponent: React.FC<InputSeedPhraseProps> = ({
  currentWord,
  markedWord,
  wordList,
  isValid,
  wordState,
  mnemonic,
  handleTextInput,
  selectWord,
  handleButtonPress,
  openKeyboard,
  handleDoneButton,
  handleNextWord,
  handlePreviousWord,
}) => {
  const isPreviousEnabled = markedWord > 0 || currentWord.length > 0
  const isNextEnabled = markedWord < mnemonic.length
  return (
    <Container style={styles.container}>
      <Text style={styles.header}>
        {mnemonic.length === 0 ? 'Recovery' : mnemonic.length + '/12 completed'}
      </Text>
      <View style={styles.mnemonicSection}>
        {mnemonic.length === 0 ? (
          <Text style={styles.note}>
            Start writing your seed-phrase and it will appears here word by word
          </Text>
        ) : (
          mnemonic.map((word: string, i: number) => (
            <Text
              style={[
                styles.mnemonicWord,
                markedWord === i && { color: Colors.purpleMain },
              ]}
            >
              {word}
            </Text>
          ))
        )}
      </View>
      <View style={styles.inputSection}>
        <View style={{ width: 30 }}>
          {isPreviousEnabled && <PreviousIcon onPress={handlePreviousWord} />}
        </View>
        {/*Placeholder to center text input*/}
        <View style={{ width: 29 }} />
        {
          //@ts-ignore textAlign is missing in the typings of TextInput
          <TextInput
            textAlign={'center'}
            ref={openKeyboard}
            autoCapitalize={'none'}
            autoCorrect={false}
            style={[
              styles.textInput,
              wordState === WordState.wrong ? styles.error : styles.correct,
            ]}
            value={currentWord}
            onChangeText={handleTextInput}
            returnKeyLabel={'Done'}
            returnKeyType={'next'}
            selectionColor={Colors.purpleMain}
            blurOnSubmit={false}
            onSubmitEditing={handleDoneButton}
          />
        }
        <View style={{ marginRight: 10, width: 19 }}>
          {wordState === WordState.loading && (
            <Rotation>
              <SpinningIcon styles={{ backgroundColor: 'blue' }} />
            </Rotation>
          )}
          {wordState === WordState.valid && <CheckMarkIcon />}
        </View>
        <View style={{ width: 30 }}>
          {isNextEnabled && <NextIcon onPress={handleNextWord} />}
        </View>
      </View>
      <View
        style={{
          backgroundColor: Colors.sandLight,
          width: '90%',
          height: 2,
          marginBottom: 3,
        }}
      />
      <Text style={{ color: 'white', fontSize: 18 }}>
        {wordState === WordState.wrong
          ? 'The word is not correct, check for typos'
          : wordList.length > 0 && 'Choose the right word or press enter'}
      </Text>
      <View style={styles.wordListWrapper}>
        <View style={styles.wordListSection}>
          {currentWord.length > 1 &&
            wordList.map((word, i) => (
              <Button
                key={i}
                text={word}
                onPress={() => selectWord(wordList[i])}
                upperCase={false}
                style={{
                  container: {
                    ...buttonStandardContainer,
                    minWidth: 0,
                    margin: 6,
                  },
                  text: { ...buttonStandardText },
                }}
              />
            ))}
        </View>
      </View>
      {isValid && (
        <JolocomButton
          disabled={!isValid}
          onPress={isValid ? handleButtonPress : undefined}
          raised
          upperCase={false}
          text={'Recover my Identity'}
        />
      )}
      <View style={{ flex: 2 }} />
      <JolocomButton text={'Back to signup'} />
    </Container>
  )
}

export default InputSeedPhraseComponent
