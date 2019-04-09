import React from 'react'
import { connect } from 'react-redux'
import { RootState } from 'src/reducers'
import { InputSeedPhraseComponent } from "../components/inputSeedPhrase";
import { registrationActions } from "../../../actions";
const bip39 = require("bip39");

interface ConnectProps {
  submitSeedPhrase: (seedPhrase: string) => void
}

interface OwnProps {
}

interface Props extends OwnProps, ConnectProps {
}

interface State {
  seedPhrase: string
  errorMsg: string
}

export class InputSeedPhraseContainer extends React.Component<Props, State> {

  state = {
    seedPhrase: '',
    errorMsg: '',
  }

  private onSeedPhraseChange = (seedPhrase: string): void => {
    this.setState({ seedPhrase })
  }

  private onSubmit = (): void => {
    const { seedPhrase } = this.state;
    if (bip39.validateMnemonic(seedPhrase))
      this.props.submitSeedPhrase(seedPhrase)
    this.setState({errorMsg: 'Invalid Seed Phrase'})
  }

  render() {
    const { errorMsg } = this.state;
    return (
      <InputSeedPhraseComponent
        onSeedPhraseChange={ this.onSeedPhraseChange }
        onSubmit={ this.onSubmit }
        errorMsg={ errorMsg }
      />
    )
  }
}

const mapStateToProps = (state: RootState) => {
  return {}
}

const mapDispatchToProps = (dispatch: (action: Function) => void) => {
  return {
    submitSeedPhrase: (seedPhrase: string) => {
      dispatch(registrationActions.submitSeedPhrase(seedPhrase))
    }
  }
}

export const InputSeedPhrase = connect(mapStateToProps, mapDispatchToProps)(InputSeedPhraseContainer)
