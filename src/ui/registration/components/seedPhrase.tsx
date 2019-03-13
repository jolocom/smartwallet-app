import React from 'react'
import { StyleSheet } from 'react-native'
import { JolocomTheme } from 'src/styles/jolocom-theme'
import { Container, Block, CenteredText } from 'src/ui/structure/'
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
  phrase: {
    paddingLeft: '3%',
    paddingRight: '3%',
    color: JolocomTheme.primaryColorWhite,
    fontSize: 34,
    fontFamily: JolocomTheme.contentFontFamily,
    lineHeight: 38,
  },
  sideNote: {
    paddingLeft: '5%',
    paddingRight: '5%',
    lineHeight: 26,
    color: JolocomTheme.primaryColorSand,
    fontSize: JolocomTheme.labelFontSize,
    fontFamily: JolocomTheme.contentFontFamily,
  },
  footerButton: {
    position: 'absolute',
    bottom: '5%',
  },
  buttonContainer: {
    width: 225,
    height: 50,
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

export const SeedPhrase: React.SFC<Props> = props => {
  return (
    <Container style={styles.container}>
      <Block flex={0.1}>
        <CenteredText
          style={styles.sideNote}
          msg={
            I18n.t('Write these words down on an analog and secure place') +
            '.\n ' +
            I18n.t('Without these words, you cannot access your wallet again') +
            '.'
          }
        />
      </Block>
      <Block flex={0.6}>
        <CenteredText style={styles.phrase} msg={props.seedPhrase} />
      </Block>
      <Block style={styles.footerButton}>
        <Button
          style={{ container: styles.buttonContainer, text: styles.buttonText }}
          onPress={props.handleButtonTap}
          raised
          upperCase={false}
          text={I18n.t('Yes, I wrote it down')}
        />
      </Block>
    </Container>
  )
}
