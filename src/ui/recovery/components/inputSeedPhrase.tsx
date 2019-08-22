import * as React from 'react'
import { StyleSheet, Text, TextInput, View } from 'react-native'
import { Container } from '../../structure'
import { JolocomTheme } from '../../../styles/jolocom-theme.android'
import { Button } from 'react-native-material-ui'

const styles = StyleSheet.create({
  container: {
    backgroundColor: JolocomTheme.primaryColorBlack,
  },
  noteSection: {
    marginTop: 20,
    flex: 0.8,
    justifyContent: 'center',
  },
  note: {
    textAlign: 'center',
    lineHeight: 26,
    color: JolocomTheme.primaryColorSand,
    fontSize: JolocomTheme.labelFontSize,
    fontFamily: JolocomTheme.contentFontFamily,
  },
  textInput: {
    color: 'white',
    width: '50%',
  },
  buttonSection: {
    marginTop: 'auto',
  },
  buttonContainer: {
    borderRadius: 4,
    height: 48,
    paddingHorizontal: 25,
    backgroundColor: JolocomTheme.primaryColorPurple,
  },
  buttonText: {
    paddingVertical: 15,
    fontWeight: '100',
    fontSize: JolocomTheme.headerFontSize,
    color: JolocomTheme.primaryColorWhite,
    fontFamily: JolocomTheme.contentFontFamily,
  },
  disabled: {
    opacity: 0.5,
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
}

const InputSeedPhraseComponent: React.FC<InputSeedPhraseProps> = ({
  currentWord,
  wordList,
  isValid,
  mnemonic,
  handleTextInput,
  selectWord,
  handleButtonPress,
  openKeyboard,
  handleDoneButton,
}) => (
  <Container style={styles.container}>
    <View style={styles.noteSection}>
      <Text style={styles.note}>
        {' '}
        {mnemonic.length === 0
          ? 'Please input the 12 words phrase that was displayed to you when you setup your backup.'
          : mnemonic.length + '/12'}
      </Text>
    </View>
    <View
      style={{
        flex: 1,
        flexDirection: 'row',
        width: '100%',
        flexWrap: 'wrap',
        justifyContent: 'center',
      }}
    >
      {mnemonic.map((word: string) => (
        <Text style={[styles.note, { margin: 2 }]}>{word}</Text>
      ))}
    </View>
    {
      //@ts-ignore textAlign is missing in the typings of TextInput
      <TextInput
        textAlign={'center'}
        ref={openKeyboard}
        autoFocus
        autoCapitalize={'none'}
        style={styles.textInput}
        value={currentWord}
        onChangeText={handleTextInput}
        underlineColorAndroid={JolocomTheme.primaryColorPurple}
        returnKeyLabel={'Done'}
        returnKeyType={'next'}
        blurOnSubmit={false}
        onSubmitEditing={handleDoneButton}
      />
    }
    {wordList.length === 0 && currentWord.length > 2 && (
      <Text style={{ color: 'white' }}>Wrong Word</Text>
    )}
    <View
      style={{
        flex: 1,
        flexDirection: 'row',
        width: '100%',
        flexWrap: 'wrap',
      }}
    >
      {wordList.map((word, i) => (
        <Text
          key={i}
          style={[styles.note, { margin: 8 }]}
          onPress={() => selectWord(wordList[i])}
        >
          {word}
        </Text>
      ))}
    </View>
    {isValid ? (
      <Text style={styles.note}>Valid</Text>
    ) : (
      <Text style={styles.note}>Not Valid</Text>
    )}
    <View style={styles.buttonSection}>
      <Button
        disabled={!isValid}
        style={{
          container: [styles.buttonContainer, !isValid && styles.disabled],
          text: styles.buttonText,
        }}
        onPress={isValid ? handleButtonPress : undefined}
        raised
        upperCase={false}
        text={'Recover my Identity'}
      />
    </View>
  </Container>
)

export default InputSeedPhraseComponent
