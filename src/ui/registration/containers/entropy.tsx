import * as React from 'react'
import { connect } from 'react-redux'
import { AnyAction } from 'redux'
import { navigationActions } from 'src/actions'
import { EntropyComponent } from 'src/ui/registration/components/entropy'
import { RootState } from 'src/reducers'
import { 
  EntropyGenerator,
  EntropyGeneratorInterface
} from 'src/lib/entropyGenerator'

interface ConnectProps {
  navigate: (encodedEntropy: string) => void;
}

interface OwnProps { }

interface Props extends OwnProps, ConnectProps {}

interface State {
  isDrawn: boolean;
  encodedEntropy: string;
  sufficientEntropy: boolean;
}

export class EntropyContainer extends React.Component<Props, State> {
  private entropyGenerator!: EntropyGeneratorInterface

  state = {
    isDrawn: false,
    encodedEntropy: '',
    sufficientEntropy: false
  }

  componentDidMount() {
    this.entropyGenerator = new EntropyGenerator()
  }

  private addPoint = (x: number, y: number) => {
    this.entropyGenerator.addFromDelta(x)
    this.entropyGenerator.addFromDelta(y)
    this.checkEntropyProgress()
  }

  private checkEntropyProgress = () => {
    if (!this.state.sufficientEntropy && this.entropyGenerator.getProgress() === 1) {
      const encodedEntropy = this.generateRandomString()
      this.setState({ encodedEntropy })
      this.setState({ sufficientEntropy: true })
    }
  }

  private generateRandomString = () => {
    return this.entropyGenerator.generateRandomString(4)
  }

  private submitEntropy = () => {
    this.props.navigate(this.state.encodedEntropy)
  }

  render() {
    return (
      <EntropyComponent
        addPoint={ this.addPoint }
        isDrawn={ !this.state.encodedEntropy.length }
        submitEntropy={ this.submitEntropy }
        sufficientEntropy={ this.state.sufficientEntropy }
      />
    )
  }
}

const mapStateToProps = (state: RootState) => {
  return {}
}

const mapDispatchToProps = (dispatch: (action: AnyAction) => void) => {
  return {
    navigate: (encodedEntropy: string) => dispatch(navigationActions.navigate({
      routeName: 'SeedPhrase',
      params: { encodedEntropy }
    }))
  }
}

export const Entropy = connect(mapStateToProps, mapDispatchToProps)(EntropyContainer)