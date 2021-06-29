import React from 'react'
import ModalScreen from '~/modals/Modal'
import useErrors from '~/hooks/useErrors'
import { ErrorScreens } from '../errorContext'
import { ErrorFallback } from '~/components/ErrorFallback'
import { SWErrorCodes, UIErrors } from '../codes'
import { strings } from '~/translations'
import { useSelector } from 'react-redux'
import { getIsAppLocked } from '~/modules/account/selectors'

const ErrorDisplay = () => {
  const isAppLocked = useSelector(getIsAppLocked)
  const { errorScreen, resetError, error, showErrorReporting } = useErrors()
  const { title, message } =
    UIErrors[error?.message as SWErrorCodes] ??
    UIErrors[SWErrorCodes.SWUnknown]!

  return (
    <ModalScreen
      isVisible={errorScreen === ErrorScreens.errorDisplay && !isAppLocked}
      onRequestClose={resetError}
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
