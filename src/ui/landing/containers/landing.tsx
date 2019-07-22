import React from 'react'
import { connect } from 'react-redux'
import { LandingComponent } from 'src/ui/landing/components/landing'
import { registrationActions } from 'src/actions/'
import { withErrorHandling } from '../../../actions/modifiers'
import { showErrorScreen } from '../../../actions/generic'
import { AppError, ErrorCode } from '../../../lib/errors'
import { routeList } from '../../../routeList'
import { ThunkDispatch } from '../../../store'
import { StatusBar } from 'react-native'

interface Props extends ReturnType<typeof mapDispatchToProps> {}

export class LandingContainer extends React.Component<Props> {
  render() {
    return (
      <React.Fragment>
        <StatusBar barStyle="light-content" />
        <LandingComponent handleButtonTap={this.props.startRegistration} />
      </React.Fragment>
    )
  }
}

const mapDispatchToProps = (dispatch: ThunkDispatch) => ({
  startRegistration: () =>
    dispatch(
      withErrorHandling(
        showErrorScreen,
        (err: AppError) =>
          new AppError(ErrorCode.RegistrationFailed, err, routeList.Landing),
      )(registrationActions.startRegistration),
    ),
})

export const Landing = connect(
  null,
  mapDispatchToProps,
)(LandingContainer)
