import React from 'react'
import { StyleSheet, FlatList, Text } from 'react-native'
import { connect } from 'react-redux'
import { Container, JolocomButton } from 'src/ui/structure'
import { ThunkDispatch } from 'src/store'
import { NavigationScreenProps } from 'react-navigation'
import { Colors } from 'src/styles'
import { BleManager, Device } from 'react-native-ble-plx'
import { openSerialConnection, SerialConnection } from 'src/lib/ble'

interface Props
    extends ReturnType<typeof mapDispatchToProps>,
    NavigationScreenProps { }

interface State {
  devices: {
    [id: string]: string
  }
  connected: SerialConnection | null
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
    // private scanner: typeof QRScanner
    private removeFocusListener: (() => void) | undefined
    private ble: BleManager;

    constructor(props: Props) {
        super(props)
        this.state = {
            devices: {},
            connected: null
        }
        this.ble = new BleManager();
        this.ble.startDeviceScan(null, null, (error, device) => {
            if (error)
                console.log(error.toString());

            if (device) {
                this.setState({
                    devices: {
                        ...this.state.devices,
                        [device.id]: device
                    }
                })
            }
        })
    }

    componentWillUnmount() {
        if (this.removeFocusListener) this.removeFocusListener()
        this.ble.destroy();
    }

    onScannerCancel() {
        if (this.props.navigation) this.props.navigation.goBack()
    }

    render() {
        // const { onScannerSuccess } = this.props

        if (!this.state.connected) {
            const devices = this.state.devices
            return (
                <React.Fragment>
                    <Container style={styles.container}>
                    <FlatList data={Object.values(devices).map(d => ({ name: d.name, id: d.id }))}
                            renderItem={({ item }) => <JolocomButton
                                text={item.name || "rando"}
                                onPress={() => this.ble.connectToDevice(item.id, { requestMTU: 512 })
                                    .then(device => this.setState({ connected: device }))} />} />
                    </Container>
                </React.Fragment>
            )
        } else {
            const c = this.state.connected
            return (
                <React.Fragment>
                    <Text>{c.id}</Text>
                </React.Fragment>
            )
        }
    }
}

const mapDispatchToProps = (dispatch: ThunkDispatch) => ({
    // onScannerSuccess: async (e: QrScanEvent) => {
    // let interactionToken

    // try {
    // interactionToken = JolocomLib.parse.interactionToken.fromJWT(e.data)
    // } catch (err) {
    // return dispatch(
    // showErrorScreen(new AppError(ErrorCode.ParseJWTFailed, err)),
    // )
    // }

    // const handler = interactionHandlers[interactionToken.interactionType]

    // return handler
    // ? dispatch(withLoading(withErrorScreen(handler(interactionToken))))
    // : dispatch(
    // showErrorScreen(
    // new AppError(ErrorCode.Unknown, new Error('No handler found')),
    // ),
    // )
    // },
})

export const BLEScannerContainer = connect(
    null,
    mapDispatchToProps,
)(BLECodeScanner)
