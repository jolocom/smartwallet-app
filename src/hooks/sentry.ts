import * as Sentry from '@sentry/react-native'
import useErrors from './useErrors'

interface UserReport {
  issue?: string | null
  details?: string
  email?: string
}

const useSentry = () => {
  const { error } = useErrors()

  const sendContactReport = (report: UserReport) => {
    Sentry.withScope((scope) => {
      scope.setExtras({ ...report })

      Sentry.captureMessage('CONTACT_US', scope)
    })
  }

  const sendErrorReport = (report: UserReport, sendPrivateData: boolean) => {
    Sentry.withScope((scope) => {
      scope.setExtras({ ...report })
      if (!sendPrivateData) scope.setUser(null)

      Sentry.captureException(error)
    })
  }

  return { sendContactReport, sendErrorReport }
}

export default useSentry
