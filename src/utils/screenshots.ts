// @ts-ignore
import FlagSecure from 'react-native-flag-secure-android'
import { Agent } from 'react-native-jolocom'
import { StorageKeys } from '~/hooks/sdk'

export class ScreenshotManager {
  static async disable() {
    return FlagSecure.activate()
  }

  static async enable() {
    return FlagSecure.deactivate()
  }

  // TODO: we have a hook useSettings to get values from the settings table
  static async getDisabledStatus(agent: Agent) {
    return agent.storage.get
      .setting(StorageKeys.screenshotsDisabled)
      .then((value) => {
        return value ? value.isDisabled : true
      })
  }

  // TODO: we have a hook useSettings to set values to the settings table
  static async storeDisabledStatus(status: boolean, agent: Agent) {
    return agent.storage.store.setting(StorageKeys.screenshotsDisabled, {
      isDisabled: status,
    })
  }
}
