import React, { useEffect, useState } from 'react'
import {
  AppState,
  AppStateStatus,
  Platform,
  View,
} from 'react-native'
import {
  NavigationInjectedProps
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

  useEffect(() => {
    let focusListener
    if (navigation) {
      focusListener = navigation.addListener('willFocus', () => {
        // NOTE: the re-render and the re-mount should only fire during the willFocus event
        setRenderKey(Date.now())
      })
    }

    check(CAMERA_PERMISSION).then(perm => {
      setPermission(perm)
      if (perm !== RESULTS.GRANTED && perm !== RESULTS.BLOCKED) {
        requestCameraPermission()
      }
    })

    return focusListener && focusListener.remove
  }, [])

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
      />
    )
  } else if (permission === RESULTS.UNAVAILABLE) {
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
