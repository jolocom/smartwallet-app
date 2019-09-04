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
import { Colors, Spacing, Typography } from '../../../styles'
import {
  CheckMarkIcon,
  NextIcon,
  PreviousIcon,
  SpinningIcon,
} from '../../../resources'
import { WordState } from '../container/inputSeedPhrase'
import Rotation from '../../animation/Rotation'
import { TransparentButton } from '../../structure/transparentButton'
// @ts-ignore
import { RippleLoader } from 'react-native-indicator'

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'flex-start',
    backgroundColor: JolocomTheme.primaryColorBlack,
  },
  header: {
    ...largeText,
    color: Colors.sandLight,
    marginTop: Spacing.XL,
  },
  mnemonicSection: {
    flexDirection: 'row',
    width: '100%',
    height: 150,
    flexWrap: 'wrap',
    marginTop: Spacing.XS,
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
    marginHorizontal: 20,
    flexDirection: 'row',
    alignItems: 'center',
  },
  textInput: {
    flex: 1,
    fontSize: Typography.textXXL,
  },
  correct: {
    color: 'white',
  },
  error: {
    color: Colors.purpleMain,
  },
  divider: {
    backgroundColor: Colors.sandLight,
    width: '80%',
    height: 2,
  },
  hint: {
    fontSize: Typography.textXS,
    color: Colors.white,
    marginTop: 3,
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
  },
  buttonSection: {
    flex: 1,
    marginBottom: 30,
    width: '100%',
    justifyContent: 'center',
    alignItems: 'center',
  },
})
interface InputSeedPhraseProps {
  handleButtonPress: () => void
  handleTextInput: (text: string) => void
  selectWord: (word: string) => void
  openKeyboard: (ref: TextInput) => void
  handleDoneButton: () => void
  handleBackButton: () => void
  mnemonic: string[]
  currentWord: string
  isValid: boolean
  wordList: string[]
  validWord: boolean
  markedWord: number
  handleNextWord: () => void
  handlePreviousWord: () => void
  wordState: WordState
  isLoading: boolean
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
  handleBackButton,
  isLoading,
}) => {
  const isPreviousEnabled = markedWord > 0 || currentWord.length > 0
  const isNextEnabled = markedWord < mnemonic.length
  let headerText
  if (isLoading) {
    headerText = 'Full phrase verification'
  } else if (mnemonic.length === 0) {
    headerText = 'Recovery'
  } else {
    headerText = mnemonic.length + '/12 completed'
  }
  return (
    <Container
      style={[
        styles.container,
        isLoading && { justifyContent: 'space-around' },
      ]}
    >
      <Text style={styles.header}>{headerText}</Text>
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
      {!isLoading ? (
        <React.Fragment>
          <View style={styles.inputSection}>
            <View style={{ width: 30 }}>
              {isPreviousEnabled && (
                <PreviousIcon onPress={handlePreviousWord} />
              )}
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
                placeholder={mnemonic.length === 0 ? 'Your first word' : ''}
                placeholderTextColor={Colors.white050}
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
          <View style={styles.divider} />
          <Text style={styles.hint}>
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
                      text: {
                        ...buttonStandardText,
                        fontSize: Typography.textLG,
                      },
                    }}
                  />
                ))}
            </View>
          </View>

          <View style={{ flex: 2 }} />
          <View style={styles.buttonSection}>
            {isValid && (
              <JolocomButton
                disabled={!isValid}
                onPress={isValid ? handleButtonPress : undefined}
                raised
                upperCase={false}
                text={'Restore account'}
                style={{ container: { margin: 10 } }}
              />
            )}
            <TransparentButton
              onPress={handleBackButton}
              style={{ width: 300, height: 56 }}
              text={'Back to signup'}
            />
          </View>
        </React.Fragment>
      ) : (
        <React.Fragment>
          <RippleLoader size={120} strokeWidth={4} color={Colors.mint} />
          <View style={{ margin: 20 }} />
        </React.Fragment>
      )}
    </Container>
  )
}

export default InputSeedPhraseComponent
