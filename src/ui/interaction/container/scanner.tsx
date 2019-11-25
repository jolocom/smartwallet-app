import React, { useEffect, useState } from 'react'
import { AppState, AppStateStatus, Platform } from 'react-native'
import {
  NavigationEventSubscription,
  NavigationScreenProps,
} from 'react-navigation'
/* TODO: When using the latest react-native-permissions version, remove this dependency,
 since there is already a cross-platform openSettings method */
import { appDetailsSettings } from 'react-native-android-open-settings'
// TODO: using v1.2.1. When upgrading to RN60, use the latest version.
import Permissions, { Status } from 'react-native-permissions'
import { ScannerComponent } from '../component/scanner'
import { NoPermissionComponent } from '../component/noPermission'
import { JolocomLib } from 'jolocom-lib'
import {
  JSONWebToken,
  JWTEncodable,
} from 'jolocom-lib/js/interactionTokens/JSONWebToken'

interface Props extends NavigationScreenProps {
  onScannerSuccess: (interactionToken: JSONWebToken<JWTEncodable>) => void
}

const CAMERA_PERMISSION = 'camera'

enum RESULTS {
  AUTHORIZED = 'authorized',
  RESTRICTED = 'restricted',
}

const IS_IOS = Platform.OS === 'ios'

export const ScannerContainer = (props: Props) => {
  const [reRenderKey, setRenderKey] = useState<number>(Date.now())
  const [permission, setPermission] = useState<Status>(RESULTS.AUTHORIZED)
  const [isCameraAllowed, allowCamera] = useState<boolean>(false)
  const [isCameraReady, setCameraReady] = useState<boolean>(false)
  const [isTorch, setTorch] = useState<boolean>(false)

  useEffect(() => {
    let focusListener: NavigationEventSubscription
    if (navigation) {
      focusListener = navigation.addListener('willFocus', () => {
        // NOTE: the re-render and the re-mount should only fire during the willFocus event
        setRenderKey(Date.now())
      })
    }

    requestCameraPermission().then(() => {
      setTimeout(() => setCameraReady(true), 200)
    })

    return () => focusListener.remove()
  }, [])

  const requestCameraPermission = async () => {
    const permission = await Permissions.request(CAMERA_PERMISSION)
    setPermission(permission)
    allowCamera(permission === RESULTS.AUTHORIZED)
  }

  /*
   * detect when the focus is back on the app screen after navigating
   * to settings, in order to check if the permissions changed
   */
  const openSettings = () => {
    const listener = async (state: AppStateStatus) => {
      if (state === 'active') {
        AppState.removeEventListener('change', listener)
        await requestCameraPermission()
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

  const onEnablePermission = async () => {
    if (IS_IOS) {
      openSettings()
    } else {
      if (permission === RESULTS.RESTRICTED) {
        openSettings()
      } else {
        await requestCameraPermission()
      }
    }
  }

  const parseJWT = (jwt: string) => {
    let interactionToken: JSONWebToken<JWTEncodable>
    try {
      interactionToken = JolocomLib.parse.interactionToken.fromJWT(jwt)
    } catch (e) {
      return false
    }
    onScannerSuccess(interactionToken)
    return true
  }

  const { onScannerSuccess, navigation } = props

  return permission === RESULTS.AUTHORIZED ? (
    <ScannerComponent
      reRenderKey={reRenderKey}
      isCameraAllowed={isCameraAllowed}
      parseJWT={parseJWT}
      navigation={navigation}
      isCameraReady={isCameraReady}
      isTorchPressed={isTorch}
      onPressTorch={(state: boolean) => setTorch(state)}
    />
  ) : (
    <NoPermissionComponent onPressEnable={onEnablePermission} />
  )
}
