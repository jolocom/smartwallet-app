import React from 'react'
import ModalScreen from '~/modals/Modal'
import ScreenContainer from '~/components/ScreenContainer'
import JoloText from '~/components/JoloText'
import Btn from '~/components/Btn'
import useErrors from '~/hooks/useErrors'
import { ErrorScreens } from '../errorContext'

const ErrorDisplay = () => {
  const { errorScreen, resetError } = useErrors()

  return (
    <ModalScreen isVisible={errorScreen === ErrorScreens.errorDisplay}>
      <ScreenContainer>
        <JoloText>Error Display</JoloText>
        <Btn onPress={resetError}>Close</Btn>
      </ScreenContainer>
    </ModalScreen>
  )
}

export default ErrorDisplay
