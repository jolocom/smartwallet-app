import React from 'react'
import { connect } from 'react-redux'
import { SeedPhrase as SeedPhraseComponent } from 'src/ui/registration/components/seedPhrase'
import { navigatorResetHome } from 'src/actions/navigation'
import { ThunkDispatch } from '../../../store'
import { NavigationScreenProps } from 'react-navigation'
import { StatusBar } from 'react-native'

interface Props
  extends ReturnType<typeof mapDispatchToProps>,
    ReturnType<typeof mapStateToProps>,
    NavigationScreenProps {}

interface State {
  checked: boolean
}

export class SeedPhraseContainer extends React.Component<Props, State> {
  constructor(props: Props) {
    super(props)
    this.state = {
      checked: false,
    }
  }

  render() {
    const mnemonic =
      this.props.navigation && this.props.navigation.getParam('mnemonic')
    return (
      <React.Fragment>
        <StatusBar barStyle="light-content" />
        <SeedPhraseComponent
          seedPhrase={mnemonic}
          checked={this.state.checked}
          handleButtonTap={this.props.finishRegistration}
        />
      </React.Fragment>
    )
  }
}

const mapStateToProps = () => ({})
const mapDispatchToProps = (dispatch: ThunkDispatch) => ({
  finishRegistration: () => dispatch(navigatorResetHome()),
})

export const SeedPhrase = connect(
  mapStateToProps,
  mapDispatchToProps,
)(SeedPhraseContainer)
