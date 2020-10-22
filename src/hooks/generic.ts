import { useEffect, useState, useCallback } from 'react'
import { StatusBar } from 'react-native'

export const useDelay = (callback: () => void, timeout = 2500) => {
  return new Promise((res, rej) => {
    setTimeout(() => {
      try {
        callback()
        res()
      } catch (e) {
        rej(e)
      }
    }, timeout)
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
