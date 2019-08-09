import React from 'react'
import { connect } from 'react-redux'
import { LandingComponent } from 'src/ui/landing/components/landing'
import { registrationActions } from 'src/actions/'
import { ThunkDispatch } from 'src/store'
import { StatusBar } from 'react-native'

interface Props extends ReturnType<typeof mapDispatchToProps> {}

export class LandingContainer extends React.Component<Props> {
  public render(): JSX.Element {
    return (
      <React.Fragment>
        <StatusBar barStyle="light-content" />
        <LandingComponent handleButtonTap={this.props.openInitAction} />
      </React.Fragment>
    )
  }
}

const mapDispatchToProps = (dispatch: ThunkDispatch) => ({
  openInitAction: () => dispatch(registrationActions.openInitAction),
})

export const Landing = connect(
  null,
  mapDispatchToProps,
)(LandingContainer)
