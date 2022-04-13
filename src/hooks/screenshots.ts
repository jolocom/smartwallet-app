import { useIsFocused } from '@react-navigation/core'
import { useEffect } from 'react'
import { ScreenshotManager } from '~/utils/screenshots'
import { useToasts } from './toasts'

export const useDisableScreenshots = () => {
  const isFocused = useIsFocused()
  const { scheduleErrorWarning } = useToasts()

  useEffect(() => {
    if (isFocused) {
      ScreenshotManager.disable().catch(scheduleErrorWarning)
    } else {
      ScreenshotManager.enable().catch(scheduleErrorWarning)
    }
  }, [isFocused])
}
