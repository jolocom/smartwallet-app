import { useEffect } from 'react'
import { StatusBar } from 'react-native'

const useHideStatusBar = () => {
  useEffect(() => {
    StatusBar.setHidden(true)

    return () => {
      StatusBar.setHidden(false)
    }
  }, [])
}

export default useHideStatusBar
