import * as Sentry from '@sentry/react-native'
import useErrors from './useErrors'

interface UserReport {
  issue?: string | null
  details?: string
  email?: string
}

const useSentry = () => {
  const { error } = useErrors()

  const sendReport = (report: UserReport, sendPrivateData: boolean = false) => {
    Sentry.withScope((scope) => {
      scope.setExtras({ ...report, sendPrivateData })
      if (!sendPrivateData) scope.setUser(null)

      if (error) {
        Sentry.captureException(error)
      } else {
        Sentry.captureMessage('CONTACT_US', scope)
      }
    })
  }

  return { sendReport }
}

export default useSentry
