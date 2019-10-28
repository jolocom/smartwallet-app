import React from 'react'
import { AppState, AppStateStatus, Platform } from 'react-native'
import { NavigationScreenProps } from 'react-navigation'
/* TODO: When using the latest react-native-permissions version, remove this dependency,
 since there is already a cross-platform openSettings method */
import { appDetailsSettings } from 'react-native-android-open-settings'
// TODO: using v1.2.1. When upgrading to RN60, use the latest version.
import Permissions, { Status } from 'react-native-permissions'
import { ScannerComponent } from '../component/scanner'
import { NoPermissionComponent } from '../component/noPermission'

interface Props extends NavigationScreenProps {
  onScannerSuccess: (jwt: string) => void
}

interface State {
  permission: Status
  isCameraAllowed: boolean
}

const CAMERA_PERMISSION = 'camera'

enum RESULTS {
  AUTHORIZED = 'authorized',
  RESTRICTED = 'restricted',
}

const IS_IOS = Platform.OS === 'ios'

export class ScannerContainer extends React.Component<Props, State> {
  public constructor(props: Props) {
    super(props)
    this.state = {
      permission: RESULTS.AUTHORIZED,
      isCameraAllowed: false
    }
  }

  public async componentDidMount(): Promise<void> {
    await this.requestCameraPermission()
  }

  private requestCameraPermission = async () => {
    const permission = await Permissions.request(CAMERA_PERMISSION)
    this.setState({
      permission,
      isCameraAllowed: permission === RESULTS.AUTHORIZED
    })
  }

  /*
   * detect when the focus is back on the app screen after navigating
   * to settings, in order to check if the permissions changed
   */
  private openSettings = () => {
    const listener = async (state: AppStateStatus) => {
      if (state === 'active') {
        AppState.removeEventListener('change', listener)
        await this.requestCameraPermission()
      }
    }

    AppState.addEventListener('change', listener)

    try {
      const openPlatformSettings = Platform.select({
        ios: Permissions.openSettings,
        android: appDetailsSettings,
      })
      openPlatformSettings()
    } catch (e) {
      AppState.removeEventListener('change', listener)
    }
  }

  private onEnablePermission = async () => {
    if (IS_IOS) {
      this.openSettings()
    } else {
      if (this.state.permission === RESULTS.RESTRICTED) {
        this.openSettings()
      } else {
        await this.requestCameraPermission()
      }
    }
  }

  public render() {
    const { onScannerSuccess, navigation } = this.props
    return this.state.permission === RESULTS.AUTHORIZED ? (
      <ScannerComponent
        isCameraAllowed={this.state.isCameraAllowed}
        onScannerSuccess={onScannerSuccess}
        navigation={navigation}
      />
    ) : (
      <NoPermissionComponent onPressEnable={this.onEnablePermission} />
    )
  }
}
