import React from 'react'
import { Text, StyleSheet, Platform, BackHandler } from 'react-native'
import { Container } from 'src/ui/structure'
import { JolocomTheme } from 'src/styles/jolocom-theme'
import { Button } from 'react-native-material-ui'
import { QrScanEvent } from '../containers/types'
const QRScanner = require('react-native-qrcode-scanner').default

interface Props {
  onScannerSuccess: (e: QrScanEvent) => void
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
    if (Platform.OS === 'android') {
      BackHandler.addEventListener('hardwareBackPress', () => {
        this.props.onScannerCancel()
        return true
      })
    }
  }

  componentWillUnmount() {
    BackHandler.removeEventListener('hardwareBackPress', this.props.onScannerCancel)
  }

  render() {
    const { onScannerSuccess, onScannerCancel } = this.props
    return (
      <Container>
        <QRScanner
          onRead={(e: QrScanEvent) => onScannerSuccess(e)}
          topContent={<Text>You can scan the qr code now!</Text>}
          bottomContent={<Button onPress={() => onScannerCancel()} style={{ text: styles.buttonText }} text="Cancel" />}
        />
      </Container>
    )
  }
}
