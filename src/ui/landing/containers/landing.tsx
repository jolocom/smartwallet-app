import React from 'react'
import { connect } from 'react-redux'
import { LandingComponent } from 'src/ui/landing/components/landing'
import { navigationActions } from 'src/actions/'
import { ThunkDispatch } from 'src/store'
import { StatusBar } from 'react-native'
import { routeList } from '../../../routeList'
import { checkTermsOfService } from 'src/actions/generic'
import { withLoading } from 'src/actions/modifiers'

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
  getStarted: async () => {
    dispatch(withLoading(checkTermsOfService(routeList.Entropy)))
  },
  recoverIdentity: async () => {
    dispatch(withLoading(checkTermsOfService(routeList.InputSeedPhrase)))
  },
})

export const Landing = connect(null, mapDispatchToProps)(LandingContainer)
