import React from 'react'
import { Container } from 'src/ui/structure/'
import { StyleSheet } from 'react-native'
import { JolocomTheme } from 'src/styles/jolocom-theme'
const loaders = require('react-native-indicator')

interface Props {}

const styles = StyleSheet.create({
  loadingContainer: {
    backgroundColor: 'white',
    padding: 0,
    position: 'absolute',
    // to cover things such as the qr code scanner
    zIndex: 1,
  },
})

export const LoadingSpinner: React.SFC<Props> = props => (
  <Container style={styles.loadingContainer}>
    <loaders.RippleLoader
      size={120}
      strokeWidth={4}
      color={JolocomTheme.primaryColorPurple}
    />
  </Container>
)
