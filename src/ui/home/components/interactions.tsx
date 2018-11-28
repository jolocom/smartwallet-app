import React from 'react'
import { StyleSheet } from 'react-native'
import { Block, Container, CenteredText } from 'src/ui/structure'
import { JolocomTheme } from 'src/styles/jolocom-theme'
import I18n from 'src/locales/i18n';

interface Props {
}

const styles = StyleSheet.create({
  text: {
    fontFamily: JolocomTheme.contentFontFamily,
    fontSize: 30,
    color: JolocomTheme.primaryColorBlack
  }
})

export class InteractionsComponent extends React.Component<Props> {
  render() {
    return (
      <Container>
        <Block>
        <CenteredText
          msg={ I18n.t('Coming Soon...') }
          style={ styles.text }
        />
        </Block>
      </Container>
    )
  }
}
