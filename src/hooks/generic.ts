import { useEffect, useState, useCallback, useRef } from 'react'
import { StatusBar } from 'react-native'

export const useDelay = (callback: () => void, timeout = 2500) => {
  return new Promise((res) => {
    callback();
    res('');
  })
}

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

export const usePrevious = (value: any) => {
  const ref = useRef()
  useEffect(() => {
    ref.current = value
  }, [JSON.stringify(value)])
  return ref.current
}
