import React from 'react'
import { StyleSheet, View, Text } from 'react-native'
import { Container } from 'src/ui/structure'
import I18n from 'src/locales/i18n'
import strings from '../../../locales/strings'
import { Colors, Typography, Buttons, Spacing } from 'src/styles'

const { Button } = require('react-native-material-ui')

interface Props {
  seedPhrase: string
  handleButtonTap: () => void
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: Colors.blackMain,
  },
  noteSection: {
    marginTop: Spacing.LG,
    flex: 0.8,
    justifyContent: 'center',
  },
  note: {
    ...Typography.noteText,
    ...Typography.centeredText,
  },
  phraseSection: {
    flex: 1,
  },
  seedPhrase: {
    ...Typography.largeText,
    ...Typography.centeredText,
  },
  buttonSection: {
    marginTop: 'auto',
  },
  buttonContainer: {
    ...Buttons.buttonStandardContainer,
  },
  buttonText: {
    ...Buttons.buttonStandardText,
  },
})

export const SeedPhrase: React.SFC<Props> = ({
  seedPhrase,
  handleButtonTap,
}: Props) => (
  <Container style={styles.container}>
    <View style={styles.noteSection}>
      <Text style={styles.note}>
        {I18n.t(strings.WRITE_THESE_WORDS_DOWN_ON_AN_ANALOG_AND_SECURE_PLACE) +
          '. ' +
          I18n.t(
            strings.WITHOUT_THESE_WORDS_YOU_CANNOT_ACCESS_YOUR_WALLET_AGAIN,
          ) +
          '.'}
      </Text>
    </View>
    <View style={styles.phraseSection}>
      <Text style={styles.seedPhrase}>{seedPhrase}</Text>
    </View>
    <View style={styles.buttonSection}>
      <Button
        style={{ container: styles.buttonContainer, text: styles.buttonText }}
        onPress={handleButtonTap}
        raised
        upperCase={false}
        text={I18n.t(strings.YES_I_WROTE_IT_DOWN)}
      />
    </View>
  </Container>
)
