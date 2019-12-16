import React, { useEffect, useState } from 'react'
import {  AppState, AppStateStatus, Platform } from 'react-native'
import { NavigationScreenProps } from 'react-navigation'
/**
 * TODO: When using the latest react-native-permissions version, remove this
 * dependency, since there is already a cross-platform openSettings method
 */
import { appDetailsSettings } from 'react-native-android-open-settings'
// TODO: using v1.2.1. When upgrading to RN60, use the latest version.
import Permissions, { Status } from 'react-native-permissions'

import { ScannerComponent } from '../component/scanner'
import { NoPermissionComponent } from '../component/noPermission'

interface Props extends NavigationScreenProps {
  consumeToken: (jwt: string) => Promise<any>
}

const CAMERA_PERMISSION = 'camera'

enum RESULTS {
  AUTHORIZED = 'authorized',
  RESTRICTED = 'restricted',
}

const IS_IOS = Platform.OS === 'ios'

export const ScannerContainer = (props: Props) => {
  const { consumeToken, navigation } = props

  const [reRenderKey, setRenderKey] = useState(Date.now())
  const [permission, setPermission] = useState<Status>(RESULTS.RESTRICTED)
  const [isCameraReady, setCameraReady] = useState(false)

  useEffect(() => {
    let focusListener
    if (navigation) {
      focusListener = navigation.addListener('willFocus', () => {
        // NOTE: the re-render and the re-mount should only fire during the willFocus event
        setRenderKey(Date.now())
      })
    }

    requestCameraPermission().then(() => {
      setTimeout(() => setCameraReady(true), 200)
    })

    return focusListener && focusListener.remove
  }, [])

  const requestCameraPermission = async () => {
    const permission = await Permissions.request(CAMERA_PERMISSION)
    setPermission(permission)
  }

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

  return permission === RESULTS.AUTHORIZED ? (
    isCameraReady ? (
      <ScannerComponent
        reRenderKey={reRenderKey}
        onScan={consumeToken}
      />
    ) : null
  ) : (
    <NoPermissionComponent onPressEnable={onEnablePermission} />
  )
}

export const Scanner = ScannerContainer
