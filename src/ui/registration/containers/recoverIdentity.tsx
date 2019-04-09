import React from 'react'
import { connect } from 'react-redux'
import { RootState } from 'src/reducers'
import { RecoverIdentityComponent } from "../components/recoverIdentity";

interface ConnectProps {
}

interface OwnProps {
}

interface Props extends OwnProps, ConnectProps {
}

interface State {
  seedPhrase: string
}

export class RecoverIdentityContainer extends React.Component<Props, State> {

  state = {
    seedPhrase:'',
  }

  private onSeedPhraseChange = (seedPhrase: string): void => {
    this.setState({ seedPhrase })
  }

  private onSubmit = ():void => {
    console.log(this.state.seedPhrase)
  }

  render() {
    return (
      <RecoverIdentityComponent
        onSeedPhraseChange={ this.onSeedPhraseChange }
        onSubmit={this.onSubmit}
      />
    )
  }
}

const mapStateToProps = (state: RootState) => {
  return {}
}

const mapDispatchToProps = (dispatch: (action: Function) => void) => {
  return {}
}

export const RecoverIdentity = connect(mapStateToProps, mapDispatchToProps)(RecoverIdentityContainer)
