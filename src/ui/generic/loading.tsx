import React from 'react'
import { Container, CenteredText } from 'src/ui/structure/'
import { Dimensions, Image, StyleSheet } from 'react-native'
import { JolocomTheme } from 'src/styles/jolocom-theme'

const image = require('src/resources/img/splashScreen.png')

interface Props {}

const styles = StyleSheet.create({
  loadingContainer: {
    backgroundColor: JolocomTheme.primaryColorBlack,
  },
  loadingText: {
    position: 'absolute',
    bottom: '5%',
    fontSize: 12,
    fontFamily: JolocomTheme.contentFontFamily,
    color: JolocomTheme.primaryColorSand,
    opacity: 0.7
  }
})

export const LoadingScreen: React.SFC<Props> = (props) => {

  const viewWidth: number = Dimensions.get('window').width
  const viewHeight: number = Dimensions.get('window').height

  return(
    <Container style={ styles.loadingContainer }>
      <Image
        source= { image }
        style= {{ 
          bottom: '15%',
          width: viewWidth, 
          height: viewHeight/2
        }}
      />
      <CenteredText 
        style= { styles.loadingText }
        msg= { 'POWERED BY JOLOCOM' }/>
    </Container>
  )
}