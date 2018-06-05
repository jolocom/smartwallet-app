import React from 'react'
import { Button } from 'react-native-material-ui'
import { StyleSheet, View } from 'react-native'
import { JolocomTheme } from 'src/styles/jolocom-theme'
import { Block, Container, CenteredText } from 'src/ui/structure/'
import { MaskedImageComponent } from 'src/ui/registration/components/maskedImage'

interface Props {
  addPoint: (x: number, y: number) => void
  submitEntropy: () => void
  readonly progress : number
}

// TODO FONT WEIGHT REFERENCE FROM STYLES
const styles = StyleSheet.create({
  mainContainer:{
    backgroundColor: JolocomTheme.primaryColorBlack
  },
  footerButton: {
    position: 'absolute',
    bottom: '5%'
  },
  text: {
    position: 'absolute',
    top: '20%',
    backgroundColor: JolocomTheme.primaryColorBlack,
    fontSize: JolocomTheme.headerFontSize,
    fontFamily: JolocomTheme.contentFontFamily,
    fontWeight: '100',
    color: JolocomTheme.primaryColorSand
  },
  buttonContainer: {
    width: 164,
    height: 48,
    borderRadius: 4,
    backgroundColor: JolocomTheme.primaryColorPurple
  },
  buttonText: {
    fontFamily: JolocomTheme.contentFontFamily,
    color: JolocomTheme.primaryColorWhite,
    fontSize: JolocomTheme.headerFontSize,
    fontWeight: '100',
  },
  buttonTextDisabled: {
    fontFamily: JolocomTheme.contentFontFamily,
    color: 'rgba(255,255,255, 0.4)',
    fontSize: JolocomTheme.headerFontSize,
    fontWeight: '100',
  }
})

export const EntropyComponent : React.SFC<Props> = props => {
  const { progress, submitEntropy, addPoint } = props

  const msg = progress === 0 ?
    'For security purposes, we need some randomness.' +
    ' Please tap the screen and draw on it randomly' 
    : `${Math.trunc(progress * 100)} %`

  return (
    <Container style={ styles.mainContainer }>
      <CenteredText style={ styles.text } msg={ msg } />
      <Block>
        <MaskedImageComponent
          addPoint={ addPoint }
        />
      </Block>
      <View style={ styles.footerButton }>
        <Button
          style={ progress !== 1 ? { container: styles.buttonContainer, text: styles.buttonTextDisabled } : { container: styles.buttonContainer, text: styles.buttonText }}
          disabled={ progress !== 1 }
          upperCase={ false }
          raised={ true }
          text="Continue"
          onPress={ submitEntropy }
        />
      </View>
    </Container>
  )
}
