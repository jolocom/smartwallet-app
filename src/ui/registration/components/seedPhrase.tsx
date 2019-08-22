import React from 'react'
import { StyleSheet, View, Text } from 'react-native'
import { Container, JolocomButton } from 'src/ui/structure/'
import I18n from 'src/locales/i18n'
import strings from '../../../locales/strings'
import { Colors, Typography } from 'src/styles'

interface Props {
  seedPhrase: string
  checked: boolean
  handleButtonTap: () => void
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: Colors.blackMain,
  },
  noteSection: {
    marginTop: 20,
    flex: 0.8,
    justifyContent: 'center',
  },
  note: {
    ...Typography.subMainText,
    ...Typography.centeredText,
    lineHeight: Typography.subMainText.fontSize + 2,
    color: Colors.sandLight,
  },
  phraseSection: {
    flex: 1,
  },
  seedPhrase: {
    ...Typography.baseFontStyles,
    ...Typography.centeredText,
    fontSize: Typography.text3XL,
    lineHeight: Typography.text3XL + 4,
    color: Colors.white,
  },
  buttonSection: {
    marginTop: 'auto',
  },
})

export const SeedPhrase: React.SFC<Props> = props => (
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
      <Text style={styles.seedPhrase}>{props.seedPhrase}</Text>
    </View>
    <View style={styles.buttonSection}>
      <JolocomButton
        onPress={props.handleButtonTap}
        raised
        upperCase={false}
        text={I18n.t(strings.YES_I_WROTE_IT_DOWN)}
      />
    </View>
  </Container>
)
