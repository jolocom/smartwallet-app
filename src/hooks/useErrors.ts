import { StatusBar } from 'react-native'
import { useErrorContext, ErrorScreens } from '~/errors/errorContext'

const useErrors = () => {
  const { setError, ...state } = useErrorContext()

  const showErrorDisplay = (error?: Error) => {
    setError(ErrorScreens.errorDisplay, error)
  }

  const showErrorReporting = (error?: Error) => {
    // NOTE: when showing the modal from the Camera screen (no StatusBar), the status bar
    // does not show up after the modal is visible. Must be shown before the modal is
    // visible.
    StatusBar.setHidden(false)
    setError(ErrorScreens.errorReporting, error)
  }

  const resetError = () => {
    setError(undefined, undefined)
  }

  return { ...state, showErrorDisplay, showErrorReporting, resetError }
}

export default useErrors
