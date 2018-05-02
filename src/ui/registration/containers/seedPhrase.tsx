import React from 'react'
import { connect } from 'react-redux'
import { SeedPhrase as SeedPhraseComponent } from 'src/ui/registration/components/seedPhrase'
import { RootState } from 'src/reducers/'

interface ConnectProps {
}

interface Props extends ConnectProps {
  navigation: { state: { params: { mnemonic: string } } }
}

interface State {
  checked: boolean;
}

export class SeedPhraseContainer extends React.Component<Props, State> {
  constructor(props: Props) {
    super(props)
    this.state = {
      checked: false
    }
  }

  render() {
    const { mnemonic } = this.props.navigation.state.params
    return <SeedPhraseComponent
      seedPhrase={ mnemonic }
      checked={ this.state.checked }
      onCheck={ this.handleCheckboxTap }
    />
  }

  private handleCheckboxTap = () => {
    this.setState({ checked: !this.state.checked })
  }
}

const mapStateToProps = (state: RootState) => {
  return { }
}

const mapDispatchToProps = (dispatch: Function) => {
  return { }
}

export const SeedPhrase = connect(mapStateToProps, mapDispatchToProps)(SeedPhraseContainer)
