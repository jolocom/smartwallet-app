import { useState, useEffect } from 'react'
import { Platform, AppState, AppStateStatus } from 'react-native'
import Permissions from 'react-native-permissions'
import { useDispatch } from 'react-redux'
import { setPopup } from '~/modules/appState/actions'

export enum Results {
  UNAVAILABLE = 'unavailable',
  DENIED = 'denied',
  BLOCKED = 'blocked',
  GRANTED = 'granted',
}

const useCameraPermissions = () => {
  const [permission, setPermission] = useState<Results>(Results.UNAVAILABLE)
  const dispatch = useDispatch()

  useEffect(() => {
    requestPermission()
  }, [])

  const requestPermission = async () => {
    dispatch(setPopup(true))
    const permissionType = Platform.select({
      ios: Permissions.PERMISSIONS.IOS.CAMERA,
      android: Permissions.PERMISSIONS.ANDROID.CAMERA,
      // To avoid having @permissionType as undefined
      default: Permissions.PERMISSIONS.IOS.CAMERA,
    })
    const permission = (await Permissions.request(permissionType)) as Results
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
