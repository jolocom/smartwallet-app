import React from 'react'
import { StyleSheet, Text } from 'react-native'
import { Container } from 'src/ui/structure'
import I18n from 'src/locales/i18n'
import strings from '../../../locales/strings'
import { Typography, Colors } from 'src/styles'

interface Props {}

const styles = StyleSheet.create({
  container: {
    backgroundColor: Colors.backgroundLightMain,
  },
  text: {
    ...Typography.baseFontStyles,
    fontSize: Typography.textXXL,
    textAlign: 'center',
    color: Colors.greyLight,
  },
})

export class RecordsComponent extends React.Component<Props> {
  render() {
    return (
      <Container style={styles.container}>
        <Text style={styles.text}>
          {I18n.t(strings.YOU_HAVENT_LOGGED_IN_TO_ANY_SERVICES_YET) + '.'}
        </Text>
      </Container>
    )
  }
}
