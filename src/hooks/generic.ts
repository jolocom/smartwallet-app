import { useEffect, useState, useCallback, useRef } from 'react'
import { Platform, StatusBar } from 'react-native'
import SoftInputMode from 'react-native-set-soft-input-mode'
import { useDispatch } from 'react-redux'
import { setPopup } from '~/modules/appState/actions'

export const useForceUpdate = () => {
  const [, setTick] = useState(0)

  return useCallback(() => {
    setTick((tick) => tick + 1)
  }, [])
}

export const useHideStatusBar = () => {
  useEffect(() => {
    StatusBar.setHidden(true)

    return () => {
      StatusBar.setHidden(false)
    }
  }, [])
}

export const usePrevious = <T extends unknown>(value: T) => {
  const ref = useRef<T | undefined>()
  useEffect(() => {
    ref.current = value
  }, [JSON.stringify(value)])
  return ref.current
}

/**
 * Changes the Keyboard input mode to @adjustResize on @Android
 */
export const useAdjustResizeInputMode = () => {
  useEffect(() => {
    if (Platform.OS === 'android') {
      SoftInputMode.set(SoftInputMode.ADJUST_RESIZE)
      return () => {
        SoftInputMode.set(SoftInputMode.ADJUST_PAN)
      }
    }
  }, [])
}

/**
 * Calls a Promise which puts the app in background (e.g. external modals)
 * without triggering the Lock Screen.
 */
export const useDisableLock = () => {
  const dispatch = useDispatch()

  return async <T>(cb: () => Promise<T>) => {
    dispatch(setPopup(true))
    const result = await cb()
    dispatch(setPopup(false))

    return result
  }
}
