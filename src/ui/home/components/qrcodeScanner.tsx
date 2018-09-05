import React from 'react'
import { Text, StyleSheet, Platform, BackHandler } from 'react-native'
import { Container } from 'src/ui/structure'
import { JolocomTheme } from 'src/styles/jolocom-theme'
import { Button } from 'react-native-material-ui'
const QRScanner = require('react-native-qrcode-scanner').default

// TODO Typings on E, Event is not enough
interface Props {
  onScannerSuccess: (e : Event) => void
  onScannerCancel: () => void
}

interface State {}

const styles = StyleSheet.create({
  buttonText: {
    color: JolocomTheme.primaryColorBlack
  }
})

// TODO The Listener is never removed it seems
export class QRcodeScanner extends React.Component<Props, State> {
  componentDidMount() {
    if (Platform.OS === "android") {
      // TODO Return true?
      BackHandler.addEventListener('hardwareBackPress', () => {
        this.props.onScannerCancel()
      })
    }
  }

  render() {
    const { onScannerSuccess, onScannerCancel } = this.props
    return (
      <Container>
        <QRScanner
          onRead={(e : Event) => onScannerSuccess(e) }
          topContent={
            <Text>You can scan the qr code now!</Text>
          }
          bottomContent={
            <Button
              onPress={ () => onScannerCancel() }
              style={{ text: styles.buttonText }}
              text="Cancel"
            />
          }
        />
      </Container>
    )
  }
}
