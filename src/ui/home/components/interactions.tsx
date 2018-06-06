import React from 'react'
import { StyleSheet } from 'react-native'
import { Block, Container, CenteredText } from 'src/ui/structure'
import { JolocomTheme } from 'src/styles/jolocom-theme'

interface Props {
}

const styles = StyleSheet.create({
  container: {
  },
  text: {
    fontFamily: JolocomTheme.contentFontFamily,
    fontSize: 30,
    color: JolocomTheme.primaryColorBlack
  }
})

export class InteractionsComponent extends React.Component<Props> {
  render() {
    return (
      <Container style={ styles.container }>
        <Block>
        <CenteredText
          msg='Coming Soon...' 
          style={ styles.text }
        />
        </Block>
      </Container>
    )
  }
}