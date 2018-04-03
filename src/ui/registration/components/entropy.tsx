import * as React from 'react'
import { Button } from 'react-native-material-ui'
import { StyleSheet, Text, View, TextStyle } from 'react-native'
import { JolocomTheme } from 'src/styles/jolocom-theme'
import { CenteredText } from 'src/ui/structure/'

import { MaskedImageComponent } from './maskedImage'

const styles = StyleSheet.create({
  container: {
    backgroundColor: JolocomTheme.palette.primaryColor,
    display: 'flex',
    flexDirection: 'column',
    height: '100%',
    width: '100%'
  },
  footerButton: {
    position: 'absolute',
    bottom: 30,
    left: 90,
    right: 90
  },
  maskedImage: {
    flex: 1
  },
  text: {
    position: 'absolute',
    top: '20%',
    backgroundColor: JolocomTheme.palette.primaryColor,
    fontSize: JolocomTheme.textStyles.headline.fontSize,
    fontWeight: JolocomTheme.textStyles.headline.fontWeight,
    color: JolocomTheme.textStyles.headline.color
  }
})

export interface EntropyProps {
  addPoint: (x: number, y: number) => void
  drawUpon: () => void
  submitEntropy: () => void
  readonly isDrawn: boolean
  readonly sufficientEntropy: boolean
}

export interface EntropyState {
}

export const EntropyComponent : React.SFC<EntropyProps> = props => {
  const { isDrawn, sufficientEntropy } = props
  
    let Header = null

    if (!props.isDrawn) {
      Header = (
          <CenteredText 
            style={styles.text}
            msg={ 'For security purposes, we need some randomness.' +
            ' Please put your finger anywhere on the screen and draw' + 
            ' on it randomly.' }
          /> 
      )
    }

  return (

        <View style={ styles.container }>
          { Header }
          <View style={ styles.maskedImage }>
            <MaskedImageComponent
            addPoint={ props.addPoint }
            drawUpon={ props.drawUpon }
            />
          </View>
          <View style={ styles.footerButton }>
            <Button
              disabled={!props.sufficientEntropy}
              raised={ true }
              text="NEXT STEP"
              onPress={ props.submitEntropy }
            />
          </View>
        </View>
  )
}