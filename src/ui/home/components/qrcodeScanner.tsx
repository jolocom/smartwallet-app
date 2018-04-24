import React from 'react'
import { View, Text, TextInput, StyleSheet, Linking, TouchableOpacity } from 'react-native'
import { Container, Block } from 'src/ui/structure'
import { JolocomTheme } from 'src/styles/jolocom-theme'
const QRScanner = require('react-native-qrcode-scanner').default
import { Button } from 'react-native-material-ui'


interface Props {
  onScannerSuccess: (e : any) => void
  onScannerCancel: () => void
}

interface State {
}

const styles = StyleSheet.create({
  buttonText: {
    color: JolocomTheme.palette.primaryColor
  }
})

export class QRcodeScanner extends React.Component<Props, State> {

  render() {
    const { onScannerSuccess, onScannerCancel } = this.props
    return (
      <Container>
        <QRScanner
          onRead={(e : any) => onScannerSuccess(e) }
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
