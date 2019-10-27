import React from 'react'
import { StyleSheet, FlatList, Text } from 'react-native'
import { connect } from 'react-redux'
import { Container, JolocomButton } from 'src/ui/structure'
import { ThunkDispatch } from 'src/store'
import { NavigationScreenProps } from 'react-navigation'
import { Colors } from 'src/styles'
import { BleManager } from 'react-native-ble-plx'
import { openSerialConnection, SerialConnection, BleSerialConnectionConfig } from 'src/lib/ble'
import { showErrorScreen } from 'src/actions/generic'
import { JolocomLib } from 'jolocom-lib'
import { AppError, ErrorCode } from 'src/lib/errors'
import { interactionHandlers } from 'src/lib/storage/interactionTokens'
import { withLoading, withErrorScreen } from 'src/actions/modifiers'
import { JSONWebToken, JWTEncodable } from 'jolocom-lib/js/interactionTokens/JSONWebToken';

interface Props
  extends ReturnType<typeof mapDispatchToProps>,
  NavigationScreenProps { }

interface State {
  devices: {
    [id: string]: string
  }
  connected: SerialConnection | null,
  rx: string
}

const serialUUIDs: BleSerialConnectionConfig = {
  serviceUUID: "6e400001-b5a3-f393-e0a9-e50e24dcca9e",
  rxUUID: "6e400002-b5a3-f393-e0a9-e50e24dcca9e",
  txUUID: "6e400003-b5a3-f393-e0a9-e50e24dcca9e"
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: Colors.backgroundLightMain,
  },
  buttonText: {
    color: Colors.blackMain,
  },
})

export class BLECodeScanner extends React.Component<Props, State> {
  private removeFocusListener: (() => void) | undefined
  private ble: BleManager

  constructor(props: Props) {
    super(props)
    this.state = {
      devices: {},
      connected: null,
      rx: '',
    }
    this.ble = new BleManager()
    this.ble.startDeviceScan([serialUUIDs.serviceUUID], null, (error, device) => {
      if (error) console.log(error.toString())

      if (device && device.name) {
        this.setState({
          devices: {
            ...this.state.devices,
            [device.id]: device.name,
          },
        })
      }
    })
  }

  componentWillUnmount() {
    if (this.removeFocusListener) this.removeFocusListener()
    this.state.connected
      ? this.state.connected.close()
      : null
  }

  onScannerCancel() {
    if (this.props.navigation) this.props.navigation.goBack()
  }

  render() {
    const rx = this.state.rx
    if (rx[rx.length - 1] === '\n' && this.state.connected) {
      const connection = this.state.connected
      this.props.onScannerSuccess(connection.respond)(rx)
    }

    if (!this.state.connected) {
      const devices = this.state.devices
      return (
        <React.Fragment>
          <Container style={styles.container}>
            <FlatList
              data={Object.keys(devices).map(id => ({
                name: devices[id],
                id,
              }))}
              renderItem={({ item }) => (
                <JolocomButton
                  text={item.name}
                  onPress={async () =>
                    this.ble
                      .connectToDevice(item.id, { requestMTU: 512 })
                      .then(device =>
                        device.discoverAllServicesAndCharacteristics(),
                      )
                      .then(device =>
                        openSerialConnection(this.ble)(device, serialUUIDs),
                      )
                      .then(serial => {
                        this.ble.stopDeviceScan()
                        this.setState({ connected: serial })
                        serial.listen(line =>
                          this.setState({
                            rx:
                              this.state.rx +
                              Buffer.from(line, 'Base64').toString('ascii'),
                          }),
                        )
                      })
                  }
                />
              )}
            />
          </Container>
        </React.Fragment>
      )
    } else {
      return (
        <React.Fragment>
          <Text>{this.state.rx}</Text>
        </React.Fragment>
      )
    }
  }
}

const mapDispatchToProps = (dispatch: ThunkDispatch) => ({
    onScannerSuccess: (send: (token: JSONWebToken<JWTEncodable>) => Promise<any>) => async (e: string) => {
    console.log(e)
    let interactionToken
    try {
      interactionToken = JolocomLib.parse.interactionToken.fromJWT(e)
    } catch (err) {
      return dispatch(
        showErrorScreen(new AppError(ErrorCode.ParseJWTFailed, err)),
      )
    }
    const handler = interactionHandlers[interactionToken.interactionType]
    return handler
      ? dispatch(withLoading(withErrorScreen(handler(interactionToken))))
      : dispatch(
          showErrorScreen(
            new AppError(ErrorCode.Unknown, new Error('No handler found')),
          ),
        )
  },
})

export const BLEScannerContainer = connect(
  null,
  mapDispatchToProps,
)(BLECodeScanner)
