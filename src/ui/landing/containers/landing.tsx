import * as React from 'react'
import { connect } from 'react-redux'
import { LandingComponent } from 'src/ui/landing/components/landing'

export interface PropsFromReduxState {}

export interface Props extends PropsFromReduxState {
  navigation: {
    navigate: (route: string) => void;
  };
}

class LandingContainer extends React.Component<Props> {
  render() {
    return (
      <LandingComponent handleButtonTap={this.goToNextScreen} />
    )
  }

  private goToNextScreen = () => {
    const nexScreenId = 'PasswordEntry'
    this.props.navigation.navigate(nexScreenId)
  }

}

const mapStateToProps = (state: PropsFromReduxState) => {
  return {}
}

const mapDispatchToProps = (dispatch: Function) => {
  return {}
}

export const Landing = connect(mapStateToProps, mapDispatchToProps)(LandingContainer)
