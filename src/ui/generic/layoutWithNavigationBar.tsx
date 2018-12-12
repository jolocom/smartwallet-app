import React, { ReactNode } from 'react'
import { StyleSheet, View, TouchableOpacity } from 'react-native'

import { QRcodeScanner, QrScanEvent } from 'src/ui/generic/qrcodeScanner'
import { LoadingSpinner } from '.'
import { JolocomTheme } from 'src/styles/jolocom-theme'
import Icon from 'react-native-vector-icons/MaterialCommunityIcons'

const NAVIGATION_HEIGHT = 82
const NAVIGATION_CONTENT_HEIGHT = NAVIGATION_HEIGHT - 27

interface Props {
  onScannerSuccess: (jwt: string) => void,
  children: ReactNode,
  loading?: boolean,
}
interface State {
  scanning: boolean,
  loading: boolean
}

const styles = StyleSheet.create({
  navigationWrapper: {
    position: 'absolute',
    bottom: 0,
    height: NAVIGATION_HEIGHT,
    justifyContent: 'flex-end',
    alignItems: 'center',
    backgroundColor: 'transparent',
    width: '100%',
  },
  navigationContent: {
    height: NAVIGATION_CONTENT_HEIGHT,
    backgroundColor: JolocomTheme.primaryColorGrey,
    width: '100%',
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
  },
  navigationContentItem: {
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
  },
  contentLeft: {
    marginRight: 36
  },
  contentRight: {
    marginLeft: 36
  },
  childrenContainer: {
    width: '100%',
    paddingBottom: NAVIGATION_CONTENT_HEIGHT,
  },
  qrCodeButton: {
    position: 'absolute',
    bottom: 6,
    height: 72,
    width: 72,
    borderRadius: 35,
    backgroundColor: JolocomTheme.primaryColorPurple,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.8,
    shadowRadius: 2,
    elevation: 8,
  },
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

        <View style={styles.navigationWrapper}>
          <View style={styles.navigationContent}>
            <View style={[styles.navigationContentItem, styles.contentLeft]}>
            </View>
            <View style={[styles.navigationContentItem, styles.contentRight]}>
            </View>
          </View>
          
          <TouchableOpacity style={styles.qrCodeButton} onPress={this.onScannerStart}>
            <Icon size={30} name="qrcode-scan" color="white" />
          </TouchableOpacity>
        </View>
      </View>
    )
  }
}
