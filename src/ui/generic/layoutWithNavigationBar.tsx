import React, { ReactNode } from 'react'
import { StyleSheet, View, TouchableOpacity } from 'react-native'

import { QRcodeScanner, QrScanEvent } from 'src/ui/generic/qrcodeScanner'
import { LoadingSpinner } from '.'
import { JolocomTheme } from 'src/styles/jolocom-theme'
import Icon from 'react-native-vector-icons/MaterialCommunityIcons'

const NAVIGATION_HEIGHT = 70

interface Props {
  onScannerSuccess: (jwt: string) => void,
  children: ReactNode,
  loading: boolean,
}
interface State {
  scanning: boolean,
  loading: boolean
}

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    bottom: 0,
    height: NAVIGATION_HEIGHT,
    width: '100%',
    justifyContent: 'space-around',
    alignItems: 'center',
    backgroundColor: JolocomTheme.primaryColorGrey
  },
  qrCodeButton: {
    height: 55,
    width: 55,
    borderRadius: 35,
    backgroundColor: JolocomTheme.primaryColorPurple,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.8,
    shadowRadius: 2,
    elevation: 8
  },
  childrenContainer: {
    width: '100%',
    paddingBottom: NAVIGATION_HEIGHT
  }
}) 

export class LayoutWithNavigationBar extends React.Component<Props, State> {
  state = {
    scanning: false,
    loading: false,
  }

  private onScannerStart = (): void => {
    this.setState({ scanning: true })
    this.setState({ loading: true })
  }

  private onScannerCancel = (): void => {
    this.setState({ scanning: false })
    this.setState({ loading: false })
  }

  private onScannerSuccess = (e: QrScanEvent): void => {
    this.setState({ scanning: false })
    this.props.onScannerSuccess(e.data)
    this.setState({ loading: false })
  }

  render() {
    if (this.state.scanning) {
      return <QRcodeScanner onScannerSuccess={this.onScannerSuccess} onScannerCancel={this.onScannerCancel} />
    }

    if (this.state.loading || this.props.loading) {
      return <LoadingSpinner />
    }

    return (
      <View>
        <View style={styles.childrenContainer}>
          {this.props.children}
        </View>

        <View style={styles.container}>
          <TouchableOpacity style={styles.qrCodeButton} onPress={this.onScannerStart}>
            <Icon size={30} name="qrcode-scan" color="white" />
          </TouchableOpacity>
        </View>
      </View>
    )
  }
}
