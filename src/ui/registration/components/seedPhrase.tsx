import React from 'react'
import { StyleSheet, View, Text } from 'react-native'
import { JolocomTheme } from 'src/styles/jolocom-theme'
import { Container } from 'src/ui/structure/'
import I18n from 'src/locales/i18n'

const { Button } = require('react-native-material-ui')

interface Props {
  seedPhrase: string
  checked: boolean
  handleButtonTap: () => void
}

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
  phraseSection: {
    flex: 1,
  },
  seedPhrase: {
    textAlign: 'center',
    color: JolocomTheme.primaryColorWhite,
    fontSize: 34,
    fontFamily: JolocomTheme.contentFontFamily,
    lineHeight: 38,
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

export const SeedPhrase: React.SFC<Props> = props => (
  <Container style={styles.container}>
    <View style={styles.noteSection}>
      <Text style={styles.note}>
        {I18n.t('Write these words down on an analog and secure place') +
          '. ' +
          I18n.t('Without these words, you cannot access your wallet again') +
          '.'}
      </Text>
    </View>
    <View style={styles.phraseSection}>
      <Text style={styles.seedPhrase}>{props.seedPhrase}</Text>
    </View>
    <View style={styles.buttonSection}>
      <Button
        style={{ container: styles.buttonContainer, text: styles.buttonText }}
        onPress={props.handleButtonTap}
        raised
        upperCase={false}
        text={I18n.t('Yes, I wrote it down')}
      />
    </View>
  </Container>
)
