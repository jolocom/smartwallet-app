import { useIsFocused } from '@react-navigation/core'
import { useEffect } from 'react'
import { ScreenshotManager } from '~/utils/screenshots'

export const useDisableScreenshots = () => {
  const isFocused = useIsFocused()

  useEffect(() => {
    if (isFocused) {
      ScreenshotManager.disable()
    } else {
      ScreenshotManager.enable()
    }
  }, [isFocused])
}
