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

  static async getDisabledStatus(agent: Agent) {
    return agent.storage.get
      .setting(StorageKeys.screenshotsDisabled)
      .then((value) => {
        return value ? value.isDisabled : true
      })
  }

  static async storeDisabledStatus(status: boolean, agent: Agent) {
    return agent.storage.store.setting(StorageKeys.screenshotsDisabled, {
      isDisabled: status,
    })
  }
}
