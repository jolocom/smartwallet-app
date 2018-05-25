import React from 'react'
import { connect } from 'react-redux'
import { LandingComponent } from 'src/ui/landing/components/landing'
import { registrationActions, accountActions } from 'src/actions/'
import { RootState } from 'src/reducers/'

interface ConnectProps {
  checkIfAccountExists: () => void
  startRegistration: () => void
}

interface OwnProps {}
interface Props extends ConnectProps, OwnProps {}

export class LandingContainer extends React.Component<Props> {
  componentDidMount() {
    this.props.checkIfAccountExists()
  }

  render() {
    return (
      <LandingComponent handleButtonTap={ this.props.startRegistration } />
    )
  }
}

const mapStateToProps = (state: RootState) => {
  return {}
}

const mapDispatchToProps = (dispatch: Function) => {
  return {
    startRegistration: () => dispatch(registrationActions.startRegistration()),
    checkIfAccountExists: () => dispatch(accountActions.checkIdentityExists())
  }
}

export const Landing = connect(mapStateToProps, mapDispatchToProps)(LandingContainer)
