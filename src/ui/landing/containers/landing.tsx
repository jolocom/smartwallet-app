import React from 'react'
import { connect } from 'react-redux'
import { LandingComponent } from 'src/ui/landing/components/landing'
import { navigationActions } from 'src/actions/'
import { RootState } from 'src/reducers/'
import { routeList } from 'src/routes'
import { Storage } from 'src/lib/storage'


interface ConnectProps {
  navigate: () => void;
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
    const ts = new Storage()
    ts.provisionTables()
    this.props.navigate()
  }
}

const mapStateToProps = (state: RootState) => {
  return {}
}

const mapDispatchToProps = (dispatch: Function) => {
  return {
    navigate: () => dispatch(navigationActions.navigate({
      routeName: 'PasswordEntry'
    }))
  }
}

export const Landing = connect(mapStateToProps, mapDispatchToProps)(LandingContainer)