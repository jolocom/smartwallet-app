import React, { useEffect, useState } from 'react'
import {
  AppState,
  AppStateStatus,
  Platform,
  View,
} from 'react-native'
import {
  NavigationInjectedProps, NavigationEventSubscription
} from 'react-navigation'

import { PERMISSIONS, RESULTS, request, openSettings, check, Permission } from 'react-native-permissions'

import { ScannerComponent } from '../component/scanner'
import { NoPermissionComponent } from '../component/noPermission'
import { Colors } from 'src/styles'

interface Props extends NavigationInjectedProps {
  consumeToken: (jwt: string) => Promise<any>
}

const CAMERA_PERMISSION = Platform.select({
  android: PERMISSIONS.ANDROID.CAMERA,
  ios: PERMISSIONS.IOS.CAMERA
}) as Permission

export const ScannerContainer: React.FC<Props> = (props) => {
  const { consumeToken, navigation } = props
  const [reRenderKey, setRenderKey] = useState(Date.now())
  const [permission, setPermission] = useState<string>(RESULTS.UNAVAILABLE)
  const [scannerRef, setScannerRef] = useState(null)

  // NOTE: this is needed because QRScanner behaves weirdly when the screen is
  // remounted....
  // @ts-ignore
  if (scannerRef) scannerRef.reactivate()

  const rerender = () => {
    setRenderKey(Date.now())
    // @ts-ignore
    if (scannerRef) scannerRef.reactivate()
  }

  useEffect(() => {
    let listeners: NavigationEventSubscription[] = []
    if (navigation) {
      listeners.push(navigation.addListener('didFocus', () => {
        rerender()
        checkCameraPermissions()
      }))
    } else {
      checkCameraPermissions()
    }

    return () => listeners.forEach(l => l.remove())
  }, [])

  const checkCameraPermissions = async () => {
    return check(CAMERA_PERMISSION).then(perm => {
      setPermission(perm)
      if (perm !== RESULTS.GRANTED && perm !== RESULTS.BLOCKED) {
        requestCameraPermission()
      }
    })
  }

  const requestCameraPermission = async () => {
    const permission = await request(CAMERA_PERMISSION)
    setPermission(permission)
  }

  const tryOpenSettings = () => {
    const listener = async (state: AppStateStatus) => {
      if (state === 'active') {
        AppState.removeEventListener('change', listener)
        await requestCameraPermission()
      }
    }

    AppState.addEventListener('change', listener)

    try {
      openSettings()
    } catch (e) {
      AppState.removeEventListener('change', listener)
    }
  }

  const onEnablePermission = async () => {
    if (permission === RESULTS.BLOCKED) {
      tryOpenSettings()
    } else {
      await requestCameraPermission()
    }
  }

  if (permission === RESULTS.GRANTED) {
    return (
      <ScannerComponent
        reRenderKey={reRenderKey}
        onScan={consumeToken}
        onScannerRef={r => setScannerRef(r)}
      />
    )
  } else if (permission === RESULTS.UNAVAILABLE) {
    // TODO: maybe add a message here like "do you even camera?"
    return (
      <View
        style={{
          width: '100%',
          height: '100%',
          backgroundColor: Colors.black065,
        }}
      />
    )
  } else {
    return <NoPermissionComponent onPressEnable={onEnablePermission} />
  }
}

export const Scanner = ScannerContainer
