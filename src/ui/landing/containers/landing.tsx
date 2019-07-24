import React from 'react'
import { connect } from 'react-redux'
import { LoadingScreen } from 'src/ui/generic/'
import { LandingComponent } from 'src/ui/landing/components/landing'
import { registrationActions } from 'src/actions/'
import { RootState } from 'src/reducers/'
import { ThunkDispatch } from '../../../store'

interface Props
  extends ReturnType<typeof mapDispatchToProps>,
    ReturnType<typeof mapStateToProps> {}

export class LandingContainer extends React.Component<Props> {
  render() {
    if (this.props.loading) {
      return <LoadingScreen />
    } else {
      return <LandingComponent handleButtonTap={this.props.openInitAction} />
    }
  }
}

const mapStateToProps = ({
  account: {
    loading: { loading },
  },
}: RootState) => ({
  loading,
})

const mapDispatchToProps = (dispatch: ThunkDispatch) => ({
  openInitAction: () => dispatch(registrationActions.openInitAction),
})

export const Landing = connect(
  mapStateToProps,
  mapDispatchToProps,
)(LandingContainer)
