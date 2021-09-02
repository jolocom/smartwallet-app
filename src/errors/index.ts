import { Platform } from 'react-native'
import * as Sentry from '@sentry/react-native'
import VersionNumber from 'react-native-version-number'

import { SENTRY_DSN } from './config'

export function initSentry() {
  Sentry.init({
    dsn: SENTRY_DSN,
    release: `${VersionNumber.bundleIdentifier}@${VersionNumber.appVersion}`,

    // disable automatic reporting of errors/rejections without user consent
    integrations: (defaultIntegrations) =>
      defaultIntegrations.filter((i) => i.name !== 'ReactNativeErrorHandlers'),

    // FIXME we disable native integrations on android because we can't cleanup
    // the even in the beforeEvent handler below, `contexts` is undefined on
    // android
    enableNative: Platform.OS !== 'android',

    /**
     * @param event
     * @dev TODO Decide if event.contexts.app should be stripped
     */

    beforeSend: (event) => {
      const { extra, contexts } = event

      if (extra && contexts) {
        if (!extra.sendPrivateData) {
          delete contexts.device
          delete contexts.os
          delete contexts.app.device_app_hash
        }

        delete extra.sendPrivateData
      }

      return { ...event, contexts, extra }
    },
  })
}
