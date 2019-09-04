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
  },
})
interface InputSeedPhraseProps {
  handleButtonPress: () => void
  handleTextInput: (text: string) => void
  selectWord: (word: string) => void
  inputRef: (ref: TextInput) => void
  handleDoneButton: () => void
  handleBackButton: () => void
  mnemonic: string[]
  inputValue: string
  isMnemonicValid: boolean
  suggestions: string[]
  markedWord: number
  handleNextWord: () => void
  handlePreviousWord: () => void
  inputState: WordState
  isLoading: boolean
}
const InputSeedPhraseComponent: React.FC<InputSeedPhraseProps> = ({
  inputValue,
  markedWord,
  suggestions,
  isMnemonicValid,
  inputState,
  mnemonic,
  handleTextInput,
  selectWord,
  handleButtonPress,
  inputRef,
  handleDoneButton,
  handleNextWord,
  handlePreviousWord,
  handleBackButton,
  isLoading,
}) => {
  const isPreviousEnabled = markedWord > 0 || inputValue.length > 0
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
                ref={inputRef}
                autoCapitalize={'none'}
                autoCorrect={false}
                style={[
                  styles.textInput,
                  inputState === WordState.wrong
                    ? styles.error
                    : styles.correct,
                ]}
                value={inputValue}
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
              {inputState === WordState.loading && (
                <Rotation>
                  <SpinningIcon />
                </Rotation>
              )}
              {inputState === WordState.valid && <CheckMarkIcon />}
            </View>
            <View style={{ width: 30 }}>
              {isNextEnabled && <NextIcon onPress={handleNextWord} />}
            </View>
          </View>
          <View style={styles.divider} />
          <Text style={styles.hint}>
            {inputState === WordState.wrong
              ? 'The word is not correct, check for typos'
              : suggestions.length > 0 &&
                'Choose the right word or press enter'}
          </Text>
          <View style={styles.wordListWrapper}>
            <View style={styles.wordListSection}>
              {inputValue.length > 1 &&
                suggestions.map((word, i) => (
                  <Button
                    key={i}
                    text={word}
                    onPress={() => selectWord(suggestions[i])}
                    upperCase={false}
                    style={{
                      container: {
                        ...buttonStandardContainer,
                        minWidth: 0,
                        margin: 6,
                        height: 40,
                        backgroundColor: Colors.purpleMain050,
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
            {isMnemonicValid && (
              <JolocomButton
                disabled={!isMnemonicValid}
                onPress={isMnemonicValid ? handleButtonPress : undefined}
                raised
                upperCase={false}
                text={'Restore account'}
              />
            )}
            <TransparentButton
              onPress={handleBackButton}
              style={{ marginHorizontal: 30, paddingVertical: 10 }}
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
