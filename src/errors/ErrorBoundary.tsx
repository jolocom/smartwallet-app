import React from 'react'
import { withTranslation, WithTranslation } from 'react-i18next'
import RNRestart from 'react-native-restart'

import { ErrorFallback } from '~/components/ErrorFallback'
import { ErrorContext, ErrorScreens } from './errorContext'

class ErrorBoundary extends React.Component<WithTranslation> {
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
    const { t } = this.props
    if (this.state.hasError) {
      return (
        <ErrorFallback
          title={t('Errors.crashTitle')}
          description={t('Errors.crashMessage')}
          topButtonText={t('Errors.reportBtn')}
          onPressTop={this.handleReport}
          bottomButtonText={t('Errors.restartBtn')}
          onPressBottom={this.handleRestart}
        />
      )
    }
    return this.props.children
  }
}

export default withTranslation()(ErrorBoundary)
