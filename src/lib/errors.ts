import * as Sentry from '@sentry/react-native'
import VersionNumber from 'react-native-version-number'
import { sentryDSN } from 'src/config'
import { routeList } from '../routeList'
import strings from '../locales/strings'
import ErrorCode from './errorCodes'
export { ErrorCode }

export class AppError extends Error {
  // private code: ErrorCode
  public origError: any
  public navigateTo: routeList
  public code: ErrorCode

  public constructor(
    code = ErrorCode.Unknown,
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    origError?: any,
    navigateTo: routeList = routeList.AppInit,
  ) {
    super(strings[code] || strings[ErrorCode.Unknown])
    this.code = code
    this.origError = origError
    this.navigateTo = navigateTo
  }
}

export const errorTitleMessages = [strings.DAMN, strings.OH_NO, strings.UH_OH]

export function initErrorReporting() {
  Sentry.init({
    dsn: sentryDSN,
    release: `${VersionNumber.bundleIdentifier}@${VersionNumber.appVersion}`,

    // disable automatic reporting of errors/rejections without user consent
    integrations: defaultIntegrations =>
      defaultIntegrations.filter(i => i.name !== 'ReactNativeErrorHandlers'),

    /**
     * @param event
     * @dev TODO Decide if event.contexts.app should be stripped
     */

    beforeSend: event => {
      const { extra, contexts } = event

      if (extra && contexts) {
        if (!extra.sendPrivateData) {
          delete contexts.device
          delete contexts.os
        }

        delete extra.sendPrivateData
      }

      return { ...event, contexts, extra }
    },
  })
}

export interface UserReport {
  userError: string | undefined
  userDescription: string
  userContact: string
  sendPrivateData: boolean
}

interface ErrorReport extends UserReport {
  error: AppError | Error | undefined
}

export function reportError(report: ErrorReport) {
  Sentry.withScope(scope => {
    if (report.error instanceof AppError && report.error.origError) {
      scope.setExtras({
        AppError: report.error.message,
        UserError: report.userError,
        UserDescription: report.userDescription,
        UserContact: report.userContact,
        sendPrivateData: report.sendPrivateData,
      })
      report.error = report.error.origError
    }
    Sentry.captureException(report.error)
  })
}
