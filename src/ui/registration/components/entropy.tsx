import * as React from 'react'
import { Button } from 'react-native-material-ui'
import { StyleSheet, View } from 'react-native'
import { JolocomTheme } from 'src/styles/jolocom-theme'
import { Block, Container, CenteredText } from 'src/ui/structure/'
import { MaskedImageComponent } from 'src/ui/registration/components/maskedImage'

const styles = StyleSheet.create({
  footerButton: {
    position: 'absolute',
    bottom: '5%'
  },
  text: {
    position: 'absolute',
    top: '20%',
    backgroundColor: JolocomTheme.jolocom.gray4,
    fontSize: JolocomTheme.textStyles.headline.fontSize,
    fontWeight: JolocomTheme.textStyles.headline.fontWeight,
    color: JolocomTheme.textStyles.headline.color
  }
})

interface Props {
  addPoint: (x: number, y: number) => void;
  submitEntropy: () => void;
  readonly isDrawn: boolean;
  readonly sufficientEntropy: boolean;
}

export const EntropyComponent : React.SFC<Props> = props => {
  const { isDrawn, sufficientEntropy } = props

  const msg = isDrawn ? 
    'For security purposes, we need some randomness.' +
    ' Please put your finger anywhere on the screen and draw' +
    ' on it randomly.'
    : ''

  return (
    <Container >
      <CenteredText style={ styles.text } msg={ msg } />
      <Block>
        <MaskedImageComponent
          addPoint={ props.addPoint }
        />
      </Block>
      <View style={ styles.footerButton }>
        <Button
          disabled={ !props.sufficientEntropy }
          raised={ true }
          text="NEXT STEP"
          onPress={ props.submitEntropy }
        />
      </View>
    </Container>
  )
}