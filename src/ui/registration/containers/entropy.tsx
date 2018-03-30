import * as React from 'react'
import { View } from 'react-native'
import { connect } from 'react-redux'
import { AnyAction } from 'redux'

import { registrationActions } from 'src/actions'
import { EntropyComponent } from '../components/entropy'
import { EntropyAgent } from 'src/agents/entropyAgent'
import { entropy } from 'src/reducers/registration'


export interface EntropyProps {
}

export interface ReduxProps extends EntropyProps {
  submitEncodedEntropy: (entropy: string) => void
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
    this.checkEntropyProgress()
  }

  private checkEntropyProgress = () => {
    if (!this.state.sufficientEntropy && this.state.entropyAgent.getProgress() === 1) {
      const encodedEntropy = this.generateRandomString()
      this.props.submitEncodedEntropy(encodedEntropy)
      this.setState({sufficientEntropy: true}) 
    }
  }

  public generateRandomString = () => {
    return this.state.entropyAgent.generateRandomString(4)
  }

  private submitEntropy = () => {
    console.log(this.props)
  }

  public render() {

    return (
     <View>
       <EntropyComponent
         addPoint={ this.addPoint }
         drawUpon={ this.drawUpon }
         isDrawn={ this.state.isDrawn }
         submitEntropy={ this.submitEntropy }
         sufficientEntropy={ this.state.sufficientEntropy }
       />
     </View>
    )
  }
}

const mapStateToProps = (state: EntropyState, props: EntropyProps) => {
  return {
  }
}

const mapDispatchToProps = (dispatch: (action: AnyAction) => void) => {
  return {
    submitEncodedEntropy: (entropy: string) => dispatch(registrationActions.submitEncodedEntropy(entropy))
  }
}

export const Entropy = connect(mapStateToProps, mapDispatchToProps)(EntropyContainer)