import { useEffect, useState, useCallback, useRef } from 'react'
import { StatusBar } from 'react-native'

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
