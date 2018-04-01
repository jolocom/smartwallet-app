import * as React from 'react'
import { connect } from 'react-redux'
import { AnyAction } from 'redux'
import { ThunkAction } from 'redux-thunk'
import { SeedPhrase as SeedPhraseComponent } from 'src/ui/registration/components/seedPhrase'
import { registrationActions } from 'src/actions/'

export interface PropsFromReduxState {
  seedPhrase: string;
}

export interface Props extends PropsFromReduxState {
  fetchSeedPhrase: () => void;
  clearSeedPhrase: () => void;
}

export interface ComponentState {
  checked: boolean;
}

class SeedPhraseContainer extends React.Component<Props, ComponentState> {
  constructor(props: Props) {
    super(props)
    this.state = {
      checked: false
    }
  }

  componentDidMount() {
    this.props.fetchSeedPhrase()
  }

  render() {
    return <SeedPhraseComponent
      seedPhrase={ this.props.seedPhrase }
      checked={ this.state.checked }
      onCheck={ this.handleCheckboxTap }
    />
  }

  private handleCheckboxTap = () => {
    this.setState({ checked: !this.state.checked })
  }
}

const mapStateToProps = (state: PropsFromReduxState) => {
  return {
    seedPhrase: state.seedPhrase
  }
}

const mapDispatchToProps = (dispatch: Function) => {
  return {
    fetchSeedPhrase: () => dispatch(registrationActions.fetchSeedPhrase())
  }
}

export const SeedPhrase = connect(mapStateToProps, mapDispatchToProps)(SeedPhraseContainer)
