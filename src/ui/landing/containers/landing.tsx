import React from 'react'
import { connect } from 'react-redux'
import { LandingComponent } from 'src/ui/landing/components/landing'
import { registrationActions } from 'src/actions/'
import { withErrorScreen } from 'src/actions/modifiers'
import { AppError, ErrorCode } from 'src/lib/errors'
import { routeList } from 'src/routeList'
import { ThunkDispatch } from 'src/store'
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
      withErrorScreen(
        registrationActions.startRegistration,
        err =>
          new AppError(ErrorCode.RegistrationFailed, err, routeList.Landing),
      ),
    ),
})

export const Landing = connect(
  null,
  mapDispatchToProps,
)(LandingContainer)
