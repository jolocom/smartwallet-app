import React from 'react'
import RNRestart from 'react-native-restart'

import { ErrorFallback } from '~/components/ErrorFallback'
import Btn, { BtnTypes, BtnSize } from '~/components/Btn'
import { strings } from '~/translations/strings'
import { ErrorContext, ErrorScreens } from './errorContext'

export class ErrorBoundary extends React.Component {
  static contextType = ErrorContext

  public state = {
    hasError: false,
    error: null,
  }

  public static getDerivedStateFromError(error: Error) {
    return { hasError: true, error }
  }

  private handleClose = () => {
    this.setState({ hasError: false })
  }

  private handleRestart = () => {
    RNRestart.Restart()
  }

  private handleReport = () => {
    this.context.setError(ErrorScreens.errorReporting, this.state.error)
    this.handleClose()
  }

  render() {
    if (this.state.hasError) {
      return (
        <ErrorFallback
          title={strings.SYSTEM_CRASH}
          description={strings.BUT_DONT_WORRY_YOUR_DATA_IS_SAFE}
        >
          <Btn
            type={BtnTypes.quaternary}
            size={BtnSize.medium}
            onPress={this.handleReport}
          >
            {strings.SUBMIT_REPORT}
          </Btn>
          <Btn
            type={BtnTypes.secondary}
            size={BtnSize.medium}
            onPress={this.handleRestart}
          >
            {strings.RESTART_APPLICATION}
          </Btn>
        </ErrorFallback>
      )
    }
    return this.props.children
  }
}
