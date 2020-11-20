import React from 'react'
import { ErrorFallback } from '~/components/ErrorFallback'
import Btn, { BtnTypes, BtnSize } from '~/components/Btn'
import { strings } from '~/translations/strings'
import { ErrorContext, ErrorScreens } from './errorContext'

export class ErrorBoundary extends React.Component {
  static contextType = ErrorContext

  public state = {
    hasError: false,
  }

  public static getDerivedStateFromError() {
    return { hasError: true }
  }

  private handleClose = () => {
    this.setState({ hasError: false })
  }

  private handleReport = () => {
    this.context.setErrorScreen(ErrorScreens.errorReporting)
    this.handleClose()
  }

  render() {
    if (this.state.hasError) {
      return (
        <ErrorFallback
          title={strings.UNKNOWN_ERROR}
          description={
            strings.AND_IF_THIS_IS_NOT_THE_FIRST_TIME_WE_STRONGLY_RECOMMEND_LETTING_US_KNOW
          }
        >
          <Btn
            type={BtnTypes.secondary}
            size={BtnSize.medium}
            onPress={this.handleReport}
          >
            Report error
          </Btn>
          <Btn
            type={BtnTypes.secondary}
            size={BtnSize.medium}
            onPress={this.handleClose}
          >
            {strings.CLOSE}
          </Btn>
        </ErrorFallback>
      )
    }
    return this.props.children
  }
}
