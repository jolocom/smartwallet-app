import { useIsFocused } from '@react-navigation/core'
import { useEffect } from 'react'
import { ScreenshotManager } from '~/utils/screenshots'
import { useToasts } from './toasts'
import { Platform } from 'react-native'

export const useDisableScreenshots = () => {
  const isFocused = useIsFocused()
  const { scheduleErrorWarning } = useToasts()

  useEffect(() => {
    if (Platform.OS === 'android') {
      if (isFocused) {
        ScreenshotManager.disable().catch(scheduleErrorWarning)
      } else {
        ScreenshotManager.enable().catch(scheduleErrorWarning)
      }
    }
  }, [isFocused])
}
