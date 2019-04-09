import React from 'react'
import { connect } from 'react-redux'
import { registrationActions } from 'src/actions'
import { EntropyComponent } from 'src/ui/registration/components/entropy'
import { RootState } from 'src/reducers'
import { 
  EntropyGeneratorInterface,
  EntropyGenerator
} from 'src/lib/entropyGenerator'

interface ConnectProps {
  submit: (encodedEntropy: string) => void
  inputSeedPhrase: () => void
}

interface OwnProps { }

interface Props extends OwnProps, ConnectProps {}

interface State {
  isDrawn: boolean
  encodedEntropy: string
  sufficientEntropy: boolean
  entropyProgress: number
}

export class EntropyContainer extends React.Component<Props, State> {
  private entropyGenerator! : EntropyGeneratorInterface

  state = {
    isDrawn: false,
    encodedEntropy: '',
    entropyProgress: 0,
    sufficientEntropy: false
  }

  componentDidMount() {
    this.entropyGenerator = this.setUpEntropyGenerator()
  }

  private setUpEntropyGenerator() : EntropyGenerator {
    return new EntropyGenerator()
  }

  private addPoint = (x: number, y: number) : void => {
    this.entropyGenerator.addFromDelta(x)
    this.entropyGenerator.addFromDelta(y)
    this.setState({ entropyProgress: this.entropyGenerator.getProgress() })
    this.updateEntropyProgress()
  }

  private updateEntropyProgress = () : void => {
    if (!this.state.sufficientEntropy && this.state.entropyProgress === 1) {
      const encodedEntropy = this.generateRandomString()
      this.setState({ encodedEntropy })
      this.setState({ sufficientEntropy: true })
    }
  }

  private generateRandomString = () : string => {
    return this.entropyGenerator.generateRandomString(4)
  }

  private submitEntropy = () : void => {
    this.props.submit(this.state.encodedEntropy)
  }

  private inputSeedPhrase = () : void => {
    this.props.inputSeedPhrase()
  }

  render() {
    return (
      <EntropyComponent
        addPoint={ this.addPoint }
        progress={ this.state.entropyProgress }
        submitEntropy={ this.submitEntropy }
        recoverIdentity={ this.inputSeedPhrase }
      />
    )
  }
}

const mapStateToProps = (state: RootState) => {
  return {}
}

const mapDispatchToProps = (dispatch: (action: Function) => void) => {
  return {
    submit: (encodedEntropy: string) => 
      dispatch(registrationActions.submitEntropy(encodedEntropy)),
    inputSeedPhrase : () =>
      dispatch(registrationActions.inputSeedPhrase()),
  }
}

export const Entropy = connect(mapStateToProps, mapDispatchToProps)(EntropyContainer)
