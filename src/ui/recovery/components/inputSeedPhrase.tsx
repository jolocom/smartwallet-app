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
    width: 200,
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
})
interface InputSeedPhraseProps {
  handleTextInput: (text: string) => void
  selectWord: (index: number) => void
  value: string
  wordList: string[]
}

const InputSeedPhraseComponent: React.FC<InputSeedPhraseProps> = ({
  value,
  wordList,
  handleTextInput,
  selectWord,
}) => (
  <Container style={styles.container}>
    <View style={styles.noteSection}>
      <Text style={styles.note}>
        Please input the 12 words phrase that was displayed to you when you set
        up your backup.
      </Text>
    </View>

    <TextInput
      multiline
      style={styles.textInput}
      value={value}
      onChangeText={handleTextInput}
      underlineColorAndroid={JolocomTheme.primaryColorPurple}
    />
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
          onPress={() => selectWord(i)}
        >
          {word}
        </Text>
      ))}
    </View>
    <View style={styles.buttonSection}>
      <Button
        style={{ container: styles.buttonContainer, text: styles.buttonText }}
        // onPress={handleButtonTap}
        raised
        upperCase={false}
        text={'Recover my Identity'}
      />
    </View>
  </Container>
)

export default InputSeedPhraseComponent
