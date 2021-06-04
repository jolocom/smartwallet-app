import { useEffect, useState, useCallback, useRef, Dispatch, SetStateAction } from 'react'
import { StatusBar } from 'react-native'
import SoftInputMode from 'react-native-set-soft-input-mode'

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

// NOTE: used to change the Keyboard input mode to @adjustResize on @Android
export const useAdjustResizeInputMode = () => {
  useEffect(() => {
    SoftInputMode.set(SoftInputMode.ADJUST_RESIZE)
    return () => {
      SoftInputMode.set(SoftInputMode.ADJUST_PAN)
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
) => {
  useEffect(() => {
    if (state) {
      setTimeout(() => {
        updateState(prevValue => !prevValue)
      }, 100)
    }
  }, [state])
}
