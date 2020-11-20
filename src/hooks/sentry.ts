import * as Sentry from '@sentry/react-native'

interface UserReport {
  issue?: string
  details?: string
  contact?: string
}

const useSentry = () => {
  const error = false

  const sendReport = (report: UserReport, sendPrivateData: boolean) => {
    Sentry.withScope((scope) => {
      scope.setExtras({ ...report, sendPrivateData })
      if (!sendPrivateData) scope.setUser(null)

      try {
        if (error) {
          Sentry.captureException(new Error('TEST_ERROR'))
        } else {
          Sentry.captureMessage('TEST_MESSAGE', scope)
        }
      } catch (e) {
        console.log(e)
      }
    })
  }

  return { sendReport }
}

export default useSentry
