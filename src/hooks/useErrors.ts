import { useErrorContext, ErrorScreens } from '~/errors/errorContext'

const useErrors = () => {
  const { setError, ...state } = useErrorContext()

  const showErrorDisplay = (error?: Error) => {
    setError(ErrorScreens.errorDisplay, error ?? null)
  }

  const showErrorReporting = (error?: Error) => {
    setError(ErrorScreens.errorReporting, error ?? null)
  }

  const resetError = () => {
    setError(null, null)
  }

  return { ...state, showErrorDisplay, showErrorReporting, resetError }
}

export default useErrors
