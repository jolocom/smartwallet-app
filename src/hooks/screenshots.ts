// @ts-ignore
import FlagSecure from 'react-native-flag-secure-android'
import { Agent } from 'react-native-jolocom'
import { StorageKeys } from '~/hooks/sdk'
import { useToasts } from './toasts'

export const useDisableScreenshots = () => {
  const { scheduleErrorWarning } = useToasts()

  return (agent: Agent) => {
    return agent.storage.get
      .setting(StorageKeys.screenshotsEnabled)
      .then((value) => {
        const { isEnabled } = value
        isEnabled ? FlagSecure.deactivate() : FlagSecure.activate()
      })
      .catch(scheduleErrorWarning)
  }
}
