import * as React from 'react'
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native'
import { Container } from '../../structure'
import { JolocomTheme } from '../../../styles/jolocom-theme'
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
  mnemonicContainer: {
    flex: 1,
    flexDirection: 'row',
  },
  mnemonic: {
    margin: 8,
    color: JolocomTheme.primaryColorWhite,
  },
  selector: {
    width: 109,
    height: 32,
    borderRadius: 4,
    borderStyle: 'solid',
    borderWidth: 1,
    borderColor: '#942f51',
    margin: 10,
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

interface RepeatSeedPhraseProps {
  note: string
  mnemonicSorting: {}
  randomWords: string[]
  back: () => void
  checkMnemonic: () => void
  selectPosition: (id: number) => void
}
const RepeatSeedPhraseComponent = ({
  note,
  mnemonicSorting,
  randomWords,
  back,
  checkMnemonic,
  selectPosition,
}: RepeatSeedPhraseProps) => (
  <Container style={styles.container}>
    <View style={styles.noteSection}>
      <Text style={styles.note}>{note}</Text>
    </View>
    <View style={styles.mnemonicContainer}>
      {randomWords.map(key => (
        <Text style={styles.mnemonic}>{key}</Text>
      ))}
    </View>
    <View style={{ display: 'flex', flexDirection: 'row' }}>
      <View>
        {new Array(6).fill('').map((e, i) => (
          <TouchableOpacity
            key={i}
            style={styles.selector}
            onPress={() => selectPosition(i)}
          >
            <Text style={styles.note}>
              {mnemonicSorting[i] ? mnemonicSorting[i] : i + 1}
            </Text>
          </TouchableOpacity>
        ))}
      </View>
      <View>
        {new Array(6).fill('').map((e, i) => (
          <TouchableOpacity
            key={i}
            style={styles.selector}
            onPress={() => selectPosition(i + 6)}
          >
            <Text style={styles.note}>
              {mnemonicSorting[i + 6] ? mnemonicSorting[i + 6] : i + 7}
            </Text>
          </TouchableOpacity>
        ))}
      </View>
    </View>
    <View style={styles.buttonSection}>
      <Button
        style={{ container: styles.buttonContainer, text: styles.buttonText }}
        onPress={randomWords.length ? back : checkMnemonic}
        raised
        upperCase={false}
        text={randomWords.length ? 'Show my phrase again' : 'Confirm and check'}
      />
    </View>
  </Container>
)

export default RepeatSeedPhraseComponent
