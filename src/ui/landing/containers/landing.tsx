import React from 'react'
import { connect } from 'react-redux'
import { LoadingScreen } from 'src/ui/generic/'
import { LandingComponent } from 'src/ui/landing/components/landing'
import { registrationActions } from 'src/actions/'
import { RootState } from 'src/reducers/'
import { withErrorHandling } from '../../../actions/modifiers'
import { showErrorScreen } from '../../../actions/generic'
import { AppError } from '../../../lib/errors'
import { routeList } from '../../../routeList'
import { ThunkDispatch } from '../../../store'
import ErrorCode from '../../../lib/errorCodes'

interface Props
  extends ReturnType<typeof mapDispatchToProps>,
    ReturnType<typeof mapStateToProps> {}

export class LandingContainer extends React.Component<Props> {
  render() {
    if (this.props.loading) {
      return <LoadingScreen />
    } else {
      return <LandingComponent handleButtonTap={this.props.startRegistration} />
    }
  }
}

const mapStateToProps = ({
  account: {
    loading: { loading },
  },
}: RootState) => {
  return {
    loading,
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
  mapStateToProps,
  mapDispatchToProps,
)(LandingContainer)
