import * as React from 'react'
import { connect } from 'react-redux'
import { LandingComponent } from 'src/ui/landing/components/landing'
import { navigationActions } from 'src/actions/'
import { RootState } from 'src/reducers/'
import { routeList } from 'src/routes'

interface ConnectProps {
  navigate: (route: routeList) => void;
}

interface OwnProps {}
interface Props extends ConnectProps, OwnProps {}

class LandingContainer extends React.Component<Props> {
  render() {
    return (
      <LandingComponent handleButtonTap={this.goToNextScreen} />
    )
  }

  private goToNextScreen = () => {
    this.props.navigate(routeList.PasswordEntry)
  }
}

const mapStateToProps = (state: RootState) => {
  return {}
}

const mapDispatchToProps = (dispatch: Function) => {
  return {
    navigate: (route: routeList) => dispatch(navigationActions.navigate(route))
  }
}

export const Landing = connect(mapStateToProps, mapDispatchToProps)(LandingContainer)

