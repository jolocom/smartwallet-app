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

const styles = StyleSheet.create({
  footerButton: {
    position: 'absolute',
    bottom: '5%'
  },
  text: {
    position: 'absolute',
    top: '20%',
    backgroundColor: JolocomTheme.primaryColorBlack,
    fontSize: JolocomTheme.headerFontSize,
    color: JolocomTheme.primaryColorSand
  }
})

export const EntropyComponent : React.SFC<Props> = props => {
  const { progress, submitEntropy, addPoint } = props

  const msg = progress === 0 ?
    'For security purposes, we need some randomness.' +
    ' Please put your finger anywhere on the screen and draw' +
    ' on it randomly.'
    : `${Math.trunc(progress * 100)} %`

  return (
    <Container >
      <CenteredText style={ styles.text } msg={ msg } />
      <Block>
        <MaskedImageComponent
          addPoint={ addPoint }
        />
      </Block>
      <View style={ styles.footerButton }>
        <Button
          disabled={ progress !== 1 }
          raised={ true }
          text="NEXT STEP"
          onPress={ submitEntropy }
        />
      </View>
    </Container>
  )
}
