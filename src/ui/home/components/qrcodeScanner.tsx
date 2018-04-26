import React from 'react'
import { Text, StyleSheet, Platform, BackHandler } from 'react-native'
import { Container } from 'src/ui/structure'
import { JolocomTheme } from 'src/styles/jolocom-theme'
import { Button } from 'react-native-material-ui'

const QRScanner = require('react-native-qrcode-scanner').default



interface Props {
  onScannerSuccess: (e : any) => void
  onScannerCancel: () => void
}

interface State {
  listener: any
}

const styles = StyleSheet.create({
  buttonText: {
    color: JolocomTheme.palette.primaryColor
  }
})

export class QRcodeScanner extends React.Component<Props, State> {
  state = {
    listener: null
  }

  componentDidMount() {
    if (Platform.OS == "android" && this.state.listener == null) {
      this.setState({
        listener: BackHandler.addEventListener('hardwareBackPress', () => {
          this.props.onScannerCancel()
        })
      })
    }
  }

  componentWillUnmount() {
    this.setState({
      listener: null
    })
  }

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
