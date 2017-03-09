import React from 'react'
import { connect } from 'redux/utils'
import Presentation from '../presentation/entropy'

@connect({
  props: ['registration'],
  actions: [
    'registration:goForward',
    'registration:addMaskedImagePoint', 'registration:addEntropyFromDeltas'
  ]
})
export default class Dialog extends React.Component {
  static propTypes = {
    registration: React.PropTypes.object.isRequired,

    goForward: React.PropTypes.func.isRequired,
    addEntropyFromDeltas: React.PropTypes.func.isRequired,
    addMaskedImagePoint: React.PropTypes.func.isRequired
  }

  render() {
    return <Presentation
      imagePointsUncovered={this.props.registration.maskedImage.uncovered}
      valid={this.props.registration.passphrase.sufficientEntropy}
      onMouseMovement={this.props.addEntropyFromDeltas}
      onMaskedImagePoint={this.props.addMaskedImagePoint}
      onSubmit={this.props.goForward}
    />
  }
}
