import React from 'react'
import QRScanner, { Event } from 'react-native-qrcode-scanner'
import { NavigationScreenProps } from 'react-navigation'
import { RNCamera } from 'react-native-camera'
import {
  Dimensions,
  StyleSheet,
  Text,
  TouchableHighlight,
  View,
} from 'react-native'
import I18n from '../../../locales/i18n'
import strings from '../../../locales/strings'
import { TorchOffIcon, TorchOnIcon } from '../../../resources'
import { black065, white } from '../../../styles/colors'
import { Colors, Spacing } from '../../../styles'
import {
  centeredText,
  fontLight,
  textSubheader,
} from '../../../styles/typography'

const SCREEN_HEIGHT = Dimensions.get('window').height
const SCREEN_WIDTH = Dimensions.get('window').width
const MARKER_SIZE = SCREEN_WIDTH * 0.75

const styles = StyleSheet.create({
  rectangle: {
    height: MARKER_SIZE,
    width: MARKER_SIZE,
    borderRadius: 2,
    borderWidth: 2,
    borderColor: white,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'transparent',
  },
  bottomOverlay: {
    flex: 1,
    backgroundColor: Colors.black065,
    height: '100%',
    width: '100%',
    alignItems: 'center',
    zIndex: 1,
    justifyContent: 'space-between',
  },
  horizontalOverlay: {
    height: MARKER_SIZE,
    width: SCREEN_WIDTH,
    backgroundColor: black065,
  },
  descriptionText: {
    marginTop: Spacing.MD,
    color: Colors.sandLight,
    fontSize: textSubheader,
    width: MARKER_SIZE,
    fontFamily: fontLight,
    lineHeight: 22,
    ...centeredText,
  },
  torch: {
    width: 80,
    height: 80,
    alignItems: 'center',
    justifyContent: 'center',
  },
})

interface Props extends NavigationScreenProps {
  onScannerSuccess: (jwt: string) => void
}

interface State {
  isTorch: boolean
  reRenderKey: number
  isCameraReady: boolean
}

export class ScannerComponent extends React.Component<Props, State> {
  private scanner!: QRScanner
  private removeFocusListener: (() => void) | undefined

  public constructor(props: Props) {
    super(props)
    this.state = {
      isTorch: false,
      // NOTE: the key is used to invalidate the previously rendered component as
      // we need to rerender and remount the camera to ensure it is properly setup
      reRenderKey: Date.now(),
      isCameraReady: false,
    }
  }

  public async componentDidMount(): Promise<void> {
    // NOTE: timeout the rendering of the camera to avoid the screen stuttering
    setTimeout(() => this.setState({ isCameraReady: true }), 200)
    if (this.props.navigation) {
      this.removeFocusListener = this.props.navigation.addListener(
        'willFocus',
        () => {
          if (this.state.isCameraReady) {
            this.scanner.reactivate()
            // NOTE: the re-render and the re-mount should only fire during the willFocus event
            this.setState({ reRenderKey: Date.now() })
          }
        },
      ).remove
    }
  }

  public componentWillUnmount(): void {
    if (this.removeFocusListener) this.removeFocusListener()
  }

  private onTorchChange = (state: boolean) => {
    this.setState({
      isTorch: state,
    })
  }

  public render() {
    const { onScannerSuccess } = this.props
    const cameraProps = {
      key: this.state.reRenderKey,
      captureAudio: false,
      flashMode: this.state.isTorch
        ? RNCamera.Constants.FlashMode.torch
        : RNCamera.Constants.FlashMode.off,
    }

    return (
      <React.Fragment>
        {this.state.isCameraReady && (
          <QRScanner
            //@ts-ignore - see https://github.com/DefinitelyTyped/DefinitelyTyped/issues/29651
            containerStyle={{ position: 'absolute' }}
            cameraProps={cameraProps}
            ref={(ref: QRScanner) => (this.scanner = ref)}
            fadeIn
            onRead={(e: Event) => onScannerSuccess(e.data)}
            //@ts-ignore
            cameraStyle={StyleSheet.create({ height: SCREEN_HEIGHT })}
          />
        )}

        <View style={{ flexDirection: 'row' }}>
          <View style={styles.horizontalOverlay} />
          <View style={styles.rectangle} />
          <View style={styles.horizontalOverlay} />
        </View>
        <View style={styles.bottomOverlay}>
          <View style={{ flex: 1 }}>
            <Text style={styles.descriptionText}>
              {I18n.t(
                strings.ITS_ALL_AUTOMATIC_JUST_PLACE_YOUR_PHONE_ABOVE_THE_CODE,
              )}
            </Text>
          </View>
          <View
            style={{ flex: 3, alignItems: 'center', justifyContent: 'center' }}
          >
            <TouchableHighlight
              onPressIn={() => this.onTorchChange(true)}
              onPressOut={() => this.onTorchChange(false)}
              activeOpacity={1}
              underlayColor={'transparent'}
              style={styles.torch}
            >
              {this.state.isTorch ? <TorchOnIcon /> : <TorchOffIcon />}
            </TouchableHighlight>
          </View>
        </View>
      </React.Fragment>
    )
  }
}
