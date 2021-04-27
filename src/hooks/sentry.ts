import * as Sentry from '@sentry/react-native'
import { last } from '~/utils/arrayUtils'
import useErrors from './useErrors'
// @ts-ignore
import packageJson from '~/../package.json'

interface UserReport {
  issue?: string | null
  details?: string
  email?: string
}

const PACKAGE_VERSION = (packageJson.version as string).split('.')
const BUILD_NUMBER = last(PACKAGE_VERSION)
const APP_VERSION = PACKAGE_VERSION.filter((e) => e !== BUILD_NUMBER).join('.')

const useSentry = () => {
  const { error } = useErrors()

  const sendContactReport = (report: UserReport) => {
    Sentry.withScope((scope) => {
      scope.setExtras({ ...report, version: APP_VERSION, build: BUILD_NUMBER })
      scope.setUser(null)

      Sentry.captureMessage('CONTACT_US', scope)
    })
  }

  const sendErrorReport = (report: UserReport, sendPrivateData: boolean) => {
    Sentry.withScope((scope) => {
      scope.setExtras({ ...report, version: APP_VERSION, build: BUILD_NUMBER })
      scope.setUser(null)

      if (!sendPrivateData) scope.clearBreadcrumbs()
      Sentry.captureException(error)
    })
  }

  return { sendContactReport, sendErrorReport }
}

export default useSentry
