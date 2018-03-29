import * as React from 'react'
import { Button } from 'react-native-material-ui'
import { StyleSheet, Text, View } from 'react-native'
import { MaskedImageComponent } from './maskedImage'

// const sjcl = require('node_modules/sjcl')
// const EntropyAgent = require('src/agents/entropy')
const JolocomTheme = require('src/styles/jolocom-theme')

const styles = StyleSheet.create({
  container: {
    backgroundColor: 'purple',
    display: 'flex',
    flexDirection: 'column',
    height: '100%',
    width: '100%'
  },
  footerButton: {
    backgroundColor: 'blue',
    position: 'absolute',
    bottom: 30,
    left: 90,
    right: 90
  },
  maskedImage: {
    backgroundColor: 'yellow',
    flex: 4,
    // position: 'absolute',
    // top: 0,
    // left:0,
    // right:0
  },
  header: {
    backgroundColor: 'purple',
    flex: 1,
    justifyContent: 'center'
  },
  text: {
    fontWeight: 'bold'
  }
})

export interface EntropyProps {
  drawUpon: any
  isDrawn: boolean
  submitEntropy: any
}

export interface EntropyState {
}

export class EntropyComponent extends React.Component<EntropyProps, EntropyState> {

  public render() {
  
    let Header = null

    if (!this.props.isDrawn) {
      Header = (
        <View style={styles.header}>
          <Text style={styles.text}> For security purposes, we need some randomness. 
          Please put your finger anywhere on the screen and draw on it randomly. 
          </Text>
        </View>
      )
    }

    return (

          <View style={styles.container}>
          { Header }
            <View style={styles.maskedImage}>
              <MaskedImageComponent
              drawUpon={this.props.drawUpon}
              />
            </View>
            <View style={styles.footerButton}>
              <Button
                raised={true}
                text="NEXT STEP"
                onPress={(this.props as any).submitEntropy}
              />
            </View>
          </View>
    )
  }
}