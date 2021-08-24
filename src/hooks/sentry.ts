import * as Sentry from '@sentry/react-native'
import { last } from '~/utils/arrayUtils'
import useErrors from './useErrors'
import packageJson from '~/../package.json'
import { SENTRY_DSN } from '~/errors/config'

interface UserReport {
  issue?: string | null
  details?: string
  email?: string
}

const USER_FEEDBACK_URL =
  'https://sentry.io/api/0/projects/jolocom/smartwallet/user-feedback/'
const PACKAGE_VERSION = (packageJson.version as string).split('.')
const BUILD_NUMBER = last(PACKAGE_VERSION)
const APP_VERSION = PACKAGE_VERSION.filter((e) => e !== BUILD_NUMBER).join('.')

const useSentry = () => {
  const { error } = useErrors()

  const sendUserFeedback = async (report: UserReport) => {
    const eventId = Sentry.getCurrentHub().lastEventId()
    if (eventId) {
      const body = JSON.stringify({
        event_id: eventId,
        name: report.issue ?? 'Unknown',
        email: report.email ?? '-',
        comments: report.details ?? '-',
      })

      await fetch(USER_FEEDBACK_URL, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `DSN ${SENTRY_DSN}`,
        },
        body,
      })
        .then((res) => {
          if (!res.ok)
            console.warn(
              `Error ${res.status}: Failed to send user feedback report!`,
            )
        })
        .catch(console.warn)
    } else {
      console.warn(
        'Error: Could not find Sentry EventID to send a user feedback report!',
      )
    }
  }

  const sendContactReport = (report: UserReport) => {
    Sentry.withScope((scope) => {
      scope.setExtras({ ...report, version: APP_VERSION, build: BUILD_NUMBER })
      scope.setUser(null)
      const id = Math.random().toString(36).slice(-8)
      Sentry.captureMessage(id, scope)
      sendUserFeedback(report)
    })
  }

  const sendErrorReport = (report: UserReport, sendPrivateData: boolean) => {
    Sentry.withScope((scope) => {
      scope.setExtras({ ...report, version: APP_VERSION, build: BUILD_NUMBER })
      scope.setUser(null)

      if (!sendPrivateData) scope.clearBreadcrumbs()
      Sentry.captureException(error)
      sendUserFeedback(report)
    })
  }

  return { sendContactReport, sendErrorReport }
}

export default useSentry
