import React from 'react'
import { connect } from 'react-redux'
import { NavigationScreenProp, NavigationState } from 'react-navigation'
import { AppError, reportError, UserReport } from '../../../lib/errors'
import { ErrorReportingComponent } from '../components/errorReporting'
import { ThunkDispatch } from '../../../store'
import { routeList } from '../../../routeList'
import { navigationActions } from '../../../actions'
interface PaymentNavigationParams {
  error: AppError | Error | undefined
}

interface Props extends ReturnType<typeof mapDispatchToProps> {
  navigation: NavigationScreenProp<NavigationState, PaymentNavigationParams>
}

const ErrorReportingContainer = (props: Props) => {
  const { navigateToScreen } = props

  const onSubmitReport = (userReport: UserReport) => {
    if (props.navigation && props.navigation.state.params.error) {
      const { error } = props.navigation.state.params
      reportError({ ...userReport, error })
      if (error instanceof AppError) {
        console.log(error.navigateTo)
        navigateToScreen(error.navigateTo)
      } else {
        navigateToScreen(routeList.AppInit)
      }
    }
  }

  return <ErrorReportingComponent onSubmit={onSubmitReport} />
}

const mapDispatchToProps = (dispatch: ThunkDispatch) => ({
  navigateToScreen: (screen: routeList) =>
    dispatch(navigationActions.navigate({ routeName: screen })),
})

export const ErrorReporting = connect(
  null,
  mapDispatchToProps,
)(ErrorReportingContainer)
