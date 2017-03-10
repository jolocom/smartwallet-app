import React from 'react'
import { connect } from 'redux/utils'
import Presentation from '../presentation/entropy'

@connect({
  props: ['registration'],
  actions: [
    'registration:goForward',
    'registration:addMaskedImagePoint', 'registration:setMaskedImageUncovering',
    'registration:addEntropyFromDeltas'
  ]
})
export default class RegistrationEntropyScreen extends React.Component {
  static propTypes = {
    registration: React.PropTypes.object.isRequired,

    goForward: React.PropTypes.func.isRequired,
    addEntropyFromDeltas: React.PropTypes.func.isRequired,
    addMaskedImagePoint: React.PropTypes.func.isRequired,
    setMaskedImageUncovering: React.PropTypes.func.isRequired
  }

  render() {
    return <Presentation
      imagePointsUncovered={this.props.registration.maskedImage.uncovered}
      imageUncovering={this.props.registration.maskedImage.uncovering}
      onImageUncoveringChange={this.props.setMaskedImageUncovering}
      valid={this.props.registration.passphrase.sufficientEntropy}
      onImagePointUncoverd={this.props.addMaskedImagePoint}
      onMaskedImagePoint={this.props.addMaskedImagePoint}
      onSubmit={this.props.goForward}
    />
  }
}
