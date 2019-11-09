import React from 'react'
import { StyleSheet, FlatList } from 'react-native'
import { connect } from 'react-redux'
import { Container, JolocomButton } from 'src/ui/structure'
import { ThunkDispatch } from 'src/store'
import { NavigationScreenProps } from 'react-navigation'
import { Colors } from 'src/styles'
import { BleManager } from 'react-native-ble-plx'
import { openSerialConnection, BleSerialConnectionConfig } from 'src/lib/ble'
import { showErrorScreen } from 'src/actions/generic'
import { JolocomLib } from 'jolocom-lib'
import { AppError, ErrorCode } from 'src/lib/errors'
import { interactionHandlers } from 'src/lib/storage/interactionTokens'
import { withLoading, withErrorScreen } from 'src/actions/modifiers'
import { SendResponse } from 'src/lib/transportLayers'
import { InteractionType } from 'jolocom-lib/js/interactionTokens/types';

interface Props
  extends ReturnType<typeof mapDispatchToProps>,
  NavigationScreenProps { }

interface State {
  devices: {
    [id: string]: string
  }
}

const serialUUIDs: BleSerialConnectionConfig = {
  serviceUUID: '6e400001-b5a3-f393-e0a9-e50e24dcca9e',
  rxUUID: '6e400002-b5a3-f393-e0a9-e50e24dcca9e',
  txUUID: '6e400003-b5a3-f393-e0a9-e50e24dcca9e',
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: Colors.backgroundLightMain,
  },
  buttonText: {
    color: Colors.blackMain,
  },
})

class BLECodeScanner extends React.Component<Props, State> {
  private removeFocusListener: (() => void) | undefined
  private ble: BleManager

  constructor(props: Props) {
    super(props)
    this.state = {
      devices: {},
    }
    this.ble = new BleManager()
    this.ble.startDeviceScan(
      [serialUUIDs.serviceUUID],
      null,
      (error, device) => {
        if (error) console.log(error.toString())

        if (device && device.name) {
          this.setState({
            devices: {
              ...this.state.devices,
              [device.id]: device.name,
            },
          })
        }
      },
    )
  }

  componentWillUnmount() {
    if (this.removeFocusListener) this.removeFocusListener()
  }

  onScannerCancel() {
    if (this.props.navigation) this.props.navigation.goBack()
  }

  render() {
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
                    .then(device => {
                      this.ble.stopDeviceScan()
                      return device.discoverAllServicesAndCharacteristics()
                    })
                    .then(device =>
                      openSerialConnection(this.ble)(device, serialUUIDs)(
                        this.props.onScannerSuccess,
                      )
                    )
                }
              />
            )}
          />
        </Container>
      </React.Fragment>
    )
  }
}

const mapDispatchToProps = (dispatch: ThunkDispatch) => ({
  onScannerSuccess: (
    send: SendResponse,
  ) => async (e: string) => {
    let interactionToken
    try {
      interactionToken = JolocomLib.parse.interactionToken.fromJWT(e)
    } catch (err) {
      return dispatch(
        showErrorScreen(new AppError(ErrorCode.ParseJWTFailed, err)),
      )
    }
    const handler = interactionHandlers[interactionToken.interactionType]
    return handler && interactionToken.interactionType !== InteractionType.CredentialOfferRequest
      ? dispatch(withLoading(withErrorScreen(handler(interactionToken, send))))
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
