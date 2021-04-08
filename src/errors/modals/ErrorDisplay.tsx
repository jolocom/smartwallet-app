import React from 'react'
import ModalScreen from '~/modals/Modal'
import useErrors from '~/hooks/useErrors'
import { ErrorScreens } from '../errorContext'
import { ErrorFallback } from '~/components/ErrorFallback'
import { SWErrorCodes, UIErrors } from '../codes'
import { strings } from '~/translations'

const ErrorDisplay = () => {
  const { errorScreen, resetError, error, showErrorReporting } = useErrors()
  const { title, message } =
    UIErrors[error?.message as SWErrorCodes] ??
    UIErrors[SWErrorCodes.SWUnknown]!

  return (
    <ModalScreen
      isVisible={errorScreen === ErrorScreens.errorDisplay}
      animationType={'slide'}
    >
      <ErrorFallback
        title={title}
        description={message}
        onPressTop={showErrorReporting}
        onPressBottom={resetError}
        topButtonText={strings.SUBMIT_REPORT}
        bottomButtonText={strings.CLOSE}
      />
    </ModalScreen>
  )
}

export default ErrorDisplay
