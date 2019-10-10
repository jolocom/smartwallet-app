import React from 'react'
import {
  AppState,
  AppStateStatus,
  Dimensions,
  Platform,
  StyleSheet,
  Text,
  TouchableHighlight,
  View,
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
/* TODO: When using the latest react-native-permissions version, remove this dependency,
 since there is already a cross-platform openSettings method */
import { appDetailsSettings } from 'react-native-android-open-settings'
// TODO: using v1.2.1. When upgrading to RN60, use the latest version.
import Permissions, { Status } from 'react-native-permissions'

export interface QrScanEvent {
  data: string
}

interface Props extends NavigationScreenProps {
  onScannerSuccess: (e: QrScanEvent) => void
}

interface State {
  isTorch: boolean
  key: number
  permission: Status
  isCamera: boolean
}

interface PermissionResults {
  AUTHORIZED: Status
  DENIED: Status
  RESTRICTED: Status
}

const QRScanner = require('react-native-qrcode-scanner').default

const CAMERA_PERMISSION = 'camera'
const RESULTS: PermissionResults = {
  AUTHORIZED: 'authorized',
  DENIED: 'denied',
  RESTRICTED: 'restricted',
}

const IS_IOS = Platform.OS === 'ios'
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
    marginBottom: Spacing.XXL,
    fontFamily: fontMain,
    lineHeight: 24,
    ...centeredText,
  },
  androidPermissionButton: {
    color: Colors.white,
    fontSize: textXS,
    textDecorationLine: 'underline',
    fontFamily: fontMain,
    lineHeight: 20,
    ...centeredText,
  },
  iosPermissionButton: {
    color: Colors.nativeBlue,
    fontSize: textXS,
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
      permission: RESULTS.DENIED,
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
          if (permission === RESULTS.AUTHORIZED) {
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
    const permission = await Permissions.request(CAMERA_PERMISSION)

    this.setState({
      permission,
    })
    return permission
  }

  // detect when the focus is back on the app screen after navigating
  // to settings, in order to check if the permissions changed
  private promiseOpenSettings = (cb: () => void) =>
    new Promise((resolve, reject) => {
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

  private openSettings = () => {
    if (IS_IOS) {
      this.promiseOpenSettings(Permissions.openSettings).then(
        this.requestCameraPermission,
      )
    } else {
      this.promiseOpenSettings(appDetailsSettings).then(
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

  private renderNoPermissionView = () => (
    <React.Fragment>
      <View style={styles.notAuthorizedOverlay}>
        <Text style={styles.scanText}>{I18n.t(strings.SCAN_QR)}</Text>
        <Text style={styles.notAuthorizedDescription}>
          {I18n.t(
            strings.ENABLE_ACCESS_SO_YOU_CAN_START_TAKING_PHOTOS_AND_VIDEOS,
          )}
        </Text>
        <Text
          style={
            IS_IOS ? styles.iosPermissionButton : styles.androidPermissionButton
          }
          onPress={async () => {
            if (IS_IOS) {
              this.openSettings()
            } else {
              if (this.state.permission === RESULTS.RESTRICTED) {
                this.openSettings()
              } else {
                await this.requestCameraPermission()
              }
            }
          }}
        >
          {I18n.t(strings.ENABLE_CAMERA_ACCESS)}
        </Text>
      </View>
      <View style={styles.notAuthorizedOverlay} />
    </React.Fragment>
  )

  public render() {
    return this.state.permission === RESULTS.AUTHORIZED
      ? this.renderCamera()
      : this.renderNoPermissionView()
  }
}
