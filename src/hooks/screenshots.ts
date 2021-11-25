import { useIsFocused } from '@react-navigation/core'
import { useEffect } from 'react'
// @ts-ignore
import FlagSecure from 'react-native-flag-secure-android'
import { Agent } from 'react-native-jolocom'
import { StorageKeys } from '~/hooks/sdk'

export const useInitDisableScreenshots = () => {
  return async (agent: Agent) => {
    return agent.storage.get
      .setting(StorageKeys.screenshotsEnabled)
      .then((value) => {
        const { isEnabled } = value
        isEnabled ? FlagSecure.deactivate() : FlagSecure.activate()
      })
      .catch(console.warn)
  }
}

export const useDisableScreenshots = () => {
  const isFocused = useIsFocused()

  useEffect(() => {
    if (isFocused) {
      FlagSecure.activate()
    } else {
      FlagSecure.deactivate()
    }
  }, [isFocused])
}
