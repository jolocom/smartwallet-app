import React from 'react'
import ModalScreen from '~/modals/Modal'
import { ErrorScreens } from '../errorContext'
import ScreenContainer from '~/components/ScreenContainer'
import JoloText from '~/components/JoloText'
import Btn from '~/components/Btn'
import useErrors from '~/hooks/useErrors'
import useSentry from '~/hooks/sentry'

const ErrorReporting = () => {
  const { errorScreen, resetError, error } = useErrors()
  const { sendReport } = useSentry()

  return (
    <ModalScreen
      isVisible={errorScreen === ErrorScreens.errorReporting}
      animationType={'slide'}
    >
      <ScreenContainer>
        <JoloText>Error Reporting</JoloText>
        <Btn onPress={resetError}>Close</Btn>
        <Btn onPress={() => sendReport({})}>Send report</Btn>
      </ScreenContainer>
    </ModalScreen>
  )
}

export default ErrorReporting
