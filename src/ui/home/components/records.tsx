import React from 'react'
import { StyleSheet } from 'react-native'
import { Block, Container, CenteredText } from 'src/ui/structure'
import { JolocomTheme } from 'src/styles/jolocom-theme'
import I18n from 'src/locales/i18n'
import en from '../../../locales/en'

interface Props {}

const styles = StyleSheet.create({
  text: {
    fontFamily: JolocomTheme.contentFontFamily,
    fontSize: 30, // FIXME
    color: '#959595', // FIXME
  },
})

export class RecordsComponent extends React.Component<Props> {
  render() {
    return (
      <Container>
        <Block>
          <CenteredText
            msg={I18n.t(en.YOU_HAVENT_LOGGED_IN_TO_ANY_SERVICES_YET) + '.'}
            style={styles.text}
          />
        </Block>
      </Container>
    )
  }
}
