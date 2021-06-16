import { useState, useEffect } from 'react'
import { Platform, AppState, AppStateStatus } from 'react-native'
import Permissions from 'react-native-permissions'
import { useDisableLock } from '~/hooks/generic'

export enum Results {
  UNAVAILABLE = 'unavailable',
  DENIED = 'denied',
  BLOCKED = 'blocked',
  GRANTED = 'granted',
}

const useCameraPermissions = () => {
  const [permission, setPermission] = useState<Results>(Results.UNAVAILABLE)
  const disableLock = useDisableLock()

  useEffect(() => {
    requestPermission()
  }, [])

  const requestPermission = async () => {
    const permissionType = Platform.select({
      ios: Permissions.PERMISSIONS.IOS.CAMERA,
      android: Permissions.PERMISSIONS.ANDROID.CAMERA,
      // To avoid having @permissionType as undefined
      default: Permissions.PERMISSIONS.IOS.CAMERA,
    })
    const permission = (await disableLock(() =>
      Permissions.request(permissionType),
    )) as Results

    setPermission(permission)
  }

  const openSettings = () => {
    const listener = async (state: AppStateStatus) => {
      if (state === 'active') {
        AppState.removeEventListener('change', listener)
        await requestPermission()
      }
    }

    AppState.addEventListener('change', listener)

    try {
      Permissions.openSettings()
    } catch (e) {
      AppState.removeEventListener('change', listener)
    }
  }

  const handlePlatformPermissions = () => {
    Platform.select({
      ios: openSettings,
      android: () => {
        if (permission === Results.BLOCKED) {
          openSettings()
        } else requestPermission()
      },
      default: () => {},
    })()
  }

  return { permission, handlePlatformPermissions }
}

export default useCameraPermissions
