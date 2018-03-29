import * as React from 'react'
import { View } from 'react-native'
import { connect } from 'react-redux'
import { AnyAction } from 'redux'
import { registrationActions } from 'src/actions'
import { EntropyComponent } from '../components/entropy'
import { EntropyAgent } from 'src/agents/entropyAgent'
import { entropy } from 'src/reducers/registration'


export interface EntropyProps {
  entropyAgent: any
  isDrawn: boolean
  sufficientEntropy: boolean
}

export interface ReduxProps extends EntropyProps {
  submitEntropy: (entropy: any) => void
  // addPoint: (point: number) => void
}

export interface EntropyState {
  entropyAgent: any
  isDrawn: boolean
  sufficientEntropy: boolean
}

class EntropyContainer extends React.Component<ReduxProps, EntropyState> {

  constructor(props: ReduxProps) {
    super(props)
    this.state = {
      entropyAgent: new EntropyAgent(),
      isDrawn: false,
      sufficientEntropy: false
    }
  }

  private drawUpon = () => {
    this.setState({isDrawn: true})
  }

  private addPoint = (x: number, y: number) => {
    this.state.entropyAgent.addFromDelta(x)
    this.state.entropyAgent.addFromDelta(y)
    if (!this.state.sufficientEntropy && this.state.entropyAgent.getProgress() === 1) {
      this.setState({sufficientEntropy: true}) 
    }
  }

  public render() {

    return (
     <View>
       <EntropyComponent
         addPoint={ this.addPoint }
         drawUpon={ this.drawUpon }
         isDrawn={ this.props.isDrawn }
         submitEntropy={ this.props.submitEntropy }
         sufficientEntropy={ this.props.sufficientEntropy }
       />
     </View>
    )
  }
}

const mapStateToProps = (state: EntropyState, props: EntropyProps) => {
  return {
    entropyAgent: state.entropyAgent,
    isDrawn: state.isDrawn,
    sufficientEntropy: state.sufficientEntropy
  }
}

const mapDispatchToProps = (dispatch: (action: AnyAction) => void) => {
  return {
    // addPoint: (point:number) => dispatch(registrationActions.addEntropyFromDelta(point)),
    submitEntropy: (entropy:any) => dispatch(registrationActions.submitEntropy(entropy))
  }
}

export const Entropy = connect(mapStateToProps, mapDispatchToProps)(EntropyContainer)