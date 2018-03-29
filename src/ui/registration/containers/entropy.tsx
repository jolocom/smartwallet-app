import * as React from 'react'
import { View } from 'react-native'
import { connect } from 'react-redux'
import { AnyAction } from 'redux'
import { entropyActions } from 'src/actions'
import { EntropyComponent } from '../components/entropy'


export interface EntropyProps {
}

export interface ReduxProps extends EntropyProps {
  drawUpon: () => void
  submitEntropy: (entropy: any) => void
}

export interface EntropyState {
  isDrawn: boolean
}

class EntropyContainer extends React.Component<ReduxProps, EntropyState> {

  constructor(props: ReduxProps) {
    super(props)
    this.state = {
      isDrawn: false
    }
  }

  private drawUpon = () => {
    this.setState({isDrawn: true})
  }

  public render() {

    // const { width, height } = Dimensions.get('window')
    console.log(this.props, this.state, 'container')

    return (
     <View>
       <EntropyComponent
         drawUpon={ entropyActions.drawUpon }
         isDrawn={ this.state.isDrawn }
         submitEntropy={ this.props.submitEntropy }
       />
     </View>
    )
  }
}

const mapStateToProps = (state: EntropyState, props: EntropyProps) => {
  return {
    isDrawn: state.isDrawn
  }
}

const mapDispatchToProps = (dispatch: (action: AnyAction) => void) => {
  return {
    submitEntropy: (entropy:any) => dispatch(entropyActions.submitEntropy(entropy)),
    drawUpon: () => dispatch(entropyActions.drawUpon())
  }
}

export const Entropy = connect(mapStateToProps, mapDispatchToProps)(EntropyContainer)