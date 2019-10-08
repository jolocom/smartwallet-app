import React from 'react'
import {
  StyleSheet,
  Text,
  Platform,
  View,
  Dimensions,
  TouchableHighlight,
  AppState,
  AppStateStatus,
  PermissionStatus,
} from 'react-native'
import { QrScanEvent } from 'src/ui/generic/qrcodeScanner'
import { NavigationScreenProps } from 'react-navigation'
import { Colors, Spacing } from '../../../styles'
import { black065, white } from '../../../styles/colors'
import {
  centeredText,
  fontMain,
  textSM,
  textXL,
  textXS,
} from '../../../styles/typography'
import I18n from 'src/locales/i18n'
import strings from 'src/locales/strings'
import { RNCamera } from 'react-native-camera'
import { TorchOffIcon, TorchOnIcon } from '../../../resources'
import { PermissionsAndroid } from 'react-native'
import AndroidOpenSettings from 'react-native-android-open-settings'

const QRScanner = require('react-native-qrcode-scanner').default

export interface QrScanEvent {
  data: string
}

interface Props extends NavigationScreenProps {
  onScannerSuccess: (e: QrScanEvent) => void
}

interface State {
  isTorch: boolean
  key: number
  permission: PermissionStatus
  isCamera: boolean
}

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
    paddingBottom: '6%',
  },
  notAuthorizedOverlay: {
    flex: 1,
    backgroundColor: Colors.black065,
    height: '100%',
    width: '100%',
    alignItems: 'center',
    zIndex: 1,
    justifyContent: 'center',
  },
  horizontalOverlay: {
    height: MARKER_SIZE,
    width: SCREEN_WIDTH,
    backgroundColor: black065,
  },
  descriptionText: {
    marginTop: Spacing.SM,
    color: Colors.sandLight,
    fontSize: textSM,
    paddingHorizontal: Spacing['3XL'],
    fontFamily: fontMain,
    lineHeight: 20,
    ...centeredText,
  },
  scanText: {
    color: Colors.sandLight,
    fontSize: textXL,
    fontFamily: fontMain,
    ...centeredText,
  },
  notAuthorizedDescription: {
    color: Colors.sandLight080,
    fontSize: textSM,
    paddingTop: Spacing.XS,
    paddingHorizontal: Spacing.XXL,
    fontFamily: fontMain,
    lineHeight: 24,
    ...centeredText,
  },
  permissionButton: {
    color: Colors.white,
    fontSize: textXS,
    textDecorationLine: 'underline',
    fontFamily: fontMain,
    lineHeight: 20,
    ...centeredText,
  },
  torch: {
    width: 80,
    height: 80,
    alignItems: 'center',
    justifyContent: 'center',
  },
})

export class QRCodeScanner extends React.Component<Props, State> {
  private scanner: typeof QRScanner
  private removeFocusListener: (() => void) | undefined

  public constructor(props: Props) {
    super(props)
    this.state = {
      isTorch: false,
      // NOTE: the key is used to invalidate the previously rendered component as
      // we need to rerender and remount the camera to ensure it is properly setup
      key: Date.now(),
      permission: PermissionsAndroid.RESULTS.DENIED,
      isCamera: false,
    }
  }

  public async componentDidMount(): Promise<void> {
    // NOTE: timeout the rendering of the camera to avoid the screen stuttering
    setTimeout(() => this.setState({ isCamera: true }), 200)
    const permission = await this.requestCameraPermission()
    if (this.props.navigation) {
      this.removeFocusListener = this.props.navigation.addListener(
        'willFocus',
        () => {
          if (permission === PermissionsAndroid.RESULTS.GRANTED) {
            this.scanner.reactivate()
            // NOTE: the re-render and the re-mount should only fire during the willFocus event
            this.setState({ key: Date.now() })
            // NOTE: force an update to force remounting of the Camera
            this.forceUpdate()
          }
        },
      ).remove
    }
  }

  public componentWillUnmount(): void {
    if (this.removeFocusListener) this.removeFocusListener()
  }

  private requestCameraPermission = async () => {
    const permission = await PermissionsAndroid.request(
      PermissionsAndroid.PERMISSIONS.CAMERA,
    )

    this.setState({
      permission,
    })

    return permission
  }

  // detect when the focus is back on the app screen after navigating
  // to settings, in order to check if the permissions changed
  private promiseOpenSettings = (cb: () => void) => {
    return new Promise((resolve, reject) => {
      const listener = (state: AppStateStatus) => {
        if (state === 'active') {
          AppState.removeEventListener('change', listener)
          resolve()
        }
      }
      AppState.addEventListener('change', listener)
      try {
        cb()
      } catch (e) {
        AppState.removeEventListener('change', listener)
        reject(e)
      }
    })
  }

  private openSettings = () => {
    if (Platform.OS === 'ios') {
      // navigate to iOS settings through DeepLink
    } else {
      this.promiseOpenSettings(AndroidOpenSettings.appDetailsSettings).then(
        this.requestCameraPermission,
      )
    }
  }

  private onTorchChange = (state: boolean) => {
    this.setState({
      isTorch: state,
    })
  }

  private renderCamera = () => {
    const { onScannerSuccess } = this.props
    const cameraProps = {
      key: this.state.key,
      captureAudio: false,
      flashMode: this.state.isTorch
        ? RNCamera.Constants.FlashMode.torch
        : RNCamera.Constants.FlashMode.off,
    }
    return (
      <React.Fragment>
        {/* NOTE: The QRScanner is positioned as absolute to
         allow the interaction menu on top of it */}
        {this.state.isCamera ? (
          <QRScanner
            containerStyle={{ position: 'absolute' }}
            cameraProps={cameraProps}
            ref={(ref: React.Component) => (this.scanner = ref)}
            fadeIn
            onRead={onScannerSuccess}
            cameraStyle={{ height: SCREEN_HEIGHT }}
          />
        ) : null}
        <View style={{ flexDirection: 'row' }}>
          <View style={styles.horizontalOverlay} />
          <View style={styles.rectangle} />
          <View style={styles.horizontalOverlay} />
        </View>
        <View style={styles.bottomOverlay}>
          <Text style={styles.descriptionText}>
            {I18n.t(
              strings.ITS_ALL_AUTOMATIC_JUST_PLACE_YOUR_PHONE_ABOVE_THE_CODE,
            )}
          </Text>

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
      </React.Fragment>
    )
  }

  private renderNoPermissionView = () => {
    return (
      <React.Fragment>
        <View style={styles.notAuthorizedOverlay}>
          <Text style={styles.scanText}>{I18n.t(strings.SCAN_QR)}</Text>
          <Text style={styles.notAuthorizedDescription}>
            {I18n.t(
              strings.ENABLE_ACCESS_SO_YOU_CAN_START_TAKING_PHOTOS_AND_VIDEOS,
            )}
          </Text>
        </View>
        <View style={styles.notAuthorizedOverlay}>
          <Text
            style={styles.permissionButton}
            onPress={async () => {
              if (
                this.state.permission ===
                PermissionsAndroid.RESULTS.NEVER_ASK_AGAIN
              ) {
                this.openSettings()
              } else {
                await this.requestCameraPermission()
              }
            }}
          >
            {I18n.t(strings.ENABLE_CAMERA_ACCESS)}
          </Text>
        </View>
      </React.Fragment>
    )
  }

  public render() {
    return this.state.permission === PermissionsAndroid.RESULTS.GRANTED
      ? this.renderCamera()
      : this.renderNoPermissionView()
  }
}
