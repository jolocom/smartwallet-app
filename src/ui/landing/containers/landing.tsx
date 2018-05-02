import React from 'react'
import { connect } from 'react-redux'
import { LandingComponent } from 'src/ui/landing/components/landing'
import { navigationActions, accountActions } from 'src/actions/'
import { RootState } from 'src/reducers/'
import { Storage } from 'src/lib/storage'

interface ConnectProps {
  navigate: () => void
  checkIfAccountExists: () => void
}

interface OwnProps {}
interface Props extends ConnectProps, OwnProps {}

export class LandingContainer extends React.Component<Props> {

  componentDidMount() {
    // this.props.checkIfAccountExists()
  }

  // TODO ACTION
  private goToNextScreen = () => {
    const ts = new Storage()
    ts.provisionTables()
    this.props.navigate()
  }

  render() {
    return (
      <LandingComponent handleButtonTap={this.goToNextScreen} />
    )
  }

}

const mapStateToProps = (state: RootState) => {
  return {}
}

const mapDispatchToProps = (dispatch: Function) => {
  return {
    checkIfAccountExists: () => dispatch(accountActions.checkIdentityExists()),
    navigate: () => dispatch(navigationActions.navigate({
      routeName: 'PasswordEntry'
    }))
  }
}

export const Landing = connect(mapStateToProps, mapDispatchToProps)(LandingContainer)
