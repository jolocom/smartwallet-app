import { useIsFocused } from '@react-navigation/core'
import {
  useEffect,
  useState,
  useCallback,
  useRef,
  Dispatch,
  SetStateAction,
  useLayoutEffect,
} from 'react'
import { Platform, StatusBar } from 'react-native'
import SoftInputMode from 'react-native-set-soft-input-mode'
import { useDispatch } from 'react-redux'
import { setPopup } from '~/modules/appState/actions'
import useErrors from './useErrors'

export const useForceUpdate = () => {
  const [, setTick] = useState(0)

  return useCallback(() => {
    setTick((tick) => tick + 1)
  }, [])
}

export const useHideStatusBar = () => {
  const isFocused = useIsFocused()
  const { errorScreen } = useErrors()

  useLayoutEffect(() => {
    isFocused ? StatusBar.setHidden(true) : StatusBar.setHidden(false)

    return () => {
      StatusBar.setHidden(false)
    }
  }, [isFocused])

  useEffect(() => {
    !!errorScreen ? StatusBar.setHidden(false) : StatusBar.setHidden(true)
  }, [errorScreen])
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
 * This hook is responsible for toggling a
 * state back to its initial state after 100ms
 * @param state
 * @param updateState
 */
export const useRevertToInitialState = (
  state: boolean,
  updateState: Dispatch<SetStateAction<boolean>>,
  delay: number = 100,
) => {
  useEffect(() => {
    if (state) {
      setTimeout(() => {
        updateState((prevValue) => !prevValue)
      }, delay)
    }
  }, [state])
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
