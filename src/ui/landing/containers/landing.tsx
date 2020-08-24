import React from 'react'
import { connect } from 'react-redux'
import { LandingComponent } from 'src/ui/landing/components/landing'
import { navigationActions, registrationActions } from 'src/actions/'
import { ThunkDispatch } from 'src/store'
import { StatusBar } from 'react-native'
import { routeList } from '../../../routeList'
import { withErrorScreen } from 'src/actions/modifiers'
import { AppError, ErrorCode } from 'src/lib/errors'

interface Props extends ReturnType<typeof mapDispatchToProps> {}

export class LandingContainer extends React.Component<Props> {
  public render(): JSX.Element {
    return (
      <React.Fragment>
        <StatusBar barStyle="light-content" />
        <LandingComponent
          handleGetStarted={this.props.getStarted}
          handleRecover={this.props.recoverIdentity}
        />
      </React.Fragment>
    )
  }
}

const mapDispatchToProps = (dispatch: ThunkDispatch) => ({
  getStarted: () =>
    dispatch(
      withErrorScreen(
        registrationActions.createIdentity(''),
        err =>
          new AppError(ErrorCode.RegistrationFailed, err, routeList.Landing),
      ),
    ),
  recoverIdentity: () =>
    dispatch(
      navigationActions.navigate({
        routeName: routeList.InputSeedPhrase,
      }),
    ),
})

export const Landing = connect(
  null,
  mapDispatchToProps,
)(LandingContainer)
