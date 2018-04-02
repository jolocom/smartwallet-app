import * as React from 'react'
import { connect } from 'react-redux'
import { AnyAction } from 'redux'
import { ThunkAction } from 'redux-thunk'
import { SeedPhrase as SeedPhraseComponent } from 'src/ui/registration/components/seedPhrase'
import { registrationActions } from 'src/actions/'
import { RootState } from 'src/reducers/'

interface ConnectProps {
  seedPhrase: string;
  fetchSeedPhrase: () => void;
  clearSeedPhrase: () => void;
}

interface Props extends ConnectProps {}

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

  componentDidMount() {
    this.props.fetchSeedPhrase()
  }

  componentWillUnmount() {
    this.props.clearSeedPhrase()
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

const mapStateToProps = (state: RootState) => {
  return {
    seedPhrase: state.registration.seedPhrase
  }
}

const mapDispatchToProps = (dispatch: Function) => {
  return {
    fetchSeedPhrase: () => dispatch(registrationActions.fetchSeedPhrase()),
    clearSeedPhrase: () => dispatch(registrationActions.clearSeedPhrase())
  }
}

export const SeedPhrase = connect(mapStateToProps, mapDispatchToProps)(SeedPhraseContainer)
