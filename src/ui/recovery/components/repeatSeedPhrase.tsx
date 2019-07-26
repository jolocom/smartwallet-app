import * as React from 'react'
import { StyleSheet, Text, View } from 'react-native'
import { Container } from '../../structure'
import { JolocomTheme } from '../../../styles/jolocom-theme'
import { Button } from 'react-native-material-ui'
import Placeholder from './placeholder'
import strings from '../../../locales/strings'
import * as I18n from 'i18n-js'

const styles = StyleSheet.create({
  container: {
    backgroundColor: JolocomTheme.primaryColorBlack,
  },
  noteSection: {
    marginTop: 20,
    marginBottom: 20,
    margin: 50,
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
    flexDirection: 'row',
    justifyContent: 'flex-start',
  },
  mnemonic: {
    margin: 8,
    fontSize: 34,
    color: JolocomTheme.primaryColorSandInactive,
  },
  currentWord: {
    color: JolocomTheme.primaryColorWhite,
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
      {randomWords.map((key, i) => (
        <Text
          key={key}
          style={[styles.mnemonic, i === 0 && styles.currentWord]}
        >
          {key}
        </Text>
      ))}
      {/* Placeholder */}
      <Text style={[styles.mnemonic, { color: 'black' }]}>I</Text>
    </View>
    <View style={{ flexDirection: 'row' }}>
      <View>
        {new Array(6).fill('').map((e, i) => (
          <Placeholder
            key={i}
            i={i}
            sorting={mnemonicSorting}
            onPress={selectPosition}
          />
        ))}
      </View>
      <View>
        {new Array(6).fill('').map((e, i) => (
          <Placeholder
            key={i}
            i={i + 6}
            sorting={mnemonicSorting}
            onPress={selectPosition}
          />
        ))}
      </View>
    </View>
    <View style={styles.buttonSection}>
      <Button
        style={{ container: styles.buttonContainer, text: styles.buttonText }}
        onPress={randomWords.length ? back : checkMnemonic}
        raised
        upperCase={false}
        text={
          randomWords.length
            ? I18n.t(strings.SHOW_MY_PHRASE_AGAIN)
            : I18n.t(strings.CONFIRM_AND_CHECK)
        }
      />
    </View>
  </Container>
)

export default RepeatSeedPhraseComponent
