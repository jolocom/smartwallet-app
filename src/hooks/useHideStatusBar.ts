import { useEffect } from 'react'
import { StatusBar } from 'react-native'

const useHideStatusBar = (delay: number = 600) => {
  useEffect(() => {
    setTimeout(() => {
      StatusBar.setHidden(true)
    }, delay)

    return () => {
      setTimeout(() => {
        StatusBar.setHidden(false)
      }, delay)
    }
  }, [])
}

export default useHideStatusBar
