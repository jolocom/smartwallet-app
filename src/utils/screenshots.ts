// @ts-ignore
import FlagSecure from 'react-native-flag-secure-android'
import { Agent } from 'react-native-jolocom'
import { StorageKeys } from '~/hooks/sdk'

export class ScreenshotManager {
  constructor(private agent: Agent) {}

  static async disable() {
    return FlagSecure.activate()
  }

  static async enable() {
    return FlagSecure.deactivate()
  }

  async getDisabledStatus() {
    return this.agent.storage.get
      .setting(StorageKeys.screenshotsEnabled)
      .then((value) => {
        return value.isEnabled
      })
  }

  async storeDisabledStatus(status: boolean) {
    return this.agent.storage.store.setting(StorageKeys.screenshotsEnabled, {
      isEnabled: !status,
    })
  }
}
