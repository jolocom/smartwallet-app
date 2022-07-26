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
import { useDispatch, useSelector } from 'react-redux'
import { setPopup } from '~/modules/appState/actions'
import { getLoaderState } from '~/modules/loader/selectors'
import useErrors from './useErrors'

export const useForceUpdate = () => {
  const [, setTick] = useState(0)

  return useCallback(() => {
    setTick((tick) => tick + 1)
  }, [])
}

/**
 * Used to hide the StatusBar on an individual screen.
 *
 * NODE: was previously used for the Scanner screen, but currently not used anywhere.
 */
export const useHideStatusBar = () => {
  const isFocused = useIsFocused()
  const { errorScreen } = useErrors()
  const { isVisible: isLoaderVisible } = useSelector(getLoaderState)

  const hide = () => {
    StatusBar.setHidden(true)
  }
  const show = () => {
    StatusBar.setHidden(false)
  }

  useLayoutEffect(() => {
    isFocused ? hide() : show()

    return () => {
      show()
    }
  }, [isFocused])

  useLayoutEffect(() => {
    errorScreen ? show() : hide()
  }, [errorScreen])

  useLayoutEffect(() => {
    isLoaderVisible ? show() : hide()
  }, [isLoaderVisible])
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

    /**
     * NOTE: deferring setting 'isPopup' to false to give time for a popup to hide
     * and, therefore, changing app state to 'active';
     * otherwise, the app is being locked again, because the
     * state of the app is still in the background
     */
    setTimeout(() => {
      dispatch(setPopup(false))
    }, 1000)

    return result
  }
}
